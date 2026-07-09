"""
Run LASSO regressions for selected dependent variables in the New Mexico CDC PLACES data.

The webpage is static, so this script writes regression output to
data/lasso_regression_results.json. The Regression section in index.html
loads that JSON file and lets users choose the dependent variable.

Usage:
    python run_lasso_sleep_regression.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "data" / "Clean_NM.csv"
JSON_OUTPUT_PATH = ROOT / "data" / "lasso_regression_results.json"
TEXT_OUTPUT_PATH = ROOT / "data" / "lasso_regression_results.txt"
LEGACY_SLEEP_JSON_OUTPUT_PATH = ROOT / "data" / "lasso_sleep_regression_results.json"
LEGACY_SLEEP_TEXT_OUTPUT_PATH = ROOT / "data" / "lasso_sleep_regression_results.txt"
DEPENDENT_VARIABLE_OPTIONS = [
    ("DIABETES_CrudePrev", "Diabetes prevalence"),
    ("OBESITY_CrudePrev", "Obesity prevalence"),
    ("MHLTH_CrudePrev", "Frequent mental distress prevalence"),
    ("DEPRESSION_CrudePrev", "Poor mental health / depression prevalence"),
    ("SLEEP_CrudePrev", "Short sleep duration prevalence"),
    ("ACCESS2_CrudePrev", "Lack of health insurance prevalence"),
    ("CHECKUP_CrudePrev", "Recent checkup prevalence"),
    ("CASTHMA_CrudePrev", "Asthma prevalence"),
    ("COPD_CrudePrev", "COPD prevalence"),
]
DEFAULT_DEPENDENT_VARIABLE = "SLEEP_CrudePrev"
RANDOM_SEED = 585


def filter_valid_tract_rows(raw_df: pd.DataFrame) -> pd.DataFrame:
    """Keep only CSV rows that represent actual tract records."""
    required_columns = {"TractFIPS", "CountyName"}
    if not required_columns.issubset(raw_df.columns):
        return raw_df

    tract_fips = raw_df["TractFIPS"].astype("string").str.strip()
    county_name = raw_df["CountyName"].astype("string").str.strip()
    return raw_df[tract_fips.notna() & (tract_fips != "") & county_name.notna() & (county_name != "")].copy()


def soft_threshold(value: float, penalty: float) -> float:
    """Shrink a coefficient toward zero by the LASSO penalty."""
    if value > penalty:
        return value - penalty
    if value < -penalty:
        return value + penalty
    return 0.0


def fit_lasso_coordinate_descent(
    x_matrix: np.ndarray,
    y_vector: np.ndarray,
    alpha: float,
    initial_coefficients: np.ndarray | None = None,
    max_iter: int = 600,
    tolerance: float = 1e-5,
) -> np.ndarray:
    """
    Fit LASSO coefficients on standardized predictors and centered y.

    Objective: (1 / 2n) * sum((y - Xb)^2) + alpha * sum(abs(b)).
    """
    n_rows, n_cols = x_matrix.shape
    coefficients = (
        np.zeros(n_cols)
        if initial_coefficients is None
        else initial_coefficients.astype(float, copy=True)
    )
    predictions = x_matrix @ coefficients
    column_norms = np.mean(x_matrix * x_matrix, axis=0)
    column_norms[column_norms == 0] = 1.0

    for _ in range(max_iter):
        max_change = 0.0

        for col_idx in range(n_cols):
            old_value = coefficients[col_idx]
            residual_plus_current = y_vector - predictions + x_matrix[:, col_idx] * old_value
            rho = np.mean(x_matrix[:, col_idx] * residual_plus_current)
            new_value = soft_threshold(rho, alpha) / column_norms[col_idx]

            if new_value != old_value:
                predictions += x_matrix[:, col_idx] * (new_value - old_value)
                coefficients[col_idx] = new_value
                max_change = max(max_change, abs(new_value - old_value))

        if max_change < tolerance:
            break

    return coefficients


def choose_alpha_by_bic(
    x_standardized: np.ndarray,
    y_centered: np.ndarray,
    alpha_grid: np.ndarray,
) -> tuple[float, np.ndarray, list[dict[str, float]]]:
    path_rows: list[dict[str, float]] = []
    best_bic = float("inf")
    best_alpha = float(alpha_grid[0])
    best_coefficients = np.zeros(x_standardized.shape[1])
    coefficients = np.zeros(x_standardized.shape[1])
    n_rows = len(y_centered)

    for alpha in alpha_grid:
        coefficients = fit_lasso_coordinate_descent(
            x_standardized,
            y_centered,
            alpha,
            initial_coefficients=coefficients,
        )
        predictions = x_standardized @ coefficients
        mse = float(np.mean((y_centered - predictions) ** 2))
        selected_count = int(np.sum(np.abs(coefficients) > 1e-8))
        bic = float(n_rows * np.log(max(mse, 1e-12)) + selected_count * np.log(n_rows))

        path_rows.append({"alpha": float(alpha), "mse": mse, "bic": bic, "selected_count": selected_count})

        if bic < best_bic:
            best_bic = bic
            best_alpha = float(alpha)
            best_coefficients = coefficients.copy()

    return best_alpha, best_coefficients, path_rows


def rounded(value: float, digits: int = 6) -> float:
    return float(np.round(value, digits))


def normal_two_sided_p_value(test_statistic: float) -> float:
    """Approximate a two-sided p-value with the standard normal distribution."""
    return float(math.erfc(abs(test_statistic) / math.sqrt(2.0)))


def significance_label(p_value: float) -> str:
    if p_value < 0.001:
        return "***"
    if p_value < 0.01:
        return "**"
    if p_value < 0.05:
        return "*"
    return "not significant"


def post_lasso_ols_statistics(
    x_raw: np.ndarray,
    y_raw: np.ndarray,
    predictor_columns: list[str],
    selected_mask: np.ndarray,
) -> dict[str, dict[str, float | str]]:
    """Refit OLS on LASSO-selected predictors to estimate approximate p-values."""
    selected_indices = np.where(selected_mask)[0]
    if len(selected_indices) == 0:
        return {}

    selected_x = x_raw[:, selected_indices]
    design = np.column_stack([np.ones(len(y_raw)), selected_x])
    beta, _, _, _ = np.linalg.lstsq(design, y_raw, rcond=None)
    fitted = design @ beta
    residuals = y_raw - fitted
    degrees_of_freedom = max(len(y_raw) - design.shape[1], 1)
    residual_variance = float(np.sum(residuals**2) / degrees_of_freedom)
    covariance = residual_variance * np.linalg.pinv(design.T @ design)
    standard_errors = np.sqrt(np.maximum(np.diag(covariance), 0.0))

    stats: dict[str, dict[str, float | str]] = {}
    for position, predictor_idx in enumerate(selected_indices, start=1):
        coefficient = float(beta[position])
        standard_error = float(standard_errors[position])
        t_statistic = coefficient / standard_error if standard_error > 0 else 0.0
        p_value = normal_two_sided_p_value(t_statistic)
        stats[predictor_columns[predictor_idx]] = {
            "post_lasso_ols_coefficient": rounded(coefficient),
            "standard_error": rounded(standard_error),
            "test_statistic": rounded(t_statistic),
            "p_value": rounded(p_value, 8),
            "significance": significance_label(p_value),
        }

    return stats


def run_regression(dependent_variable: str, dependent_variable_label: str, raw_df: pd.DataFrame | None = None) -> dict:
    if raw_df is None:
        raw_df = pd.read_csv(CSV_PATH)
    raw_df = filter_valid_tract_rows(raw_df)
    crude_prev_columns = [col for col in raw_df.columns if col.endswith("_CrudePrev")]

    if dependent_variable not in crude_prev_columns:
        raise ValueError(f"Dependent variable {dependent_variable} was not found in {CSV_PATH}.")

    predictor_columns = [col for col in crude_prev_columns if col != dependent_variable]
    model_df = raw_df[[dependent_variable] + predictor_columns].apply(pd.to_numeric, errors="coerce").dropna()

    x_raw = model_df[predictor_columns].to_numpy(dtype=float)
    y_raw = model_df[dependent_variable].to_numpy(dtype=float)

    x_means = x_raw.mean(axis=0)
    x_stds = x_raw.std(axis=0, ddof=0)
    usable_columns = x_stds > 0

    predictor_columns = [col for col, usable in zip(predictor_columns, usable_columns) if usable]
    x_raw = x_raw[:, usable_columns]
    x_means = x_means[usable_columns]
    x_stds = x_stds[usable_columns]

    x_standardized = (x_raw - x_means) / x_stds
    y_mean = y_raw.mean()
    y_centered = y_raw - y_mean

    alpha_max = float(np.max(np.abs((x_standardized.T @ y_centered) / len(y_centered))))
    alpha_grid = np.geomspace(alpha_max, alpha_max * 0.001, 35)
    best_alpha, standardized_coefficients, lasso_path_rows = choose_alpha_by_bic(
        x_standardized,
        y_centered,
        alpha_grid,
    )
    coefficients = standardized_coefficients / x_stds
    intercept = y_mean - float(np.dot(coefficients, x_means))
    fitted = intercept + x_raw @ coefficients
    residuals = y_raw - fitted

    selected_mask = np.abs(coefficients) > 1e-8
    ols_stats = post_lasso_ols_statistics(x_raw, y_raw, predictor_columns, selected_mask)
    selected_variables = []
    removed_variables = []

    for name, coef, std_coef in zip(predictor_columns, coefficients, standardized_coefficients):
        row = {
            "variable": name,
            "coefficient": rounded(coef),
            "standardized_coefficient": rounded(std_coef),
            "direction": "positive" if coef > 0 else "negative" if coef < 0 else "zero",
        }
        if abs(coef) > 1e-8:
            row.update(ols_stats.get(name, {}))
            selected_variables.append(row)
        else:
            removed_variables.append(name)

    selected_variables.sort(key=lambda row: abs(row["standardized_coefficient"]), reverse=True)

    ss_res = float(np.sum(residuals**2))
    ss_tot = float(np.sum((y_raw - y_mean) ** 2))
    r_squared = 1.0 - (ss_res / ss_tot)
    rmse = float(np.sqrt(np.mean(residuals**2)))
    mae = float(np.mean(np.abs(residuals)))

    result = {
        "model": "LASSO linear regression",
        "dependent_variable": dependent_variable,
        "dependent_variable_label": dependent_variable_label,
        "data_file": str(CSV_PATH.relative_to(ROOT)).replace("\\", "/"),
        "method_note": (
            f"Started with all {len(crude_prev_columns)} CDC PLACES crude prevalence variables, used "
            f"{dependent_variable} as the dependent variable, and used the remaining variables as candidate predictors. "
            "Predictors were standardized before LASSO selection. The alpha penalty was selected "
            "by scanning a warm-started LASSO path and choosing the model with the lowest BIC. "
            "P-values are approximate post-LASSO OLS p-values from refitting ordinary least squares "
            "on the selected variables."
        ),
        "row_count_total": int(len(raw_df)),
        "row_count_used": int(len(model_df)),
        "candidate_crude_prev_columns": int(len(crude_prev_columns)),
        "candidate_predictor_count": int(len(predictor_columns)),
        "selected_variable_count": int(len(selected_variables)),
        "removed_variable_count": int(len(removed_variables)),
        "alpha": rounded(best_alpha),
        "intercept": rounded(intercept),
        "metrics": {
            "r_squared": rounded(r_squared, 4),
            "rmse": rounded(rmse, 4),
            "mae": rounded(mae, 4),
        },
        "selected_variables": selected_variables,
        "removed_variables": removed_variables,
        "lasso_path": lasso_path_rows,
    }

    return result


def build_output_payload() -> dict:
    raw_df = filter_valid_tract_rows(pd.read_csv(CSV_PATH))
    models = [
        run_regression(dependent_variable, label, raw_df)
        for dependent_variable, label in DEPENDENT_VARIABLE_OPTIONS
    ]

    return {
        "model": "LASSO linear regression",
        "data_file": str(CSV_PATH.relative_to(ROOT)).replace("\\", "/"),
        "default_dependent_variable": DEFAULT_DEPENDENT_VARIABLE,
        "dependent_variable_options": [
            {"field": dependent_variable, "label": label}
            for dependent_variable, label in DEPENDENT_VARIABLE_OPTIONS
        ],
        "models": models,
    }


def format_text_model(result: dict) -> str:
    title = f"LASSO regression for {result['dependent_variable_label']}"

    selected_lines = [
        f"{row['variable']}: coefficient={row['coefficient']}, "
        f"standardized={row['standardized_coefficient']}, "
        f"post_lasso_ols={row.get('post_lasso_ols_coefficient', 'NA')}, "
        f"p_value={row.get('p_value', 'NA')}, "
        f"significance={row.get('significance', 'NA')}, direction={row['direction']}"
        for row in result["selected_variables"]
    ]

    return "\n".join(
        [
            title,
            "=" * len(title),
            f"Dependent variable: {result['dependent_variable']}",
            f"Rows used: {result['row_count_used']} of {result['row_count_total']}",
            f"Candidate predictors: {result['candidate_predictor_count']}",
            f"Selected predictors: {result['selected_variable_count']}",
            f"Removed predictors: {result['removed_variable_count']}",
            f"Alpha: {result['alpha']}",
            f"Intercept: {result['intercept']}",
            f"R-squared: {result['metrics']['r_squared']}",
            f"RMSE: {result['metrics']['rmse']}",
            f"MAE: {result['metrics']['mae']}",
            "",
            "Selected variables:",
            *selected_lines,
            "",
            "Removed variables:",
            ", ".join(result["removed_variables"]),
        ]
    )


def write_outputs(payload: dict) -> None:
    JSON_OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    text = "\n\n".join(format_text_model(result) for result in payload["models"])
    TEXT_OUTPUT_PATH.write_text(text + "\n", encoding="utf-8")

    sleep_result = next(
        result for result in payload["models"]
        if result["dependent_variable"] == DEFAULT_DEPENDENT_VARIABLE
    )
    LEGACY_SLEEP_JSON_OUTPUT_PATH.write_text(json.dumps(sleep_result, indent=2), encoding="utf-8")
    LEGACY_SLEEP_TEXT_OUTPUT_PATH.write_text(format_text_model(sleep_result) + "\n", encoding="utf-8")


def main() -> None:
    payload = build_output_payload()
    write_outputs(payload)
    print(f"Wrote {JSON_OUTPUT_PATH.relative_to(ROOT)}")
    print(f"Wrote {TEXT_OUTPUT_PATH.relative_to(ROOT)}")
    print(f"Wrote legacy sleep outputs to {LEGACY_SLEEP_JSON_OUTPUT_PATH.relative_to(ROOT)}")
    for result in payload["models"]:
        print(
            f"{result['dependent_variable']}: selected {result['selected_variable_count']} "
            f"predictors and removed {result['removed_variable_count']} predictors."
        )


if __name__ == "__main__":
    main()
