/*
    CDC PLACES NEW MEXICO WEB MAP
    Adapted from the original GeoAIR Lab web-mapping example (https://geoair-lab.github.io/iNMsocialJusticeMap/index.html)

    IMPORTANT LAB-CODE PRESERVATION NOTE:
    - The original JavaScript is not deleted.
    - It is commented out at the bottom of this file.

    DATASET COMMENT:
    The Clean_NM.csv has one row per New Mexico census tract.
    Main join field:
      CSV:     TractFIPS
      GeoJSON: GEOID

    FIELD COMMENT:
    CDC PLACES fields ending in *_CrudePrev are crude prevalence estimates.
    Matching *_Crude95CI fields provide 95% confidence intervals.
*/

/* ------------------------------------------------------------
   1. Category and measure configuration
   ------------------------------------------------------------
   Similar to the original lab code, most map behavior is controlled by
   selectors and IDs. Here, each object below creates one row in the page.
*/
const CDC_CATEGORIES = [
    {
        "id": "health-outcomes",
        "title": "Health Outcomes",
        "shortTitle": "Outcomes",
        "default": "ARTHRITIS_CrudePrev",
        "description": "Estimated prevalence of chronic disease and oral health outcomes.",
        "variables": [
            {
                "field": "ARTHRITIS_CrudePrev",
                "label": "Arthritis",
                "ciField": "ARTHRITIS_Crude95CI"
            },
            {
                "field": "BPHIGH_CrudePrev",
                "label": "High blood pressure",
                "ciField": "BPHIGH_Crude95CI"
            },
            {
                "field": "CANCER_CrudePrev",
                "label": "Cancer excluding skin cancer",
                "ciField": "CANCER_Crude95CI"
            },
            {
                "field": "CASTHMA_CrudePrev",
                "label": "Current asthma",
                "ciField": "CASTHMA_Crude95CI"
            },
            {
                "field": "CHD_CrudePrev",
                "label": "Coronary heart disease",
                "ciField": "CHD_Crude95CI"
            },
            {
                "field": "COPD_CrudePrev",
                "label": "COPD",
                "ciField": "COPD_Crude95CI"
            },
            {
                "field": "DEPRESSION_CrudePrev",
                "label": "Depression",
                "ciField": "DEPRESSION_Crude95CI"
            },
            {
                "field": "DIABETES_CrudePrev",
                "label": "Diabetes",
                "ciField": "DIABETES_Crude95CI"
            },
            {
                "field": "HIGHCHOL_CrudePrev",
                "label": "High cholesterol",
                "ciField": "HIGHCHOL_Crude95CI"
            },
            {
                "field": "OBESITY_CrudePrev",
                "label": "Obesity",
                "ciField": "OBESITY_Crude95CI"
            },
            {
                "field": "STROKE_CrudePrev",
                "label": "Stroke",
                "ciField": "STROKE_Crude95CI"
            },
            {
                "field": "TEETHLOST_CrudePrev",
                "label": "All teeth lost",
                "ciField": "TEETHLOST_Crude95CI"
            }
        ]
    },
    {
        "id": "prevention",
        "title": "Prevention",
        "shortTitle": "Prevention",
        "default": "ACCESS2_CrudePrev",
        "description": "Health care access and preventive service use measures.",
        "variables": [
            {
                "field": "ACCESS2_CrudePrev",
                "label": "Lack of health insurance",
                "ciField": "ACCESS2_Crude95CI"
            },
            {
                "field": "BPMED_CrudePrev",
                "label": "Taking medicine for high blood pressure",
                "ciField": "BPMED_Crude95CI"
            },
            {
                "field": "CHECKUP_CrudePrev",
                "label": "Annual checkup",
                "ciField": "CHECKUP_Crude95CI"
            },
            {
                "field": "CHOLSCREEN_CrudePrev",
                "label": "Cholesterol screening",
                "ciField": "CHOLSCREEN_Crude95CI"
            },
            {
                "field": "COLON_SCREEN_CrudePrev",
                "label": "Colorectal cancer screening",
                "ciField": "COLON_SCREEN_Crude95CI"
            },
            {
                "field": "DENTAL_CrudePrev",
                "label": "Dental visit",
                "ciField": "DENTAL_Crude95CI"
            },
            {
                "field": "MAMMOUSE_CrudePrev",
                "label": "Mammography use",
                "ciField": "MAMMOUSE_Crude95CI"
            }
        ]
    },
    {
        "id": "health-risk-behaviors",
        "title": "Health Risk Behaviors",
        "shortTitle": "Risk Behaviors",
        "default": "CSMOKING_CrudePrev",
        "description": "Behaviors that may increase chronic disease risk.",
        "variables": [
            {
                "field": "BINGE_CrudePrev",
                "label": "Binge drinking",
                "ciField": "BINGE_Crude95CI"
            },
            {
                "field": "CSMOKING_CrudePrev",
                "label": "Current smoking",
                "ciField": "CSMOKING_Crude95CI"
            },
            {
                "field": "LPA_CrudePrev",
                "label": "No leisure-time physical activity",
                "ciField": "LPA_Crude95CI"
            },
            {
                "field": "SLEEP_CrudePrev",
                "label": "Short sleep duration",
                "ciField": "SLEEP_Crude95CI"
            }
        ]
    },
    {
        "id": "disabilities",
        "title": "Disabilities",
        "shortTitle": "Disabilities",
        "default": "DISABILITY_CrudePrev",
        "description": "Disability status and functional limitation measures.",
        "variables": [
            {
                "field": "HEARING_CrudePrev",
                "label": "Hearing disability",
                "ciField": "HEARING_Crude95CI"
            },
            {
                "field": "VISION_CrudePrev",
                "label": "Vision disability",
                "ciField": "VISION_Crude95CI"
            },
            {
                "field": "COGNITION_CrudePrev",
                "label": "Cognitive disability",
                "ciField": "COGNITION_Crude95CI"
            },
            {
                "field": "MOBILITY_CrudePrev",
                "label": "Mobility disability",
                "ciField": "MOBILITY_Crude95CI"
            },
            {
                "field": "SELFCARE_CrudePrev",
                "label": "Self-care disability",
                "ciField": "SELFCARE_Crude95CI"
            },
            {
                "field": "INDEPLIVE_CrudePrev",
                "label": "Independent living disability",
                "ciField": "INDEPLIVE_Crude95CI"
            },
            {
                "field": "DISABILITY_CrudePrev",
                "label": "Any disability",
                "ciField": "DISABILITY_Crude95CI"
            }
        ]
    },
    {
        "id": "health-status",
        "title": "Health Status",
        "shortTitle": "Health Status",
        "default": "GHLTH_CrudePrev",
        "description": "Self-reported general, mental, and physical health status.",
        "variables": [
            {
                "field": "GHLTH_CrudePrev",
                "label": "Fair or poor general health",
                "ciField": "GHLTH_Crude95CI"
            },
            {
                "field": "MHLTH_CrudePrev",
                "label": "Frequent mental distress",
                "ciField": "MHLTH_Crude95CI"
            },
            {
                "field": "PHLTH_CrudePrev",
                "label": "Frequent physical distress",
                "ciField": "PHLTH_Crude95CI"
            }
        ]
    },
    {
        "id": "health-related-social-needs",
        "title": "Health-Related Social Needs",
        "shortTitle": "Social Needs",
        "default": "FOODINSECU_CrudePrev",
        "description": "Social needs that can shape health outcomes and access to resources.",
        "variables": [
            {
                "field": "LONELINESS_CrudePrev",
                "label": "Feeling lonely",
                "ciField": "LONELINESS_Crude95CI"
            },
            {
                "field": "FOODSTAMP_CrudePrev",
                "label": "Received food stamps / SNAP",
                "ciField": "FOODSTAMP_Crude95CI"
            },
            {
                "field": "FOODINSECU_CrudePrev",
                "label": "Food insecurity",
                "ciField": "FOODINSECU_Crude95CI"
            },
            {
                "field": "HOUSINSECU_CrudePrev",
                "label": "Housing insecurity",
                "ciField": "HOUSINSECU_Crude95CI"
            },
            {
                "field": "SHUTUTILITY_CrudePrev",
                "label": "Utility services threat",
                "ciField": "SHUTUTILITY_Crude95CI"
            },
            {
                "field": "LACKTRPT_CrudePrev",
                "label": "Lack of reliable transportation",
                "ciField": "LACKTRPT_Crude95CI"
            },
            {
                "field": "EMOTIONSPT_CrudePrev",
                "label": "Lack of social and emotional support",
                "ciField": "EMOTIONSPT_Crude95CI"
            }
        ]
    },
    {
        "id": "non-medical-factors",
        "title": "Non-Medical Factors",
        "shortTitle": "Non-Medical",
        "default": null,
        "description": "Placeholder row for the CDC/PLACES non-medical factors category. These ACS-derived fields are not included in the Clean_NM.csv.",
        "variables": [
            {
                "field": "NOT_IN_CURRENT_CSV",
                "label": "Non-medical factor fields are not included in Clean_NM.csv",
                "ciField": null
            }
        ],
        "disabled": true
    }
];

/* ------------------------------------------------------------
   2. File paths
   ------------------------------------------------------------
   These paths keep the original GeoAIR lab data-folder structure.
*/
const CDC_CSV_PATH = "data/Clean_NM.csv";
const NM_TRACT_GEOJSON_PATH = "data/census_tract_county_nm_2020.geojson";
const NM_COUNTY_GEOJSON_PATH = "data/tl_2018_nm_county.geojson";

/* ------------------------------------------------------------
   3. Shared map settings
   ------------------------------------------------------------
*/
const NO_DATA_COLOR = "#d9d9d9";
const MAP_CLASS_COUNT = 5;
const CDC_COLOR_SCHEME = (typeof colorbrewer !== "undefined" && colorbrewer.YlOrRd)
    ? colorbrewer.YlOrRd[MAP_CLASS_COUNT]
    : ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];

let cdcRows = [];
let cdcByTractFips = new Map();
let tractGeojson = null;
let countyGeojson = null;
let categoryViews = [];
let dataTable = null;
let selectedCompareFeatures = {};

/* ------------------------------------------------------------
   4. Load CDC CSV and New Mexico tract/county boundaries
   ------------------------------------------------------------
   D3 loads the tabular and spatial data. Once both finish loading,
   the app builds the seven category rows, maps, legends, and table.
*/
Promise.all([
    d3.csv(CDC_CSV_PATH),
    d3.json(NM_TRACT_GEOJSON_PATH),
    d3.json(NM_COUNTY_GEOJSON_PATH)
]).then(function ([cdcCsv, tracts, counties]) {
    cdcRows = normalizeCdcRows(cdcCsv);
    tractGeojson = tracts;
    countyGeojson = counties;

    cdcByTractFips = new Map(cdcRows.map(function (row) {
        return [row.TractFIPS, row];
    }));

    buildCategoryRows();
    initializeAllCategoryViews();
    updateStatusPanel();
    renderDataTable();
}).catch(function (error) {
    console.error("Data loading failed:", error);
    document.getElementById("cdc-map-rows").innerHTML = `
        <div class="alert alert-danger">
            <b>Data loading failed.</b> Please check that Clean_NM.csv and the New Mexico GeoJSON files are inside the data folder.
        </div>`;
});

/* ------------------------------------------------------------
   5. Normalize CSV rows
   ------------------------------------------------------------
   This step makes the data easier to map:
   - keeps FIPS codes as strings;
   - removes commas from population fields;
   - converts CDC prevalence fields into numbers where possible.
*/
function normalizeCdcRows(rows) {
    return rows.map(function (rawRow) {
        const row = {};

        Object.keys(rawRow).forEach(function (key) {
            const cleanKey = key.trim();
            row[cleanKey] = rawRow[key];
        });

        row.TractFIPS = String(row.TractFIPS || "").trim().padStart(11, "0");
        row.CountyFIPS = String(row.CountyFIPS || "").trim().padStart(5, "0");
        row.TotalPopulation_number = parseNumber(row.TotalPopulation);
        row.TotalPop18plus_number = parseNumber(row.TotalPop18plus);

        CDC_CATEGORIES.forEach(function (category) {
            category.variables.forEach(function (measure) {
                if (measure.field && measure.field.endsWith("_CrudePrev")) {
                    row[measure.field + "_number"] = parseNumber(row[measure.field]);
                }
            });
        });

        return row;
    });
}

function parseNumber(value) {
    if (value === undefined || value === null || value === "") return null;
    const cleaned = String(value).replace(/,/g, "").trim();
    const numberValue = Number(cleaned);
    return Number.isFinite(numberValue) ? numberValue : null;
}

/* ------------------------------------------------------------
   6. Build the seven map rows from the category configuration
   ------------------------------------------------------------
*/
function buildCategoryRows() {
    const container = document.getElementById("cdc-map-rows");
    container.innerHTML = "";

    CDC_CATEGORIES.forEach(function (category, index) {
        const selectId = `select-${category.id}`;
        const mapId = `map-${category.id}`;
        const legendId = `legend-${category.id}`;
        const summaryId = `summary-${category.id}`;
        const comparisonId = `comparison-${category.id}`;

        const optionsHtml = category.variables.map(function (measure) {
            const selected = measure.field === category.default ? "selected" : "";
            return `<option value="${measure.field}" ${selected}>${measure.label}</option>`;
        }).join("");

        const disabledText = category.disabled
            ? " disabled"
            : "";

        const mapContent = category.disabled
            ? `<div id="${mapId}" class="cdc-placeholder">
                    <div>
                        <strong>Placeholder row: data not included in current CSV</strong>
                        <p>The  Clean_NM.csv does not contain the ACS-derived non-medical-factor fields. Add those columns later to activate this row.</p>
                    </div>
               </div>`
            : `<div id="${mapId}" class="cdc-map"></div>`;

        container.insertAdjacentHTML("beforeend", `
            <section id="${category.id}" class="cdc-section cdc-map-card">
                <div class="cdc-map-card-header">
                    <h2>${index + 1}. ${category.title}</h2>
                    <p class="text-muted">${category.description}</p>
                </div>
                <div class="cdc-map-card-body">
                    <label class="cdc-select-label" for="${selectId}">Map variable:</label>
                    <select id="${selectId}" class="cdc-measure-select form-control" ${disabledText}>
                        ${optionsHtml}
                    </select>
                    ${mapContent}
                    <div id="${legendId}" class="cdc-legend"></div>
                    <div id="${summaryId}" class="cdc-summary"></div>
                    <div id="${comparisonId}" class="cdc-compare-box">
                     <b>Compare two locations</b><br>
                      Click two census tracts on the map to compare their values.
                    </div>
                </div>
            </section>
        `);
    });
}

/* ------------------------------------------------------------
   7. Initialize each Leaflet category map
   ------------------------------------------------------------
   Each map uses the same tract geometry, but it styles the polygons
   using a different selected CDC measure.
*/
function initializeAllCategoryViews() {
    categoryViews = [];

    CDC_CATEGORIES.forEach(function (category) {
        const select = document.getElementById(`select-${category.id}`);
        const legend = document.getElementById(`legend-${category.id}`);
        const summary = document.getElementById(`summary-${category.id}`);
        const comparison = document.getElementById(`comparison-${category.id}`);

        if (category.disabled) {
            legend.innerHTML = "<b>No active legend.</b> Non-medical-factor columns are not in the Clean_NM CSV.";
            summary.innerHTML = "This row is kept so the page structure mirrors the seven CDC PLACES categories.";
            return;
        }

        const map = L.map(`map-${category.id}`, {
            scrollWheelZoom: false
        }).setView([34.5, -106.0], 6);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        const tractLayer = L.geoJson(tractGeojson, {
            style: function (feature) {
                return getFeatureStyle(feature, select.value);
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: function (e) {
                        e.target.setStyle({
                            weight: 2.5,
                            color: "#111827"
                        });
                        e.target.bringToFront();
                    },
                    mouseout: function (e) {
                        tractLayer.resetStyle(e.target);
                    },
                    click: function (e) {
                        handleCompareClick(view, feature, e.target);
                    }
                });
                layer.bindPopup(function () {
                    return buildPopupContent(feature, select.value);
                });
            }
        }).addTo(map);

        L.geoJson(countyGeojson, {
            style: {
                color: "#252525",
                weight: 1,
                fillOpacity: 0,
                opacity: 0.7
            },
            interactive: false
        }).addTo(map);

        try {
            map.fitBounds(tractLayer.getBounds(), { padding: [10, 10] });
        } catch (error) {
            map.setView([34.5, -106.0], 6);
        }

        const view = { category, select, legend, summary, comparison, map, tractLayer };
        categoryViews.push(view);

        select.addEventListener("change", function () {
            selectedCompareFeatures[category.id] = [];
            updateCategoryView(view);
            updateComparisonPanel(view);
            renderDataTable();
        });

        updateCategoryView(view);
    });
}

function updateCategoryView(view) {
    view.tractLayer.setStyle(function (feature) {
        return getFeatureStyle(feature, view.select.value);
    });

    view.tractLayer.eachLayer(function (layer) {
        layer.bindPopup(function () {
            return buildPopupContent(layer.feature, view.select.value);
        });
    });

    renderLegend(view.legend, view.select.value);
    renderSummary(view.summary, view.select.value);
}
function handleCompareClick(view, feature, layer) {
    const categoryId = view.category.id;

    if (!selectedCompareFeatures[categoryId]) {
        selectedCompareFeatures[categoryId] = [];
    }

    const row = getRowForFeature(feature);

    if (!row) {
        layer.openPopup();
        return;
    }

    const selectedList = selectedCompareFeatures[categoryId];

    if (selectedList.length === 2) {
        selectedList.length = 0;
    }

    selectedList.push(feature);

    layer.openPopup();
    updateComparisonPanel(view);
}

function updateComparisonPanel(view) {
    const selectedList = selectedCompareFeatures[view.category.id] || [];
    const measureField = view.select.value;
    const label = getMeasureLabel(measureField);

    if (selectedList.length === 0) {
        view.comparison.innerHTML = `
            <b>Compare two locations</b><br>
            Click two census tracts on the map to compare their values.
        `;
        return;
    }

    if (selectedList.length === 1) {
        const row1 = getRowForFeature(selectedList[0]);

        view.comparison.innerHTML = `
            <b>Compare two locations</b><br>
            First location selected:<br>
            ${row1.CountyName} County, Tract ${row1.TractFIPS}<br>
            <b>${label}:</b> ${formatPercent(row1[measureField + "_number"])}<br><br>
            Now click a second tract to compare.
        `;
        return;
    }

    const row1 = getRowForFeature(selectedList[0]);
    const row2 = getRowForFeature(selectedList[1]);

    const value1 = row1[measureField + "_number"];
    const value2 = row2[measureField + "_number"];
    const difference = value2 - value1;

    view.comparison.innerHTML = `
        <b>Comparison: ${label}</b>
        <table>
            <tr>
                <th>Location</th>
                <th>County</th>
                <th>Tract FIPS</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>First clicked</td>
                <td>${row1.CountyName}</td>
                <td>${row1.TractFIPS}</td>
                <td>${formatPercent(value1)}</td>
            </tr>
            <tr>
                <td>Second clicked</td>
                <td>${row2.CountyName}</td>
                <td>${row2.TractFIPS}</td>
                <td>${formatPercent(value2)}</td>
            </tr>
        </table>
        <b>Difference:</b> ${formatPercent(Math.abs(difference))}<br>
        <b>Direction:</b> The second location is ${difference >= 0 ? "higher" : "lower"} than the first.
        <br><br>
        Click another tract to start a new comparison.
    `;
}

function getFeatureStyle(feature, measureField) {
    const row = getRowForFeature(feature);
    const value = row ? row[measureField + "_number"] : null;
    const breaks = getBreaksForMeasure(measureField);

    return {
        fillColor: getColorForValue(value, breaks),
        weight: 0.5,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: value === null ? 0.45 : 0.78
    };
}

function getRowForFeature(feature) {
    const geoid = String(feature.properties.GEOID || "").trim();
    return cdcByTractFips.get(geoid) || null;
}

/* ------------------------------------------------------------
   8. Classification, colors, legends, and summaries
   ------------------------------------------------------------
   Quantile breaks make the map useful for quick exploration.
   They are recalculated separately for each selected CDC measure.
*/
function getValuesForMeasure(measureField) {
    return cdcRows
        .map(function (row) { return row[measureField + "_number"]; })
        .filter(function (value) { return value !== null && Number.isFinite(value); })
        .sort(function (a, b) { return a - b; });
}

function getBreaksForMeasure(measureField) {
    const values = getValuesForMeasure(measureField);
    if (values.length === 0) return [];

    const breaks = [];
    for (let i = 1; i <= MAP_CLASS_COUNT; i++) {
        breaks.push(quantile(values, i / MAP_CLASS_COUNT));
    }
    return breaks;
}

function quantile(sortedValues, p) {
    if (sortedValues.length === 0) return null;
    const index = (sortedValues.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sortedValues[lower];
    return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
}

function getColorForValue(value, breaks) {
    if (value === null || !Number.isFinite(value) || breaks.length === 0) return NO_DATA_COLOR;
    for (let i = 0; i < breaks.length; i++) {
        if (value <= breaks[i]) return CDC_COLOR_SCHEME[i];
    }
    return CDC_COLOR_SCHEME[CDC_COLOR_SCHEME.length - 1];
}

function renderLegend(container, measureField) {
    const label = getMeasureLabel(measureField);
    const breaks = getBreaksForMeasure(measureField);
    if (breaks.length === 0) {
        container.innerHTML = `<b>No data available for ${label}.</b>`;
        return;
    }

    let previous = null;
    let html = `<div class="cdc-legend-title">${label}: crude prevalence (%)</div>`;

    breaks.forEach(function (breakValue, index) {
        const color = CDC_COLOR_SCHEME[index];
        const fromText = previous === null ? "lowest" : previous.toFixed(1);
        const toText = breakValue.toFixed(1);
        html += `
            <div class="cdc-legend-item">
                <span class="cdc-swatch" style="background:${color}"></span>
                <span>${fromText} – ${toText}</span>
            </div>`;
        previous = breakValue;
    });

    html += `
        <div class="cdc-legend-item">
            <span class="cdc-swatch" style="background:${NO_DATA_COLOR}"></span>
            <span>No data / no CSV match</span>
        </div>`;

    container.innerHTML = html;
}

function renderSummary(container, measureField) {
    const label = getMeasureLabel(measureField);
    const values = getValuesForMeasure(measureField);
    if (values.length === 0) {
        container.innerHTML = `No valid values are available for <b>${label}</b>.`;
        return;
    }

    const min = values[0];
    const median = quantile(values, 0.5);
    const max = values[values.length - 1];

    container.innerHTML = `
        <b>${label}</b> across ${values.length} New Mexico census tracts:
        min ${min.toFixed(1)}%, median ${median.toFixed(1)}%, max ${max.toFixed(1)}%.
    `;
}

function getMeasureLabel(measureField) {
    for (const category of CDC_CATEGORIES) {
        for (const measure of category.variables) {
            if (measure.field === measureField) return measure.label;
        }
    }
    return measureField;
}

function getMeasureCiField(measureField) {
    return measureField && measureField.endsWith("_CrudePrev")
        ? measureField.replace("_CrudePrev", "_Crude95CI")
        : null;
}

/* ------------------------------------------------------------
   9. Popup content
   ------------------------------------------------------------
*/
function buildPopupContent(feature, measureField) {
    const row = getRowForFeature(feature);
    const label = getMeasureLabel(measureField);

    if (!row) {
        return `
            <b>${feature.properties.NAMELSAD || "Census tract"}</b><br>
            County: ${feature.properties.NAMELSADCO || "Unknown"}<br>
            GEOID: ${feature.properties.GEOID || "Unknown"}<br>
            <i>No matching CDC CSV row for this tract.</i>
        `;
    }

    const value = row[measureField + "_number"];
    const ciField = getMeasureCiField(measureField);
    const ci = ciField ? row[ciField] : "";

    return `
        <b>${row.CountyName} County</b><br>
        Tract FIPS: ${row.TractFIPS}<br>
        Population: ${formatInteger(row.TotalPopulation_number)}<br>
        Adults 18+: ${formatInteger(row.TotalPop18plus_number)}<hr>
        <b>${label}</b><br>
        Crude prevalence: ${formatPercent(value)}<br>
        95% CI: ${ci || "not available"}
    `;
}

function formatInteger(value) {
    return value === null || !Number.isFinite(value)
        ? "not available"
        : value.toLocaleString();
}

function formatPercent(value) {
    return value === null || !Number.isFinite(value)
        ? "not available"
        : value.toFixed(1) + "%";
}

/* ------------------------------------------------------------
   10. Status panel and data table
   ------------------------------------------------------------
*/
function updateStatusPanel() {
    const activeFields = new Set();
    CDC_CATEGORIES.forEach(function (category) {
        category.variables.forEach(function (measure) {
            if (measure.field && measure.field.endsWith("_CrudePrev") && !category.disabled) {
                activeFields.add(measure.field);
            }
        });
    });

    document.getElementById("cdc-row-count").textContent = cdcRows.length.toLocaleString();
    document.getElementById("tract-count").textContent = tractGeojson.features.length.toLocaleString();
    document.getElementById("measure-count").textContent = activeFields.size.toLocaleString();
}

function renderDataTable() {
    const table = document.getElementById("cdc-data-table");

    // DataTables wraps the original table. Destroy the old instance before
    // rebuilding headers and rows after a dropdown change.
    if (typeof jQuery !== "undefined" && jQuery.fn.DataTable && dataTable) {
        dataTable.destroy();
        dataTable = null;
    }

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    const activeViews = categoryViews.filter(function (view) {
        return !view.category.disabled;
    });

    const headers = ["County", "Tract FIPS", "Total Population"].concat(
        activeViews.map(function (view) {
            return view.category.shortTitle + ": " + getMeasureLabel(view.select.value);
        })
    );

    thead.innerHTML = "<tr>" + headers.map(function (header) {
        return `<th>${header}</th>`;
    }).join("") + "</tr>";

    tbody.innerHTML = cdcRows.map(function (row) {
        const cells = [
            row.CountyName,
            row.TractFIPS,
            formatInteger(row.TotalPopulation_number)
        ];

        activeViews.forEach(function (view) {
            cells.push(formatPercent(row[view.select.value + "_number"]));
        });

        return "<tr>" + cells.map(function (cell) {
            return `<td>${cell}</td>`;
        }).join("") + "</tr>";
    }).join("");

    if (typeof jQuery !== "undefined" && jQuery.fn.DataTable) {
        dataTable = jQuery("#cdc-data-table").DataTable({
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            scrollX: true,
            order: [[0, "asc"], [1, "asc"]]
        });
    }
}

/* ------------------------------------------------------------
   ORIGINAL LAB JAVASCRIPT COMMENTED OUT BELOW
   ------------------------------------------------------------
   The following lines are the original Dr. Yang GeoAIR Lab myJS_scripts/main.js,
   commented out line-by-line so they remain available for demonstration
   and comparison but do not run in this CDC/NM version.
*/


// OLD LAB CODE: // load data
// OLD LAB CODE: // Data can be loaded through regular means with your favorite javascript library
// OLD LAB CODE: Promise.all([
// OLD LAB CODE:   // D3 can handle different types of data defined either locally in variables or from external files.
// OLD LAB CODE:   // d3.csv() method sends http request to the specified url to load .csv file or data and executes callback function with parsed csv data objects.
// OLD LAB CODE:   d3.csv("data/NM_svi_food_cejst_replaced999withNA.csv"),
// OLD LAB CODE:   d3.json("data/census_tract_county_nm_2020.geojson"),
// OLD LAB CODE:   d3.json("data/tl_2018_nm_county.geojson"),
// OLD LAB CODE:   d3.json("data/NM_nativeLand_intersect_USCensus.geojson"),
// OLD LAB CODE: ]).then(function ([justic_data, nm_tract, nm_county, native_json]) {
// OLD LAB CODE:   draw(justic_data, nm_tract, nm_county, native_json);
// OLD LAB CODE: });
// OLD LAB CODE: 
// OLD LAB CODE: function draw(justic_data, nm_tract, nm_county, native_json) {
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE:   // ----------pure leaflet.js parts starts here-------------
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE: 
// OLD LAB CODE:   // **** BASEMAP ****
// OLD LAB CODE:   const USGS_USImagery = L.tileLayer(
// OLD LAB CODE:       "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
// OLD LAB CODE:       {
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         attribution: '© <a href="https://usgs.gov/">U.S. Geological Survey</a>',
// OLD LAB CODE:       }
// OLD LAB CODE:     ),
// OLD LAB CODE:     OpenStreetMap = L.tileLayer(
// OLD LAB CODE:       "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
// OLD LAB CODE:       {
// OLD LAB CODE:         attribution:
// OLD LAB CODE:           '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         accessToken:
// OLD LAB CODE:           "cEsmm0rHmqiHCbTmgVEXQ7mBXFcxtmKzCq4JNxCK75itmwK5d13tLxEQiwUQ9M8k",
// OLD LAB CODE:       }
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE:   // ------------------------------ overlay layer function starts here---------- -----------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // --------------------
// OLD LAB CODE:   // Create County Layer
// OLD LAB CODE:   // --------------------
// OLD LAB CODE:   function createCountyLayer(map) {
// OLD LAB CODE:     const info = L.control({ position: "topright" });
// OLD LAB CODE: 
// OLD LAB CODE:     info.onAdd = function () {
// OLD LAB CODE:       this._div = L.DomUtil.create("div", "info");
// OLD LAB CODE:       this.update();
// OLD LAB CODE:       return this._div;
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     info.update = function (props) {
// OLD LAB CODE:       this._div.innerHTML = props
// OLD LAB CODE:         ? `<h4>New Mexico County</h4><b>${props.NAMELSAD}</b>`
// OLD LAB CODE:         : "<h4>New Mexico County</h4>Hover over a county";
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     const layer = L.geoJson(nm_county, {
// OLD LAB CODE:       style: function () {
// OLD LAB CODE:         return {
// OLD LAB CODE:           fillColor: "red",
// OLD LAB CODE:           weight: 2,
// OLD LAB CODE:           color: "white",
// OLD LAB CODE:           dashArray: "3",
// OLD LAB CODE:           fillOpacity: 0.2,
// OLD LAB CODE:         };
// OLD LAB CODE:       },
// OLD LAB CODE:       onEachFeature: function (feature, layer) {
// OLD LAB CODE:         layer.on({
// OLD LAB CODE:           mouseover: function (e) {
// OLD LAB CODE:             const layer = e.target;
// OLD LAB CODE:             layer.setStyle({
// OLD LAB CODE:               weight: 5,
// OLD LAB CODE:               color: "#666",
// OLD LAB CODE:               dashArray: "",
// OLD LAB CODE:               fillOpacity: 0.7,
// OLD LAB CODE:             });
// OLD LAB CODE:             layer.bringToFront();
// OLD LAB CODE:             info.update(layer.feature.properties);
// OLD LAB CODE:           },
// OLD LAB CODE:           mouseout: function (e) {
// OLD LAB CODE:             const layer = e.target;
// OLD LAB CODE:             layer.setStyle({
// OLD LAB CODE:               weight: 2,
// OLD LAB CODE:               color: "white",
// OLD LAB CODE:               dashArray: "3",
// OLD LAB CODE:               fillOpacity: 0.2,
// OLD LAB CODE:             });
// OLD LAB CODE:             info.update();
// OLD LAB CODE:           },
// OLD LAB CODE:           click: function (e) {
// OLD LAB CODE:             map.fitBounds(e.target.getBounds());
// OLD LAB CODE:           },
// OLD LAB CODE:         });
// OLD LAB CODE: 
// OLD LAB CODE:         layer.bindPopup(`<strong>${feature.properties.NAMELSAD}</strong>`);
// OLD LAB CODE:       },
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     return { layer, info };
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // ---------------------------------
// OLD LAB CODE:   // Create Native American Land Layer
// OLD LAB CODE:   // ---------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   function createNativeLandLayer(map) {
// OLD LAB CODE:     const info = L.control({ position: "topright" });
// OLD LAB CODE: 
// OLD LAB CODE:     info.onAdd = function () {
// OLD LAB CODE:       this._div = L.DomUtil.create("div", "info");
// OLD LAB CODE:       this.update();
// OLD LAB CODE:       return this._div;
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     info.update = function (props) {
// OLD LAB CODE:       this._div.innerHTML = props
// OLD LAB CODE:         ? `<h4>Land Name</h4><b>${props.NAME_2}</b>`
// OLD LAB CODE:         : "<h4>New Mexico Native Land</h4>Hover over a land";
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     const layer = L.geoJson(native_json, {
// OLD LAB CODE:       style: function () {
// OLD LAB CODE:         return {
// OLD LAB CODE:           color: "white",
// OLD LAB CODE:           weight: 0.2,
// OLD LAB CODE:           opacity: 1,
// OLD LAB CODE:           dashArray: "1",
// OLD LAB CODE:           fillColor: "#255",
// OLD LAB CODE:           fillOpacity: 0.9,
// OLD LAB CODE:         };
// OLD LAB CODE:       },
// OLD LAB CODE:       onEachFeature: function (feature, layer) {
// OLD LAB CODE:         layer.on({
// OLD LAB CODE:           mouseover: function (e) {
// OLD LAB CODE:             const layer = e.target;
// OLD LAB CODE:             layer.setStyle({
// OLD LAB CODE:               weight: 0.4,
// OLD LAB CODE:               color: "#666",
// OLD LAB CODE:               dashArray: "",
// OLD LAB CODE:               fillOpacity: 1,
// OLD LAB CODE:             });
// OLD LAB CODE:             layer.bringToFront();
// OLD LAB CODE:             info.update(layer.feature.properties);
// OLD LAB CODE:           },
// OLD LAB CODE:           mouseout: function (e) {
// OLD LAB CODE:             const layer = e.target;
// OLD LAB CODE:             layer.setStyle({
// OLD LAB CODE:               weight: 0.2,
// OLD LAB CODE:               color: "white",
// OLD LAB CODE:               dashArray: "1",
// OLD LAB CODE:               fillOpacity: 0.9,
// OLD LAB CODE:             });
// OLD LAB CODE:             info.update();
// OLD LAB CODE:           },
// OLD LAB CODE:           click: function (e) {
// OLD LAB CODE:             map.fitBounds(e.target.getBounds());
// OLD LAB CODE:           },
// OLD LAB CODE:         });
// OLD LAB CODE: 
// OLD LAB CODE:         layer.bindPopup(
// OLD LAB CODE:           `<strong>${feature.properties.NAME_2}</strong><br/>${feature.properties.STATE_NAME}<br/> ${feature.properties.NAMELSADCO}<br/> ${feature.properties.NAMELSAD_2}`
// OLD LAB CODE:         );
// OLD LAB CODE:       },
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     return { layer, info };
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // **** MAP - Social Justice starts here ****
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // create map
// OLD LAB CODE:   const map_socialJustice = L.map("map_socialJustice", {
// OLD LAB CODE:     // to enable fractional zoom
// OLD LAB CODE:     zoomSnap: 0.1,
// OLD LAB CODE:     zoom: 14,
// OLD LAB CODE:     layers: [OpenStreetMap, USGS_USImagery],
// OLD LAB CODE:     // full screen control can be added by changing pseudoFullscreen to true
// OLD LAB CODE:     // git repository of Leaflet.fullscreen plug-in: https://github.com/Leaflet/Leaflet.fullscreen
// OLD LAB CODE:     fullscreenControl: {
// OLD LAB CODE:       pseudoFullscreen: false,
// OLD LAB CODE:     },
// OLD LAB CODE:   });
// OLD LAB CODE:   map_socialJustice.setView(new L.LatLng(34, -105.2), 6.6);
// OLD LAB CODE: 
// OLD LAB CODE:   // // **** CONTROLS LAYERS****
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE:   // Setup Map Layers and Controls - Social Justice Map
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // Create layers for the map
// OLD LAB CODE:   const { layer: countyLayer_socialJustice, info: countyInfo_socialJustice } =
// OLD LAB CODE:     createCountyLayer(map_socialJustice);
// OLD LAB CODE:   const { layer: nativeLayer_socialJustice, info: nativeInfo_socialJustice } =
// OLD LAB CODE:     createNativeLandLayer(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // Basemaps (you already have these)
// OLD LAB CODE:   const baseMaps_socialJustice = {
// OLD LAB CODE:     "USGS Satellite": USGS_USImagery,
// OLD LAB CODE:     "Open Street Map": OpenStreetMap,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // Overlay maps
// OLD LAB CODE:   const overlayMaps_socialJustice = {
// OLD LAB CODE:     "New Mexico County": countyLayer_socialJustice,
// OLD LAB CODE:     "Native American Land": nativeLayer_socialJustice,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // Add layers control
// OLD LAB CODE:   L.control
// OLD LAB CODE:     .layers(baseMaps_socialJustice, overlayMaps_socialJustice)
// OLD LAB CODE:     .addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // Manage info boxes based on layer visibility
// OLD LAB CODE:   map_socialJustice.on("overlayadd", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_socialJustice) {
// OLD LAB CODE:       countyInfo_socialJustice.addTo(map_socialJustice);
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_socialJustice) {
// OLD LAB CODE:       nativeInfo_socialJustice.addTo(map_socialJustice);
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   map_socialJustice.on("overlayremove", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_socialJustice) {
// OLD LAB CODE:       countyInfo_socialJustice.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_socialJustice) {
// OLD LAB CODE:       nativeInfo_socialJustice.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // **** CONTROLS LAYERS****
// OLD LAB CODE:   // add scale bar to the map
// OLD LAB CODE:   // git repository of leaflet-betterscale plug-in: https://github.com/daniellsu/leaflet-betterscale
// OLD LAB CODE:   L.control.betterscale().addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// OLD LAB CODE: 
// OLD LAB CODE:   // add mini map  to the map
// OLD LAB CODE:   // git repository of Leaflet.MiniMap plug-in: https://github.com/Norkart/Leaflet-MiniMap
// OLD LAB CODE:   var osm2 = new L.TileLayer(osmUrl, {
// OLD LAB CODE:     minZoom: 0,
// OLD LAB CODE:     maxZoom: 13,
// OLD LAB CODE:   });
// OLD LAB CODE:   var miniMap = new L.Control.MiniMap(osm2, {
// OLD LAB CODE:     toggleDisplay: true,
// OLD LAB CODE:     width: 100,
// OLD LAB CODE:     height: 100,
// OLD LAB CODE:   }).addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // add north arrow to the map
// OLD LAB CODE:   var north = L.control({ position: "topright" });
// OLD LAB CODE:   north.onAdd = function (map) {
// OLD LAB CODE:     var div = L.DomUtil.create("div", "info legend");
// OLD LAB CODE:     div.innerHTML = '<img src="images/norhArrow_1.png" "width=45 height=45" >';
// OLD LAB CODE:     // make the noth arrow draggable using draggle feature
// OLD LAB CODE:     var draggable = new L.Draggable(div);
// OLD LAB CODE:     draggable.enable();
// OLD LAB CODE:     return div;
// OLD LAB CODE:   };
// OLD LAB CODE:   north.addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // search box
// OLD LAB CODE:   // leafelt-geocoder search plugin
// OLD LAB CODE:   // git repository of leaflet-control-geocoder plug-in:  https://github.com/perliedman/leaflet-control-geocoder
// OLD LAB CODE:   L.Control.geocoder().addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // coordinates
// OLD LAB CODE:   // add mouse over coordinates to  map
// OLD LAB CODE:   // default projection is EPSG4326
// OLD LAB CODE:   // git repository of leaflet-coord-projection plug-in: https://github.com/edihasaj/leaflet-coord-projection?tab=readme-ov-file
// OLD LAB CODE:   var coordinatesControl = L.control
// OLD LAB CODE:     .coordProjection({
// OLD LAB CODE:       position: "bottomleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // add ruler to the map
// OLD LAB CODE:   // git repository of leaflet-ruler plug-in: https://github.com/gokertanrisever/leaflet-ruler
// OLD LAB CODE:   var rulerControl = L.control
// OLD LAB CODE:     .ruler({
// OLD LAB CODE:       position: "topleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_socialJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet Plugin For Creating And Editing Geometry Layers to the map
// OLD LAB CODE:   // git repository of Leaflet-Geoman plug-in: https://github.com/geoman-io/leaflet-geoman
// OLD LAB CODE:   // add Leaflet-Geoman controls with some options to the map_socialJustice
// OLD LAB CODE:   var drawControl = map_socialJustice.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircleMarker: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   map_socialJustice.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircle: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // ----------------------------------------
// OLD LAB CODE:   // **** MAP - Social Justice ends here ****
// OLD LAB CODE:   // ----------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------------------------
// OLD LAB CODE:   // **** MAP -  Social Vulnerability Index starts here ****
// OLD LAB CODE:   // -------------------------------------------------------
// OLD LAB CODE:   // **** BASEMAP ****
// OLD LAB CODE:   const USGS_USImagery_svi = L.tileLayer(
// OLD LAB CODE:       "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
// OLD LAB CODE:       {
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         attribution: '© <a href="https://usgs.gov/">U.S. Geological Survey</a>',
// OLD LAB CODE:       }
// OLD LAB CODE:     ),
// OLD LAB CODE:     OpenStreetMap_svi = L.tileLayer(
// OLD LAB CODE:       "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
// OLD LAB CODE:       {
// OLD LAB CODE:         attribution:
// OLD LAB CODE:           '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         accessToken:
// OLD LAB CODE:           "cEsmm0rHmqiHCbTmgVEXQ7mBXFcxtmKzCq4JNxCK75itmwK5d13tLxEQiwUQ9M8k",
// OLD LAB CODE:       }
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   // create map
// OLD LAB CODE:   const map_svi = L.map("map_svi", {
// OLD LAB CODE:     // to enable fractional zoom
// OLD LAB CODE:     zoomSnap: 0.1,
// OLD LAB CODE:     zoom: 14,
// OLD LAB CODE:     layers: [OpenStreetMap_svi, USGS_USImagery_svi],
// OLD LAB CODE:     fullscreenControl: {
// OLD LAB CODE:       pseudoFullscreen: false,
// OLD LAB CODE:     },
// OLD LAB CODE:   });
// OLD LAB CODE:   map_svi.setView(new L.LatLng(34, -105.2), 6.6);
// OLD LAB CODE: 
// OLD LAB CODE:   // add basemap
// OLD LAB CODE:   const baseMaps_svi = {
// OLD LAB CODE:     "USGS Satellite ": USGS_USImagery_svi,
// OLD LAB CODE:     "Open Street Map": OpenStreetMap_svi,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // // **** CONTROLS LAYERS****
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE:   // Setup Map Layers and Controls - SVI
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // Create layers for the map
// OLD LAB CODE:   const { layer: countyLayer_svi, info: countyInfo_svi } =
// OLD LAB CODE:     createCountyLayer(map_svi);
// OLD LAB CODE:   const { layer: nativeLayer_svi, info: nativeInfo_svi } =
// OLD LAB CODE:     createNativeLandLayer(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // Overlay maps
// OLD LAB CODE:   const overlayMaps_svi = {
// OLD LAB CODE:     "New Mexico County": countyLayer_svi,
// OLD LAB CODE:     "Native American Land": nativeLayer_svi,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // Add layers control
// OLD LAB CODE:   L.control.layers(baseMaps_svi, overlayMaps_svi).addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // Manage info boxes based on layer visibility
// OLD LAB CODE:   map_svi.on("overlayadd", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_svi) {
// OLD LAB CODE:       countyInfo_svi.addTo(map_svi);
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_svi) {
// OLD LAB CODE:       nativeInfo_svi.addTo(map_svi);
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   map_svi.on("overlayremove", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_svi) {
// OLD LAB CODE:       countyInfo_svi.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_svi) {
// OLD LAB CODE:       nativeInfo_svi.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // // **** CONTROLS LAYERS****
// OLD LAB CODE:   // // add basemap to the control layer
// OLD LAB CODE:   // // add overlay layer to the control layer
// OLD LAB CODE:   // L.control.layers(baseMaps_svi, overlayMaps_svi).addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // add scale bar to the map
// OLD LAB CODE:   L.control.betterscale().addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // add mini map to the map
// OLD LAB CODE:   var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// OLD LAB CODE:   var osm2 = new L.TileLayer(osmUrl, {
// OLD LAB CODE:     minZoom: 0,
// OLD LAB CODE:     maxZoom: 13,
// OLD LAB CODE:   });
// OLD LAB CODE:   var miniMap = new L.Control.MiniMap(osm2, {
// OLD LAB CODE:     toggleDisplay: true,
// OLD LAB CODE:     width: 100,
// OLD LAB CODE:     height: 100,
// OLD LAB CODE:   }).addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // add north arrow to the map
// OLD LAB CODE:   var north = L.control({ position: "topright" });
// OLD LAB CODE:   north.onAdd = function (map_svi) {
// OLD LAB CODE:     var div = L.DomUtil.create("div", "info legend");
// OLD LAB CODE:     div.innerHTML = '<img src="images/norhArrow_1.png" "width=45 height=45" >';
// OLD LAB CODE:     // make the noth arrow draggable using draggle feature
// OLD LAB CODE:     var draggable = new L.Draggable(div);
// OLD LAB CODE:     draggable.enable();
// OLD LAB CODE:     //
// OLD LAB CODE:     return div;
// OLD LAB CODE:   };
// OLD LAB CODE:   north.addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // add search box to the map
// OLD LAB CODE:   L.Control.geocoder().addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // coordinates
// OLD LAB CODE:   // add mouse over coordinates to  map
// OLD LAB CODE:   var coordinatesControl = L.control
// OLD LAB CODE:     .coordProjection({
// OLD LAB CODE:       position: "bottomleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // ruler
// OLD LAB CODE:   var rulerControl = L.control
// OLD LAB CODE:     .ruler({
// OLD LAB CODE:       position: "topleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet-Geoman controls with some options to the map_socialJustice
// OLD LAB CODE:   var drawControl = map_svi.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircleMarker: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet Plugin For Creating And Editing Geometry Layers to the map
// OLD LAB CODE:   // add Leaflet-Geoman controls with some options to the map
// OLD LAB CODE:   map_svi.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircle: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // add printing function to map here using plugin
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet-legend to the svi map
// OLD LAB CODE:   var svi_legend = L.control({ position: "bottomright" });
// OLD LAB CODE:   svi_legend.onAdd = function (map) {
// OLD LAB CODE:     var div = L.DomUtil.create("div", "info legend-map_svi");
// OLD LAB CODE:     div.innerHTML =
// OLD LAB CODE:       '<h5 class="d-flex justify-content-center" id="choropleth_title">Level of Vulnerability</h5>' +
// OLD LAB CODE:       '<p><img src="images/svi_icon_1.png"> Low <br>' +
// OLD LAB CODE:       '<p><img src="images/svi_icon_3.png"> Low-Medium <br>' +
// OLD LAB CODE:       '<p><img src="images/svi_icon_4.png"> Medium-High <br>' +
// OLD LAB CODE:       '<p><img src="images/svi_icon_5.png"> High <br>';
// OLD LAB CODE:     return div;
// OLD LAB CODE:   };
// OLD LAB CODE:   svi_legend.addTo(map_svi);
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------------------------
// OLD LAB CODE:   // **** MAP -  Social Vulnerability Index ends here ****
// OLD LAB CODE:   // -------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // ---------------------------------------
// OLD LAB CODE:   // **** MAP - Food Justice starts here****
// OLD LAB CODE:   // ---------------------------------------
// OLD LAB CODE:   const USGS_USImagery_foodJustice = L.tileLayer(
// OLD LAB CODE:       "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
// OLD LAB CODE:       {
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         attribution: '© <a href="https://usgs.gov/">U.S. Geological Survey</a>',
// OLD LAB CODE:       }
// OLD LAB CODE:     ),
// OLD LAB CODE:     OpenStreetMap_foodJustice = L.tileLayer(
// OLD LAB CODE:       "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
// OLD LAB CODE:       {
// OLD LAB CODE:         attribution:
// OLD LAB CODE:           '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// OLD LAB CODE:         maxZoom: 20,
// OLD LAB CODE:         accessToken:
// OLD LAB CODE:           "cEsmm0rHmqiHCbTmgVEXQ7mBXFcxtmKzCq4JNxCK75itmwK5d13tLxEQiwUQ9M8k",
// OLD LAB CODE:       }
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   const map_foodJustice = L.map("map_foodJustice", {
// OLD LAB CODE:     // to enable fractional zoom
// OLD LAB CODE:     zoomSnap: 0.1,
// OLD LAB CODE:     zoom: 14,
// OLD LAB CODE:     layers: [OpenStreetMap_foodJustice, USGS_USImagery_foodJustice],
// OLD LAB CODE:     fullscreenControl: {
// OLD LAB CODE:       pseudoFullscreen: false,
// OLD LAB CODE:     },
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   map_foodJustice.setView(new L.LatLng(34, -105.2), 6.6);
// OLD LAB CODE: 
// OLD LAB CODE:   // // **** CONTROLS LAYERS****
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE:   // Setup Map Layers and Controls - Food Justice
// OLD LAB CODE:   // ---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // Create layers for the map
// OLD LAB CODE:   const { layer: countyLayer_foodJustice, info: countyInfo_foodJustice } =
// OLD LAB CODE:     createCountyLayer(map_foodJustice);
// OLD LAB CODE:   const { layer: nativeLayer_foodJustice, info: nativeInfo_foodJustice } =
// OLD LAB CODE:     createNativeLandLayer(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // Basemaps (you already have these)
// OLD LAB CODE:   const baseMaps_foodJustice = {
// OLD LAB CODE:     "USGS Satellite": USGS_USImagery_foodJustice,
// OLD LAB CODE:     "Open Street Map": OpenStreetMap_foodJustice,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // Overlay maps
// OLD LAB CODE:   const overlayMaps_foodJustice = {
// OLD LAB CODE:     "New Mexico County": countyLayer_foodJustice,
// OLD LAB CODE:     "Native American Land": nativeLayer_foodJustice,
// OLD LAB CODE:   };
// OLD LAB CODE: 
// OLD LAB CODE:   // Add layers control
// OLD LAB CODE:   L.control
// OLD LAB CODE:     .layers(baseMaps_foodJustice, overlayMaps_foodJustice)
// OLD LAB CODE:     .addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // Manage info boxes based on layer visibility
// OLD LAB CODE:   map_foodJustice.on("overlayadd", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_foodJustice) {
// OLD LAB CODE:       countyInfo_foodJustice.addTo(map_foodJustice);
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_foodJustice) {
// OLD LAB CODE:       nativeInfo_foodJustice.addTo(map_foodJustice);
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   map_foodJustice.on("overlayremove", function (e) {
// OLD LAB CODE:     if (e.layer === countyLayer_foodJustice) {
// OLD LAB CODE:       countyInfo_foodJustice.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (e.layer === nativeLayer_foodJustice) {
// OLD LAB CODE:       nativeInfo_foodJustice.remove();
// OLD LAB CODE:     }
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   L.control.betterscale().addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// OLD LAB CODE: 
// OLD LAB CODE:   var osm2 = new L.TileLayer(osmUrl, {
// OLD LAB CODE:     minZoom: 0,
// OLD LAB CODE:     maxZoom: 13,
// OLD LAB CODE:   });
// OLD LAB CODE:   var miniMap = new L.Control.MiniMap(osm2, {
// OLD LAB CODE:     toggleDisplay: true,
// OLD LAB CODE:     width: 100,
// OLD LAB CODE:     height: 100,
// OLD LAB CODE:   }).addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   L.Control.geocoder().addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // add north arrow to the map
// OLD LAB CODE:   var north = L.control({ position: "topright" });
// OLD LAB CODE:   north.onAdd = function (map_foodJustice) {
// OLD LAB CODE:     var div = L.DomUtil.create("div", "info legend");
// OLD LAB CODE:     div.innerHTML = '<img src="images/norhArrow_1.png" "width=45 height=45" >';
// OLD LAB CODE: 
// OLD LAB CODE:     // make the noth arrow draggable using draggle feature
// OLD LAB CODE:     var draggable = new L.Draggable(div);
// OLD LAB CODE:     draggable.enable();
// OLD LAB CODE:     //
// OLD LAB CODE:     return div;
// OLD LAB CODE:   };
// OLD LAB CODE:   north.addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // coordinates
// OLD LAB CODE:   // add mouse over coordinates to  map
// OLD LAB CODE:   var coordinatesControl = L.control
// OLD LAB CODE:     .coordProjection({
// OLD LAB CODE:       position: "bottomleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // ruler
// OLD LAB CODE:   var rulerControl = L.control
// OLD LAB CODE:     .ruler({
// OLD LAB CODE:       position: "topleft",
// OLD LAB CODE:     })
// OLD LAB CODE:     .addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet-Geoman controls with some options to the map_socialJustice
// OLD LAB CODE:   var drawControl = map_foodJustice.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircleMarker: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet Plugin For Creating And Editing Geometry Layers to the map
// OLD LAB CODE:   // add Leaflet-Geoman controls with some options to the map
// OLD LAB CODE:   map_foodJustice.pm.addControls({
// OLD LAB CODE:     position: "topleft",
// OLD LAB CODE:     drawCircle: false,
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // add printing function to map here using  plugin
// OLD LAB CODE: 
// OLD LAB CODE:   // add Leaflet-legend to the food access map
// OLD LAB CODE: 
// OLD LAB CODE:   const foodJustice_legend = L.control({ position: "bottomright" });
// OLD LAB CODE:   foodJustice_legend.onAdd = function (map) {
// OLD LAB CODE:     const div = L.DomUtil.create("div", "info legend-map_food");
// OLD LAB CODE:     div.innerHTML =
// OLD LAB CODE:       '<h5 class="d-flex justify-content-center" id="choropleth_title"> Selected Indicator</h5>' +
// OLD LAB CODE:       '<p><img src="images/icon_1.png"> Yes <br>' +
// OLD LAB CODE:       '<p><img src="images/icon_0.png"> No';
// OLD LAB CODE:     return div;
// OLD LAB CODE:   };
// OLD LAB CODE:   foodJustice_legend.addTo(map_foodJustice);
// OLD LAB CODE: 
// OLD LAB CODE:   // ---------------------------------------
// OLD LAB CODE:   // **** MAP - Food Justice ends here ****
// OLD LAB CODE:   // ---------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE:   // -------------pure leaflet.js parts ends here------------
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE: 
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE:   // --------------dc.js parts starts here------------
// OLD LAB CODE:   ///////////////////////////////////////////////////////////
// OLD LAB CODE: 
// OLD LAB CODE:   // crossfilter major functionality from here
// OLD LAB CODE: 
// OLD LAB CODE:   // Create an index
// OLD LAB CODE:   // See the crossfilter API for reference: https://github.com/square/crossfilter/wiki/API-Reference#crossfilter
// OLD LAB CODE: 
// OLD LAB CODE:   ndx = crossfilter(justic_data);
// OLD LAB CODE: 
// OLD LAB CODE:   //  -------- -------- -------- -------- --------
// OLD LAB CODE:   //  -------- dimension setting starts here -----
// OLD LAB CODE:   //  -------- -------- -------- -------- --------
// OLD LAB CODE: 
// OLD LAB CODE:   const allDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d;
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // define crossfilter dimensions
// OLD LAB CODE:   // See the crossfilter API for reference: https://github.com/square/crossfilter/wiki/API-Reference#dimension
// OLD LAB CODE:   const countyDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["COUNTY"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const tractDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const food1Dim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["LATracts1"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const food10Dim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["LATracts10"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const food20Dim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["LATracts20"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const foodVehDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["HUNVFlag"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const catsExceededDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["Total categories exceeded"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const disadvantageDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["Identified as disadvantaged"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const lowIncomeDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["Is low income?"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const snapDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["TractSNAP"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const svi_SocioeconomicStatusDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const svi_HouseholdCharacteristicDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const svi_EthnicMinorityStatusDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const svi_HousingTypeTransportationDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const indianAlaskaNativeDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const asianDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const blackDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const hispanicDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const hawaiianPacificNativeDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const whiteDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   const otherRaceDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   //  -------- -------- -------- -------- --------
// OLD LAB CODE:   //  -------- group setting starts here ---------
// OLD LAB CODE:   //  -------- -------- -------- -------- --------
// OLD LAB CODE: 
// OLD LAB CODE:   // define crossfilter groups
// OLD LAB CODE:   // we can give our gorup a group name to organize the charts easily
// OLD LAB CODE:   const groupname = "marker-select";
// OLD LAB CODE:   const all = ndx.groupAll();
// OLD LAB CODE: 
// OLD LAB CODE:   const countyGroup = countyDim.group().reduceCount();
// OLD LAB CODE:   const tractGroup = tractDim.group().reduceCount();
// OLD LAB CODE:   const food1Group = food1Dim.group().reduceCount();
// OLD LAB CODE:   const food10Group = food10Dim.group().reduceCount();
// OLD LAB CODE:   const food20Group = food20Dim.group().reduceCount();
// OLD LAB CODE:   const foodVehGroup = foodVehDim.group().reduceCount();
// OLD LAB CODE:   const catsExceededGroup = catsExceededDim.group().reduceCount();
// OLD LAB CODE:   const disadvantageGroup = disadvantageDim.group().reduceCount();
// OLD LAB CODE:   const lowIncomeGroup = lowIncomeDim.group().reduceCount();
// OLD LAB CODE:   const snapGroup = snapDim.group().reduceCount();
// OLD LAB CODE:   const filteredFunctionsnapGroup = {
// OLD LAB CODE:     all: function () {
// OLD LAB CODE:       return snapGroup.top(Infinity).filter(function (d) {
// OLD LAB CODE:         return d.key !== "" && d.key !== null && d.key !== undefined;
// OLD LAB CODE:       });
// OLD LAB CODE:     },
// OLD LAB CODE:   };
// OLD LAB CODE:   const svi_SocioeconomicStatusGroup = svi_SocioeconomicStatusDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["RPL_THEME1"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const svi_HouseholdCharacteristicGroup = svi_HouseholdCharacteristicDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["RPL_THEME2"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const svi_EthnicMinorityStatusGroup = svi_EthnicMinorityStatusDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["RPL_THEME3"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const svi_HousingTypeTransportationGroup = svi_HousingTypeTransportationDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["RPL_THEME4"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const indianAlaskaNativeGroup = indianAlaskaNativeDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["EP_AIAN"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const asianGroup = asianDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["EP_ASIAN"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const blackGroup = blackDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["EP_AFAM"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const hispanicGroup = hispanicDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["EP_HISP"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const hawaiianPacificNativeGroup = hawaiianPacificNativeDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["EP_NHPI"];
// OLD LAB CODE:     });
// OLD LAB CODE:   const whiteGroup = whiteDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["Percent White"] * 100;
// OLD LAB CODE:   });
// OLD LAB CODE:   const otherRaceGroup = otherRaceDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["Percent other races"] * 100;
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   //  -------- -------- -------- --------
// OLD LAB CODE:   //  ------- define chart starts here --
// OLD LAB CODE:   //  -------- -------- -------- --------
// OLD LAB CODE: 
// OLD LAB CODE:   // define dc.js charts
// OLD LAB CODE:   const countyChart = dc.pieChart("#chart-ring-county", groupname);
// OLD LAB CODE:   const tractChart = new dc.SelectMenu("#chart-ring-censusTract", groupname);
// OLD LAB CODE:   const disadvantageChart = dc.pieChart("#chart-ring-disadvantage", groupname);
// OLD LAB CODE:   const lowIncomeChart = dc.barChart("#chart-ring-lowIncome", groupname);
// OLD LAB CODE:   const food1Chart = dc.pieChart("#chart-ring-food1", groupname);
// OLD LAB CODE:   const food10Chart = dc.pieChart("#chart-ring-food10", groupname);
// OLD LAB CODE:   const food20Chart = dc.pieChart("#chart-ring-food20", groupname);
// OLD LAB CODE:   const foodVehChart = dc.pieChart("#chart-ring-foodVeh", groupname);
// OLD LAB CODE:   const catsExceededChart = dc.pieChart("#chart-ring-cats", groupname);
// OLD LAB CODE:   const povertyChart = dc.barChart("#chart-ring-poverty", groupname);
// OLD LAB CODE:   const snapChart = dc.barChart("#chart-ring-snap", groupname);
// OLD LAB CODE:   const regression_1Chart = new dc.ScatterPlot(
// OLD LAB CODE:     "#chart-ring-regression_1",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const regression_2Chart = new dc.ScatterPlot(
// OLD LAB CODE:     "#chart-ring-regression_2",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const regression_3Chart = new dc.ScatterPlot(
// OLD LAB CODE:     "#chart-ring-regression_3",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const LeafletMap_socialJustice = dc_leaflet.choroplethChart(
// OLD LAB CODE:     "#map_socialJustice",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const LeafletMap_svi = dc_leaflet.choroplethChart("#map_svi", groupname);
// OLD LAB CODE:   const LeafletMap_foodJustice = dc_leaflet.choroplethChart(
// OLD LAB CODE:     "#map_foodJustice",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const svi_SocioeconomicStatusHistogramChart = dc.barChart(
// OLD LAB CODE:     "#chart-ring-svi_SocioeconomicStatus",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const svi_EthnicMinorityStatusHistogramChart = dc.barChart(
// OLD LAB CODE:     "#chart-ring-svi_EthnicMinorityStatus",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const svi_HouseholdCharacteristicHistogramChart = dc.barChart(
// OLD LAB CODE:     "#chart-ring-svi_HouseholdCharacteristic",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const svi_HousingTypeTransportationHistogramChart = dc.barChart(
// OLD LAB CODE:     "#chart-ring-svi_HousingTypeTransportation",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_svi_SocioeconomicStatus = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_svi_SocioeconomicStatus",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_svi_EthnicMinorityStatus = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_svi_EthnicMinorityStatus",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_svi_HouseholdCharacteristic = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_svi_HouseholdCharacteristic",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_svi_HousingTypeTransportation = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_svi_HousingTypeTransportation",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_indianAlaskaNative = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_indianAlaskaNative",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_asian = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_asian",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_black = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_black",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_hispanic = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_hispanic",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_hawaiianPacificNative = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_hawaiianPacificNative",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_white = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_white",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE:   const dcChoroMap_otherRace = new dc.GeoChoroplethChart(
// OLD LAB CODE:     "#chart-ring-dcChoro_otherRace",
// OLD LAB CODE:     groupname
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   // define dc.js data tables and data counts
// OLD LAB CODE:   const dataTableCount = dc.dataCount(".dc-dataTable-count", groupname);
// OLD LAB CODE:   const dataTable = dc_datatables.datatable("#data-table", groupname);
// OLD LAB CODE:   const socialJusticeCount = dc.dataCount(".dc-socialJustice-count", groupname);
// OLD LAB CODE:   const foodJusticeCount = dc.dataCount(".dc-foodJustice-count", groupname);
// OLD LAB CODE:   const sviCount = dc.dataCount(".dc-svi-count", groupname);
// OLD LAB CODE: 
// OLD LAB CODE:   //  -------- -------- -------- --------
// OLD LAB CODE:   // -------- define chart ends here ----
// OLD LAB CODE:   //  -------- -------- -------- --------
// OLD LAB CODE: 
// OLD LAB CODE:   // ------------Create dc.js charts------------
// OLD LAB CODE:   // Define chart attributes
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // social Justice map group change from dropdown starts here
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   const map_socialJusticeDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return [d["FIPS"]];
// OLD LAB CODE:   });
// OLD LAB CODE:   const map_socialJusticeDefaultGroup = map_socialJusticeDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["Total categories exceeded"];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   const legendChart_SocialJustice_map = dc_leaflet
// OLD LAB CODE:     .legend()
// OLD LAB CODE:     .position("bottomright");
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSocialJustice_map(map_socialJusticeGroup) {
// OLD LAB CODE:     // pre defined dimentsion
// OLD LAB CODE:     const map_socialJusticeDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return d["FIPS"];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // #### dc_leaflet choropleth map ####
// OLD LAB CODE:     // Define dc_leaflet.js choropleth map attributes
// OLD LAB CODE:     // source: https://github.com/dc-js/dc.leaflet.js
// OLD LAB CODE:     LeafletMap_socialJustice.dimension(map_socialJusticeDim)
// OLD LAB CODE:       .group(map_socialJusticeGroup)
// OLD LAB CODE:       .zoom(6)
// OLD LAB CODE:       .map(map_socialJustice)
// OLD LAB CODE:       .width(600)
// OLD LAB CODE:       .height(400)
// OLD LAB CODE:       .center([34.69200051074456, -105.784602377386])
// OLD LAB CODE:       .geojson(nm_tract)
// OLD LAB CODE:       .colors(colorbrewer.YlOrRd[7])
// OLD LAB CODE:       .colorDomain([
// OLD LAB CODE:         d3.min(map_socialJusticeGroup.all(), dc.pluck("value")),
// OLD LAB CODE:         d3.max(map_socialJusticeGroup.all(), dc.pluck("value")),
// OLD LAB CODE:       ])
// OLD LAB CODE:       .colorAccessor(function (d) {
// OLD LAB CODE:         return d.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .featureKeyAccessor(function (feature) {
// OLD LAB CODE:         return feature.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .popupMod("ctrlCmd")
// OLD LAB CODE:       .renderPopup(true)
// OLD LAB CODE:       .popup(function (d, feature) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           " Census Tract ID is " +
// OLD LAB CODE:           feature.properties.GEOID +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "This census tract has value " +
// OLD LAB CODE:           "<b>" +
// OLD LAB CODE:           d.value +
// OLD LAB CODE:           "<b>" +
// OLD LAB CODE:           " for selected indicator"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .legend(legendChart_SocialJustice_map);
// OLD LAB CODE: 
// OLD LAB CODE:     LeafletMap_socialJustice.render(); //this like is the key to the update layers from dropdown.
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   updateSocialJustice_map(map_socialJusticeDefaultGroup);
// OLD LAB CODE:   // Listen to the button -> update if user change it
// OLD LAB CODE: 
// OLD LAB CODE:   d3.select("#select-socialJustice").on("change", function () {
// OLD LAB CODE:     // updateSvi_map(this.value);
// OLD LAB CODE:     nd = this.value;
// OLD LAB CODE:     map_socialJusticeGroup_current = map_socialJusticeDim
// OLD LAB CODE:       .group()
// OLD LAB CODE:       .reduceSum(function (d) {
// OLD LAB CODE:         return d[nd];
// OLD LAB CODE:       });
// OLD LAB CODE:     // Filter out the NA values in this group
// OLD LAB CODE:     map_socialJusticeGroup_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return map_socialJusticeGroup_current
// OLD LAB CODE:           .top(Infinity)
// OLD LAB CODE:           .filter(function (d) {
// OLD LAB CODE:             return d.key !== "" && d.key !== null && d.key !== undefined;
// OLD LAB CODE:           });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     updateSocialJustice_map(map_socialJusticeGroup_filteredGroup);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // social Justice map group change from dropdown ends here
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // food Justice map group change from dropdown starts here
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   const map_foodJusticeDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const map_foodJusticeDefaultGroup = map_foodJusticeDim
// OLD LAB CODE:     .group()
// OLD LAB CODE:     .reduceSum(function (d) {
// OLD LAB CODE:       return d["LowIncomeTracts"];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   function updateFoodJustice_map(map_foodJusticeGroup) {
// OLD LAB CODE:     // pre defined dimentsion
// OLD LAB CODE:     const map_foodJusticeDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return d["FIPS"];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     LeafletMap_foodJustice.dimension(map_foodJusticeDim)
// OLD LAB CODE:       .group(map_foodJusticeGroup)
// OLD LAB CODE:       .zoom(6)
// OLD LAB CODE:       .map(map_foodJustice)
// OLD LAB CODE:       .width(600)
// OLD LAB CODE:       .height(400)
// OLD LAB CODE:       .center([34.69200051074456, -105.784602377386])
// OLD LAB CODE:       .geojson(nm_tract)
// OLD LAB CODE:       .colorAccessor(function (kv) {
// OLD LAB CODE:         return +kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(["#dadaeb", "#3f007d"])
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         console.log(kv);
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .featureKeyAccessor(function (feature) {
// OLD LAB CODE:         return feature.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .popupMod("ctrlCmd")
// OLD LAB CODE:       .renderPopup(true)
// OLD LAB CODE:       .popup(function (d, feature) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           " Census Tract ID is " +
// OLD LAB CODE:           feature.properties.GEOID +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "This census tract is " +
// OLD LAB CODE:           "<b>" +
// OLD LAB CODE:           +d.value +
// OLD LAB CODE:           "<b>" +
// OLD LAB CODE:           " for selected indicator" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           " (0 is No, 1 is Yes)"
// OLD LAB CODE:         );
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     LeafletMap_foodJustice.render(); //this like is the key to the update layers from dropdown.
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   updateFoodJustice_map(map_foodJusticeDefaultGroup);
// OLD LAB CODE:   // Listen to the button -> update if user change it
// OLD LAB CODE: 
// OLD LAB CODE:   d3.select("#select-foodJustice").on("change", function () {
// OLD LAB CODE:     // updateSvi_map(this.value);
// OLD LAB CODE:     nd = this.value;
// OLD LAB CODE:     map_foodJusticeGroup_current = map_foodJusticeDim
// OLD LAB CODE:       .group()
// OLD LAB CODE:       .reduceSum(function (d) {
// OLD LAB CODE:         return d[nd];
// OLD LAB CODE:       });
// OLD LAB CODE:     // Filter out the NA values in this group
// OLD LAB CODE:     map_foodJusticeGroup_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return map_foodJusticeGroup_current.top(Infinity).filter(function (d) {
// OLD LAB CODE:           return d.key !== "" && d.key !== null && d.key !== undefined;
// OLD LAB CODE:         });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE:     updateFoodJustice_map(map_foodJusticeGroup_filteredGroup);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // food Justice map group change from dropdown ends here
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE:   // --------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   // SVI map group change from dropdown starts here
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   const map_sviDim = ndx.dimension(function (d) {
// OLD LAB CODE:     return d["FIPS"];
// OLD LAB CODE:   });
// OLD LAB CODE:   const map_sviDefaultGroup = map_sviDim.group().reduceSum(function (d) {
// OLD LAB CODE:     return d["RPL_THEMES"];
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSvi_map(map_sviGroup) {
// OLD LAB CODE:     // pre defined dimentsion
// OLD LAB CODE:     const map_sviDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return d["FIPS"];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     LeafletMap_svi.dimension(map_sviDim)
// OLD LAB CODE:       .group(map_sviGroup)
// OLD LAB CODE:       .zoom(6)
// OLD LAB CODE:       .map(map_svi)
// OLD LAB CODE:       .width(600)
// OLD LAB CODE:       .height(400)
// OLD LAB CODE:       .center([34.69200051074456, -105.784602377386])
// OLD LAB CODE:       .geojson(nm_tract)
// OLD LAB CODE:       .colors(colorbrewer.GnBu[4])
// OLD LAB CODE:       .colorDomain([
// OLD LAB CODE:         d3.min(map_sviGroup.all(), dc.pluck("value")),
// OLD LAB CODE:         d3.max(map_sviGroup.all(), dc.pluck("value")),
// OLD LAB CODE:       ])
// OLD LAB CODE:       .colorAccessor(function (d) {
// OLD LAB CODE:         return d.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .featureKeyAccessor(function (feature) {
// OLD LAB CODE:         return feature.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .popupMod("ctrlCmd")
// OLD LAB CODE:       .renderPopup(true)
// OLD LAB CODE:       .popup(function (d, feature) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           " Census Tract ID is " +
// OLD LAB CODE:           feature.properties.GEOID +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "This census tract has score " +
// OLD LAB CODE:           "<b>" +
// OLD LAB CODE:           d.value +
// OLD LAB CODE:           "</b>" +
// OLD LAB CODE:           " for selected indicator" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "<br>" +
// OLD LAB CODE:           "Possible scores range from 0 (lowest vulnerability) to 1 (highest vulnerability)."
// OLD LAB CODE:         );
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     LeafletMap_svi.render(); //this like is the key to the update layers from dropdown.
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   updateSvi_map(map_sviDefaultGroup);
// OLD LAB CODE:   // Listen to the button -> update if user change it
// OLD LAB CODE: 
// OLD LAB CODE:   d3.select("#select-svi").on("change", function () {
// OLD LAB CODE:     // updateSvi_map(this.value);
// OLD LAB CODE:     nd = this.value;
// OLD LAB CODE:     map_sviGroup_current = map_sviDim.group().reduceSum(function (d) {
// OLD LAB CODE:       return d[nd];
// OLD LAB CODE:     });
// OLD LAB CODE:     // Filter out the NA values in this group
// OLD LAB CODE:     mapSVIGroup_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return map_sviGroup_current.top(Infinity).filter(function (d) {
// OLD LAB CODE:           return d.key !== "" && d.key !== null && d.key !== undefined;
// OLD LAB CODE:         });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     updateSvi_map(mapSVIGroup_filteredGroup);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   // SVI map group change from dropdown ends here
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   //  ### dc choropleth map setting starts here
// OLD LAB CODE:   // -----------------------------------------------
// OLD LAB CODE:   // source: https://dc-js.github.io/dc.js/vc/index.html
// OLD LAB CODE:   // peojection change for SVI  small multiple from dropdown starts here
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSVI_projection(projection_dropdown) {
// OLD LAB CODE:     projection = projection_dropdown;
// OLD LAB CODE:     //  d3.js projection resources: https://d3js.org/d3-geo/projection
// OLD LAB CODE: 
// OLD LAB CODE:     let width = 330;
// OLD LAB CODE:     let height = 240;
// OLD LAB CODE: 
// OLD LAB CODE:     let path = d3.geoPath().projection(projection);
// OLD LAB CODE: 
// OLD LAB CODE:     //set up scale and translate
// OLD LAB CODE:     // let bounds, scale, offset;
// OLD LAB CODE:     projection.scale(1).translate([0, 0]);
// OLD LAB CODE: 
// OLD LAB CODE:     let bounds = path.bounds(nm_tract);
// OLD LAB CODE:     let scale =
// OLD LAB CODE:       0.9 /
// OLD LAB CODE:       Math.max(
// OLD LAB CODE:         (bounds[1][0] - bounds[0][0]) / width,
// OLD LAB CODE:         (bounds[1][1] - bounds[0][1]) / height
// OLD LAB CODE:       );
// OLD LAB CODE:     let offset = [
// OLD LAB CODE:       (width - scale * (bounds[1][0] + bounds[0][0])) / 2,
// OLD LAB CODE:       (height - scale * (bounds[1][1] + bounds[0][1])) / 2,
// OLD LAB CODE:     ];
// OLD LAB CODE: 
// OLD LAB CODE:     projection.scale(scale).translate(offset);
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     // svi Socioeconomic Status choropleth map
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(svi_SocioeconomicStatusDim)
// OLD LAB CODE:       .group(svi_SocioeconomicStatusGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_svi_SocioeconomicStatus.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_svi_SocioeconomicStatus.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         // console.log(d)
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#E2F2FF",
// OLD LAB CODE:             "#C4E4FF",
// OLD LAB CODE:             "#9ED2FF",
// OLD LAB CODE:             "#81C5FF",
// OLD LAB CODE:             "#6BBAFF",
// OLD LAB CODE:             "#51AEFF",
// OLD LAB CODE:             "#36A2FF",
// OLD LAB CODE:             "#1E96FF",
// OLD LAB CODE:             "#0089FF",
// OLD LAB CODE:             "#0061B5",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 1])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_svi_SocioeconomicStatus.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Socioeconomic Status: " +
// OLD LAB CODE:           (d.value ? d.value : 0)
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------
// OLD LAB CODE:     // Set up zoom and pan behavior for the map
// OLD LAB CODE:     // -----------------------------
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       // Store the zoom behavior globally for use in the reset button
// OLD LAB CODE:       window.dcChoroMap_svi_SocioeconomicStatusZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-0.1", min: 0, max: 0.1 },
// OLD LAB CODE:         { name: "0.1-0.2", min: 0.1, max: 0.2 },
// OLD LAB CODE:         { name: "0.2-0.3", min: 0.2, max: 0.3 },
// OLD LAB CODE:         { name: "0.3-0.4", min: 0.3, max: 0.4 },
// OLD LAB CODE:         { name: "0.4-0.5", min: 0.4, max: 0.5 },
// OLD LAB CODE:         { name: "0.5-0.6", min: 0.5, max: 0.6 },
// OLD LAB CODE:         { name: "0.6-0.7", min: 0.6, max: 0.7 },
// OLD LAB CODE:         { name: "0.7-0.8", min: 0.7, max: 0.8 },
// OLD LAB CODE:         { name: "0.8-0.9", min: 0.8, max: 0.9 },
// OLD LAB CODE:         { name: "0.9-1", min: 0.9, max: 1 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_svi_SocioeconomicStatus,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_svi_SocioeconomicStatus.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     // svi Ethnic Minority Status choropleth map
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(svi_EthnicMinorityStatusDim)
// OLD LAB CODE:       .group(svi_EthnicMinorityStatusGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_svi_EthnicMinorityStatus.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_svi_EthnicMinorityStatus.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#E2F2FF",
// OLD LAB CODE:             "#C4E4FF",
// OLD LAB CODE:             "#9ED2FF",
// OLD LAB CODE:             "#81C5FF",
// OLD LAB CODE:             "#6BBAFF",
// OLD LAB CODE:             "#51AEFF",
// OLD LAB CODE:             "#36A2FF",
// OLD LAB CODE:             "#1E96FF",
// OLD LAB CODE:             "#0089FF",
// OLD LAB CODE:             "#0061B5",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE: 
// OLD LAB CODE:       .colorDomain([0, 1])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_svi_EthnicMinorityStatus.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE: 
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Ethnic Minority Status : " +
// OLD LAB CODE:           (d.value ? d.value : 0)
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus.render();
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       // Store the zoom behavior globally for use in the reset button
// OLD LAB CODE:       window.dcChoroMap_svi_EthnicMinorityStatusZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-0.1", min: 0, max: 0.1 },
// OLD LAB CODE:         { name: "0.1-0.2", min: 0.1, max: 0.2 },
// OLD LAB CODE:         { name: "0.2-0.3", min: 0.2, max: 0.3 },
// OLD LAB CODE:         { name: "0.3-0.4", min: 0.3, max: 0.4 },
// OLD LAB CODE:         { name: "0.4-0.5", min: 0.4, max: 0.5 },
// OLD LAB CODE:         { name: "0.5-0.6", min: 0.5, max: 0.6 },
// OLD LAB CODE:         { name: "0.6-0.7", min: 0.6, max: 0.7 },
// OLD LAB CODE:         { name: "0.7-0.8", min: 0.7, max: 0.8 },
// OLD LAB CODE:         { name: "0.8-0.9", min: 0.8, max: 0.9 },
// OLD LAB CODE:         { name: "0.9-1", min: 0.9, max: 1 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_svi_EthnicMinorityStatus,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_svi_EthnicMinorityStatus.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     // svi Household Characteristic choropleth map
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(svi_HouseholdCharacteristicDim)
// OLD LAB CODE:       .group(svi_HouseholdCharacteristicGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_svi_HouseholdCharacteristic.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_svi_HouseholdCharacteristic.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#E2F2FF",
// OLD LAB CODE:             "#C4E4FF",
// OLD LAB CODE:             "#9ED2FF",
// OLD LAB CODE:             "#81C5FF",
// OLD LAB CODE:             "#6BBAFF",
// OLD LAB CODE:             "#51AEFF",
// OLD LAB CODE:             "#36A2FF",
// OLD LAB CODE:             "#1E96FF",
// OLD LAB CODE:             "#0089FF",
// OLD LAB CODE:             "#0061B5",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 1])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_svi_HouseholdCharacteristic.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Household Characteristic: " +
// OLD LAB CODE:           (d.value ? d.value : 0)
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       // Store the zoom behavior globally for use in the reset button
// OLD LAB CODE:       window.dcChoroMap_svi_HouseholdCharacteristicZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // -------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-0.1", min: 0, max: 0.1 },
// OLD LAB CODE:         { name: "0.1-0.2", min: 0.1, max: 0.2 },
// OLD LAB CODE:         { name: "0.2-0.3", min: 0.2, max: 0.3 },
// OLD LAB CODE:         { name: "0.3-0.4", min: 0.3, max: 0.4 },
// OLD LAB CODE:         { name: "0.4-0.5", min: 0.4, max: 0.5 },
// OLD LAB CODE:         { name: "0.5-0.6", min: 0.5, max: 0.6 },
// OLD LAB CODE:         { name: "0.6-0.7", min: 0.6, max: 0.7 },
// OLD LAB CODE:         { name: "0.7-0.8", min: 0.7, max: 0.8 },
// OLD LAB CODE:         { name: "0.8-0.9", min: 0.8, max: 0.9 },
// OLD LAB CODE:         { name: "0.9-1", min: 0.9, max: 1 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_svi_HouseholdCharacteristic,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_svi_HouseholdCharacteristic.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     // svi Housing Type TransportationDim choropleth map
// OLD LAB CODE:     // -----------------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(svi_HousingTypeTransportationDim)
// OLD LAB CODE:       .group(svi_HousingTypeTransportationGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_svi_HousingTypeTransportation.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_svi_HousingTypeTransportation.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#E2F2FF",
// OLD LAB CODE:             "#C4E4FF",
// OLD LAB CODE:             "#9ED2FF",
// OLD LAB CODE:             "#81C5FF",
// OLD LAB CODE:             "#6BBAFF",
// OLD LAB CODE:             "#51AEFF",
// OLD LAB CODE:             "#36A2FF",
// OLD LAB CODE:             "#1E96FF",
// OLD LAB CODE:             "#0089FF",
// OLD LAB CODE:             "#0061B5",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE: 
// OLD LAB CODE:       .colorDomain([0, 1])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d
// OLD LAB CODE:           ? dcChoroMap_svi_HousingTypeTransportation.colors()(d)
// OLD LAB CODE:           : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Housing Type Transportation " +
// OLD LAB CODE:           (d.value ? d.value : 0)
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       // Store the zoom behavior globally for use in the reset button
// OLD LAB CODE:       window.dcChoroMap_svi_HousingTypeTransportationZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using 'legendables'
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-0.1", min: 0, max: 0.1 },
// OLD LAB CODE:         { name: "0.1-0.2", min: 0.1, max: 0.2 },
// OLD LAB CODE:         { name: "0.2-0.3", min: 0.2, max: 0.3 },
// OLD LAB CODE:         { name: "0.3-0.4", min: 0.3, max: 0.4 },
// OLD LAB CODE:         { name: "0.4-0.5", min: 0.4, max: 0.5 },
// OLD LAB CODE:         { name: "0.5-0.6", min: 0.5, max: 0.6 },
// OLD LAB CODE:         { name: "0.6-0.7", min: 0.6, max: 0.7 },
// OLD LAB CODE:         { name: "0.7-0.8", min: 0.7, max: 0.8 },
// OLD LAB CODE:         { name: "0.8-0.9", min: 0.8, max: 0.9 },
// OLD LAB CODE:         { name: "0.9-1", min: 0.9, max: 1 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_svi_HousingTypeTransportation,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_svi_HousingTypeTransportation.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     //---------------------------------------------------------------------------------------------
// OLD LAB CODE:     //--------------------------------demographic map starts here----------------------------------
// OLD LAB CODE:     //---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // American Indian/Alaska Native
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(indianAlaskaNativeDim)
// OLD LAB CODE:       .group(indianAlaskaNativeGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_indianAlaskaNative.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_indianAlaskaNative.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 100])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_indianAlaskaNative.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent American Indian or Alaska Native " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_indianAlaskaNativeZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "1-10%", min: 1, max: 10 },
// OLD LAB CODE:         { name: "11-20%", min: 11, max: 20 },
// OLD LAB CODE:         { name: "21-30%", min: 21, max: 30 },
// OLD LAB CODE:         { name: "31-40%", min: 31, max: 40 },
// OLD LAB CODE:         { name: "41-50%", min: 41, max: 50 },
// OLD LAB CODE:         { name: "51-60%", min: 51, max: 60 },
// OLD LAB CODE:         { name: "61-70%", min: 61, max: 70 },
// OLD LAB CODE:         { name: "71-80%", min: 71, max: 80 },
// OLD LAB CODE:         { name: "81-90%", min: 81, max: 90 },
// OLD LAB CODE:         { name: "91-100%", min: 91, max: 100 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_indianAlaskaNative,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_indianAlaskaNative.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // Asian
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_asian
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(220)
// OLD LAB CODE:       .dimension(asianDim)
// OLD LAB CODE:       .group(asianGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_asian.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_asian.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 22])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_asian.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent Asian " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_asian.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_asianZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_asian.legendables = function () {
// OLD LAB CODE:       return asianGroup.all().map(function (kv) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_asian,
// OLD LAB CODE:           // display the value as the text (not sure what you want here)
// OLD LAB CODE:           name: kv.key + ": " + kv.value + " Socioeconomic Status",
// OLD LAB CODE:           // apply the chart's color scale to get the color
// OLD LAB CODE:           color: dcChoroMap_asian.colors()(kv.value),
// OLD LAB CODE:           // ordering: -kv.value
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_asian.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-2%", min: 0, max: 2 },
// OLD LAB CODE:         { name: "3-4%", min: 3, max: 4 },
// OLD LAB CODE:         { name: "5-6%", min: 5, max: 6 },
// OLD LAB CODE:         { name: "7-8%", min: 7, max: 8 },
// OLD LAB CODE:         { name: "9-10%", min: 9, max: 10 },
// OLD LAB CODE:         { name: "11-12%", min: 11, max: 12 },
// OLD LAB CODE:         { name: "13-14%", min: 13, max: 14 },
// OLD LAB CODE:         { name: "15-16%", min: 15, max: 16 },
// OLD LAB CODE:         { name: "17-18%", min: 17, max: 18 },
// OLD LAB CODE:         { name: "19-20%", min: 19, max: 20 },
// OLD LAB CODE:         { name: "21-22%", min: 21, max: 22 },
// OLD LAB CODE:       ];
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_asian,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_asian.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_asian.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_asian.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // Black
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_black
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(blackDim)
// OLD LAB CODE:       .group(blackGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_black.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_black.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 20])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_black.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent Black or African American " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_black.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_blackZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Update the legend with bins based on the 0-20 range
// OLD LAB CODE:     dcChoroMap_black.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-2%", min: 0, max: 2 },
// OLD LAB CODE:         { name: "3-4%", min: 3, max: 4 },
// OLD LAB CODE:         { name: "5-6%", min: 5, max: 6 },
// OLD LAB CODE:         { name: "7-8%", min: 7, max: 8 },
// OLD LAB CODE:         { name: "9-10%", min: 9, max: 10 },
// OLD LAB CODE:         { name: "11-12%", min: 11, max: 12 },
// OLD LAB CODE:         { name: "13-14%", min: 13, max: 14 },
// OLD LAB CODE:         { name: "15-16%", min: 15, max: 16 },
// OLD LAB CODE:         { name: "17-18%", min: 17, max: 18 },
// OLD LAB CODE:         { name: "19-20%", min: 19, max: 20 },
// OLD LAB CODE:       ];
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_black,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_black.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_black.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_black.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // Hispanic/Latino
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_hispanic
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(220)
// OLD LAB CODE:       .dimension(hispanicDim)
// OLD LAB CODE:       .group(hispanicGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_hispanic.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_hispanic.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 100])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_hispanic.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent Hispanic or Latino " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_hispanic.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_hispanicZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_hispanic.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "1-10%", min: 1, max: 10 },
// OLD LAB CODE:         { name: "11-20%", min: 11, max: 20 },
// OLD LAB CODE:         { name: "21-30%", min: 21, max: 30 },
// OLD LAB CODE:         { name: "31-40%", min: 31, max: 40 },
// OLD LAB CODE:         { name: "41-50%", min: 41, max: 50 },
// OLD LAB CODE:         { name: "51-60%", min: 51, max: 60 },
// OLD LAB CODE:         { name: "61-70%", min: 61, max: 70 },
// OLD LAB CODE:         { name: "71-80%", min: 71, max: 80 },
// OLD LAB CODE:         { name: "81-90%", min: 81, max: 90 },
// OLD LAB CODE:         { name: "91-100%", min: 91, max: 100 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_hispanic,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_hispanic.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_hispanic.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_hispanic.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // Native Hawaiian/Pacific
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(hawaiianPacificNativeDim)
// OLD LAB CODE:       .group(hawaiianPacificNativeGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_hawaiianPacificNative.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_hawaiianPacificNative.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 4])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_hawaiianPacificNative.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent Native Hawaiian or Pacific " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_hawaiianPacificNativeZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-0.4%", min: 0, max: 0.4 },
// OLD LAB CODE:         { name: "0.4-0.8%", min: 0.4, max: 0.8 },
// OLD LAB CODE:         { name: "0.8-1.2%", min: 0.8, max: 1.2 },
// OLD LAB CODE:         { name: "1.2-1.6%", min: 1.2, max: 1.6 },
// OLD LAB CODE:         { name: "1.6-2.0%", min: 1.6, max: 2.0 },
// OLD LAB CODE:         { name: "2.0-2.4%", min: 2.0, max: 2.4 },
// OLD LAB CODE:         { name: "2.4-2.8%", min: 2.4, max: 2.8 },
// OLD LAB CODE:         { name: "2.8-3.2%", min: 2.8, max: 3.2 },
// OLD LAB CODE:         { name: "3.2-3.6%", min: 3.2, max: 3.6 },
// OLD LAB CODE:         { name: "3.6-4.0%", min: 3.6, max: 4.0 },
// OLD LAB CODE:       ];
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_hawaiianPacificNative,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_hawaiianPacificNative.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative.render();
// OLD LAB CODE: 
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // White
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_white
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(whiteDim)
// OLD LAB CODE:       .group(whiteGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_white.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_white.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 100])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_white.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent White " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_white.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_whiteZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_white.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "1-10%", min: 1, max: 10 },
// OLD LAB CODE:         { name: "11-20%", min: 11, max: 20 },
// OLD LAB CODE:         { name: "21-30%", min: 21, max: 30 },
// OLD LAB CODE:         { name: "31-40%", min: 31, max: 40 },
// OLD LAB CODE:         { name: "41-50%", min: 41, max: 50 },
// OLD LAB CODE:         { name: "51-60%", min: 51, max: 60 },
// OLD LAB CODE:         { name: "61-70%", min: 61, max: 70 },
// OLD LAB CODE:         { name: "71-80%", min: 71, max: 80 },
// OLD LAB CODE:         { name: "81-90%", min: 81, max: 90 },
// OLD LAB CODE:         { name: "91-100%", min: 91, max: 100 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_white,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_white.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_white.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_white.render();
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE:     // Other Race
// OLD LAB CODE:     // -----------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:     dcChoroMap_otherRace
// OLD LAB CODE:       .width(300)
// OLD LAB CODE:       .height(250)
// OLD LAB CODE:       .dimension(otherRaceDim)
// OLD LAB CODE:       .group(otherRaceGroup)
// OLD LAB CODE:       .filterHandler(function (dimension, filter) {
// OLD LAB CODE:         dimension.filter(function (d) {
// OLD LAB CODE:           return dcChoroMap_otherRace.filter() != null
// OLD LAB CODE:             ? d.indexOf(dcChoroMap_otherRace.filter()) >= 0
// OLD LAB CODE:             : true;
// OLD LAB CODE:         }); // perform filtering
// OLD LAB CODE:         return filter; // return the actual filter value
// OLD LAB CODE:       })
// OLD LAB CODE:       .overlayGeoJson(nm_tract.features, "state", function (d) {
// OLD LAB CODE:         return d.properties.GEOID;
// OLD LAB CODE:       })
// OLD LAB CODE:       .colors(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleQuantize()
// OLD LAB CODE:           .range([
// OLD LAB CODE:             "#fff5f0",
// OLD LAB CODE:             "#fee0d2",
// OLD LAB CODE:             "#fcbba1",
// OLD LAB CODE:             "#fc9272",
// OLD LAB CODE:             "#fb6a4a",
// OLD LAB CODE:             "#ef3b2c",
// OLD LAB CODE:             "#cb181d",
// OLD LAB CODE:             "#a50f15",
// OLD LAB CODE:             "#67000d",
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .colorDomain([0, 65])
// OLD LAB CODE:       .colorCalculator(function (d) {
// OLD LAB CODE:         return d ? dcChoroMap_otherRace.colors()(d) : "#ccc";
// OLD LAB CODE:       })
// OLD LAB CODE:       .projection(projection)
// OLD LAB CODE:       .valueAccessor(function (kv) {
// OLD LAB CODE:         return kv.value;
// OLD LAB CODE:       })
// OLD LAB CODE:       .title(function (d) {
// OLD LAB CODE:         return (
// OLD LAB CODE:           "Census Tract ID: " +
// OLD LAB CODE:           d.key +
// OLD LAB CODE:           ";" +
// OLD LAB CODE:           " Percent Other Race " +
// OLD LAB CODE:           (d.value ? d.value : 0) +
// OLD LAB CODE:           "%"
// OLD LAB CODE:         );
// OLD LAB CODE:       })
// OLD LAB CODE:       .on("renderlet", function (chart) {
// OLD LAB CODE:         // Ensure polygons are always filled even on zoom
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .style("fill-opacity", 1) // Ensure full opacity for visibility
// OLD LAB CODE:           .style("stroke", "black") // Add stroke to ensure visibility at close zoom
// OLD LAB CODE:           .style("stroke-width", "0.1px"); // Add stroke width for clarity at zoomed-in levels
// OLD LAB CODE: 
// OLD LAB CODE:         // Hover effect (add mouseover and mouseout event listeners)
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("path")
// OLD LAB CODE:           .on("mouseover", function (event, d) {
// OLD LAB CODE:             // Increase opacity on hover
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 0.7)
// OLD LAB CODE:               .style("stroke-width", "0.05px"); // Increase stroke width for emphasis
// OLD LAB CODE:           })
// OLD LAB CODE:           .on("mouseout", function (event, d) {
// OLD LAB CODE:             // Reset opacity on mouseout
// OLD LAB CODE:             d3.select(this)
// OLD LAB CODE:               .style("fill-opacity", 1)
// OLD LAB CODE:               .style("stroke-width", "0.1px"); // Reset stroke width
// OLD LAB CODE:           });
// OLD LAB CODE:       });
// OLD LAB CODE:     // zoom, and pan
// OLD LAB CODE:     // https://stackoverflow.com/questions/60920890/dc-js-responsive-map-and-zoom-function-mousewheel
// OLD LAB CODE:     // https://jsfiddle.net/gordonwoodhull/p2z7j6wr/5/
// OLD LAB CODE:     dcChoroMap_otherRace.on("postRender", (chart) => {
// OLD LAB CODE:       const zoom = d3.zoom();
// OLD LAB CODE:       zoom.on("zoom", () => {
// OLD LAB CODE:         const { k, x, y } = d3.event.transform;
// OLD LAB CODE:         chart
// OLD LAB CODE:           .select("g.layer0")
// OLD LAB CODE:           .attr("transform", `translate(${x},${y}) scale(${k})`);
// OLD LAB CODE:       });
// OLD LAB CODE:       chart.svg().call(zoom);
// OLD LAB CODE:       window.dcChoroMap_otherRaceZoom = zoom;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     // Adding the legend using `legendables`
// OLD LAB CODE:     // --------------------------------------
// OLD LAB CODE:     dcChoroMap_otherRace.legendables = function () {
// OLD LAB CODE:       const bins = [
// OLD LAB CODE:         { name: "0-6.5%", min: 0, max: 6.5 },
// OLD LAB CODE:         { name: "6.5-13%", min: 6.5, max: 13 },
// OLD LAB CODE:         { name: "13-19.5%", min: 13, max: 19.5 },
// OLD LAB CODE:         { name: "19.5-26%", min: 19.5, max: 26 },
// OLD LAB CODE:         { name: "26-32.5%", min: 26, max: 32.5 },
// OLD LAB CODE:         { name: "32.5-39%", min: 32.5, max: 39 },
// OLD LAB CODE:         { name: "39-45.5%", min: 39, max: 45.5 },
// OLD LAB CODE:         { name: "45.5-52%", min: 45.5, max: 52 },
// OLD LAB CODE:         { name: "52-58.5%", min: 52, max: 58.5 },
// OLD LAB CODE:         { name: "58.5-65%", min: 58.5, max: 65 },
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       return bins.map(function (bin) {
// OLD LAB CODE:         return {
// OLD LAB CODE:           chart: dcChoroMap_otherRace,
// OLD LAB CODE:           name: bin.name,
// OLD LAB CODE:           color: dcChoroMap_otherRace.colors()(bin.min), // Get the color for the lower bound of the bin
// OLD LAB CODE:           ordering: bin.min, // Sorting the legend by bin's lower bound
// OLD LAB CODE:         };
// OLD LAB CODE:       });
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     // Attach the legend to the chart's container using `dc.legend()`
// OLD LAB CODE:     dcChoroMap_otherRace.legend(
// OLD LAB CODE:       dc
// OLD LAB CODE:         .legend()
// OLD LAB CODE:         .x(5) // Position the legend at x = 5
// OLD LAB CODE:         .y(15) // Position the legend at y = 15
// OLD LAB CODE:         .itemHeight(10) // Set the height of each item in the legend
// OLD LAB CODE:         .gap(5) // Set the gap between each item
// OLD LAB CODE:     );
// OLD LAB CODE:     dcChoroMap_otherRace.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   //---------------------------------------------------------------------------------------------
// OLD LAB CODE:   //--------------------------- dc choropleth map update projection -----------------------------
// OLD LAB CODE:   //---------------------------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   map_SVIDefaultProjection = d3.geoMercator();
// OLD LAB CODE: 
// OLD LAB CODE:   updateSVI_projection(map_SVIDefaultProjection);
// OLD LAB CODE:   // Listen to the button -> update if user change it
// OLD LAB CODE: 
// OLD LAB CODE:   d3.select("#select-sviProjection").on("change", function () {
// OLD LAB CODE:     // updateSvi_map(this.value);
// OLD LAB CODE:     nd = this.value;
// OLD LAB CODE:     console.log(nd);
// OLD LAB CODE: 
// OLD LAB CODE:     if (nd === "d3.geoMercator()") {
// OLD LAB CODE:       projection = d3.geoMercator();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (nd === "d3.geoAlbers()") {
// OLD LAB CODE:       projection = d3.geoAlbers();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (nd === "d3.geoEquirectangular()") {
// OLD LAB CODE:       projection = d3.geoEquirectangular();
// OLD LAB CODE:     }
// OLD LAB CODE:     if (nd === "d3.geoStereographic()") {
// OLD LAB CODE:       projection = d3.geoStereographic();
// OLD LAB CODE:     }
// OLD LAB CODE:     updateSVI_projection(projection);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // ----------------------------------------------------------------------------
// OLD LAB CODE:   // ----------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // #### dc pie/donut chart
// OLD LAB CODE:   // Create a pie/donut chart and use the given css selector as anchor.
// OLD LAB CODE:   // You can also specify an optional chart group for this chart to be scoped within.
// OLD LAB CODE:   // Note: in this web app, all charts are belong to group -
// OLD LAB CODE:   // When a chart belongs to a specific group then any interaction with such chart will only trigger redraw on other charts within the same chart group.
// OLD LAB CODE:   // API: Pie Chart: https://dc-js.github.io/dc.js/docs/html/PieChart.html
// OLD LAB CODE:   countyChart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(countyDim)
// OLD LAB CODE:     .group(countyGroup)
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#county-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "") {
// OLD LAB CODE:             kv = "No data";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = kv.name;
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   countyChart.ordinalColors([
// OLD LAB CODE:     "#a6cee3",
// OLD LAB CODE:     "#1f78b4",
// OLD LAB CODE:     "#b2df8a",
// OLD LAB CODE:     "#33a02c",
// OLD LAB CODE:     "#fb9a99",
// OLD LAB CODE:     "#e31a1c",
// OLD LAB CODE:     "#fdbf6f",
// OLD LAB CODE:     "#ff7f00",
// OLD LAB CODE:     "#cab2d6",
// OLD LAB CODE:     "#6a3d9a",
// OLD LAB CODE:     "#ffff99",
// OLD LAB CODE:     "#b15928",
// OLD LAB CODE:   ]);
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // Function to zoom into the clicked counties
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // countyChart.on("filtered", function (chart) {
// OLD LAB CODE:   //   // Retrieve all active filters
// OLD LAB CODE:   //   const filters = chart.filters();
// OLD LAB CODE: 
// OLD LAB CODE:   //   if (filters.length > 0) {
// OLD LAB CODE:   //     // Collect all matching features for selected counties
// OLD LAB CODE:   //     const selectedFeatures = nm_tract.features.filter(function (feature) {
// OLD LAB CODE:   //       return filters.includes(feature.properties.NAMELSADCO);
// OLD LAB CODE:   //     });
// OLD LAB CODE: 
// OLD LAB CODE:   //     if (selectedFeatures.length > 0) {
// OLD LAB CODE:   //       const geojsonLayer = L.geoJSON({
// OLD LAB CODE:   //         type: "FeatureCollection",
// OLD LAB CODE:   //         features: selectedFeatures
// OLD LAB CODE:   //       });
// OLD LAB CODE: 
// OLD LAB CODE:   //       const bounds = geojsonLayer.getBounds();
// OLD LAB CODE: 
// OLD LAB CODE:   //       map_socialJustice.fitBounds(bounds, { maxZoom: 10 });
// OLD LAB CODE:   //       map_svi.fitBounds(bounds, { maxZoom: 10 });
// OLD LAB CODE:   //       map_foodJustice.fitBounds(bounds, { maxZoom: 10 });
// OLD LAB CODE:   //     } else {
// OLD LAB CODE:   //       console.warn(
// OLD LAB CODE:   //         "No matching features found for selected counties:",
// OLD LAB CODE:   //         filters
// OLD LAB CODE:   //       );
// OLD LAB CODE:   //     }
// OLD LAB CODE:   //   } else {
// OLD LAB CODE:   //     // No selection → zoom back to full New Mexico view
// OLD LAB CODE:   //     map_socialJustice.setView([34, -105.2], 6.6);
// OLD LAB CODE:   //     map_svi.setView([34, -105.2], 6.6);
// OLD LAB CODE:   //     map_foodJustice.setView([34, -105.2], 6.6);
// OLD LAB CODE:   //   }
// OLD LAB CODE:   // });
// OLD LAB CODE: 
// OLD LAB CODE:   tractChart
// OLD LAB CODE:     .width(300) //(optional) define chart width
// OLD LAB CODE:     .height(250) //(optional) define chart height
// OLD LAB CODE:     .dimension(tractDim)
// OLD LAB CODE:     .group(tractGroup)
// OLD LAB CODE:     .multiple(true)
// OLD LAB CODE:     .numberVisible(12)
// OLD LAB CODE:     .controlsUseVisibility(true);
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // Function to zoom into the clicked census tracts
// OLD LAB CODE:   // -------------------------------------------
// OLD LAB CODE:   // tractChart.on("filtered", function (chart, filter) {
// OLD LAB CODE:   //   if (filter && filter.length > 0) {
// OLD LAB CODE:   //     // Assuming only one tract is selected at a time for zooming
// OLD LAB CODE: 
// OLD LAB CODE:   //     // FIPS codes are numeric, GEOIDs in GeoJSON are strings with leading zeros
// OLD LAB CODE:   //     const selectedFIPS = filter[0].toString().padStart(11, "0");
// OLD LAB CODE: 
// OLD LAB CODE:   //     // Find the selected tract in the GeoJSON
// OLD LAB CODE:   //     const selectedFeature = nm_tract.features.find(function (feature) {
// OLD LAB CODE:   //       return feature.properties.GEOID === selectedFIPS;
// OLD LAB CODE:   //     });
// OLD LAB CODE: 
// OLD LAB CODE:   //     if (selectedFeature) {
// OLD LAB CODE:   //       // Get the bounds of the selected feature
// OLD LAB CODE:   //       const bounds = L.geoJSON(selectedFeature).getBounds();
// OLD LAB CODE: 
// OLD LAB CODE:   //       // Zoom into the selected tract
// OLD LAB CODE:   //       map_socialJustice.fitBounds(bounds, {
// OLD LAB CODE:   //         maxZoom: 14 // Adjust this zoom level as needed
// OLD LAB CODE:   //       });
// OLD LAB CODE:   //       map_svi.fitBounds(bounds, {
// OLD LAB CODE:   //         maxZoom: 14 // Adjust this zoom level as needed
// OLD LAB CODE:   //       });
// OLD LAB CODE:   //       map_foodJustice.fitBounds(bounds, {
// OLD LAB CODE:   //         maxZoom: 14 // Adjust this zoom level as needed
// OLD LAB CODE:   //       });
// OLD LAB CODE:   //     }
// OLD LAB CODE:   //   }
// OLD LAB CODE:   // });
// OLD LAB CODE: 
// OLD LAB CODE:   // #### dc pie/donut chart
// OLD LAB CODE:   // Create a pie/donut chart and use the given css selector as anchor.
// OLD LAB CODE:   // You can also specify an optional chart group for this chart to be scoped within.
// OLD LAB CODE:   // Note: in this web app, all charts are belong to group - TRELIS_group
// OLD LAB CODE:   // When a chart belongs to a specific group then any interaction with such chart will only trigger redraw on other charts within the same chart group.
// OLD LAB CODE:   // API: Pie Chart: https://dc-js.github.io/dc.js/docs/html/PieChart.html
// OLD LAB CODE:   disadvantageChart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(disadvantageDim)
// OLD LAB CODE:     .group(disadvantageGroup)
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         if (kv.data.key === "TRUE") {
// OLD LAB CODE:           kv = "Yes";
// OLD LAB CODE:         } else if (kv.data.key === "FALSE") {
// OLD LAB CODE:           kv = "No";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#disadvantage-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "TRUE") {
// OLD LAB CODE:             kv = "Yes";
// OLD LAB CODE:           } else if (kv.name === "FALSE") {
// OLD LAB CODE:             kv = "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "No data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   disadvantageChart.ordinalColors(["#c1c1c1", "#db1d0f", "#FFEDA0"]);
// OLD LAB CODE: 
// OLD LAB CODE:   // #### dc bar chart
// OLD LAB CODE:   // Create a bar chart and use the given css selector as anchor.
// OLD LAB CODE:   // You can also specify an optional chart group for this chart to be scoped within.
// OLD LAB CODE:   // Note: in this web app, all charts are belong to group
// OLD LAB CODE:   // When a chart belongs to a specific group then any interaction with such chart will only trigger redraw on other charts within the same chart group.
// OLD LAB CODE:   // API: Bar Chart https://dc-js.github.io/dc.js/docs/html/BarChart.html
// OLD LAB CODE:   lowIncomeChart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(260) //(optional) define chart height
// OLD LAB CODE:     .margins({ top: 10, right: 20, bottom: 35, left: 30 })
// OLD LAB CODE:     .x(d3.scaleBand())
// OLD LAB CODE:     .xUnits(dc.units.ordinal) //d3.scale.ordinal().domain(genusDim) //d3.scaleBand() for d3 v4 //May want to make this non-ordinal
// OLD LAB CODE:     .linearColors(["#f6ac09"])
// OLD LAB CODE:     .renderHorizontalGridLines(true)
// OLD LAB CODE:     .controlsUseVisibility(true)
// OLD LAB CODE:     .yAxisLabel("Number of Tracts")
// OLD LAB CODE:     .xAxisLabel("Low Income Tract?")
// OLD LAB CODE:     .dimension(lowIncomeDim)
// OLD LAB CODE:     .group(lowIncomeGroup)
// OLD LAB CODE:     // **Customize the x-axis tick labels:** map true->Yes, false->No
// OLD LAB CODE:     .xAxis()
// OLD LAB CODE:     .tickFormat(function (kv) {
// OLD LAB CODE:       if (kv === "TRUE") {
// OLD LAB CODE:         kv = "Yes";
// OLD LAB CODE:       } else if (kv === "FALSE") {
// OLD LAB CODE:         kv = "No";
// OLD LAB CODE:       } else {
// OLD LAB CODE:         kv = "No data";
// OLD LAB CODE:       }
// OLD LAB CODE:       return kv;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   snapChart
// OLD LAB CODE:     .width(350) //(optional) define chart width
// OLD LAB CODE:     .height(250) //(optional) define chart height
// OLD LAB CODE:     .margins({ top: 10, right: 20, bottom: 45, left: 25 })
// OLD LAB CODE:     .x(d3.scaleBand())
// OLD LAB CODE:     .x(d3.scaleLinear().domain([0, 1000])) //d3.scale.ordinal().domain(genusDim) //d3.scaleBand() for d3 v4 //May want to make this non-ordinal
// OLD LAB CODE:     .linearColors(["#79309a"])
// OLD LAB CODE:     .brushOn(true)
// OLD LAB CODE:     .renderHorizontalGridLines(true)
// OLD LAB CODE:     .controlsUseVisibility(true)
// OLD LAB CODE:     .yAxisLabel("Number of Tracts")
// OLD LAB CODE:     .xAxisLabel("Total Count of Housing Units Receiving SNAP Benefits")
// OLD LAB CODE:     .dimension(snapDim)
// OLD LAB CODE:     .group(filteredFunctionsnapGroup);
// OLD LAB CODE:   snapChart.yAxis().ticks(8);
// OLD LAB CODE:   snapChart.xUnits(function () {
// OLD LAB CODE:     return 80;
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // #### dc regression chart
// OLD LAB CODE:   // source: https://github.com/Tom-Alexander/regression-js
// OLD LAB CODE:   // source: https://dc-js.github.io/dc.js/examples/regression.html
// OLD LAB CODE: 
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   //----------------------regression_1Chart------------------------
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   function getVariableLabel(variableId, selectId) {
// OLD LAB CODE:     const select = document.getElementById(selectId);
// OLD LAB CODE:     const option = select.querySelector(`option[value="${variableId}"]`);
// OLD LAB CODE:     return option ? option.textContent : variableId; // Fallback to variable name if not found
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function updateRegression1Chart(xVariable, yVariable) {
// OLD LAB CODE:     const regression_1Dim = ndx.dimension(function (d) {
// OLD LAB CODE:       return [+d[xVariable], +d[yVariable]];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_1Group = regression_1Dim.group();
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_1_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return regression_1Group.top(Infinity).filter(function (d) {
// OLD LAB CODE:           return (
// OLD LAB CODE:             d.key[0] !== "" &&
// OLD LAB CODE:             d.key[1] !== "" &&
// OLD LAB CODE:             d.key[0] !== null &&
// OLD LAB CODE:             d.key[1] !== null &&
// OLD LAB CODE:             d.key[0] !== undefined &&
// OLD LAB CODE:             d.key[1] !== undefined
// OLD LAB CODE:           );
// OLD LAB CODE:         });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     const xDomain = d3.extent(regression_1_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[0];
// OLD LAB CODE:     });
// OLD LAB CODE:     const yDomain = d3.extent(regression_1_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[1];
// OLD LAB CODE:     });
// OLD LAB CODE:     // Get human-readable labels from select options
// OLD LAB CODE:     const xLabel = getVariableLabel(xVariable, "regression_1_x");
// OLD LAB CODE:     const yLabel = getVariableLabel(yVariable, "regression_1_y");
// OLD LAB CODE: 
// OLD LAB CODE:     regression_1Chart
// OLD LAB CODE:       .width(450)
// OLD LAB CODE:       .height(450)
// OLD LAB CODE:       .margins({ top: 10, right: 20, bottom: 45, left: 60 })
// OLD LAB CODE:       .dimension(regression_1Dim)
// OLD LAB CODE:       .group(regression_1_filteredGroup)
// OLD LAB CODE:       .x(d3.scaleLinear().domain(xDomain))
// OLD LAB CODE:       .y(d3.scaleLinear().domain(yDomain))
// OLD LAB CODE:       .xAxisLabel(xLabel) // Use extracted label
// OLD LAB CODE:       .yAxisLabel(yLabel); // Use extracted label
// OLD LAB CODE: 
// OLD LAB CODE:     regression_1Chart.on("pretransition", function () {
// OLD LAB CODE:       const data = regression_1Chart
// OLD LAB CODE:         .group()
// OLD LAB CODE:         .all()
// OLD LAB CODE:         .map((kv) => [kv.key[0], kv.key[1]]);
// OLD LAB CODE:       if (data.length < 2) return; // Prevent errors if not enough data
// OLD LAB CODE: 
// OLD LAB CODE:       const r = regression.linear(data),
// OLD LAB CODE:         m = r.equation[0],
// OLD LAB CODE:         b = r.equation[1],
// OLD LAB CODE:         [x1, x2] = regression_1Chart.x().domain();
// OLD LAB CODE: 
// OLD LAB CODE:       const points = [
// OLD LAB CODE:         [x1, m * x1 + b],
// OLD LAB CODE:         [x2, m * x2 + b],
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       const xScale = regression_1Chart.x(),
// OLD LAB CODE:         yScale = regression_1Chart.y(),
// OLD LAB CODE:         margins = regression_1Chart.margins();
// OLD LAB CODE: 
// OLD LAB CODE:       const line = regression_1Chart
// OLD LAB CODE:         .g()
// OLD LAB CODE:         .selectAll("line.regression")
// OLD LAB CODE:         .data([points]);
// OLD LAB CODE: 
// OLD LAB CODE:       function do_points(line) {
// OLD LAB CODE:         line
// OLD LAB CODE:           .attr("x1", (d) => xScale(d[0][0]) + margins.left)
// OLD LAB CODE:           .attr("y1", (d) => yScale(d[0][1]) + margins.top)
// OLD LAB CODE:           .attr("x2", (d) => xScale(d[1][0]) + margins.left)
// OLD LAB CODE:           .attr("y2", (d) => yScale(d[1][1]) + margins.top)
// OLD LAB CODE:           .style("stroke", "red") // Ensure the line is visible
// OLD LAB CODE:           .style("stroke-width", 2)
// OLD LAB CODE:           .style("stroke-dasharray", "4,2"); // Optional dashed style
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       line
// OLD LAB CODE:         .enter()
// OLD LAB CODE:         .append("line")
// OLD LAB CODE:         .attr("class", "regression")
// OLD LAB CODE:         .call(do_points)
// OLD LAB CODE:         .merge(line)
// OLD LAB CODE:         .transition()
// OLD LAB CODE:         .duration(regression_1Chart.transitionDuration())
// OLD LAB CODE:         .call(do_points);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     regression_1Chart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initial render
// OLD LAB CODE:   updateRegression1Chart("RPL_THEMES", "LAPOP1_10");
// OLD LAB CODE: 
// OLD LAB CODE:   // Dropdown event listeners
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_1_x")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = this.value;
// OLD LAB CODE:       const selectedY = document.getElementById("regression_1_y").value;
// OLD LAB CODE:       updateRegression1Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_1_y")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = document.getElementById("regression_1_x").value;
// OLD LAB CODE:       const selectedY = this.value;
// OLD LAB CODE:       updateRegression1Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   //----------------------regression_2Chart------------------------
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   function getVariableLabel(variableId, selectId) {
// OLD LAB CODE:     const select = document.getElementById(selectId);
// OLD LAB CODE:     const option = select.querySelector(`option[value="${variableId}"]`);
// OLD LAB CODE:     return option ? option.textContent : variableId;
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function updateRegression2Chart(xVariable, yVariable) {
// OLD LAB CODE:     const regression_2Dim = ndx.dimension(function (d) {
// OLD LAB CODE:       return [+d[xVariable], +d[yVariable] / 100]; // Scale Y values by dividing by 100
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_2Group = regression_2Dim.group();
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_2_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return regression_2Group.top(Infinity).filter(function (d) {
// OLD LAB CODE:           return (
// OLD LAB CODE:             d.key[0] !== "" &&
// OLD LAB CODE:             d.key[1] !== "" &&
// OLD LAB CODE:             d.key[0] !== null &&
// OLD LAB CODE:             d.key[1] !== null &&
// OLD LAB CODE:             d.key[0] !== undefined &&
// OLD LAB CODE:             d.key[1] !== undefined
// OLD LAB CODE:           );
// OLD LAB CODE:         });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     const xDomain = d3.extent(regression_2_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[0];
// OLD LAB CODE:     });
// OLD LAB CODE:     const yDomain = d3.extent(regression_2_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[1];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Get human-readable labels from select options
// OLD LAB CODE:     const xLabel = getVariableLabel(xVariable, "regression_2_x");
// OLD LAB CODE:     const yLabel = getVariableLabel(yVariable, "regression_2_y");
// OLD LAB CODE: 
// OLD LAB CODE:     regression_2Chart
// OLD LAB CODE:       .width(450)
// OLD LAB CODE:       .height(450)
// OLD LAB CODE:       .margins({ top: 10, right: 20, bottom: 45, left: 50 })
// OLD LAB CODE:       .dimension(regression_2Dim)
// OLD LAB CODE:       .group(regression_2_filteredGroup)
// OLD LAB CODE:       .x(d3.scaleLinear().domain(xDomain))
// OLD LAB CODE:       .y(d3.scaleLinear().domain(yDomain))
// OLD LAB CODE:       .xAxisLabel(xLabel) // Use extracted label
// OLD LAB CODE:       .yAxisLabel(yLabel); // Use extracted label
// OLD LAB CODE: 
// OLD LAB CODE:     regression_2Chart.on("pretransition", function () {
// OLD LAB CODE:       const data = regression_2Chart
// OLD LAB CODE:         .group()
// OLD LAB CODE:         .all()
// OLD LAB CODE:         .map((kv) => [kv.key[0], kv.key[1]]);
// OLD LAB CODE:       if (data.length < 2) return; // Prevent errors if not enough data
// OLD LAB CODE: 
// OLD LAB CODE:       const r = regression.linear(data),
// OLD LAB CODE:         m = r.equation[0],
// OLD LAB CODE:         b = r.equation[1],
// OLD LAB CODE:         [x1, x2] = regression_2Chart.x().domain();
// OLD LAB CODE: 
// OLD LAB CODE:       const points = [
// OLD LAB CODE:         [x1, m * x1 + b],
// OLD LAB CODE:         [x2, m * x2 + b],
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       const xScale = regression_2Chart.x(),
// OLD LAB CODE:         yScale = regression_2Chart.y(),
// OLD LAB CODE:         margins = regression_2Chart.margins();
// OLD LAB CODE: 
// OLD LAB CODE:       const line = regression_2Chart
// OLD LAB CODE:         .g()
// OLD LAB CODE:         .selectAll("line.regression")
// OLD LAB CODE:         .data([points]);
// OLD LAB CODE: 
// OLD LAB CODE:       function do_points(line) {
// OLD LAB CODE:         line
// OLD LAB CODE:           .attr("x1", (d) => xScale(d[0][0]) + margins.left)
// OLD LAB CODE:           .attr("y1", (d) => yScale(d[0][1]) + margins.top)
// OLD LAB CODE:           .attr("x2", (d) => xScale(d[1][0]) + margins.left)
// OLD LAB CODE:           .attr("y2", (d) => yScale(d[1][1]) + margins.top)
// OLD LAB CODE:           .style("stroke", "red")
// OLD LAB CODE:           .style("stroke-width", 2)
// OLD LAB CODE:           .style("stroke-dasharray", "4,2");
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       line
// OLD LAB CODE:         .enter()
// OLD LAB CODE:         .append("line")
// OLD LAB CODE:         .attr("class", "regression")
// OLD LAB CODE:         .call(do_points)
// OLD LAB CODE:         .merge(line)
// OLD LAB CODE:         .transition()
// OLD LAB CODE:         .duration(regression_2Chart.transitionDuration())
// OLD LAB CODE:         .call(do_points);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     regression_2Chart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initial render
// OLD LAB CODE:   updateRegression2Chart(
// OLD LAB CODE:     "RPL_THEMES",
// OLD LAB CODE:     "Expected agricultural loss rate (Natural Hazards Risk Index) (percentile)"
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   // Dropdown event listeners
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_2_x")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = this.value;
// OLD LAB CODE:       const selectedY = document.getElementById("regression_2_y").value;
// OLD LAB CODE:       updateRegression2Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_2_y")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = document.getElementById("regression_2_x").value;
// OLD LAB CODE:       const selectedY = this.value;
// OLD LAB CODE:       updateRegression2Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   //----------------------regression_3Chart------------------------
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   function getVariableLabel(variableId, selectId) {
// OLD LAB CODE:     const select = document.getElementById(selectId);
// OLD LAB CODE:     const option = select.querySelector(`option[value="${variableId}"]`);
// OLD LAB CODE:     return option ? option.textContent : variableId; // Fallback to variable name if not found
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function updateRegression3Chart(xVariable, yVariable) {
// OLD LAB CODE:     const regression_3Dim = ndx.dimension(function (d) {
// OLD LAB CODE:       return [+d[xVariable], +d[yVariable]];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_3Group = regression_3Dim.group();
// OLD LAB CODE: 
// OLD LAB CODE:     const regression_3_filteredGroup = {
// OLD LAB CODE:       all: function () {
// OLD LAB CODE:         return regression_3Group.top(Infinity).filter(function (d) {
// OLD LAB CODE:           return (
// OLD LAB CODE:             d.key[0] !== "" &&
// OLD LAB CODE:             d.key[1] !== "" &&
// OLD LAB CODE:             d.key[0] !== null &&
// OLD LAB CODE:             d.key[1] !== null &&
// OLD LAB CODE:             d.key[0] !== undefined &&
// OLD LAB CODE:             d.key[1] !== undefined
// OLD LAB CODE:           );
// OLD LAB CODE:         });
// OLD LAB CODE:       },
// OLD LAB CODE:     };
// OLD LAB CODE: 
// OLD LAB CODE:     const xDomain = d3.extent(regression_3_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[0];
// OLD LAB CODE:     });
// OLD LAB CODE:     const yDomain = d3.extent(regression_3_filteredGroup.all(), function (d) {
// OLD LAB CODE:       return d.key[1];
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Get human-readable labels from select options
// OLD LAB CODE:     const xLabel = getVariableLabel(xVariable, "regression_3_x");
// OLD LAB CODE:     const yLabel = getVariableLabel(yVariable, "regression_3_y");
// OLD LAB CODE: 
// OLD LAB CODE:     regression_3Chart
// OLD LAB CODE:       .width(450)
// OLD LAB CODE:       .height(450)
// OLD LAB CODE:       .margins({ top: 10, right: 20, bottom: 45, left: 50 })
// OLD LAB CODE:       .dimension(regression_3Dim)
// OLD LAB CODE:       .group(regression_3_filteredGroup)
// OLD LAB CODE:       .x(d3.scaleLinear().domain(xDomain))
// OLD LAB CODE:       .y(d3.scaleLinear().domain(yDomain))
// OLD LAB CODE:       .xAxisLabel(xLabel) // Use extracted label
// OLD LAB CODE:       .yAxisLabel(yLabel); // Use extracted label
// OLD LAB CODE:     regression_3Chart.xAxis().ticks(8);
// OLD LAB CODE: 
// OLD LAB CODE:     regression_3Chart.on("pretransition", function () {
// OLD LAB CODE:       const data = regression_3Chart
// OLD LAB CODE:         .group()
// OLD LAB CODE:         .all()
// OLD LAB CODE:         .map((kv) => [kv.key[0], kv.key[1]]);
// OLD LAB CODE:       if (data.length < 2) return; // Prevent errors if not enough data
// OLD LAB CODE: 
// OLD LAB CODE:       const r = regression.linear(data),
// OLD LAB CODE:         m = r.equation[0],
// OLD LAB CODE:         b = r.equation[1],
// OLD LAB CODE:         [x1, x2] = regression_3Chart.x().domain();
// OLD LAB CODE: 
// OLD LAB CODE:       const points = [
// OLD LAB CODE:         [x1, m * x1 + b],
// OLD LAB CODE:         [x2, m * x2 + b],
// OLD LAB CODE:       ];
// OLD LAB CODE: 
// OLD LAB CODE:       const xScale = regression_3Chart.x(),
// OLD LAB CODE:         yScale = regression_3Chart.y(),
// OLD LAB CODE:         margins = regression_3Chart.margins();
// OLD LAB CODE: 
// OLD LAB CODE:       const line = regression_3Chart
// OLD LAB CODE:         .g()
// OLD LAB CODE:         .selectAll("line.regression")
// OLD LAB CODE:         .data([points]);
// OLD LAB CODE: 
// OLD LAB CODE:       function do_points(line) {
// OLD LAB CODE:         line
// OLD LAB CODE:           .attr("x1", (d) => xScale(d[0][0]) + margins.left)
// OLD LAB CODE:           .attr("y1", (d) => yScale(d[0][1]) + margins.top)
// OLD LAB CODE:           .attr("x2", (d) => xScale(d[1][0]) + margins.left)
// OLD LAB CODE:           .attr("y2", (d) => yScale(d[1][1]) + margins.top)
// OLD LAB CODE:           .style("stroke", "red") // Ensure the line is visible
// OLD LAB CODE:           .style("stroke-width", 2)
// OLD LAB CODE:           .style("stroke-dasharray", "4,2"); // Optional dashed style
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       line
// OLD LAB CODE:         .enter()
// OLD LAB CODE:         .append("line")
// OLD LAB CODE:         .attr("class", "regression")
// OLD LAB CODE:         .call(do_points)
// OLD LAB CODE:         .merge(line)
// OLD LAB CODE:         .transition()
// OLD LAB CODE:         .duration(regression_3Chart.transitionDuration())
// OLD LAB CODE:         .call(do_points);
// OLD LAB CODE:     });
// OLD LAB CODE:     regression_3Chart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initial render
// OLD LAB CODE:   updateRegression3Chart(
// OLD LAB CODE:     "Expected agricultural loss rate (Natural Hazards Risk Index) (percentile)",
// OLD LAB CODE:     "LAPOP1_10"
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   // Dropdown event listeners
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_3_x")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = this.value;
// OLD LAB CODE:       const selectedY = document.getElementById("regression_3_y").value;
// OLD LAB CODE:       updateRegression3Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   document
// OLD LAB CODE:     .getElementById("regression_3_y")
// OLD LAB CODE:     .addEventListener("change", function () {
// OLD LAB CODE:       const selectedX = document.getElementById("regression_3_x").value;
// OLD LAB CODE:       const selectedY = this.value;
// OLD LAB CODE:       updateRegression3Chart(selectedX, selectedY);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE:   //-----------------regression charts end here--------------------
// OLD LAB CODE:   //---------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   food1Chart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(food1Dim)
// OLD LAB CODE:     .group(food1Group)
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         // console.log(kv);
// OLD LAB CODE:         if (kv.data.key === "1") {
// OLD LAB CODE:           kv = "Yes";
// OLD LAB CODE:         } else if (kv.data.key === "0") {
// OLD LAB CODE:           kv = "No";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#food1-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           // console.log(kv);
// OLD LAB CODE:           if (kv.name === "0") {
// OLD LAB CODE:             kv = "no";
// OLD LAB CODE:           } else if (kv.name === "1") {
// OLD LAB CODE:             kv = "yes";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "no data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return "Low Food Access at 1 Mile : " + kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE:   food1Chart.ordinalColors(["#e5d3f3", "#c1c1c1", "#79309a"]);
// OLD LAB CODE: 
// OLD LAB CODE:   food10Chart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(food10Dim)
// OLD LAB CODE:     .group(food10Group)
// OLD LAB CODE:     .valueAccessor(function (kv) {
// OLD LAB CODE:       return kv.value;
// OLD LAB CODE:     })
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         if (kv.data.key === "1") {
// OLD LAB CODE:           kv = "Yes";
// OLD LAB CODE:         } else if (kv.data.key === "0") {
// OLD LAB CODE:           kv = "No";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#food10-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "0") {
// OLD LAB CODE:             kv = "no";
// OLD LAB CODE:           } else if (kv.name === "1") {
// OLD LAB CODE:             kv = "yes";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "no data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return "Low Food Access at 10 Miles : " + kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   food10Chart.ordinalColors(["#e5d3f3", "#c1c1c1", "#79309a"]);
// OLD LAB CODE: 
// OLD LAB CODE:   food20Chart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(food20Dim)
// OLD LAB CODE:     .group(food20Group)
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         if (kv.data.key === "1") {
// OLD LAB CODE:           kv = "Yes";
// OLD LAB CODE:         } else if (kv.data.key === "0") {
// OLD LAB CODE:           kv = "No";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#food20-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "0") {
// OLD LAB CODE:             kv = "no";
// OLD LAB CODE:           } else if (kv.name === "1") {
// OLD LAB CODE:             kv = "yes";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "no data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return "Low Food Access at 20 Miles : " + kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   food20Chart.ordinalColors(["#e5d3f3", "#c1c1c1", "#79309a"]);
// OLD LAB CODE: 
// OLD LAB CODE:   foodVehChart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(foodVehDim)
// OLD LAB CODE:     .group(foodVehGroup)
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         if (kv.data.key === "1") {
// OLD LAB CODE:           kv = "Yes";
// OLD LAB CODE:         } else if (kv.data.key === "0") {
// OLD LAB CODE:           kv = "No";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#foodVeh-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "0") {
// OLD LAB CODE:             kv = "no";
// OLD LAB CODE:           } else if (kv.name === "1") {
// OLD LAB CODE:             kv = "yes";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "no data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return "Low Food Access at 1/2 Miles & Low Vehicle Access : " + kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   foodVehChart.ordinalColors(["#e5d3f3", "#c1c1c1", "#79309a"]);
// OLD LAB CODE: 
// OLD LAB CODE:   catsExceededChart
// OLD LAB CODE:     .width(200) //(optional) define chart width
// OLD LAB CODE:     .height(200) //(optional) define chart height
// OLD LAB CODE:     .innerRadius(60) //(optional) if inner radius is used then a donut chart will be generated instead of pie chart
// OLD LAB CODE:     .dimension(catsExceededDim)
// OLD LAB CODE:     .group(catsExceededGroup)
// OLD LAB CODE:     // .colors(d.scale.ordinal().range(['red','green']))
// OLD LAB CODE:     .on("pretransition", function (chart) {
// OLD LAB CODE:       chart.selectAll("text.pie-slice").text(function (kv) {
// OLD LAB CODE:         if (kv.data.key === "0") {
// OLD LAB CODE:           kv = "0";
// OLD LAB CODE:         } else if (kv.data.key === "1") {
// OLD LAB CODE:           kv = "1";
// OLD LAB CODE:         } else if (kv.data.key === "2") {
// OLD LAB CODE:           kv = "2";
// OLD LAB CODE:         } else if (kv.data.key === "3") {
// OLD LAB CODE:           kv = "3";
// OLD LAB CODE:         } else if (kv.data.key === "4") {
// OLD LAB CODE:           kv = "4";
// OLD LAB CODE:         } else if (kv.data.key === "5") {
// OLD LAB CODE:           kv = "5";
// OLD LAB CODE:         } else if (kv.data.key === "6") {
// OLD LAB CODE:           kv = "6";
// OLD LAB CODE:         } else if (kv.data.key === "7") {
// OLD LAB CODE:           kv = "7";
// OLD LAB CODE:         } else {
// OLD LAB CODE:           kv = "No data";
// OLD LAB CODE:         }
// OLD LAB CODE:         return kv;
// OLD LAB CODE:       });
// OLD LAB CODE:     })
// OLD LAB CODE:     .legend(
// OLD LAB CODE:       new dc.HtmlLegend()
// OLD LAB CODE:         .container("#cats-legend")
// OLD LAB CODE:         .horizontal(false)
// OLD LAB CODE:         .highlightSelected(true)
// OLD LAB CODE:         .legendText(function (kv) {
// OLD LAB CODE:           if (kv.name === "0") {
// OLD LAB CODE:             kv = "0";
// OLD LAB CODE:           } else if (kv.name === "1") {
// OLD LAB CODE:             kv = "1";
// OLD LAB CODE:           } else if (kv.name === "2") {
// OLD LAB CODE:             kv = "2";
// OLD LAB CODE:           } else if (kv.name === "3") {
// OLD LAB CODE:             kv = "3";
// OLD LAB CODE:           } else if (kv.name === "4") {
// OLD LAB CODE:             kv = "4";
// OLD LAB CODE:           } else if (kv.name === "5") {
// OLD LAB CODE:             kv = "5";
// OLD LAB CODE:           } else if (kv.name === "6") {
// OLD LAB CODE:             kv = "6";
// OLD LAB CODE:           } else if (kv.name === "7") {
// OLD LAB CODE:             kv = "7";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             kv = "no data";
// OLD LAB CODE:           }
// OLD LAB CODE: 
// OLD LAB CODE:           return "Total number of criteria of burdens exceed: " + kv;
// OLD LAB CODE:         })
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:   catsExceededChart.ordinalColors([
// OLD LAB CODE:     "#c1c1c1",
// OLD LAB CODE:     "#F5DEAA",
// OLD LAB CODE:     "#F1C498",
// OLD LAB CODE:     "#EDAB86",
// OLD LAB CODE:     "#E99174",
// OLD LAB CODE:     "#E57761",
// OLD LAB CODE:     "#E15E4F",
// OLD LAB CODE:     "#DD443D",
// OLD LAB CODE:     "#D92B2B",
// OLD LAB CODE:   ]);
// OLD LAB CODE: 
// OLD LAB CODE:   function updatepovertyChart(nBin) {
// OLD LAB CODE:     // Calculate raw min and max from the dataset
// OLD LAB CODE:     const minPoverty = d3.min(ndx.all(), (d) => +d.PovertyRate);
// OLD LAB CODE:     const maxPoverty = d3.max(ndx.all(), (d) => +d.PovertyRate);
// OLD LAB CODE: 
// OLD LAB CODE:     // Compute bin width based on raw range
// OLD LAB CODE:     const binWidth = (maxPoverty - minPoverty) / nBin;
// OLD LAB CODE: 
// OLD LAB CODE:     // Create a new binned dimension for PovertyRate
// OLD LAB CODE:     povertyDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return Math.floor(+d.PovertyRate / binWidth) * binWidth;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Create group counting occurrences per bin
// OLD LAB CODE:     povertyGroup = povertyDim.group().reduceCount();
// OLD LAB CODE: 
// OLD LAB CODE:     // Update the chart
// OLD LAB CODE:     povertyChart
// OLD LAB CODE:       .width(260)
// OLD LAB CODE:       .height(220)
// OLD LAB CODE:       .margins({ top: 10, right: 30, bottom: 45, left: 50 })
// OLD LAB CODE:       .x(d3.scaleLinear().domain([minPoverty, maxPoverty]))
// OLD LAB CODE:       .xUnits(dc.units.fp.precision(binWidth))
// OLD LAB CODE:       .linearColors(["#f6ac09"])
// OLD LAB CODE:       .brushOn(true)
// OLD LAB CODE:       .renderHorizontalGridLines(true)
// OLD LAB CODE:       .controlsUseVisibility(true)
// OLD LAB CODE:       .xAxisLabel("Poverty Rate Percent (%)")
// OLD LAB CODE:       .yAxisLabel("Number of Tracts")
// OLD LAB CODE:       .elasticY(true)
// OLD LAB CODE:       // Here’s the critical part: set the dimension!
// OLD LAB CODE:       .dimension(povertyDim)
// OLD LAB CODE:       .barPadding(0.02)
// OLD LAB CODE:       .outerPadding(0.05)
// OLD LAB CODE:       .group(povertyGroup)
// OLD LAB CODE:       .renderlet(function (chart) {
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("g.x text")
// OLD LAB CODE:           .attr("dx", "0")
// OLD LAB CODE:           .attr("transform", "rotate(0)");
// OLD LAB CODE:       })
// OLD LAB CODE:       .xAxis()
// OLD LAB CODE:       .ticks(8);
// OLD LAB CODE: 
// OLD LAB CODE:     povertyChart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initialize the chart with a default number of bins
// OLD LAB CODE:   updatepovertyChart(20);
// OLD LAB CODE: 
// OLD LAB CODE:   // Listen for changes
// OLD LAB CODE:   d3.select("#nBin_svi_PovertyRate").on("input", function () {
// OLD LAB CODE:     updatepovertyChart(+this.value);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   // source: https://stackoverflow.com/questions/42265571/efficient-way-to-plot-area-normalized-bar-chart-using-crossfilter-dc-js
// OLD LAB CODE:   // https://stackoverflow.com/questions/15191258/properly-display-bin-width-in-barchart-using-dc-js-and-crossfilter-js#:~:text=Bar%20charts%20in%20dc.,chart.
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSvi_SocioeconomicStatus(nBin) {
// OLD LAB CODE:     // Calculate raw min and max from the dataset
// OLD LAB CODE:     const minSvi_SocioeconomicStatus = d3.min(ndx.all(), (d) => +d.RPL_THEME1);
// OLD LAB CODE:     const maxSvi_SocioeconomicStatus = d3.max(ndx.all(), (d) => +d.RPL_THEME1);
// OLD LAB CODE: 
// OLD LAB CODE:     // Compute bin width based on raw range
// OLD LAB CODE:     const binWidth =
// OLD LAB CODE:       (maxSvi_SocioeconomicStatus - minSvi_SocioeconomicStatus) / nBin;
// OLD LAB CODE: 
// OLD LAB CODE:     // Create a new binned dimension for PovertyRate
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return Math.floor(+d.RPL_THEME1 / binWidth) * binWidth;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Create group counting occurrences per bin
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramGroup = svi_SocioeconomicStatusHistogramDim
// OLD LAB CODE:       .group()
// OLD LAB CODE:       .reduceCount();
// OLD LAB CODE: 
// OLD LAB CODE:     // Update the chart
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramChart
// OLD LAB CODE:       .width(350) //(optional) define chart width
// OLD LAB CODE:       .height(210) //(optional) define chart height
// OLD LAB CODE:       .x(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleLinear()
// OLD LAB CODE:           .domain([minSvi_SocioeconomicStatus, maxSvi_SocioeconomicStatus])
// OLD LAB CODE:       )
// OLD LAB CODE:       .xUnits(dc.units.fp.precision(binWidth))
// OLD LAB CODE:       .brushOn(true)
// OLD LAB CODE:       .renderHorizontalGridLines(true)
// OLD LAB CODE:       .controlsUseVisibility(true)
// OLD LAB CODE:       .xAxisLabel("Socioeconomic Status Score")
// OLD LAB CODE:       .yAxisLabel("Count")
// OLD LAB CODE:       .elasticY(true)
// OLD LAB CODE:       // Here’s the critical part: set the dimension!
// OLD LAB CODE:       .dimension(svi_SocioeconomicStatusHistogramDim)
// OLD LAB CODE:       .barPadding(0.02)
// OLD LAB CODE:       .outerPadding(0.05)
// OLD LAB CODE:       .group(svi_SocioeconomicStatusHistogramGroup)
// OLD LAB CODE:       .renderlet(function (chart) {
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("g.x text")
// OLD LAB CODE:           .attr("dx", "0")
// OLD LAB CODE:           .attr("transform", "rotate(0)");
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramChart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initialize the chart with a default number of bins
// OLD LAB CODE:   updateSvi_SocioeconomicStatus(20);
// OLD LAB CODE: 
// OLD LAB CODE:   // Listen for changes
// OLD LAB CODE:   d3.select("#nBin_svi_SocioeconomicStatus").on("input", function () {
// OLD LAB CODE:     updateSvi_SocioeconomicStatus(+this.value);
// OLD LAB CODE:   });
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSvi_EthnicMinorityStatus(nBin) {
// OLD LAB CODE:     // Calculate raw min and max from the dataset
// OLD LAB CODE:     const minSvi_EthnicMinorityStatus = d3.min(ndx.all(), (d) => +d.RPL_THEME3);
// OLD LAB CODE:     const maxSvi_EthnicMinorityStatus = d3.max(ndx.all(), (d) => +d.RPL_THEME3);
// OLD LAB CODE: 
// OLD LAB CODE:     // Compute bin width based on raw range
// OLD LAB CODE:     const binWidth =
// OLD LAB CODE:       (maxSvi_EthnicMinorityStatus - minSvi_EthnicMinorityStatus) / nBin;
// OLD LAB CODE: 
// OLD LAB CODE:     // Create a new binned dimension for PovertyRate
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return Math.floor(+d.RPL_THEME3 / binWidth) * binWidth;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Create group counting occurrences per bin
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramGroup =
// OLD LAB CODE:       svi_EthnicMinorityStatusHistogramDim.group().reduceCount();
// OLD LAB CODE: 
// OLD LAB CODE:     // Update the chart
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramChart
// OLD LAB CODE:       .width(350) //(optional) define chart width
// OLD LAB CODE:       .height(210) //(optional) define chart height
// OLD LAB CODE:       .x(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleLinear()
// OLD LAB CODE:           .domain([minSvi_EthnicMinorityStatus, maxSvi_EthnicMinorityStatus])
// OLD LAB CODE:       )
// OLD LAB CODE:       .xUnits(dc.units.fp.precision(binWidth))
// OLD LAB CODE:       .brushOn(true)
// OLD LAB CODE:       .renderHorizontalGridLines(true)
// OLD LAB CODE:       .controlsUseVisibility(true)
// OLD LAB CODE:       .xAxisLabel("Ethnic Minority Status Score")
// OLD LAB CODE:       .yAxisLabel("Count")
// OLD LAB CODE:       .elasticY(true)
// OLD LAB CODE:       // Here’s the critical part: set the dimension!
// OLD LAB CODE:       .dimension(svi_EthnicMinorityStatusHistogramDim)
// OLD LAB CODE:       .barPadding(0.02)
// OLD LAB CODE:       .outerPadding(0.05)
// OLD LAB CODE:       .group(svi_EthnicMinorityStatusHistogramGroup)
// OLD LAB CODE:       .renderlet(function (chart) {
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("g.x text")
// OLD LAB CODE:           .attr("dx", "0")
// OLD LAB CODE:           .attr("transform", "rotate(0)");
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramChart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initialize the chart with a default number of bins
// OLD LAB CODE:   updateSvi_EthnicMinorityStatus(20);
// OLD LAB CODE: 
// OLD LAB CODE:   // Listen for changes
// OLD LAB CODE:   d3.select("#nBin_svi_EthnicMinorityStatus").on("input", function () {
// OLD LAB CODE:     updateSvi_EthnicMinorityStatus(+this.value);
// OLD LAB CODE:   });
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   function updateSvi_HouseholdCharacteristic(nBin) {
// OLD LAB CODE:     // Calculate raw min and max from the dataset
// OLD LAB CODE:     const minSvi_HouseholdCharacteristic = d3.min(
// OLD LAB CODE:       ndx.all(),
// OLD LAB CODE:       (d) => +d.RPL_THEME2
// OLD LAB CODE:     );
// OLD LAB CODE:     const maxSvi_HouseholdCharacteristic = d3.max(
// OLD LAB CODE:       ndx.all(),
// OLD LAB CODE:       (d) => +d.RPL_THEME2
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     // Compute bin width based on raw range
// OLD LAB CODE:     const binWidth =
// OLD LAB CODE:       (maxSvi_HouseholdCharacteristic - minSvi_HouseholdCharacteristic) / nBin;
// OLD LAB CODE: 
// OLD LAB CODE:     // Create a new binned dimension for PovertyRate
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return Math.floor(+d.RPL_THEME2 / binWidth) * binWidth;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Create group counting occurrences per bin
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramGroup =
// OLD LAB CODE:       svi_HouseholdCharacteristicHistogramDim.group().reduceCount();
// OLD LAB CODE: 
// OLD LAB CODE:     // Update the chart
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramChart
// OLD LAB CODE:       .width(350) //(optional) define chart width
// OLD LAB CODE:       .height(225) //(optional) define chart height
// OLD LAB CODE:       .x(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleLinear()
// OLD LAB CODE:           .domain([
// OLD LAB CODE:             minSvi_HouseholdCharacteristic,
// OLD LAB CODE:             maxSvi_HouseholdCharacteristic,
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .xUnits(dc.units.fp.precision(binWidth))
// OLD LAB CODE:       .brushOn(true)
// OLD LAB CODE:       .renderHorizontalGridLines(true)
// OLD LAB CODE:       .controlsUseVisibility(true)
// OLD LAB CODE:       .yAxisLabel("Count")
// OLD LAB CODE:       .xAxisLabel("Household Characteristic Score")
// OLD LAB CODE:       .elasticY(true)
// OLD LAB CODE:       // Here’s the critical part: set the dimension!
// OLD LAB CODE:       .dimension(svi_HouseholdCharacteristicHistogramDim)
// OLD LAB CODE:       .barPadding(0.02)
// OLD LAB CODE:       .outerPadding(0.05)
// OLD LAB CODE:       .group(svi_HouseholdCharacteristicHistogramGroup)
// OLD LAB CODE:       .renderlet(function (chart) {
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("g.x text")
// OLD LAB CODE:           .attr("dx", "0")
// OLD LAB CODE:           .attr("transform", "rotate(0)");
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramChart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initialize the chart with a default number of bins
// OLD LAB CODE:   updateSvi_HouseholdCharacteristic(20);
// OLD LAB CODE: 
// OLD LAB CODE:   // Listen for changes
// OLD LAB CODE:   d3.select("#nBin_svi_HouseholdCharacteristic").on("input", function () {
// OLD LAB CODE:     updateSvi_HouseholdCharacteristic(+this.value);
// OLD LAB CODE:   });
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   function updateSvi_HousingTypeTransportation(nBin) {
// OLD LAB CODE:     // Calculate raw min and max from the dataset
// OLD LAB CODE:     const minSvi_HousingTypeTransportation = d3.min(
// OLD LAB CODE:       ndx.all(),
// OLD LAB CODE:       (d) => +d.RPL_THEME4
// OLD LAB CODE:     );
// OLD LAB CODE:     const maxSvi_HousingTypeTransportation = d3.max(
// OLD LAB CODE:       ndx.all(),
// OLD LAB CODE:       (d) => +d.RPL_THEME4
// OLD LAB CODE:     );
// OLD LAB CODE: 
// OLD LAB CODE:     // Compute bin width based on raw range
// OLD LAB CODE:     const binWidth =
// OLD LAB CODE:       (maxSvi_HousingTypeTransportation - minSvi_HousingTypeTransportation) /
// OLD LAB CODE:       nBin;
// OLD LAB CODE: 
// OLD LAB CODE:     // Create a new binned dimension for PovertyRate
// OLD LAB CODE:     svi_HousingTypeTransportationHistogramDim = ndx.dimension(function (d) {
// OLD LAB CODE:       return Math.floor(+d.RPL_THEME4 / binWidth) * binWidth;
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:     // Create group counting occurrences per bin
// OLD LAB CODE:     svi_HousingTypeTransportationHistogramGroup =
// OLD LAB CODE:       svi_HousingTypeTransportationHistogramDim.group().reduceCount();
// OLD LAB CODE: 
// OLD LAB CODE:     // Update the chart
// OLD LAB CODE:     svi_HousingTypeTransportationHistogramChart
// OLD LAB CODE:       .width(350) //(optional) define chart width
// OLD LAB CODE:       .height(225) //(optional) define chart height
// OLD LAB CODE:       .x(
// OLD LAB CODE:         d3
// OLD LAB CODE:           .scaleLinear()
// OLD LAB CODE:           .domain([
// OLD LAB CODE:             minSvi_HousingTypeTransportation,
// OLD LAB CODE:             maxSvi_HousingTypeTransportation,
// OLD LAB CODE:           ])
// OLD LAB CODE:       )
// OLD LAB CODE:       .xUnits(dc.units.fp.precision(binWidth))
// OLD LAB CODE:       .brushOn(true)
// OLD LAB CODE:       .renderHorizontalGridLines(true)
// OLD LAB CODE:       .controlsUseVisibility(true)
// OLD LAB CODE:       .yAxisLabel("Count")
// OLD LAB CODE:       .xAxisLabel("Housing Type & Transportation Score")
// OLD LAB CODE:       .elasticY(true)
// OLD LAB CODE:       // Here’s the critical part: set the dimension!
// OLD LAB CODE:       .dimension(svi_HousingTypeTransportationHistogramDim)
// OLD LAB CODE:       .barPadding(0.02)
// OLD LAB CODE:       .outerPadding(0.05)
// OLD LAB CODE:       .group(svi_HousingTypeTransportationHistogramGroup)
// OLD LAB CODE:       .renderlet(function (chart) {
// OLD LAB CODE:         chart
// OLD LAB CODE:           .selectAll("g.x text")
// OLD LAB CODE:           .attr("dx", "0")
// OLD LAB CODE:           .attr("transform", "rotate(0)");
// OLD LAB CODE:       });
// OLD LAB CODE: 
// OLD LAB CODE:     svi_HousingTypeTransportationHistogramChart.render();
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   // Initialize the chart with a default number of bins
// OLD LAB CODE:   updateSvi_HousingTypeTransportation(20);
// OLD LAB CODE: 
// OLD LAB CODE:   // Listen for changes
// OLD LAB CODE:   d3.select("#nBin_svi_HousingTypeTransportation").on("input", function () {
// OLD LAB CODE:     updateSvi_HousingTypeTransportation(+this.value);
// OLD LAB CODE:   });
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE:   // ---------------------------------------------------------------------------
// OLD LAB CODE: 
// OLD LAB CODE:   socialJusticeCount.dimension(ndx).group(all);
// OLD LAB CODE:   foodJusticeCount.dimension(ndx).group(all);
// OLD LAB CODE:   sviCount.dimension(ndx).group(all);
// OLD LAB CODE: 
// OLD LAB CODE:   dataTableCount
// OLD LAB CODE:     .dimension(ndx)
// OLD LAB CODE:     .group(all)
// OLD LAB CODE:     .html({
// OLD LAB CODE:       some:
// OLD LAB CODE:         "<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records" +
// OLD LAB CODE:         " | <a href='javascript: resetAll_exceptMap();'>Reset All</a>",
// OLD LAB CODE:       all: "All records selected. Please click on the graph to apply filters.",
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   dataTable
// OLD LAB CODE:     .dimension(allDim)
// OLD LAB CODE:     .group(function (d) {
// OLD LAB CODE:       return "dc.js insists on putting a row here so I remove it using JS";
// OLD LAB CODE:     })
// OLD LAB CODE:     .size(15)
// OLD LAB CODE:     .columns([
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Census tract ID",
// OLD LAB CODE:         type: "string",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["FIPS"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "State",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["STATE"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "County",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["COUNTY"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Total number of categories exceeded",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Total categories exceeded"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Identified as disadvantaged tract",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["Identified as disadvantaged"];
// OLD LAB CODE:           if (value === "TRUE") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "FALSE") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Expected agricultural loss rate (Natural Hazards Risk Index) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Expected agricultural loss rate (Natural Hazards Risk Index) (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Expected building loss rate (Natural Hazards Risk Index) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Expected building loss rate (Natural Hazards Risk Index) (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Expected population loss rate (Natural Hazards Risk Index) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Expected population loss rate (Natural Hazards Risk Index) (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Expected population loss rate (Natural Hazards Risk Index) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Expected population loss rate (Natural Hazards Risk Index) (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Share of properties at risk of flood in 30 years  %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Share of properties at risk of flood in 30 years (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Share of properties at risk of fire in 30 years %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Share of properties at risk of fire in 30 years (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Energy burden %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Energy burden (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "PM2.5 in the air %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["PM2.5 in the air (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Current asthma among adults aged greater than or equal to 18 years %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Current asthma among adults aged greater than or equal to 18 years (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Diagnosed diabetes among adults aged greater than or equal to 18 years %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Diagnosed diabetes among adults aged greater than or equal to 18 years (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Coronary heart disease among adults aged greater than or equal to 18 years %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Coronary heart disease among adults aged greater than or equal to 18 years (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low life expectancy %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Low life expectancy (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Housing burden %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Housing burden (percent) (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Share of homes with no kitchen or indoor plumbing %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Share of homes with no kitchen or indoor plumbing (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percent pre-1960s housing (lead paint indicator) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Percent pre-1960s housing (lead paint indicator) (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Proximity to hazardous waste sites %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Proximity to hazardous waste sites (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Proximity to Risk Management Plan (RMP) facilities %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Proximity to Risk Management Plan (RMP) facilities (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Proximity to NPL (Superfund) sites %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Proximity to NPL (Superfund) sites (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Diesel particulate matter exposure %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Diesel particulate matter exposure (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "DOT Travel Barriers Score %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["DOT Travel Barriers Score (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Traffic proximity and volume %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Traffic proximity and volume (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Leaky underground storage tanks %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Leaky underground storage tanks (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Wastewater discharge %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Wastewater discharge (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Linguistic isolation (percent) (percentile) %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Linguistic isolation (percent) (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Low median household income as a percent of area median income %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Low median household income as a percent of area median income (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percent of individuals < 100% Federal Poverty Line %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d[
// OLD LAB CODE:             "Percent of individuals < 100% Federal Poverty Line (percentile)"
// OLD LAB CODE:           ];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Unemployment %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Unemployment (percent) (percentile)"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Overall percentile ranking for SVI",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["RPL_THEMES"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percentile ranking for Socioeconomic Status theme summary",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["RPL_THEME1"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percentile ranking for Household Characteristics theme summary",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["RPL_THEME2"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percentile ranking for Racial and Ethnic Minority Status theme",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["RPL_THEME3"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Percentile ranking for Housing Type/Transportation theme",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["RPL_THEME4"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Black/African American, not Hispanic or Latino persons estimate %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["EP_AFAM"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Hispanic or Latino persons estimate %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["EP_HISP"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Asian, not Hispanic or Latino persons estimate %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["EP_ASIAN"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "American Indian or Alaska Native, not Hispanic or Latino persons estimate %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["EP_AIAN"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label:
// OLD LAB CODE:           "Native Hawaiian or Other Pacific Islander, not Hispanic or Latino persons estimate %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["EP_NHPI"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Median Family Income ($)",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["MedianFamilyIncome"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Income Tract",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LowIncomeTracts"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE: 
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Income and Low Access at 1 and 10 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LILATracts_1And10"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Income and Low Access at 1/2 and 10 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LILATracts_halfAnd10"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Income and Low Access at 1 and 20 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LILATracts_1And20"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Income and Low Access using vehicle access",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LILATracts_Vehicle"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Access at 1 and 10 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LA1and10"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Access at 1/2 and 10 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LAhalfand10"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE: 
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low Access at 1 and 20 miles",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LA1and20"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Low vehicle access",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["LATractsVehicle_20"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "High group quarters",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           let value = d["GroupQuartersFlag"];
// OLD LAB CODE:           if (value === "1") {
// OLD LAB CODE:             return "Yes";
// OLD LAB CODE:           } else if (value === "0") {
// OLD LAB CODE:             return "No";
// OLD LAB CODE:           } else {
// OLD LAB CODE:             return ""; // Keep it empty for undefined/null or other values
// OLD LAB CODE:           }
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE: 
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Total count of housing units receiving SNAP benefits",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["TractSNAP"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Black or African American alone %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent Black or African American alone"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "American Indian / Alaska Native %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent American Indian / Alaska Native"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Native Hawaiian or Pacific %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent Native Hawaiian or Pacific"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Native Hawaiian or Pacific %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent Native Hawaiian or Pacific"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "American Indian / Alaska Native %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent American Indian / Alaska Native"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "White %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent White"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Hispanic or Latino %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent Hispanic or Latino"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:       {
// OLD LAB CODE:         label: "Other races %",
// OLD LAB CODE:         type: "num",
// OLD LAB CODE:         format: function (d) {
// OLD LAB CODE:           return d["Percent other races"];
// OLD LAB CODE:         },
// OLD LAB CODE:       },
// OLD LAB CODE:     ])
// OLD LAB CODE:     .sortBy(function (d) {
// OLD LAB CODE:       return d.Title;
// OLD LAB CODE:     })
// OLD LAB CODE:     .order(d3.ascending)
// OLD LAB CODE:     .options({
// OLD LAB CODE:       scrollX: true,
// OLD LAB CODE:     })
// OLD LAB CODE:     .on("renderlet", function (table) {
// OLD LAB CODE:       table.selectAll(".dc-table-group").classed("info", true);
// OLD LAB CODE:     });
// OLD LAB CODE: 
// OLD LAB CODE:   // -------------------------------------
// OLD LAB CODE:   // reset buttons for all chart start here
// OLD LAB CODE:   // -------------------------------------
// OLD LAB CODE:   d3.selectAll("a#all").on("click", function () {
// OLD LAB CODE:     dc.filterAll(groupname);
// OLD LAB CODE:     dc.renderAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#county").on("click", function () {
// OLD LAB CODE:     countyChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#censusTract").on("click", function () {
// OLD LAB CODE:     tractChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:     LeafletMap_socialJustice.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:     LeafletMap_svi.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:     LeafletMap_foodJustice.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#cats").on("click", function () {
// OLD LAB CODE:     catsExceededChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#disadvantage").on("click", function () {
// OLD LAB CODE:     disadvantageChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#Poverty").on("click", function () {
// OLD LAB CODE:     povertyChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#snap").on("click", function () {
// OLD LAB CODE:     snapChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#lowIncome").on("click", function () {
// OLD LAB CODE:     lowIncomeChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#food1").on("click", function () {
// OLD LAB CODE:     food1Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#food10").on("click", function () {
// OLD LAB CODE:     food10Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#food20").on("click", function () {
// OLD LAB CODE:     food20Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#foodVeh").on("click", function () {
// OLD LAB CODE:     foodVehChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   // -------------------------------------------------------------------------------------
// OLD LAB CODE:   // Reset button handler: clear dc.js filters and reset zoom to original scale/position.
// OLD LAB CODE:   // -------------------------------------------------------------------------------------
// OLD LAB CODE:   d3.selectAll("a#dcChoro_svi_SocioeconomicStatus").on("click", function () {
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(
// OLD LAB CODE:         window.dcChoroMap_svi_SocioeconomicStatusZoom.transform,
// OLD LAB CODE:         d3.zoomIdentity
// OLD LAB CODE:       );
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_svi_EthnicMinorityStatus").on("click", function () {
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(
// OLD LAB CODE:         window.dcChoroMap_svi_EthnicMinorityStatusZoom.transform,
// OLD LAB CODE:         d3.zoomIdentity
// OLD LAB CODE:       );
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_svi_HouseholdCharacteristic").on(
// OLD LAB CODE:     "click",
// OLD LAB CODE:     function () {
// OLD LAB CODE:       dcChoroMap_svi_HouseholdCharacteristic.filterAll(groupname);
// OLD LAB CODE:       dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:       // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:       dcChoroMap_svi_HouseholdCharacteristic
// OLD LAB CODE:         .svg()
// OLD LAB CODE:         .transition()
// OLD LAB CODE:         .duration(750)
// OLD LAB CODE:         .call(
// OLD LAB CODE:           window.dcChoroMap_svi_HouseholdCharacteristicZoom.transform,
// OLD LAB CODE:           d3.zoomIdentity
// OLD LAB CODE:         );
// OLD LAB CODE:     }
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_svi_HousingTypeTransportation").on(
// OLD LAB CODE:     "click",
// OLD LAB CODE:     function () {
// OLD LAB CODE:       dcChoroMap_svi_HousingTypeTransportation.filterAll(groupname);
// OLD LAB CODE:       dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:       // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:       dcChoroMap_svi_HousingTypeTransportation
// OLD LAB CODE:         .svg()
// OLD LAB CODE:         .transition()
// OLD LAB CODE:         .duration(750)
// OLD LAB CODE:         .call(
// OLD LAB CODE:           window.dcChoroMap_svi_HousingTypeTransportationZoom.transform,
// OLD LAB CODE:           d3.zoomIdentity
// OLD LAB CODE:         );
// OLD LAB CODE:     }
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_indianAlaskaNative").on("click", function () {
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(
// OLD LAB CODE:         window.dcChoroMap_indianAlaskaNativeZoom.transform,
// OLD LAB CODE:         d3.zoomIdentity
// OLD LAB CODE:       );
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_asian").on("click", function () {
// OLD LAB CODE:     dcChoroMap_asian.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_asian
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(window.dcChoroMap_asianZoom.transform, d3.zoomIdentity);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_black").on("click", function () {
// OLD LAB CODE:     dcChoroMap_black.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_black
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(window.dcChoroMap_blackZoom.transform, d3.zoomIdentity);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_hispanic").on("click", function () {
// OLD LAB CODE:     dcChoroMap_hispanic.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_hispanic
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(window.dcChoroMap_hispanicZoom.transform, d3.zoomIdentity);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_hawaiianPacificNative").on("click", function () {
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(
// OLD LAB CODE:         window.dcChoroMap_hawaiianPacificNativeZoom.transform,
// OLD LAB CODE:         d3.zoomIdentity
// OLD LAB CODE:       );
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#dcChoro_white").on("click", function () {
// OLD LAB CODE:     dcChoroMap_white.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_white
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(window.dcChoroMap_whiteZoom.transform, d3.zoomIdentity);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#dcChoro_otherRace").on("click", function () {
// OLD LAB CODE:     dcChoroMap_otherRace.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:     // Reset zoom transform to identity (original scale/position)
// OLD LAB CODE:     dcChoroMap_otherRace
// OLD LAB CODE:       .svg()
// OLD LAB CODE:       .transition()
// OLD LAB CODE:       .duration(750)
// OLD LAB CODE:       .call(window.dcChoroMap_otherRaceZoom.transform, d3.zoomIdentity);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#svi_SocioeconomicStatus").on("click", function () {
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#svi_HouseholdCharacteristic").on("click", function () {
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#svi_EthnicMinorityStatus").on("click", function () {
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#svi_HousingTypeTransportation").on("click", function () {
// OLD LAB CODE:     svi_HousingTypeTransportationHistogramChart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   d3.selectAll("a#regression_1").on("click", function () {
// OLD LAB CODE:     regression_1Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#regression_2").on("click", function () {
// OLD LAB CODE:     regression_2Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE:   d3.selectAll("a#regression_3").on("click", function () {
// OLD LAB CODE:     regression_3Chart.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   // // reset dataTable
// OLD LAB CODE:   // function resetTable() {
// OLD LAB CODE:   //   dataTable.filterAll();
// OLD LAB CODE:   //   dc.redrawAll();
// OLD LAB CODE:   //   // make reset link invisible
// OLD LAB CODE:   //   d3.select("#resetTableLink").style("display", "none");
// OLD LAB CODE:   // }
// OLD LAB CODE:   // reset all except mapChart
// OLD LAB CODE:   // function resetAll_exceptMap() {
// OLD LAB CODE:   //   countyChart.filterAll();
// OLD LAB CODE:   //   disadvantageChart.filterAll();
// OLD LAB CODE:   //   food1Chart.filterAll();
// OLD LAB CODE:   //   food10Chart.filterAll();
// OLD LAB CODE:   //   food20Chart.filterAll();
// OLD LAB CODE:   //   catsExceededChart.filterAll();
// OLD LAB CODE:   //   povertyChart.filterAll();
// OLD LAB CODE:   //   snapChart.filterAll();
// OLD LAB CODE:   //   svi_SocioeconomicStatusHistogramChart.filterAll();
// OLD LAB CODE:   //   svi_HouseholdCharacteristicHistogramChart.filterAll();
// OLD LAB CODE:   //   svi_EthnicMinorityStatusHistogramChart.filterAll();
// OLD LAB CODE:   //   svi_HousingTypeTransportationHistogramChart.filterAll();
// OLD LAB CODE:   //   dcChoroMap_svi_SocioeconomicStatus.filterAll();
// OLD LAB CODE:   //   dcChoroMap_svi_EthnicMinorityStatus.filterAll();
// OLD LAB CODE:   //   dcChoroMap_svi_HouseholdCharacteristic.filterAll();
// OLD LAB CODE:   //   dcChoroMap_svi_HousingTypeTransportation.filterAll();
// OLD LAB CODE:   //   regression_1Chart.filterAll();
// OLD LAB CODE:   //   regression_2Chart.filterAll();
// OLD LAB CODE:   //   regression_3Chart.filterAll();
// OLD LAB CODE:   //   resetTable();
// OLD LAB CODE:   //   dc.redrawAll();
// OLD LAB CODE:   // }
// OLD LAB CODE: 
// OLD LAB CODE:   $("#mapReset_socialJustice").on("click", function () {
// OLD LAB CODE:     LeafletMap_socialJustice.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:     LeafletMap_socialJustice.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:   });
// OLD LAB CODE: 
// OLD LAB CODE:   $("#mapReset_svi").on("click", function () {
// OLD LAB CODE:     LeafletMap_svi.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:     LeafletMap_svi.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:   });
// OLD LAB CODE:   $("#mapReset_foodJustice").on("click", function () {
// OLD LAB CODE:     LeafletMap_foodJustice.filterAll(groupname);
// OLD LAB CODE:     dc.redrawAll(groupname);
// OLD LAB CODE:     LeafletMap_foodJustice.map().setView([34, -105.2], 6.6);
// OLD LAB CODE:   });
// OLD LAB CODE:   // ---------------------------
// OLD LAB CODE:   // sticky bar starts here
// OLD LAB CODE:   // ---------------------------
// OLD LAB CODE:   const activeCharts = new Set();
// OLD LAB CODE: 
// OLD LAB CODE:   function monitorChartWithZoom(
// OLD LAB CODE:     chart,
// OLD LAB CODE:     containerDivId,
// OLD LAB CODE:     chartLabel,
// OLD LAB CODE:     featurePropertyName,
// OLD LAB CODE:     geojsonFeatures,
// OLD LAB CODE:     mapsToZoom
// OLD LAB CODE:   ) {
// OLD LAB CODE:     chart.on("filtered", function () {
// OLD LAB CODE:       const container = document.getElementById(containerDivId);
// OLD LAB CODE:       const filters = chart.filters();
// OLD LAB CODE: 
// OLD LAB CODE:       // === UI Highlight + Sticky Bar ===
// OLD LAB CODE:       if (filters.length === 0) {
// OLD LAB CODE:         container.classList.remove("active-filter");
// OLD LAB CODE:         activeCharts.delete(chartLabel);
// OLD LAB CODE:       } else {
// OLD LAB CODE:         container.classList.add("active-filter");
// OLD LAB CODE:         activeCharts.add(chartLabel);
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       updateStickyBar();
// OLD LAB CODE: 
// OLD LAB CODE:       // === Zoom Logic ===
// OLD LAB CODE:       if (filters.length > 0) {
// OLD LAB CODE:         const selectedFeatures = geojsonFeatures.filter(function (feature) {
// OLD LAB CODE:           return filters.includes(feature.properties[featurePropertyName]);
// OLD LAB CODE:         });
// OLD LAB CODE: 
// OLD LAB CODE:         if (selectedFeatures.length > 0) {
// OLD LAB CODE:           const geojsonLayer = L.geoJSON({
// OLD LAB CODE:             type: "FeatureCollection",
// OLD LAB CODE:             features: selectedFeatures,
// OLD LAB CODE:           });
// OLD LAB CODE: 
// OLD LAB CODE:           const bounds = geojsonLayer.getBounds();
// OLD LAB CODE:           mapsToZoom.forEach((m) => m.fitBounds(bounds, { maxZoom: 10 }));
// OLD LAB CODE:         } else {
// OLD LAB CODE:           console.warn(
// OLD LAB CODE:             "No matching features found for selected filters:",
// OLD LAB CODE:             filters
// OLD LAB CODE:           );
// OLD LAB CODE:         }
// OLD LAB CODE:       } else {
// OLD LAB CODE:         mapsToZoom.forEach((m) => m.setView([34, -105.2], 6.6));
// OLD LAB CODE:       }
// OLD LAB CODE:     });
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function monitorTractChartWithZoom(
// OLD LAB CODE:     chart,
// OLD LAB CODE:     containerDivId,
// OLD LAB CODE:     chartLabel,
// OLD LAB CODE:     geojsonFeatures,
// OLD LAB CODE:     mapsToZoom
// OLD LAB CODE:   ) {
// OLD LAB CODE:     chart.on("filtered", function () {
// OLD LAB CODE:       const container = document.getElementById(containerDivId);
// OLD LAB CODE:       const filters = chart.filters();
// OLD LAB CODE: 
// OLD LAB CODE:       // Highlight + sticky bar update
// OLD LAB CODE:       if (filters.length === 0) {
// OLD LAB CODE:         container.classList.remove("active-filter");
// OLD LAB CODE:         activeCharts.delete(chartLabel);
// OLD LAB CODE:       } else {
// OLD LAB CODE:         container.classList.add("active-filter");
// OLD LAB CODE:         activeCharts.add(chartLabel);
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       updateStickyBar();
// OLD LAB CODE: 
// OLD LAB CODE:       // Zoom logic
// OLD LAB CODE:       if (filters.length > 0) {
// OLD LAB CODE:         // Convert numeric FIPS to 11-digit strings
// OLD LAB CODE:         const selectedGEOIDs = filters.map((f) =>
// OLD LAB CODE:           f.toString().padStart(11, "0")
// OLD LAB CODE:         );
// OLD LAB CODE: 
// OLD LAB CODE:         const selectedFeatures = geojsonFeatures.filter(function (feature) {
// OLD LAB CODE:           return selectedGEOIDs.includes(feature.properties.GEOID);
// OLD LAB CODE:         });
// OLD LAB CODE: 
// OLD LAB CODE:         if (selectedFeatures.length > 0) {
// OLD LAB CODE:           const geojsonLayer = L.geoJSON({
// OLD LAB CODE:             type: "FeatureCollection",
// OLD LAB CODE:             features: selectedFeatures,
// OLD LAB CODE:           });
// OLD LAB CODE: 
// OLD LAB CODE:           const bounds = geojsonLayer.getBounds();
// OLD LAB CODE:           mapsToZoom.forEach((m) => m.fitBounds(bounds, { maxZoom: 14 }));
// OLD LAB CODE:         } else {
// OLD LAB CODE:           console.warn("No matching tracts found for:", selectedGEOIDs);
// OLD LAB CODE:         }
// OLD LAB CODE:       } else {
// OLD LAB CODE:         mapsToZoom.forEach((m) => m.setView([34, -105.2], 6.6));
// OLD LAB CODE:       }
// OLD LAB CODE:     });
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function monitorChartFilter(chart, containerDivId, chartLabel) {
// OLD LAB CODE:     chart.on("filtered", function () {
// OLD LAB CODE:       const container = document.getElementById(containerDivId);
// OLD LAB CODE:       const filters = chart.filters();
// OLD LAB CODE: 
// OLD LAB CODE:       if (filters.length === 0) {
// OLD LAB CODE:         container.classList.remove("active-filter");
// OLD LAB CODE:         activeCharts.delete(chartLabel);
// OLD LAB CODE:       } else {
// OLD LAB CODE:         container.classList.add("active-filter");
// OLD LAB CODE:         activeCharts.add(chartLabel);
// OLD LAB CODE:       }
// OLD LAB CODE: 
// OLD LAB CODE:       updateStickyBar();
// OLD LAB CODE:     });
// OLD LAB CODE:   }
// OLD LAB CODE: 
// OLD LAB CODE:   function updateStickyBar() {
// OLD LAB CODE:     const statusText = document.getElementById("filter-status-text");
// OLD LAB CODE:     if (activeCharts.size === 0) {
// OLD LAB CODE:       statusText.textContent = "No active filters";
// OLD LAB CODE:     } else {
// OLD LAB CODE:       statusText.textContent =
// OLD LAB CODE:         "Filters active in: " + Array.from(activeCharts).join(", ");
// OLD LAB CODE:     }
// OLD LAB CODE:   }
// OLD LAB CODE:   dc.renderAll(groupname);
// OLD LAB CODE: 
// OLD LAB CODE:   // monitorChartFilter(countyChart, "chart-ring-county", "County");
// OLD LAB CODE:   // monitorChartFilter(tractChart, "chart-ring-censusTract", "Census Tract");
// OLD LAB CODE:   monitorChartWithZoom(
// OLD LAB CODE:     countyChart,
// OLD LAB CODE:     "chart-ring-county", // chart container div
// OLD LAB CODE:     "County", // label for sticky bar
// OLD LAB CODE:     "NAMELSADCO", // feature property to match
// OLD LAB CODE:     nm_tract.features, // full GeoJSON features
// OLD LAB CODE:     [map_socialJustice, map_svi, map_foodJustice] // list of Leaflet maps
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   // monitorChartFilter(countyChart, "chart-ring-county", "County");
// OLD LAB CODE:   // monitorChartFilter(tractChart, "chart-ring-censusTract", "Census Tract");
// OLD LAB CODE:   monitorTractChartWithZoom(
// OLD LAB CODE:     tractChart,
// OLD LAB CODE:     "chart-ring-censusTract", // ID of the container div for tract chart
// OLD LAB CODE:     "Census Tract", // Label for sticky bar
// OLD LAB CODE:     nm_tract.features, // Full GeoJSON tract features
// OLD LAB CODE:     [map_socialJustice, map_svi, map_foodJustice] // Maps to zoom
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     catsExceededChart,
// OLD LAB CODE:     "chart-ring-cats",
// OLD LAB CODE:     "Categories of burdens exceeded"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     disadvantageChart,
// OLD LAB CODE:     "chart-ring-disadvantage",
// OLD LAB CODE:     "Identified as disadvantaged"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     lowIncomeChart,
// OLD LAB CODE:     "chart-ring-lowIncome",
// OLD LAB CODE:     "Low Income Tract"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     svi_SocioeconomicStatusHistogramChart,
// OLD LAB CODE:     "chart-ring-svi_SocioeconomicStatus",
// OLD LAB CODE:     "Socioeconomic Status"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramChart,
// OLD LAB CODE:     "chart-ring-svi_HouseholdCharacteristic",
// OLD LAB CODE:     "Household Characteristics"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     svi_EthnicMinorityStatusHistogramChart,
// OLD LAB CODE:     "chart-ring-svi_EthnicMinorityStatus",
// OLD LAB CODE:     "Racial & Ethnic Minority Status"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     svi_HouseholdCharacteristicHistogramChart,
// OLD LAB CODE:     "chart-ring-svi_HouseholdCharacteristic",
// OLD LAB CODE:     "Housing Type & Transportation"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     food1Chart,
// OLD LAB CODE:     "chart-ring-food1",
// OLD LAB CODE:     "Low Food Access at 1 Mile"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     food10Chart,
// OLD LAB CODE:     "chart-ring-food10",
// OLD LAB CODE:     "Low Food Access at 10 Miles"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     food20Chart,
// OLD LAB CODE:     "chart-ring-food20",
// OLD LAB CODE:     "Low Food Access at 20 Miles"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     foodVehChart,
// OLD LAB CODE:     "chart-ring-foodVeh",
// OLD LAB CODE:     "Low Food Access at 1/2 Mile and No Vehicle"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     snapChart,
// OLD LAB CODE:     "chart-ring-snap",
// OLD LAB CODE:     "Number of Tracts Receiving SNAP"
// OLD LAB CODE:   );
// OLD LAB CODE: 
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_svi_SocioeconomicStatus,
// OLD LAB CODE:     "chart-ring-dcChoro_svi_SocioeconomicStatus",
// OLD LAB CODE:     "Socioeconomic Status Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_svi_EthnicMinorityStatus,
// OLD LAB CODE:     "chart-ring-dcChoro_svi_EthnicMinorityStatus",
// OLD LAB CODE:     "Ethnic Minority Status Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_svi_HouseholdCharacteristic,
// OLD LAB CODE:     "chart-ring-dcChoro_svi_HouseholdCharacteristic",
// OLD LAB CODE:     "Household Characteristic Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_svi_HousingTypeTransportation,
// OLD LAB CODE:     "chart-ring-dcChoro_svi_HousingTypeTransportation",
// OLD LAB CODE:     "Housing Type & Transportation Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(dcChoroMap_asian, "chart-ring-dcChoro_asian", "Asian Map");
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_black,
// OLD LAB CODE:     "chart-ring-dcChoro_black",
// OLD LAB CODE:     "Black or African American Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_hawaiianPacificNative,
// OLD LAB CODE:     "chart-ring-dcChoro_hawaiianPacificNative",
// OLD LAB CODE:     "Native Hawaiian/Pacific"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_hispanic,
// OLD LAB CODE:     "chart-ring-dcChoro_hispanic",
// OLD LAB CODE:     "Hispanic/Latino"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_indianAlaskaNative,
// OLD LAB CODE:     "chart-ring-dcChoro_indianAlaskaNative",
// OLD LAB CODE:     "American Indian/Alaska Native Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     dcChoroMap_otherRace,
// OLD LAB CODE:     "chart-ring-dcChoro_otherRace",
// OLD LAB CODE:     "Other Race"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(dcChoroMap_white, "chart-ring-dcChoro_white", "White");
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     regression_1Chart,
// OLD LAB CODE:     "chart-ring-regression_1",
// OLD LAB CODE:     "SVI and Food Access Scatter"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     regression_2Chart,
// OLD LAB CODE:     "chart-ring-regression_2",
// OLD LAB CODE:     "SVI and Climate and Economic Justice Map Scatter"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     regression_3Chart,
// OLD LAB CODE:     "chart-ring-regression_3",
// OLD LAB CODE:     "Food and Climate and Economic Justice Map Scatter"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     LeafletMap_foodJustice,
// OLD LAB CODE:     "map_foodJustice",
// OLD LAB CODE:     "Food Justice Map"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(
// OLD LAB CODE:     LeafletMap_socialJustice,
// OLD LAB CODE:     "map_socialJustice",
// OLD LAB CODE:     "Climate and Economic Justice"
// OLD LAB CODE:   );
// OLD LAB CODE:   monitorChartFilter(LeafletMap_svi, "map_svi", "SVI Map");
// OLD LAB CODE: }
// OLD LAB CODE: 
// OLD LAB CODE: $(document).ready(function () {
// OLD LAB CODE:   $('[data-toggle="tooltip"]').tooltip();
// OLD LAB CODE: });
// OLD LAB CODE: 
// OLD LAB CODE: const navOffset = $(".navbar").height();
// OLD LAB CODE: 
// OLD LAB CODE: $(".navbar li a").click(function (event) {
// OLD LAB CODE:   var href = $(this).attr("href");
// OLD LAB CODE: 
// OLD LAB CODE:   event.preventDefault();
// OLD LAB CODE:   window.location.hash = href;
// OLD LAB CODE: 
// OLD LAB CODE:   $(href)[0].scrollIntoView();
// OLD LAB CODE:   window.scrollBy(0, -navOffset);
// OLD LAB CODE: });