const LASSO_REGRESSION_RESULTS_PATH = "data/lasso_regression_results.json";
const LASSO_CSV_PATH = "data/Clean_NM.csv";
const HISTOGRAM_BIN_COUNT = 12;

const LASSO_MEASURE_LABELS = {
    "ACCESS2_CrudePrev": "Lack of health insurance",
    "ARTHRITIS_CrudePrev": "Arthritis",
    "BINGE_CrudePrev": "Binge drinking",
    "BPHIGH_CrudePrev": "High blood pressure",
    "BPMED_CrudePrev": "Taking medicine for high blood pressure",
    "CANCER_CrudePrev": "Cancer excluding skin cancer",
    "CASTHMA_CrudePrev": "Current asthma",
    "CHECKUP_CrudePrev": "Annual checkup",
    "CHD_CrudePrev": "Coronary heart disease",
    "CHOLSCREEN_CrudePrev": "Cholesterol screening",
    "COGNITION_CrudePrev": "Cognitive disability",
    "COLON_SCREEN_CrudePrev": "Colorectal cancer screening",
    "COPD_CrudePrev": "COPD",
    "CSMOKING_CrudePrev": "Current smoking",
    "DENTAL_CrudePrev": "Dental visit",
    "DEPRESSION_CrudePrev": "Depression",
    "DIABETES_CrudePrev": "Diabetes",
    "DISABILITY_CrudePrev": "Any disability",
    "EMOTIONSPT_CrudePrev": "Lack of social and emotional support",
    "FOODINSECU_CrudePrev": "Food insecurity",
    "FOODSTAMP_CrudePrev": "Received food stamps / SNAP",
    "GHLTH_CrudePrev": "Fair or poor general health",
    "HEARING_CrudePrev": "Hearing disability",
    "HIGHCHOL_CrudePrev": "High cholesterol",
    "HOUSINSECU_CrudePrev": "Housing insecurity",
    "INDEPLIVE_CrudePrev": "Independent living disability",
    "LACKTRPT_CrudePrev": "Lack of reliable transportation",
    "LONELINESS_CrudePrev": "Feeling lonely",
    "LPA_CrudePrev": "No leisure-time physical activity",
    "MAMMOUSE_CrudePrev": "Mammography use",
    "MHLTH_CrudePrev": "Frequent mental distress",
    "MOBILITY_CrudePrev": "Mobility disability",
    "OBESITY_CrudePrev": "Obesity",
    "PHLTH_CrudePrev": "Frequent physical distress",
    "SELFCARE_CrudePrev": "Self-care disability",
    "SHUTUTILITY_CrudePrev": "Utility services threat",
    "SLEEP_CrudePrev": "Short sleep duration",
    "STROKE_CrudePrev": "Stroke",
    "TEETHLOST_CrudePrev": "All teeth lost",
    "VISION_CrudePrev": "Vision disability"
};

let lassoCdcRows = [];

loadLassoRegressionOutput();

function loadLassoRegressionOutput() {
    const output = document.getElementById("lasso-regression-output");
    if (!output) {
        return;
    }

    Promise.all([
        d3.json(LASSO_REGRESSION_RESULTS_PATH),
        d3.csv(LASSO_CSV_PATH)
    ]).then(function ([results, rows]) {
        lassoCdcRows = rows;
        renderLassoRegressionOutput(results);
    }).catch(function (error) {
        console.error("LASSO regression output loading failed:", error);
        output.innerHTML = `
            <div class="alert alert-warning">
                <b>Regression output is not available.</b>
                Run <code>python run_lasso_sleep_regression.py</code> to create
                <code>${LASSO_REGRESSION_RESULTS_PATH}</code>.
            </div>`;
    });
}

function renderLassoRegressionOutput(results) {
    const select = document.getElementById("lasso-dependent-variable-select");
    const models = Array.isArray(results.models) ? results.models : [results];
    const defaultDependentVariable = results.default_dependent_variable || models[0].dependent_variable;
    const options = (Array.isArray(results.dependent_variable_options) ? results.dependent_variable_options : models.map(function (model) {
        return {
            "field": model.dependent_variable,
            "label": model.dependent_variable_label
        };
    })).filter(function (option) {
        return models.some(function (model) {
            return model.dependent_variable === option.field;
        });
    });

    if (select) {
        select.innerHTML = options.map(function (option) {
            const selected = option.field === defaultDependentVariable ? " selected" : "";
            return `<option value="${escapeHtml(option.field)}"${selected}>${escapeHtml(option.label)}</option>`;
        }).join("");
        select.value = defaultDependentVariable;
    }

    const findModel = function (field) {
        return models.find(function (model) {
            return model.dependent_variable === field;
        }) || models[0];
    };

    if (select) {
        select.addEventListener("change", function () {
            renderSelectedLassoView(findModel(select.value));
        });
    }

    renderSelectedLassoView(findModel(select ? select.value : defaultDependentVariable));
}

function renderSelectedLassoView(model) {
    renderLassoHistogram(model);
    renderLassoRegressionModel(model);
}

function renderLassoRegressionModel(results) {
    const output = document.getElementById("lasso-regression-output");
    const selectedRows = results.selected_variables.map(function (row) {
        const variableLabel = getMeasureLabel(row.variable);
        return `
            <tr>
                <td title="${escapeHtml(row.variable)}">${escapeHtml(variableLabel)}</td>
                <td>${formatRegressionNumber(row.coefficient)}</td>
                <td>${formatRegressionNumber(row.post_lasso_ols_coefficient)}</td>
                <td>${formatRegressionNumber(row.standardized_coefficient)}</td>
                <td>${formatPValue(row.p_value)}</td>
            </tr>`;
    }).join("");

    const removedRows = results.removed_variables.map(function (variable) {
        return `<span class="lasso-pill" title="${escapeHtml(variable)}">${escapeHtml(getMeasureLabel(variable))}</span>`;
    }).join("");
    const relationshipOptions = results.selected_variables.map(function (row, index) {
        const selected = index === 0 ? " selected" : "";
        return `<option value="${escapeHtml(row.variable)}"${selected}>${escapeHtml(getMeasureLabel(row.variable))}</option>`;
    }).join("");
    const olsExcludeOptions = results.selected_variables.map(function (row) {
        return `
            <li>
                <label class="lasso-ols-checkbox-option">
                    <input type="checkbox" class="lasso-ols-exclude-checkbox" value="${escapeHtml(row.variable)}">
                    <span>${escapeHtml(getMeasureLabel(row.variable))}</span>
                </label>
            </li>`;
    }).join("");

    output.innerHTML = `
        <div class="lasso-summary-grid">
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">Rows used</span>
                <span class="cdc-stat-value">${results.row_count_used.toLocaleString()}</span>
            </div>
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">Selected predictors</span>
                <span class="cdc-stat-value">${results.selected_variable_count}</span>
            </div>
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">Removed predictors</span>
                <span class="cdc-stat-value">${results.removed_variable_count}</span>
            </div>
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">R-squared</span>
                <span class="cdc-stat-value">${formatRegressionNumber(results.metrics.r_squared, 3)}</span>
            </div>
        </div>
        <div class="lasso-method-note">
            <b>Dependent variable:</b> ${escapeHtml(results.dependent_variable_label)}
            (<code>${escapeHtml(results.dependent_variable)}</code>). ${escapeHtml(results.method_note)}
        </div>
        <div class="row">
            <div class="col-md-8 col-sm-12">
                <h3>Selected Variables</h3>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered lasso-table">
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>LASSO coefficient</th>
                                <th>Post-LASSO OLS coefficient</th>
                                <th>Standardized coefficient</th>
                                <th>p-value</th>
                            </tr>
                        </thead>
                        <tbody>${selectedRows}</tbody>
                    </table>
                </div>
                <div class="lasso-relationship-panel">
                    <div class="lasso-relationship-header">
                        <div>
                            <h3>Linear Relationship</h3>
                            <p class="lasso-relationship-note">
                                Y-axis: ${escapeHtml(results.dependent_variable_label)}. Choose an x-axis predictor from the variables selected by LASSO.
                            </p>
                        </div>
                        <div class="lasso-relationship-control">
                            <label class="cdc-select-label" for="lasso-independent-variable-select">X-axis predictor:</label>
                            <select id="lasso-independent-variable-select" class="form-control cdc-measure-select lasso-dependent-select">
                                ${relationshipOptions}
                            </select>
                        </div>
                    </div>
                    <div id="lasso-relationship-summary" class="lasso-histogram-summary">Loading relationship plot...</div>
                    <div id="lasso-relationship-plot" class="lasso-relationship-plot"></div>
                </div>
                <div class="lasso-ols-refit-panel">
                    <div class="lasso-relationship-header">
                        <div>
                            <h3>OLS Refit</h3>
                            <p class="lasso-relationship-note">
                                Refit ordinary least squares using the selected LASSO predictors, after excluding any predictors selected below.
                            </p>
                        </div>
                        <div class="lasso-relationship-control">
                            <span class="cdc-select-label">Predictors to exclude:</span>
                            <div class="dropdown lasso-ols-dropdown">
                                <button id="lasso-ols-exclude-button" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    None excluded <span class="caret"></span>
                                </button>
                                <ul id="lasso-ols-exclude-menu" class="dropdown-menu lasso-ols-exclude-menu" aria-labelledby="lasso-ols-exclude-button">
                                    ${olsExcludeOptions}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="lasso-ols-refit-summary" class="lasso-histogram-summary">Loading OLS refit...</div>
                    <div id="lasso-ols-refit-output"></div>
                </div>
            </div>
            <div class="col-md-4 col-sm-12">
                <h3>Model Details</h3>
                <dl class="lasso-details">
                    <dt>Alpha penalty</dt>
                    <dd>${formatRegressionNumber(results.alpha)}</dd>
                    <dt>Intercept</dt>
                    <dd>${formatRegressionNumber(results.intercept)}</dd>
                    <dt>RMSE</dt>
                    <dd>${formatRegressionNumber(results.metrics.rmse, 4)}</dd>
                    <dt>MAE</dt>
                    <dd>${formatRegressionNumber(results.metrics.mae, 4)}</dd>
                    <dt>Candidate predictors</dt>
                    <dd>${results.candidate_predictor_count}</dd>
                </dl>
                <h3>Removed Variables</h3>
                <div class="lasso-pill-list">${removedRows}</div>
            </div>
        </div>`;

    setupRelationshipPlot(results);
    setupOlsRefit(results);
}

function setupRelationshipPlot(model) {
    const select = document.getElementById("lasso-independent-variable-select");
    if (!select) {
        return;
    }

    const updatePlot = function () {
        renderRelationshipPlot(model, select.value);
    };

    select.addEventListener("change", updatePlot);
    updatePlot();
}

function renderRelationshipPlot(model, predictorField) {
    const container = document.getElementById("lasso-relationship-plot");
    const summary = document.getElementById("lasso-relationship-summary");
    if (!container) {
        return;
    }

    const points = lassoCdcRows.map(function (row) {
        return {
            x: Number(row[predictorField]),
            y: Number(row[model.dependent_variable])
        };
    }).filter(function (point) {
        return Number.isFinite(point.x) && Number.isFinite(point.y);
    });

    const predictorLabel = getMeasureLabel(predictorField);
    const dependentLabel = model.dependent_variable_label;

    if (points.length < 2) {
        container.innerHTML = '<div class="alert alert-warning">Not enough numeric values are available for this relationship plot.</div>';
        if (summary) {
            summary.textContent = "Not enough paired values available.";
        }
        return;
    }

    const relationshipStats = calculateLinearRelationship(points);

    if (summary) {
        summary.textContent = `${points.length.toLocaleString()} paired census-tract values; trend line y = ${formatRegressionNumber(relationshipStats.slope, 3)}x + ${formatRegressionNumber(relationshipStats.intercept, 3)}; R-squared ${formatRegressionNumber(relationshipStats.rSquared, 3)}.`;
    }

    container.innerHTML = "";

    const containerWidth = Math.max(container.clientWidth || 760, 320);
    const margin = {
        top: 20,
        right: 24,
        bottom: 62,
        left: 64
    };
    const width = containerWidth;
    const height = 360;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xExtent = d3.extent(points, function (point) {
        return point.x;
    });
    const yExtent = d3.extent(points, function (point) {
        return point.y;
    });

    const xScale = d3.scaleLinear()
        .domain(padExtent(xExtent))
        .nice()
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain(padExtent(yExtent))
        .nice()
        .range([innerHeight, 0]);

    const svg = d3.select(container)
        .append("svg")
        .attr("class", "lasso-relationship-svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", `${dependentLabel} by ${predictorLabel} scatter plot`);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    chart.append("g")
        .attr("class", "lasso-histogram-grid")
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));

    chart.selectAll(".lasso-relationship-point")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "lasso-relationship-point")
        .attr("cx", function (point) {
            return xScale(point.x);
        })
        .attr("cy", function (point) {
            return yScale(point.y);
        })
        .attr("r", 3)
        .append("title")
        .text(function (point) {
            return `${predictorLabel}: ${formatRegressionNumber(point.x, 2)}%; ${dependentLabel}: ${formatRegressionNumber(point.y, 2)}%`;
        });

    const xDomain = xScale.domain();
    const linePoints = xDomain.map(function (xValue) {
        return {
            x: xValue,
            y: relationshipStats.intercept + relationshipStats.slope * xValue
        };
    });

    chart.append("line")
        .attr("class", "lasso-relationship-line")
        .attr("x1", xScale(linePoints[0].x))
        .attr("y1", yScale(linePoints[0].y))
        .attr("x2", xScale(linePoints[1].x))
        .attr("y2", yScale(linePoints[1].y));

    chart.append("g")
        .attr("class", "lasso-histogram-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(function (value) {
            return `${value}%`;
        }));

    chart.append("g")
        .attr("class", "lasso-histogram-axis")
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(function (value) {
            return `${value}%`;
        }));

    svg.append("text")
        .attr("class", "lasso-histogram-axis-label")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 12)
        .attr("text-anchor", "middle")
        .text(`${predictorLabel} (%)`);

    svg.append("text")
        .attr("class", "lasso-histogram-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .text(`${dependentLabel} (%)`);
}

function setupOlsRefit(model) {
    const excludeMenu = document.getElementById("lasso-ols-exclude-menu");
    const excludeButton = document.getElementById("lasso-ols-exclude-button");
    if (!excludeMenu || !excludeButton) {
        return;
    }

    const checkboxes = Array.from(excludeMenu.querySelectorAll(".lasso-ols-exclude-checkbox"));
    const updateOls = function () {
        const excludedPredictors = checkboxes.filter(function (checkbox) {
            return checkbox.checked;
        }).map(function (checkbox) {
            return checkbox.value;
        });
        excludeButton.innerHTML = excludedPredictors.length
            ? `${excludedPredictors.length} excluded <span class="caret"></span>`
            : 'None excluded <span class="caret"></span>';
        renderOlsRefit(model, excludedPredictors);
    };

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updateOls);
    });

    excludeMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    updateOls();
}

function renderOlsRefit(model, excludedPredictors) {
    const summary = document.getElementById("lasso-ols-refit-summary");
    const output = document.getElementById("lasso-ols-refit-output");
    if (!output) {
        return;
    }

    const selectedPredictors = model.selected_variables.map(function (row) {
        return row.variable;
    });
    const includedPredictors = selectedPredictors.filter(function (variable) {
        return !excludedPredictors.includes(variable);
    });
    const olsResult = fitOlsModel(model.dependent_variable, includedPredictors);

    if (!olsResult) {
        output.innerHTML = '<div class="alert alert-warning">OLS refit could not be calculated for this predictor set.</div>';
        if (summary) {
            summary.textContent = "OLS refit unavailable.";
        }
        return;
    }

    if (summary) {
        summary.textContent = `${olsResult.rowCount.toLocaleString()} complete rows; ${includedPredictors.length} included predictors; ${excludedPredictors.length} excluded predictors; R-squared ${formatRegressionNumber(olsResult.rSquared, 3)}; adjusted R-squared ${formatRegressionNumber(olsResult.adjustedRSquared, 3)}.`;
    }

    const coefficientRows = olsResult.coefficients.map(function (row) {
        return `
            <tr>
                <td title="${escapeHtml(row.variable)}">${escapeHtml(row.label)}</td>
                <td>${formatRegressionNumber(row.coefficient)}</td>
                <td>${formatRegressionNumber(row.standardError)}</td>
                <td>${formatRegressionNumber(row.tStatistic, 3)}</td>
                <td>${formatPValue(row.pValue)}</td>
            </tr>`;
    }).join("");

    output.innerHTML = `
        <div class="lasso-ols-stat-grid">
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">Included predictors</span>
                <span class="cdc-stat-value">${includedPredictors.length}</span>
            </div>
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">R-squared</span>
                <span class="cdc-stat-value">${formatRegressionNumber(olsResult.rSquared, 3)}</span>
            </div>
            <div class="lasso-summary-card">
                <span class="cdc-stat-label">RMSE</span>
                <span class="cdc-stat-value">${formatRegressionNumber(olsResult.rmse, 3)}</span>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-bordered lasso-table">
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th>OLS coefficient</th>
                        <th>Standard error</th>
                        <th>t-statistic</th>
                        <th>p-value</th>
                    </tr>
                </thead>
                <tbody>${coefficientRows}</tbody>
            </table>
        </div>`;
}

function fitOlsModel(dependentVariable, predictorFields) {
    const rows = lassoCdcRows.map(function (row) {
        const yValue = Number(row[dependentVariable]);
        const xValues = predictorFields.map(function (field) {
            return Number(row[field]);
        });
        return {
            y: yValue,
            x: xValues
        };
    }).filter(function (row) {
        return Number.isFinite(row.y) && row.x.every(Number.isFinite);
    });

    const rowCount = rows.length;
    const parameterCount = predictorFields.length + 1;
    if (rowCount <= parameterCount) {
        return null;
    }

    const xMatrix = rows.map(function (row) {
        return [1].concat(row.x);
    });
    const yVector = rows.map(function (row) {
        return row.y;
    });
    const xTranspose = transposeMatrix(xMatrix);
    const xtx = multiplyMatrices(xTranspose, xMatrix);
    const xty = multiplyMatrixVector(xTranspose, yVector);
    const xtxInverse = invertMatrixWithRidge(xtx);
    if (!xtxInverse) {
        return null;
    }

    const beta = multiplyMatrixVector(xtxInverse, xty);
    const fitted = xMatrix.map(function (row) {
        return dotProduct(row, beta);
    });
    const residuals = yVector.map(function (value, index) {
        return value - fitted[index];
    });
    const meanY = d3.mean(yVector);
    const residualSquares = d3.sum(residuals, function (value) {
        return value * value;
    });
    const totalSquares = d3.sum(yVector, function (value) {
        return Math.pow(value - meanY, 2);
    });
    const degreesOfFreedom = Math.max(rowCount - parameterCount, 1);
    const residualVariance = residualSquares / degreesOfFreedom;
    const rSquared = totalSquares === 0 ? 0 : 1 - residualSquares / totalSquares;
    const adjustedRSquared = rowCount > parameterCount
        ? 1 - (1 - rSquared) * (rowCount - 1) / (rowCount - parameterCount)
        : rSquared;

    const coefficients = beta.map(function (coefficient, index) {
        const standardError = Math.sqrt(Math.max(xtxInverse[index][index] * residualVariance, 0));
        const tStatistic = standardError > 0 ? coefficient / standardError : 0;
        const pValue = normalTwoSidedPValue(tStatistic);
        const variable = index === 0 ? "Intercept" : predictorFields[index - 1];
        return {
            variable: variable,
            label: index === 0 ? "Intercept" : getMeasureLabel(variable),
            coefficient: coefficient,
            standardError: standardError,
            tStatistic: tStatistic,
            pValue: pValue
        };
    });

    return {
        rowCount: rowCount,
        rSquared: rSquared,
        adjustedRSquared: adjustedRSquared,
        rmse: Math.sqrt(residualSquares / rowCount),
        coefficients: coefficients
    };
}

function renderLassoHistogram(model) {
    const container = document.getElementById("lasso-histogram");
    const title = document.getElementById("lasso-histogram-title");
    const summary = document.getElementById("lasso-histogram-summary");
    if (!container) {
        return;
    }

    const values = lassoCdcRows.map(function (row) {
        return Number(row[model.dependent_variable]);
    }).filter(Number.isFinite);

    if (title) {
        title.textContent = `${model.dependent_variable_label} Distribution`;
    }

    if (!values.length) {
        container.innerHTML = '<div class="alert alert-warning">No numeric values are available for this dependent variable.</div>';
        if (summary) {
            summary.textContent = "No histogram values available.";
        }
        return;
    }

    const minValue = d3.min(values);
    const maxValue = d3.max(values);
    const meanValue = d3.mean(values);
    const medianValue = d3.median(values);
    const bins = d3.histogram()
        .domain([minValue, maxValue])
        .thresholds(HISTOGRAM_BIN_COUNT)(values);

    if (summary) {
        summary.textContent = `${values.length.toLocaleString()} census tracts; min ${formatRegressionNumber(minValue, 2)}%, median ${formatRegressionNumber(medianValue, 2)}%, mean ${formatRegressionNumber(meanValue, 2)}%, max ${formatRegressionNumber(maxValue, 2)}%.`;
    }

    container.innerHTML = "";

    const containerWidth = Math.max(container.clientWidth || 760, 320);
    const margin = {
        top: 18,
        right: 22,
        bottom: 48,
        left: 54
    };
    const width = containerWidth;
    const height = 300;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("class", "lasso-histogram-svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", `${model.dependent_variable_label} histogram`);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .nice()
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, function (bin) {
            return bin.length;
        }) || 1])
        .nice()
        .range([innerHeight, 0]);

    chart.append("g")
        .attr("class", "lasso-histogram-grid")
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));

    chart.selectAll(".lasso-histogram-bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "lasso-histogram-bar")
        .attr("x", function (bin) {
            return xScale(bin.x0) + 1;
        })
        .attr("y", function (bin) {
            return yScale(bin.length);
        })
        .attr("width", function (bin) {
            return Math.max(0, xScale(bin.x1) - xScale(bin.x0) - 2);
        })
        .attr("height", function (bin) {
            return innerHeight - yScale(bin.length);
        })
        .append("title")
        .text(function (bin) {
            return `${formatRegressionNumber(bin.x0, 2)}% to ${formatRegressionNumber(bin.x1, 2)}%: ${bin.length} tracts`;
        });

    chart.append("g")
        .attr("class", "lasso-histogram-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(function (value) {
            return `${value}%`;
        }));

    chart.append("g")
        .attr("class", "lasso-histogram-axis")
        .call(d3.axisLeft(yScale).ticks(5));

    svg.append("text")
        .attr("class", "lasso-histogram-axis-label")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 8)
        .attr("text-anchor", "middle")
        .text("Crude prevalence (%)");

    svg.append("text")
        .attr("class", "lasso-histogram-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .text("Census tracts");
}

function calculateLinearRelationship(points) {
    const meanX = d3.mean(points, function (point) {
        return point.x;
    });
    const meanY = d3.mean(points, function (point) {
        return point.y;
    });
    const numerator = d3.sum(points, function (point) {
        return (point.x - meanX) * (point.y - meanY);
    });
    const denominator = d3.sum(points, function (point) {
        return Math.pow(point.x - meanX, 2);
    });
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;
    const totalSquares = d3.sum(points, function (point) {
        return Math.pow(point.y - meanY, 2);
    });
    const residualSquares = d3.sum(points, function (point) {
        return Math.pow(point.y - (intercept + slope * point.x), 2);
    });
    const rSquared = totalSquares === 0 ? 0 : 1 - residualSquares / totalSquares;

    return {
        slope: slope,
        intercept: intercept,
        rSquared: rSquared
    };
}

function padExtent(extent) {
    if (extent[0] === extent[1]) {
        return [extent[0] - 1, extent[1] + 1];
    }

    const padding = (extent[1] - extent[0]) * 0.06;
    return [extent[0] - padding, extent[1] + padding];
}

function transposeMatrix(matrix) {
    return matrix[0].map(function (_, colIndex) {
        return matrix.map(function (row) {
            return row[colIndex];
        });
    });
}

function multiplyMatrices(left, right) {
    const rightTranspose = transposeMatrix(right);
    return left.map(function (leftRow) {
        return rightTranspose.map(function (rightCol) {
            return dotProduct(leftRow, rightCol);
        });
    });
}

function multiplyMatrixVector(matrix, vector) {
    return matrix.map(function (row) {
        return dotProduct(row, vector);
    });
}

function dotProduct(left, right) {
    return d3.sum(left, function (value, index) {
        return value * right[index];
    });
}

function invertMatrixWithRidge(matrix) {
    const ridgeValues = [0, 1e-10, 1e-8, 1e-6, 1e-4];
    for (let ridgeIndex = 0; ridgeIndex < ridgeValues.length; ridgeIndex += 1) {
        const ridge = ridgeValues[ridgeIndex];
        const adjusted = matrix.map(function (row, rowIndex) {
            return row.map(function (value, colIndex) {
                return rowIndex === colIndex ? value + ridge : value;
            });
        });
        const inverse = invertMatrix(adjusted);
        if (inverse) {
            return inverse;
        }
    }

    return null;
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const augmented = matrix.map(function (row, rowIndex) {
        const identityRow = Array(size).fill(0);
        identityRow[rowIndex] = 1;
        return row.slice().concat(identityRow);
    });

    for (let pivotIndex = 0; pivotIndex < size; pivotIndex += 1) {
        let bestRow = pivotIndex;
        for (let rowIndex = pivotIndex + 1; rowIndex < size; rowIndex += 1) {
            if (Math.abs(augmented[rowIndex][pivotIndex]) > Math.abs(augmented[bestRow][pivotIndex])) {
                bestRow = rowIndex;
            }
        }

        if (Math.abs(augmented[bestRow][pivotIndex]) < 1e-12) {
            return null;
        }

        if (bestRow !== pivotIndex) {
            const temp = augmented[pivotIndex];
            augmented[pivotIndex] = augmented[bestRow];
            augmented[bestRow] = temp;
        }

        const pivotValue = augmented[pivotIndex][pivotIndex];
        for (let colIndex = 0; colIndex < size * 2; colIndex += 1) {
            augmented[pivotIndex][colIndex] /= pivotValue;
        }

        for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
            if (rowIndex === pivotIndex) {
                continue;
            }
            const factor = augmented[rowIndex][pivotIndex];
            for (let colIndex = 0; colIndex < size * 2; colIndex += 1) {
                augmented[rowIndex][colIndex] -= factor * augmented[pivotIndex][colIndex];
            }
        }
    }

    return augmented.map(function (row) {
        return row.slice(size);
    });
}

function normalTwoSidedPValue(testStatistic) {
    return 2 * (1 - normalCdf(Math.abs(testStatistic)));
}

function normalCdf(value) {
    return 0.5 * (1 + approximateErf(value / Math.sqrt(2)));
}

function approximateErf(value) {
    const sign = value < 0 ? -1 : 1;
    const x = Math.abs(value);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}

function getMeasureLabel(fieldName) {
    return LASSO_MEASURE_LABELS[fieldName] || fieldName;
}

function formatRegressionNumber(value, digits) {
    const places = typeof digits === "number" ? digits : 6;
    return Number.isFinite(value) ? Number(value).toFixed(places) : "not available";
}

function formatPValue(value) {
    if (!Number.isFinite(value)) {
        return "not available";
    }

    if (value < 0.0001) {
        return "< 0.0001";
    }

    return Number(value).toFixed(4);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
