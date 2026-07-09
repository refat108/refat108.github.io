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
        ] // End of variables array for the "Health Outcomes" category
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
        ] // End of variables array for the "Prevention" category
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
        ] // End of variables array for the "Health Risk Behaviors" category
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
        ] // End of variables array for the "Disabilities" category
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
        ] // End of variables array for the "Health Status" category
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
        ] // End of variables array for the "Health-Related Social Needs" category
    } // End of the six defined categories in the "CDC_CATEGORIES" array
    // {
    //     "id": "non-medical-factors",
    //     "title": "Non-Medical Factors",
    //     "shortTitle": "Non-Medical",
    //     "default": null,
    //     "description": "Placeholder row for the CDC/PLACES non-medical factors category. These ACS-derived fields are not included in the Clean_NM.csv.",
    //     "variables": [
    //         {
    //             "field": "NOT_IN_CURRENT_CSV",
    //             "label": "Non-medical factor fields are not included in Clean_NM.csv",
    //             "ciField": null
    //         }
    //     ],
    //     "disabled": true
    // }
]; // End of the "CDC_CATEGORIES" array that defines the configuration for each CDC category, including its ID, title, description, and the variables associated with it. Each variable includes the field name for the crude prevalence estimate, a label for display purposes, and the corresponding confidence interval field name.

/* ------------------------------------------------------------
   2. File paths
   ------------------------------------------------------------
   These paths keep the original GeoAIR lab data-folder structure.
*/
const CDC_CSV_PATH = "data/Clean_NM.csv"; // This path points to the Clean_NM.csv file, which contains the CDC PLACES data for New Mexico. The "CDC_CSV_PATH" constant is used in the code to load and access the CSV data for mapping and analysis.
const NM_TRACT_GEOJSON_PATH = "data/census_tract_county_nm_2020.geojson"; // This path points to the census tract GeoJSON file for New Mexico, which contains the geographic boundaries of census tracts in the state. The "NM_TRACT_GEOJSON_PATH" constant is used in the code to load and access the GeoJSON data for mapping and spatial analysis.
const NM_COUNTY_GEOJSON_PATH = "data/tl_2018_nm_county.geojson"; // This path points to the county boundary GeoJSON file for New Mexico, which contains the geographic boundaries of counties in the state. The "NM_COUNTY_GEOJSON_PATH" constant is used in the code to load and access the GeoJSON data for mapping and spatial analysis, particularly for displaying county boundaries as reference layers on the maps.
const LASSO_REGRESSION_RESULTS_PATH = "data/lasso_regression_results.json";

/* ------------------------------------------------------------
   3. Shared map settings
   ------------------------------------------------------------
*/
const NO_DATA_COLOR = "#d9d9d9"; // This constant defines the color used to represent areas with no data on the maps. The "NO_DATA_COLOR" variable is set to a light gray color (#d9d9d9) and is used in the code to style map features that do not have associated data values, ensuring that they are visually distinct from areas with data.
const MAP_CLASS_COUNT = 5; // This constant defines the number of classes (or breaks) used in the choropleth maps. The "MAP_CLASS_COUNT" variable is set to 5, which means that the data will be categorized into five distinct classes for visualization purposes. This variable is used in the code to determine how to classify and color the map features based on their data values, often in conjunction with a color scheme like ColorBrewer.
const CDC_COLOR_SCHEME = (typeof colorbrewer !== "undefined" && colorbrewer.YlOrRd)
    ? colorbrewer.YlOrRd[MAP_CLASS_COUNT]
    : ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];

let cdcRows = []; // This variable is initialized as an empty array and is intended to hold the normalized rows of CDC data loaded from the Clean_NM.csv file. After the CSV data is loaded and processed, the "cdcRows" variable will contain an array of objects, where each object represents a census tract with its associated CDC measures and demographic information. This variable is used throughout the code to access and manipulate the CDC data for mapping, analysis, and display purposes.
let cdcByTractFips = new Map(); // This variable is initialized as a new Map object and is intended to provide a quick lookup for CDC data rows based on census tract FIPS codes. After the CDC data is loaded and normalized, the "cdcByTractFips" Map will be populated with key-value pairs, where the key is the tract FIPS code (as a string) and the value is the corresponding data row object from the "cdcRows" array. This allows for efficient retrieval of CDC data for specific census tracts when rendering the maps, popups, and other visualizations that require access to tract-level data.
let tractGeojson = null; // This variable is initialized as null and is intended to hold the GeoJSON data for New Mexico census tracts. After the GeoJSON file specified by "NM_TRACT_GEOJSON_PATH" is loaded, the "tractGeojson" variable will contain the parsed GeoJSON object representing the geographic boundaries and properties of the census tracts in New Mexico. This variable is used in the code to create Leaflet map layers, style the tracts based on CDC data, and enable spatial interactions such as popups and comparisons on the maps.
let countyGeojson = null; // This variable is initialized as null and is intended to hold the GeoJSON data for New Mexico counties. After the GeoJSON file specified by "NM_COUNTY_GEOJSON_PATH" is loaded, the "countyGeojson" variable will contain the parsed GeoJSON object representing the geographic boundaries and properties of the counties in New Mexico. This variable is used in the code to create Leaflet map layers, style the counties based on CDC data, and enable spatial interactions such as popups and comparisons on the maps.
let categoryViews = []; // This variable is initialized as an empty array and is intended to hold the view objects for each CDC category. Each view object will contain references to the category configuration, associated DOM elements (such as the select dropdown, legend, summary, and comparison panel), the Leaflet map instance, and the tract layer for that category. After the maps are initialized, the "categoryViews" array will be populated with these view objects, allowing for easy access and management of the different category views when updating the maps, legends, summaries, and comparison panels based on user interactions.
let dataTable = null; // This variable is initialized as null and is intended to hold the instance of the DataTable created using the jQuery DataTables library. After the CDC data is loaded and rendered into an HTML table, the "dataTable" variable will be assigned the DataTable instance, which provides functionalities such as searching, sorting, and pagination for the tabular display of CDC data. This variable is used in the code to manage and update the data table as needed when users interact with the maps or change category selections.
let selectedCompareFeatures = {}; // This variable is initialized as an empty object and is intended to keep track of the selected census tract features for comparison in each category. The keys of the "selectedCompareFeatures" object will correspond to category IDs, and the values will be arrays that hold the selected GeoJSON features (census tracts) for comparison. When a user clicks on a tract in the map to compare it with another tract, the corresponding feature will be added to the array for that category in this object. This allows the code to manage and update the comparison panel with the selected tracts' data when users interact with the maps.
let lassoRegressionLoaded = false;

loadLassoRegressionOutput();

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
    cdcRows = normalizeCdcRows(cdcCsv); // This line calls the "normalizeCdcRows" function, passing in the raw CSV data loaded from the "CDC_CSV_PATH". The function processes and normalizes the CDC data rows, and the resulting array of normalized row objects is assigned to the "cdcRows" variable. This normalized data will be used for mapping, analysis, and display throughout the application.
    tractGeojson = tracts; // This line assigns the loaded GeoJSON data for New Mexico census tracts (stored in the "tracts" variable) to the "tractGeojson" variable. This GeoJSON data will be used to create map layers, style the tracts based on CDC data, and enable spatial interactions on the maps.
    countyGeojson = counties; // This line assigns the loaded GeoJSON data for New Mexico counties (stored in the "counties" variable) to the "countyGeojson" variable. This GeoJSON data will be used to create map layers, style the counties based on CDC data, and enable spatial interactions on the maps, particularly for displaying county boundaries as reference layers.

    cdcByTractFips = new Map(cdcRows.map(function (row) {
        return [row.TractFIPS, row]; // This line creates a new Map object called "cdcByTractFips" by mapping over the "cdcRows" array. For each row in the "cdcRows" array, it returns a key-value pair where the key is the "TractFIPS" property of the row (which is the census tract FIPS code) and the value is the entire row object itself. This allows for efficient lookup of CDC data rows based on tract FIPS codes when rendering the maps, popups, and other visualizations that require access to tract-level data.
    })); // End of the mapping function for creating the "cdcByTractFips" Map.

    buildCategoryRows(); // This line calls the "buildCategoryRows" function, which is responsible for dynamically creating the HTML structure for each CDC category row on the page. This function uses the configuration defined in the "CDC_CATEGORIES" array to generate the necessary DOM elements, such as the map containers, select dropdowns for variable selection, legends, summaries, and comparison panels for each category. By calling this function after loading the data, the application ensures that the page structure is set up and ready for initializing the maps and rendering the data based on user interactions.
    initializeAllCategoryViews(); // This line calls the "initializeAllCategoryViews" function, which is responsible for initializing the Leaflet maps and associated view objects for each CDC category. This function iterates over the "CDC_CATEGORIES" array, creates a Leaflet map instance for each category, adds necessary controls (such as the north arrow and mouse coordinates), and sets up the initial state for each category view. By calling this function after building the category rows, the application ensures that each category's map and interactive elements are properly initialized and ready to display the CDC data when users interact with the page.
    updateStatusPanel(); // This line calls the "updateStatusPanel" function, which is responsible for updating the status panel on the page to reflect the current state of the application. This function may display messages about data loading, errors, or other relevant information to the user. By calling this function after initializing the category views, the application can provide feedback to the user about the successful loading of data and readiness of the maps for interaction.
    renderDataTable(); // This line calls the "renderDataTable" function, which is responsible for rendering the CDC data into an HTML table format on the page. This function uses the normalized CDC data stored in the "cdcRows" variable to populate the table, and it may also initialize the DataTable instance for enhanced functionality such as searching, sorting, and pagination. By calling this function after loading and processing the data, the application ensures that users have access to a tabular view of the CDC data in addition to the interactive maps.
}).catch(function (error) {
    console.error("Data loading failed:", error); // This line logs an error message to the console if there is a failure in loading any of the data files (CDC CSV, tract GeoJSON, or county GeoJSON). The "catch" block is used to handle any errors that occur during the Promise.all data loading process, allowing the application to gracefully handle issues such as missing files or network errors.
    document.getElementById("cdc-map-rows").innerHTML = `
        <div class="alert alert-danger">
            <b>Data loading failed.</b> Please check that Clean_NM.csv and the New Mexico GeoJSON files are inside the data folder.
        </div>`; // This line updates the inner HTML of the element with the ID "cdc-map-rows" to display an alert message to the user if there is a failure in loading the data. The message informs the user that data loading has failed and suggests checking that the necessary files (Clean_NM.csv and the New Mexico GeoJSON files) are present in the data folder. This provides feedback to the user about the issue and potential steps to resolve it.
}); // End of the Promise.all data loading and initialization block.

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
        const row = {}; // Start with an empty object for the normalized row.

        Object.keys(rawRow).forEach(function (key) {
            const cleanKey = key.trim(); // This line trims any leading or trailing whitespace from the original key from the CSV row, creating a "cleanKey" that is used for the normalized row object. This helps ensure that there are no issues with extra spaces in the keys when accessing properties of the row later in the code.
            row[cleanKey] = rawRow[key]; // This line assigns the value from the original "rawRow" object to the "row" object using the "cleanKey" as the property name. This effectively creates a new object with cleaned keys while preserving the original values from the CSV row. The resulting "row" object will have properties with trimmed keys, making it easier to work with in subsequent data processing and mapping steps.
        }); // End of the loop that creates the normalized "row" object with cleaned keys.

        row.TractFIPS = String(row.TractFIPS || "").trim().padStart(11, "0"); // This line processes the "TractFIPS" property of the row to ensure it is a string, trims any whitespace, and pads it with leading zeros to ensure it is 11 characters long. This standardizes the format of the tract FIPS codes, which is important for correctly joining the CDC data with the GeoJSON tract geometries based on their FIPS codes.
        row.CountyFIPS = String(row.CountyFIPS || "").trim().padStart(5, "0"); // This line processes the "CountyFIPS" property of the row in a similar way to the "TractFIPS" property. It ensures that the county FIPS code is treated as a string, trims any whitespace, and pads it with leading zeros to ensure it is 5 characters long. This standardization is important for any operations that may involve county-level data or joins based on county FIPS codes.
        row.TotalPopulation_number = parseNumber(row.TotalPopulation); // This line creates a new property "TotalPopulation_number" on the row object by parsing the "TotalPopulation" field from the CSV. The "parseNumber" function is used to remove any commas and convert the value to a number. This allows for easier numerical operations and mapping based on the total population of each census tract.
        row.TotalPop18plus_number = parseNumber(row.TotalPop18plus); // This line creates a new property "TotalPop18plus_number" on the row object by parsing the "TotalPop18plus" field from the CSV. Similar to the previous line, it uses the "parseNumber" function to clean and convert the value to a number. This provides a numeric representation of the population aged 18 and over for each census tract, which can be useful for mapping and analysis based on adult population counts.

        CDC_CATEGORIES.forEach(function (category) {
            category.variables.forEach(function (measure) {
                if (measure.field && measure.field.endsWith("_CrudePrev")) {
                    row[measure.field + "_number"] = parseNumber(row[measure.field]); // This line checks if the "field" property of the measure exists and ends with "_CrudePrev", which indicates that it is a CDC prevalence measure. If this condition is met, it creates a new property on the row object with the name of the original field plus "_number" (e.g., "ARTHRITIS_CrudePrev_number") and assigns it the parsed numeric value of the original field using the "parseNumber" function. This allows for easier numerical operations and mapping based on the CDC prevalence measures, as they will now have corresponding numeric properties in the row object.
                }
            }); // End of the loop that processes each measure in the category.
        }); // End of the loop that processes each category in the "CDC_CATEGORIES" array.

        return row; // This line returns the normalized "row" object for the current CSV row after processing and adding the cleaned keys, standardized FIPS codes, and parsed numeric values for population and CDC measures. The resulting array of normalized rows will be used for mapping, analysis, and display in the application.
    }); // End of the mapping function that processes each raw CSV row and returns an array of normalized row objects.
} // End of the "normalizeCdcRows" function, which takes an array of raw CSV rows and returns an array of normalized row objects with cleaned keys, standardized FIPS codes, and parsed numeric values for population and CDC measures.

function parseNumber(value) {
    if (value === undefined || value === null || value === "") return null; // This line checks if the input "value" is undefined, null, or an empty string. If any of these conditions are true, it returns null, indicating that there is no valid number to parse. This helps handle cases where the CSV data may have missing or empty values for numeric fields.
    const cleaned = String(value).replace(/,/g, "").trim(); // This line converts the input "value" to a string, removes any commas (which are often used as thousand separators in numbers), and trims any leading or trailing whitespace. The resulting "cleaned" string is then used for parsing into a number. This step ensures that the input is in a format that can be correctly interpreted as a numeric value, especially for fields like population counts that may include commas.
    const numberValue = Number(cleaned); // This line attempts to convert the "cleaned" string into a number using the built-in Number function. If the "cleaned" string represents a valid numeric value, it will be converted to that number. If it does not represent a valid number (e.g., if it contains non-numeric characters), the result will be NaN (Not-a-Number).
    return Number.isFinite(numberValue) ? numberValue : null; // This line checks if the "numberValue" is a finite number using the Number.isFinite function. If it is finite, it returns the "numberValue". If it is not finite (e.g., if it is NaN or Infinity), it returns null. This ensures that only valid numeric values are returned, and any invalid or non-numeric inputs are handled gracefully by returning null.
} // End of the "parseNumber" function, which is used to clean and convert string inputs into numeric values while handling cases of missing or invalid data.

/* ------------------------------------------------------------
   6. Build the seven map rows from the category configuration
   ------------------------------------------------------------
*/
function buildCategoryRows() {
    const container = document.getElementById("cdc-map-rows"); // This line selects the DOM element with the ID "cdc-map-rows" and assigns it to the variable "container". This element is intended to be the parent container where the category rows (including maps, legends, summaries, and comparison panels) will be dynamically inserted based on the configuration defined in the "CDC_CATEGORIES" array.
    container.innerHTML = ""; // This line clears the inner HTML of the "container" element, ensuring that it starts empty before dynamically adding the category rows. This is important to prevent any existing content from interfering with the new content that will be generated based on the "CDC_CATEGORIES" configuration.

    CDC_CATEGORIES.forEach(function (category, index) {
        const selectId = `select-${category.id}`; // This line constructs a unique ID for the select dropdown element for the current category by concatenating the string "select-" with the category's ID. This ID will be used in the HTML structure for the category row and will allow for easy reference to the select element when adding event listeners or updating its value based on user interactions.
        const mapId = `map-${category.id}`; // This line constructs a unique ID for the map container element for the current category by concatenating the string "map-" with the category's ID. This ID will be used in the HTML structure for the category row and will allow for easy reference to the map container when initializing the Leaflet map and rendering the CDC data on it.
        const legendId = `legend-${category.id}`; // This line constructs a unique ID for the legend container element for the current category by concatenating the string "legend-" with the category's ID. This ID will be used in the HTML structure for the category row and will allow for easy reference to the legend container when updating the legend based on the selected variable and its corresponding data values.
        const summaryId = `summary-${category.id}`; // This line constructs a unique ID for the summary container element for the current category by concatenating the string "summary-" with the category's ID. This ID will be used in the HTML structure for the category row and will allow for easy reference to the summary container when updating the summary information based on user interactions, such as selecting different variables or comparing locations.
        const comparisonId = `comparison-${category.id}`; // This line constructs a unique ID for the comparison panel container element for the current category by concatenating the string "comparison-" with the category's ID. This ID will be used in the HTML structure for the category row and will allow for easy reference to the comparison panel when updating its content based on user interactions, such as selecting census tracts on the map for comparison.

        const optionsHtml = category.variables.map(function (measure) {
            const selected = measure.field === category.default ? "selected" : ""; // This line checks if the "field" property of the current measure matches the "default" field specified for the category. If it does, it assigns the string "selected" to the variable "selected", which will be used in the HTML option element to indicate that this option should be selected by default in the dropdown. If it does not match, it assigns an empty string, meaning that the option will not be selected by default.
            return `<option value="${measure.field}" ${selected}>${measure.label}</option>`; // This line returns a string of HTML that represents an option element for a select dropdown. The "value" attribute of the option is set to the "field" property of the measure, and the display text of the option is set to the "label" property of the measure. Additionally, if this measure is the default for the category, the "selected" attribute will be included in the option element, making it the default selection when the dropdown is rendered.
        }).join(""); // This line joins the array of option HTML strings into a single string that can be inserted into the select element for the category. The resulting "optionsHtml" variable will contain the complete set of option elements for the select dropdown based on the measures defined in the category configuration.

        const disabledText = category.disabled
            ? " disabled"
            : ""; // This line checks if the current category has a "disabled" property set to true. If it does, it assigns the string " disabled" to the variable "disabledText", which will be used in the HTML select element to disable it. If the category is not disabled, it assigns an empty string, meaning that the select element will be enabled and interactive for the user.

        const mapContent = category.disabled
            ? `<div id="${mapId}" class="cdc-placeholder">
                    <div>
                        <strong>Placeholder row: data not included in current CSV</strong>
                        <p>The  Clean_NM.csv does not contain the ACS-derived non-medical-factor fields. Add those columns later to activate this row.</p>
                    </div>
               </div>`
            : `<div id="${mapId}" class="cdc-map"></div>`; // This line checks if the current category is disabled. If it is, it assigns a string of HTML to the variable "mapContent" that represents a placeholder div with a message indicating that the data for this category is not included in the current CSV. This placeholder will be displayed instead of an interactive map. If the category is not disabled, it assigns a string of HTML that represents a div with the ID corresponding to the map container for this category, which will be used to initialize the Leaflet map and display the CDC data.

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
        `); // This block of code uses the insertAdjacentHTML method to append a new section of HTML to the "container" element for each category defined in the "CDC_CATEGORIES" array. The HTML structure includes a header with the category title and description, a select dropdown for choosing the map variable, a div for the map (or a placeholder if the category is disabled), and additional divs for the legend, summary, and comparison panel. The IDs for these elements are dynamically generated based on the category ID, allowing for easy reference when initializing maps and updating content based on user interactions.
    }); // End of the loop that iterates over each category in the "CDC_CATEGORIES" array and builds the corresponding HTML structure for the map rows.
} // End of the "buildCategoryRows" function that dynamically creates the HTML structure for each CDC category row on the page based on the configuration defined in the "CDC_CATEGORIES" array.

/* ------------------------------------------------------------
   7. Initialize each Leaflet category map
   ------------------------------------------------------------
   Each map uses the same tract geometry, but it styles the polygons
   using a different selected CDC measure.
*/
function addNorthArrow(map) {
    const northControl = L.control({ position: "topright" }); // This line creates a new Leaflet control called "northControl" and sets its position to "topright". This control will be used to display a north arrow on the map, providing users with orientation and helping them understand the directionality of the map. By specifying the position as "topright", the control will be placed in the upper right corner of the map interface.

    northControl.onAdd = function () {
        const div = L.DomUtil.create("div", "cdc-north-arrow"); // This line creates a new div element using the Leaflet DOM utility function "L.DomUtil.create". The div is assigned the class "cdc-north-arrow", which can be used for styling purposes in CSS. This div will serve as the container for the north arrow graphic and label that will be added to the map.

        div.innerHTML = `
            <div class="north-label">N</div>
            <svg class="north-svg" viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <!-- black outer arrow -->
                <path d="M30 8 L44 72 L30 58 L16 72 Z" fill="black"/>
                <!-- white inner cut -->
                <path d="M30 18 L38 64 L30 54 L22 64 Z" fill="white"/>
            </svg>
        `; // This block of code sets the inner HTML of the "div" element to include a label "N" for north and an SVG graphic that represents a north arrow. The SVG consists of two path elements: a black outer arrow and a white inner cut, creating a stylized north arrow symbol. This HTML structure will be displayed in the control on the map, providing users with a visual indication of the north direction.

        L.DomEvent.disableClickPropagation(div); // This line uses the Leaflet DOM event utility function "L.DomEvent.disableClickPropagation" to prevent click events on the "div" element from propagating to the underlying map. This is important because it allows users to interact with the north arrow control (e.g., clicking on it) without triggering unintended interactions with the map itself, such as panning or zooming.
        L.DomEvent.disableScrollPropagation(div); // This line uses the Leaflet DOM event utility function "L.DomEvent.disableScrollPropagation" to prevent scroll events on the "div" element from propagating to the underlying map. This is important because it allows users to interact with the north arrow control (e.g., using the mouse wheel while hovering over it) without triggering unintended zooming interactions with the map itself.

        return div; // This line returns the "div" element that contains the north arrow graphic and label. This returned element will be added to the map as part of the control when it is initialized, allowing it to be displayed in the specified position on the map interface.
    }; // End of the "onAdd" function that defines the content and behavior of the north arrow control.

    northControl.addTo(map); // This line adds the "northControl" to the Leaflet map instance using the "addTo" method. This will render the north arrow control on the map in the position specified when the control was created (in this case, "topright"). By adding the control to the map, users will be able to see the north arrow and use it for orientation while interacting with the map.
} // End of the "addNorthArrow" function that defines the behavior of the north arrow control on the map.
function addMouseCoordinates(map) {
    const coordControl = L.control({ position: "bottomleft" }); // This line creates a new Leaflet control called "coordControl" and sets its position to "bottomleft". This control will be used to display the latitude and longitude coordinates of the mouse cursor as it moves over the map. By specifying the position as "bottomleft", the control will be placed in the lower left corner of the map interface, allowing users to easily see the coordinates while interacting with the map. 

    coordControl.onAdd = function () {
        const div = L.DomUtil.create("div", "cdc-coordinates-control"); // This line creates a new div element using the Leaflet DOM utility function "L.DomUtil.create". The div is assigned the class "cdc-coordinates-control", which can be used for styling purposes in CSS. This div will serve as the container for displaying the mouse coordinates (latitude and longitude) as the user moves the cursor over the map.
        div.innerHTML = "Move mouse"; // This line sets the initial inner HTML of the "div" element to the text "Move mouse". This serves as a prompt to the user, indicating that they should move their mouse over the map to see the coordinates. As the user moves the mouse, this content will be updated to show the current latitude and longitude of the cursor position on the map.
        L.DomEvent.disableClickPropagation(div); // This line uses the Leaflet DOM event utility function "L.DomEvent.disableClickPropagation" to prevent click events on the "div" element from propagating to the underlying map. This is important because it allows users to interact with the coordinates control (e.g., clicking on it) without triggering unintended interactions with the map itself, such as panning or zooming.
        L.DomEvent.disableScrollPropagation(div); // This line uses the Leaflet DOM event utility function "L.DomEvent.disableScrollPropagation" to prevent scroll events on the "div" element from propagating to the underlying map. This is important because it allows users to interact with the coordinates control (e.g., using the mouse wheel while hovering over it) without triggering unintended zooming interactions with the map itself.
        return div; // This line returns the "div" element that contains the initial prompt for mouse coordinates. This returned element will be added to the map as part of the control when it is initialized, allowing it to be displayed in the specified position on the map interface and updated with the current mouse coordinates as the user interacts with the map.
    }; // End of the "onAdd" function that defines the content and behavior of the mouse coordinates control.

    coordControl.addTo(map); // This line adds the "coordControl" to the Leaflet map instance using the "addTo" method. This will render the mouse coordinates control on the map in the position specified when the control was created (in this case, "bottomleft"). By adding the control to the map, users will be able to see the prompt and eventually the latitude and longitude coordinates as they move their mouse over the map.

    map.on("mousemove", function (e) {
        const lat = e.latlng.lat.toFixed(6); // This line retrieves the latitude from the mouse event object "e" (specifically from "e.latlng.lat") and formats it to six decimal places using the "toFixed(6)" method. The resulting string is assigned to the variable "lat". This formatted latitude value will be displayed in the coordinates control on the map, providing users with precise information about their cursor's latitude position as they move it over the map.
        const lng = e.latlng.lng.toFixed(6); // This line retrieves the longitude from the mouse event object "e" (specifically from "e.latlng.lng") and formats it to six decimal places using the "toFixed(6)" method. The resulting string is assigned to the variable "lng". This formatted longitude value will be displayed in the coordinates control on the map, providing users with precise information about their cursor's longitude position as they move it over the map.
        coordControl.getContainer().innerHTML = `${lat} | ${lng}`; // This line updates the inner HTML of the container element of the "coordControl" with a string that combines the formatted latitude and longitude values, separated by a vertical bar ("|"). This allows users to see the current coordinates of their mouse cursor in real-time as they move it over the map, providing them with useful spatial information about their location on the map.
    }); // End of the event listener for mouse movement on the map that updates the coordinates control with the current latitude and longitude.

    map.on("mouseout", function () {
        coordControl.getContainer().innerHTML = "Move mouse"; // This line sets up an event listener for when the mouse cursor leaves the map area ("mouseout" event). When this event occurs, it resets the inner HTML of the coordinates control back to the initial prompt "Move mouse". This provides a clear indication to users that they are no longer hovering over the map and that they can move their mouse back onto the map to see the coordinates again.
    }); // End of the event listener for mouse leaving the map area that resets the coordinates control prompt.
} // End of the "addMouseCoordinates" function that defines the behavior of the mouse coordinates control on the map.
function initializeAllCategoryViews() {
    categoryViews = []; // This line resets the "categoryViews" array to an empty array. This is important to ensure that any previous views are cleared out before initializing new views for each category. By resetting the array, the function can safely populate it with fresh view objects for each category without any risk of retaining outdated or duplicate views from previous initializations.

    CDC_CATEGORIES.forEach(function (category) {
        const select = document.getElementById(`select-${category.id}`); // This line selects the DOM element for the select dropdown corresponding to the current category using its unique ID (constructed as "select-" followed by the category ID). The selected element is assigned to the variable "select", which will be used to manage user interactions with the dropdown and to determine which CDC measure is currently selected for mapping in this category.
        const legend = document.getElementById(`legend-${category.id}`); // This line selects the DOM element for the legend container corresponding to the current category using its unique ID (constructed as "legend-" followed by the category ID). The selected element is assigned to the variable "legend", which will be used to display the legend for the map based on the selected CDC measure and its corresponding data values. The legend will help users understand the color coding and data representation on the map for this category.
        const summary = document.getElementById(`summary-${category.id}`); // This line selects the DOM element for the summary container corresponding to the current category using its unique ID (constructed as "summary-" followed by the category ID). The selected element is assigned to the variable "summary", which will be used to display summary information about the data being visualized on the map for this category. The summary may include statistics, insights, or explanations related to the selected CDC measure and the spatial patterns observed in the map.
        const comparison = document.getElementById(`comparison-${category.id}`); // This line selects the DOM element for the comparison panel container corresponding to the current category using its unique ID (constructed as "comparison-" followed by the category ID). The selected element is assigned to the variable "comparison", which will be used to display information when users select census tracts on the map for comparison. The comparison panel will show details about the selected tracts and their values for the chosen CDC measure, allowing users to compare different locations based on the data visualized in this category.

        if (category.disabled) {
            legend.innerHTML = "<b>No active legend.</b> Non-medical-factor columns are not in the Clean_NM CSV.";
            summary.innerHTML = "This row is kept so the page structure mirrors the seven CDC PLACES categories.";
            return;
        } // This block of code checks if the current category is marked as disabled. If it is, it updates the inner HTML of the legend and summary elements to display messages indicating that there is no active legend and providing an explanation for why this category is disabled (i.e., the non-medical-factor columns are not included in the Clean_NM CSV). After updating the content for the disabled category, it returns from the function, meaning that no map will be initialized for this category, and it will skip to the next iteration of the loop for any remaining categories.

        const map = L.map(`map-${category.id}`, {
            scrollWheelZoom: false
        }).setView([34.5, -106.0], 6); // This block of code initializes a Leaflet map for the current category. It creates a new map instance using the "L.map" function, targeting the div element with the ID corresponding to the map container for this category (constructed as "map-" followed by the category ID). The map is initialized with scroll wheel zooming disabled and a default view centered on New Mexico (latitude 34.5, longitude -106.0) with a zoom level of 6. This sets up the initial map interface for this category, allowing users to interact with it and visualize the CDC data based on their selections.

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map); // This block of code initializes a Leaflet map for the current category. It creates a new map instance using the "L.map" function, targeting the div element with the ID corresponding to the map container for this category (constructed as "map-" followed by the category ID). The map is initialized with scroll wheel zooming disabled and a default view centered on New Mexico (latitude 34.5, longitude -106.0) with a zoom level of 6. Then, it adds a tile layer to the map using OpenStreetMap tiles, specifying the maximum zoom level and attribution text. This sets up the base map on which the CDC data will be visualized for this category.
        addNorthArrow(map); // This line calls the "addNorthArrow" function, passing the initialized Leaflet map instance as an argument. The "addNorthArrow" function is responsible for creating and adding a north arrow control to the map, which provides users with orientation and helps them understand the directionality of the map. By calling this function after initializing the map, the application ensures that the north arrow is displayed on the map interface, enhancing the user experience and spatial understanding while interacting with the CDC data visualized on the map.
        L.control.scale({
            position: "bottomleft",
            imperial: true,
            metric: false,
            maxWidth: 100
        }).addTo(map); // This block of code creates a scale control using the Leaflet "L.control.scale" function and adds it to the map. The control is configured to be positioned in the "bottomleft" corner of the map, display distances in imperial units (miles and feet) while hiding metric units, and have a maximum width of 100 pixels. By adding this control to the map, users can easily gauge distances on the map, which can help them better understand the spatial relationships and scales of the CDC data visualized for this category.

        addMouseCoordinates(map); // This line calls the "addMouseCoordinates" function, passing the initialized Leaflet map instance as an argument. The "addMouseCoordinates" function is responsible for creating and adding a control to the map that displays the latitude and longitude coordinates of the mouse cursor as it moves over the map. By calling this function after initializing the map, the application ensures that users can see real-time coordinate information in the specified control on the map interface, enhancing their spatial awareness and interaction with the CDC data visualized on the map.

        const tractLayer = L.geoJson(tractGeojson, {
            style: function (feature) {
                return getFeatureStyle(feature, select.value); // This line defines the style for each feature in the tract GeoJSON layer based on the currently selected variable in the dropdown for this category. The "getFeatureStyle" function is called with the feature and the selected variable (accessed through "select.value") to determine the appropriate styling (such as fill color, opacity, etc.) for that feature on the map. This allows each census tract to be visually represented according to its value for the selected CDC measure, enabling users to easily interpret spatial patterns and differences across tracts based on the data.
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: function (e) {
                        e.target.setStyle({
                            weight: 2.5,
                            color: "#111827"
                        }); // This block of code sets up an event listener for the "mouseover" event on each feature layer in the tract GeoJSON. When a user hovers their mouse over a census tract on the map, this function is triggered, and it updates the style of the target layer (the tract being hovered over) to have a thicker border (weight of 2.5) and a darker color ("#111827"). This visual change provides feedback to the user, highlighting the tract they are currently hovering over and making it easier to identify on the map.
                        e.target.bringToFront(); // This line calls the "bringToFront" method on the target layer (the tract being hovered over) to ensure that it is rendered above other layers on the map. This is important because it prevents the hovered tract from being obscured by adjacent tracts or other map features, allowing users to clearly see the highlighted tract and its boundaries when they hover over it.
                    },
                    mouseout: function (e) {
                        tractLayer.resetStyle(e.target); // This block of code sets up an event listener for the "mouseout" event on each feature layer in the tract GeoJSON. When a user moves their mouse away from a census tract on the map, this function is triggered, and it calls the "resetStyle" method on the "tractLayer" for the target layer (the tract that was previously hovered over). This resets the style of that tract back to its original styling as defined by the "style" function for the layer. This ensures that once the user is no longer hovering over a tract, it returns to its default appearance, maintaining a consistent visual representation of all tracts on the map.
                    },
                    click: function (e) {
                        handleCompareClick(view, feature, e.target); // This block of code sets up an event listener for the "click" event on each feature layer in the tract GeoJSON. When a user clicks on a census tract on the map, this function is triggered, and it calls the "handleCompareClick" function, passing in the current view object (which contains references to the category, select element, legend, summary, comparison panel, map, and tract layer), the feature that was clicked, and the target layer (the tract that was clicked). The "handleCompareClick" function is responsible for managing the logic of selecting tracts for comparison in the comparison panel. It updates the list of selected features for comparison and opens a popup with information about the clicked tract. This allows users to interactively compare different census tracts based on their values for the selected CDC measure.
                    }
                }); // End of the event listeners for mouseover, mouseout, and click events on each feature layer in the tract GeoJSON.
                layer.bindPopup(function () {
                    return buildPopupContent(feature, select.value); // This line binds a popup to each feature layer in the tract GeoJSON. The content of the popup is generated by calling the "buildPopupContent" function, passing in the feature and the currently selected variable (accessed through "select.value"). The "buildPopupContent" function constructs the HTML content for the popup based on the properties of the feature and the selected CDC measure, providing users with detailed information about that specific census tract when they click on it. This enhances the interactivity of the map and allows users to explore the data in more depth by viewing specific values and details for each tract.
                }); // End of the "onEachFeature" function that defines the event listeners and popup content for each feature layer in the tract GeoJSON.
            }
        }).addTo(map); // This line creates a new Leaflet GeoJSON layer using the "L.geoJson" function, passing in the "tractGeojson" data and the defined style and event listeners for each feature. The resulting layer is then added to the map using the "addTo" method, allowing the census tract geometries to be displayed on the map with the appropriate styling and interactivity based on the selected CDC measure for this category.

        L.geoJson(countyGeojson, {
            style: {
                color: "#252525",
                weight: 1,
                fillOpacity: 0,
                opacity: 0.7
            },
            interactive: false
        }).addTo(map); // This block of code creates a new Leaflet GeoJSON layer for the county boundaries using the "L.geoJson" function, passing in the "countyGeojson" data. The style for this layer is defined with a specific color ("#252525"), weight (1), fill opacity (0), and overall opacity (0.7). The "interactive" option is set to false, meaning that users will not be able to interact with the county boundaries (e.g., no hover or click events). This layer is then added to the map using the "addTo" method, allowing the county boundaries to be displayed on top of the tract layer, providing additional geographic context for users as they explore the CDC data visualized on the map.

        try {
            map.fitBounds(tractLayer.getBounds(), { padding: [10, 10] });
        } catch (error) {
            map.setView([34.5, -106.0], 6);
        }

        const view = { category, select, legend, summary, comparison, map, tractLayer };
        categoryViews.push(view); // This line creates a new view object that contains references to the current category, select element, legend container, summary container, comparison panel, map instance, and tract layer for this category. This view object is then pushed into the "categoryViews" array, which will hold the state and references for all category views on the page. By storing these references in the "categoryViews" array, the application can easily access and update the relevant elements and map layers for each category when users interact with the dropdowns or click on the map for comparisons.

        select.addEventListener("change", function () {
            selectedCompareFeatures[category.id] = []; // This line resets the list of selected features for comparison for the current category when the user changes the selected variable in the dropdown. By setting "selectedCompareFeatures[category.id]" to an empty array, it ensures that any previously selected tracts for comparison are cleared out, allowing users to start fresh with their comparisons based on the new variable they have selected. This is important because different variables may have different values for the same tracts, and it prevents confusion by ensuring that comparisons are relevant to the currently selected measure.
            updateCategoryView(view); // This line calls the "updateCategoryView" function, passing in the current view object for this category. The "updateCategoryView" function is responsible for updating the styling of the tract layer, the content of the popups, the legend, and the summary based on the newly selected variable in the dropdown. By calling this function after resetting the selected features for comparison, it ensures that the map and related elements are updated to reflect the new variable selection, providing users with an accurate and relevant visualization of the CDC data for this category.
            updateComparisonPanel(view); // This line calls the "updateComparisonPanel" function, passing in the current view object for this category. The "updateComparisonPanel" function is responsible for updating the content of the comparison panel based on the currently selected variable and the list of selected features for comparison. By calling this function after resetting the selected features and updating the category view, it ensures that the comparison panel is also updated to reflect the new variable selection and any changes in the selected tracts for comparison, providing users with accurate and relevant information in the comparison panel based on their interactions with the dropdown and map.
            renderDataTable(); // This line calls the "renderDataTable" function, which is responsible for rendering or updating the data table that displays the CDC data in a tabular format. By calling this function after the user changes the selected variable in the dropdown, it ensures that the data table is updated to reflect the new variable selection, allowing users to see the relevant data values for the selected measure in a tabular format alongside the map visualization. This enhances the user's ability to explore and analyze the CDC data by providing both spatial and tabular representations of the information.
        }); // End of the event listener for changes to the select dropdown that updates the category view, comparison panel, and data table based on the new variable selection.

        updateCategoryView(view); // This line calls the "updateCategoryView" function for the current view object immediately after initializing the map and setting up the event listeners. This ensures that the map, popups, legend, and summary are all updated to reflect the default variable selection for this category when the page first loads. By calling this function at the end of the initialization process for each category, it guarantees that users will see a properly styled and informative map visualization for each category right from the start, without needing to interact with the dropdowns first.
    }); // End of the loop that iterates over each category in the "CDC_CATEGORIES" array and initializes the Leaflet map, layers, controls, and event listeners for each category view.
} // End of the "initializeAllCategoryViews" function that sets up the maps and interactions for all categories defined in the "CDC_CATEGORIES" array.

function updateCategoryView(view) {
    view.tractLayer.setStyle(function (feature) {
        return getFeatureStyle(feature, view.select.value);
    }); // This line updates the style of the tract layer for the current view based on the newly selected variable in the dropdown. It calls the "setStyle" method on the "tractLayer", passing in a function that takes a feature as an argument and returns the appropriate style for that feature based on the selected variable (accessed through "view.select.value"). This ensures that when a user changes the selected variable, the map is updated to reflect the new styling for each census tract according to its value for the newly selected CDC measure.

    view.tractLayer.eachLayer(function (layer) {
        layer.bindPopup(function () {
            return buildPopupContent(layer.feature, view.select.value);
        }); // This block of code iterates over each layer in the "tractLayer" using the "eachLayer" method. For each layer (which represents a census tract), it re-binds the popup content by calling the "bindPopup" method with a function that generates the popup content based on the feature associated with that layer and the newly selected variable (accessed through "view.select.value"). This ensures that when a user changes the selected variable, the popups for each tract are updated to display information relevant to the new variable, providing users with accurate and up-to-date information when they click on a tract after changing the selection.
    }); // End of the iteration over each layer in the tract layer to update the popup content based on the new variable selection.

    renderLegend(view.legend, view.select.value); // This line calls the "renderLegend" function, passing in the legend container element for the current view and the newly selected variable (accessed through "view.select.value"). The "renderLegend" function is responsible for generating and displaying the legend for the map based on the selected variable and its corresponding data values. By calling this function after a user changes the selected variable, it ensures that the legend is updated to reflect the new variable selection, providing users with an accurate guide to understanding the color coding and data representation on the map for this category.
    renderSummary(view.summary, view.select.value); // This line calls the "renderSummary" function, passing in the summary container element for the current view and the newly selected variable (accessed through "view.select.value"). The "renderSummary" function is responsible for generating and displaying summary information about the data being visualized on the map for this category based on the selected variable. By calling this function after a user changes the selected variable, it ensures that the summary is updated to reflect the new variable selection, providing users with relevant statistics, insights, or explanations related to the selected CDC measure and the spatial patterns observed in the map for this category.
} // End of the "updateCategoryView" function that updates the map styling, popups, legend, and summary based on the selected variable for a given category view.
function handleCompareClick(view, feature, layer) {
    const categoryId = view.category.id; // This line retrieves the unique ID of the current category from the view object and assigns it to the variable "categoryId". This ID is used to manage the state of selected features for comparison specific to this category, allowing the application to keep track of which tracts have been selected for comparison within each category independently.

    if (!selectedCompareFeatures[categoryId]) {
        selectedCompareFeatures[categoryId] = []; // This line checks if there is already an array initialized for storing selected features for comparison for the current category (using the "categoryId" as the key). If it does not exist, it initializes it as an empty array. This ensures that there is a dedicated array to store the selected features for comparison for each category, allowing users to select and compare tracts within each category without interference from selections made in other categories.
    }

    const row = getRowForFeature(feature); // This line calls the "getRowForFeature" function, passing in the feature that was clicked on the map. The "getRowForFeature" function retrieves the corresponding data row from the CDC dataset based on the GEOID of the feature. The resulting row is assigned to the variable "row". This row contains the data values for the specific census tract that was clicked, which will be used to display information in the comparison panel and manage the selection of features for comparison.

    if (!row) {
        layer.openPopup(); // This line opens the popup for the clicked layer (census tract) if the corresponding data row could not be found in the CDC dataset. This provides feedback to the user that there is no data available for that specific tract, allowing them to understand why it cannot be selected for comparison or why it may not have a value displayed on the map.
        return; // This line exits the function early if the corresponding data row for the clicked feature could not be found. This prevents any further processing or attempts to add the feature to the comparison selection if there is no data available for that tract, ensuring that the application handles this case gracefully without errors.
    }

    const selectedList = selectedCompareFeatures[categoryId]; // This line retrieves the array of selected features for comparison for the current category (using the "categoryId" as the key). This array will be used to manage the selection of features for comparison within each category.

    if (selectedList.length === 2) {
        selectedList.length = 0; // This line checks if the length of the "selectedList" array is equal to 2, which means that two features have already been selected for comparison. If this condition is true, it resets the length of the array to 0, effectively clearing the selection of features for comparison. This allows users to start a new comparison by selecting two new tracts after they have already compared two tracts, ensuring that only two tracts can be compared at a time and providing a clear way to reset the comparison selection.
    }

    selectedList.push(feature); // This line adds the currently clicked feature to the "selectedList" array for comparison. This allows users to select up to two features (census tracts) for comparison in the comparison panel. By pushing the clicked feature into the array, it updates the state of selected features for comparison, which will be used to display information about the selected tracts in the comparison panel and manage the logic of comparing their values for the selected CDC measure.

    layer.openPopup(); // This line opens the popup for the clicked layer (census tract) after it has been added to the comparison selection. This provides immediate feedback to the user about the tract they have selected for comparison, allowing them to see the relevant information in the popup and understand which tract they have chosen before proceeding to select a second tract for comparison.
    updateComparisonPanel(view); // This line calls the "updateComparisonPanel" function, passing in the current view object for this category. The "updateComparisonPanel" function is responsible for updating the content of the comparison panel based on the currently selected variable and the list of selected features for comparison. By calling this function after a user clicks on a tract and adds it to the comparison selection, it ensures that the comparison panel is updated to reflect the new selection, providing users with accurate and relevant information about the selected tracts and their values for the chosen CDC measure, allowing them to compare different locations effectively.
} // End of the "handleCompareClick" function that manages the logic of selecting features for comparison and updating the comparison panel based on user interactions with the map.

function updateComparisonPanel(view) {
    const selectedList = selectedCompareFeatures[view.category.id] || []; // This line retrieves the array of selected features for comparison for the current category from the "selectedCompareFeatures" object using the category ID as the key. If there is no array initialized for that category, it defaults to an empty array. This allows the function to manage the state of selected features for comparison specific to each category and ensures that it can safely access the list of selected features without encountering undefined values.
    const measureField = view.select.value; // This line retrieves the currently selected variable (measure) from the dropdown for the current view and assigns it to the variable "measureField". This variable will be used to access the corresponding data values for the selected tracts in the comparison panel, allowing the function to display relevant information based on the user's selection of the CDC measure for this category.
    const label = getMeasureLabel(measureField); // This line calls the "getMeasureLabel" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getMeasureLabel" function returns a human-readable label for the selected measure, which is assigned to the variable "label". This label will be used in the comparison panel to provide a clear and descriptive title for the information being compared, enhancing the user's understanding of what is being displayed in the comparison panel based on their selection of the CDC measure for this category.

    if (selectedList.length === 0) {
        view.comparison.innerHTML = `
            <b>Compare two locations</b><br>
            Click two census tracts on the map to compare their values.
        `; // This block of code checks if the length of the "selectedList" array is 0, which means that no features have been selected for comparison. If this condition is true, it updates the inner HTML of the comparison panel to display a prompt for the user to click on two census tracts on the map to compare their values. This provides guidance to users on how to use the comparison feature when they have not yet selected any tracts for comparison, ensuring that they understand the steps needed to compare different locations based on the selected CDC measure for this category.
        return; // This block of code checks if the length of the "selectedList" array is 0, which means that no features have been selected for comparison. If this condition is true, it updates the inner HTML of the comparison panel to display a prompt for the user to click on two census tracts on the map to compare their values. This provides guidance to users on how to use the comparison feature when they have not yet selected any tracts for comparison, ensuring that they understand the steps needed to compare different locations based on the selected CDC measure for this category.
    }

    if (selectedList.length === 1) {
        const row1 = getRowForFeature(selectedList[0]); // This line retrieves the corresponding data row for the first selected feature in the "selectedList" array by calling the "getRowForFeature" function with the first feature (accessed as "selectedList[0]"). The resulting row is assigned to the variable "row1". This row contains the data values for the specific census tract that was first selected for comparison, which will be used to display information in the comparison panel and provide context for when the user selects a second tract for comparison.

        view.comparison.innerHTML = `
            <b>Compare two locations</b><br>
            First location selected:<br>
            ${row1.CountyName} County, Tract ${row1.TractFIPS}<br>
            <b>${label}:</b> ${formatPercent(row1[measureField + "_number"])}<br><br>
            Now click a second tract to compare.
        `; // This block of code updates the inner HTML of the comparison panel to display information about the first selected location for comparison. It includes the county name, tract FIPS code, and the value for the selected measure (formatted as a percentage) for the first selected tract. It also prompts the user to click a second tract to complete the comparison. This provides users with immediate feedback about their first selection and guides them on how to proceed with selecting a second tract for comparison based on the selected CDC measure for this category.
        return; // This line exits the function early if only one feature has been selected for comparison. This allows the function to wait until a second feature is selected before attempting to perform the comparison and display the results in the comparison panel, ensuring that users are guided through the process of selecting two tracts for comparison before any comparison information is displayed.
    } // At this point, we know that there are exactly two features in the "selectedList" array for comparison, so we can proceed with retrieving their data and calculating the comparison values.

    const row1 = getRowForFeature(selectedList[0]); // This line retrieves the corresponding data row for the first selected feature in the "selectedList" array by calling the "getRowForFeature" function with the first feature (accessed as "selectedList[0]"). The resulting row is assigned to the variable "row1". This row contains the data values for the specific census tract that was first selected for comparison, which will be used to display information in the comparison panel and provide context for when the user selects a second tract for comparison.
    const row2 = getRowForFeature(selectedList[1]); // This line retrieves the corresponding data row for the second selected feature in the "selectedList" array by calling the "getRowForFeature" function with the second feature (accessed as "selectedList[1]"). The resulting row is assigned to the variable "row2". This row contains the data values for the specific census tract that was second selected for comparison, which will be used to display information in the comparison panel and allow users to compare it against the first selected tract based on the selected CDC measure for this category.

    const value1 = row1[measureField + "_number"]; // This line retrieves the value for the selected measure (accessed using "measureField + '_number'") from the first selected row (row1) and assigns it to the variable "value1". This value represents the data for the first selected tract for the currently selected CDC measure, which will be used in the comparison panel to show the value for the first location and to calculate the difference when compared to the second selected tract.
    const value2 = row2[measureField + "_number"]; // This line retrieves the value for the selected measure (accessed using "measureField + '_number'") from the second selected row (row2) and assigns it to the variable "value2". This value represents the data for the second selected tract for the currently selected CDC measure, which will be used in the comparison panel to show the value for the second location and to calculate the difference when compared to the first selected tract.
    const difference = value2 - value1; // This line calculates the difference between the value of the second selected tract (value2) and the value of the first selected tract (value1) for the currently selected CDC measure. The result is assigned to the variable "difference". This difference will be used in the comparison panel to show how much higher or lower the second location's value is compared to the first location, providing users with a clear comparison of the two selected tracts based on the chosen CDC measure for this category.

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
    `; // This block of code updates the inner HTML of the comparison panel to display a detailed comparison between the two selected locations for the chosen CDC measure. It includes a table that shows the county name, tract FIPS code, and value for both the first and second selected tracts. It also calculates and displays the absolute difference between the two values and indicates whether the second location is higher or lower than the first. Finally, it prompts users to click another tract to start a new comparison, providing a clear and informative comparison of the two selected tracts based on the selected CDC measure for this category.
} // End of the "updateComparisonPanel" function that manages the content of the comparison panel based on the selected features and the chosen CDC measure for this category.

function getFeatureStyle(feature, measureField) {
    const row = getRowForFeature(feature); // This line calls the "getRowForFeature" function, passing in the feature for which the style is being determined. The "getRowForFeature" function retrieves the corresponding data row from the CDC dataset based on the GEOID of the feature. The resulting row is assigned to the variable "row". This row contains the data values for the specific census tract represented by the feature, which will be used to determine the appropriate styling (such as fill color and opacity) for that tract on the map based on its value for the selected CDC measure.
    const value = row ? row[measureField + "_number"] : null; // This line retrieves the value for the selected measure (accessed using "measureField + '_number'") from the retrieved row if it exists. If the row is null (which means there was no matching data for the feature), it assigns null to the variable "value". This value will be used to determine the fill color and opacity for the feature on the map based on its value for the selected CDC measure, allowing for appropriate styling even when there is no data available for a particular tract.
    const breaks = getBreaksForMeasure(measureField); // This line calls the "getBreaksForMeasure" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getBreaksForMeasure" function calculates and returns the quantile breaks for the values of the selected measure across all census tracts. These breaks are used to determine how to classify the values for styling purposes on the map, allowing for a consistent color scheme based on the distribution of values for the selected CDC measure.

    return {
        fillColor: getColorForValue(value, breaks),
        weight: 0.5,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: value === null ? 0.45 : 0.78
    }; // This block of code returns an object that defines the style for the given feature based on its value for the selected CDC measure. The "fillColor" is determined by calling the "getColorForValue" function, which takes the value and the calculated breaks to determine the appropriate color from the color scheme. The "weight", "opacity", and "color" properties define the border styling for the feature, while the "fillOpacity" is set to a lower value (0.45) if there is no data (value is null) and a higher value (0.78) if there is valid data. This styling allows for a clear visual representation of the data on the map, with different colors indicating different ranges of values for the selected CDC measure and a distinct appearance for tracts with no data.
} // End of the "getFeatureStyle" function that determines the styling for a given feature based on its value for the selected CDC measure and the calculated breaks for that measure.

function getRowForFeature(feature) {
    const geoid = String(feature.properties.GEOID || "").trim(); // This line retrieves the GEOID from the properties of the input feature, ensuring that it is treated as a string and trimming any whitespace. The GEOID is a unique identifier for each census tract, and it is used to look up the corresponding data row in the CDC dataset. By converting it to a string and trimming it, the function ensures that the GEOID is in a consistent format for accurate lookup in the "cdcByTractFips" map, which maps GEOIDs to their respective data rows from the CDC dataset.
    return cdcByTractFips.get(geoid) || null; // This line retrieves the GEOID from the properties of the input feature, ensuring that it is treated as a string and trimming any whitespace. It then uses this GEOID to look up the corresponding data row in the "cdcByTractFips" map, which is a mapping of GEOIDs to their respective data rows from the CDC dataset. If a matching row is found, it is returned; otherwise, null is returned to indicate that there is no corresponding data for that feature. This function allows the application to efficiently retrieve the relevant data for each census tract feature on the map based on its GEOID, enabling accurate styling and information display based on the CDC dataset.
} // This function takes a GeoJSON feature as input and retrieves the corresponding data row from the CDC dataset based on the GEOID property of the feature. It first extracts the GEOID from the feature's properties, ensuring it is a string and trimming any whitespace. Then, it uses this GEOID to look up the corresponding row in the "cdcByTractFips" map, which is a mapping of GEOIDs to their respective data rows from the CDC dataset. If a matching row is found, it is returned; otherwise, null is returned to indicate that there is no corresponding data for that feature.

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
        .sort(function (a, b) { return a - b; }); // This block of code defines the "getValuesForMeasure" function, which takes a measure field as input and retrieves the corresponding values for that measure across all census tracts from the CDC dataset. It does this by mapping over the "cdcRows" array, extracting the value for the specified measure (accessed using "measureField + '_number'") from each row. It then filters out any values that are null or not finite numbers to ensure that only valid numeric values are included. Finally, it sorts the resulting array of values in ascending order before returning it. This sorted array of values is used to calculate quantile breaks for classification and styling on the map based on the distribution of values for the selected CDC measure.
} // This function takes a measure field (representing a selected CDC measure) as input and retrieves the corresponding values for that measure across all census tracts from the CDC dataset. It does this by mapping over the "cdcRows" array, extracting the value for the specified measure (accessed using "measureField + '_number'") from each row. It then filters out any values that are null or not finite numbers to ensure that only valid numeric values are included. Finally, it sorts the resulting array of values in ascending order before returning it. This sorted array of values is used to calculate quantile breaks for classification and styling on the map based on the distribution of values for the selected CDC measure.

function getBreaksForMeasure(measureField) {
    const values = getValuesForMeasure(measureField); // This line calls the "getValuesForMeasure" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getValuesForMeasure" function retrieves the corresponding values for that measure across all census tracts from the CDC dataset, filters out invalid values, and returns a sorted array of valid numeric values. The resulting array is assigned to the variable "values", which will be used to calculate the quantile breaks for classification and styling on the map based on the distribution of values for the selected CDC measure.
    if (values.length === 0) return []; // This line checks if the length of the "values" array is 0, which means that there are no valid values available for the specified measure across all census tracts. If this condition is true, it returns an empty array, indicating that there are no breaks to calculate for this measure. This prevents any further processing or attempts to calculate quantile breaks when there is no data available, ensuring that the application can handle this case gracefully without errors.

    const breaks = []; // This line initializes an empty array called "breaks" that will be used to store the calculated quantile break values for the specified measure. As the function iterates through the desired number of classes (defined by "MAP_CLASS_COUNT"), it will calculate the corresponding quantile value for each class and push it into this "breaks" array. This array of breaks will then be used for classifying and styling the map based on the distribution of values for the selected CDC measure.
    for (let i = 1; i <= MAP_CLASS_COUNT; i++) {
        breaks.push(quantile(values, i / MAP_CLASS_COUNT)); // This line iterates from 1 to "MAP_CLASS_COUNT" (inclusive) to calculate the quantile break values for the specified measure. For each iteration, it calls the "quantile" function, passing in the sorted array of values and the quantile proportion (calculated as "i / MAP_CLASS_COUNT"). The resulting quantile value is then pushed into the "breaks" array. This process calculates the break points that will be used to classify the values for styling on the map, allowing for a consistent color scheme based on the distribution of values for the selected CDC measure.
    } // End of the loop that calculates quantile break values for the specified measure based on the sorted array of values and the defined number of classes for styling on the map.
    return breaks; // This line returns the array of quantile break values that were calculated for the specified measure. These breaks are used for classifying and styling the map based on the distribution of values for the selected CDC measure, allowing for a meaningful visualization of the data across different census tracts.
} // This function takes a measure field as input and calculates the quantile breaks for that measure based on the values retrieved from the "getValuesForMeasure" function. It first retrieves the sorted array of values for the specified measure. If there are no valid values, it returns an empty array. Otherwise, it calculates the quantile breaks by iterating from 1 to "MAP_CLASS_COUNT" (which represents the number of classes for styling) and pushing the corresponding quantile value into the "breaks" array using the "quantile" function. Finally, it returns the array of quantile breaks, which is used for classifying and styling the map based on the distribution of values for the selected CDC measure.

function quantile(sortedValues, p) {
    if (sortedValues.length === 0) return null; // This line checks if the length of the "sortedValues" array is 0, which means that there are no values available to calculate the quantile. If this condition is true, it returns null, indicating that the quantile cannot be calculated due to the absence of data. This prevents any further processing or attempts to calculate a quantile value when there is no data available, ensuring that the application can handle this case gracefully without errors.
    const index = (sortedValues.length - 1) * p; // This line calculates the index corresponding to the quantile proportion "p" by multiplying the length of the "sortedValues" array minus one by "p". The resulting index may be a non-integer value, which indicates that the quantile value lies between two values in the sorted array. This index will be used to determine the lower and upper bounds for interpolation when calculating the quantile value based on the distribution of values in the sorted array.
    const lower = Math.floor(index); // This line calculates the lower index by taking the floor of the calculated "index". The lower index represents the position in the sorted array that is at or just below the quantile proportion "p". This index will be used to retrieve the value from the sorted array that serves as the lower bound for interpolation when calculating the quantile value.
    const upper = Math.ceil(index); // This line calculates the upper index by taking the ceiling of the calculated "index". The upper index represents the position in the sorted array that is at or just above the quantile proportion "p". This index will be used to retrieve the value from the sorted array that serves as the upper bound for interpolation when calculating the quantile value. If the "index" is an integer, then the lower and upper indices will be the same, and the quantile value will correspond directly to that index in the sorted array. If the "index" is not an integer, then linear interpolation will be performed between the values at the lower and upper indices to calculate the quantile value.
    if (lower === upper) return sortedValues[lower]; // This line checks if the lower and upper indices are the same, which means that the quantile proportion "p" corresponds exactly to a value in the sorted array. If this condition is true, it returns the value at that index in the sorted array as the quantile value. This is a direct case where no interpolation is needed because the quantile falls exactly on a value in the dataset.
    return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower); // This line performs linear interpolation to calculate the quantile value when the "index" is not an integer, meaning that the quantile proportion "p" falls between two values in the sorted array. It calculates the quantile value by taking the value at the lower index and adding the difference between the values at the upper and lower indices multiplied by the fractional part of the "index" (calculated as "index - lower"). This allows for a more accurate estimation of the quantile value based on the distribution of values in the sorted array, providing a smooth transition between values when classifying data for styling on the map based on the selected CDC measure.
} // This function calculates the quantile value for a given sorted array of values and a quantile proportion "p". It first checks if the input array is empty and returns null if it is. Then, it calculates the index corresponding to the quantile by multiplying the length of the sorted array minus one by "p". It determines the lower and upper indices by taking the floor and ceiling of the calculated index, respectively. If the lower and upper indices are the same, it returns the value at that index. Otherwise, it performs linear interpolation between the values at the lower and upper indices to calculate and return the quantile value corresponding to "p". This function is used to calculate quantile breaks for classifying values on the map based on their distribution for a selected CDC measure.

function getColorForValue(value, breaks) {
    if (value === null || !Number.isFinite(value) || breaks.length === 0) return NO_DATA_COLOR;
    for (let i = 0; i < breaks.length; i++) {
        if (value <= breaks[i]) return CDC_COLOR_SCHEME[i]; // This line checks if the input "value" is null, not a finite number, or if the "breaks" array is empty. If any of these conditions are true, it returns a predefined color (NO_DATA_COLOR) to indicate that there is no valid data for this value. This ensures that features with missing or invalid data are styled consistently on the map, providing a clear visual indication of where data is not available for the selected CDC measure.
    } // This line iterates through the "breaks" array, which contains the quantile break values for the selected CDC measure. For each break value, it checks if the input "value" is less than or equal to that break. If this condition is true, it returns the corresponding color from the "CDC_COLOR_SCHEME" array based on the index of the break. This allows for classifying the value into a specific range defined by the breaks and assigning an appropriate color for styling on the map, providing a visual representation of how the value compares to the distribution of values for the selected CDC measure.
    return CDC_COLOR_SCHEME[CDC_COLOR_SCHEME.length - 1]; // If the input "value" is greater than all the break values in the "breaks" array, this line returns the last color in the "CDC_COLOR_SCHEME" array. This means that values that exceed the highest break will be styled with the color representing the highest range, ensuring that all values are classified and styled appropriately on the map based on their position relative to the calculated quantile breaks for the selected CDC measure.
} // This function takes a value and an array of break values as input and returns the appropriate color for styling based on where the value falls in relation to the breaks. It first checks if the value is null, not a finite number, or if there are no breaks available, in which case it returns a predefined color to indicate no data. Then, it iterates through the breaks to determine which range the value falls into and returns the corresponding color from the color scheme. If the value exceeds all break values, it returns the color representing the highest range. This function is used to determine the fill color for features on the map based on their values for the selected CDC measure and the calculated quantile breaks.

function renderLegend(container, measureField) {
    const label = getMeasureLabel(measureField); // This line calls the "getMeasureLabel" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getMeasureLabel" function returns a human-readable label for the selected measure, which is assigned to the variable "label". This label will be used in the legend to provide a clear and descriptive title for the information being represented by the colors on the map, enhancing the user's understanding of what the legend represents based on their selection of the CDC measure for this category.
    const breaks = getBreaksForMeasure(measureField); // This line calls the "getBreaksForMeasure" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getBreaksForMeasure" function calculates and returns the quantile breaks for the values of the selected measure across all census tracts. These breaks are used to determine how to classify the values for styling purposes on the map, and they will also be used to generate the legend that explains the color coding based on the distribution of values for the selected CDC measure.
    if (breaks.length === 0) {
        container.innerHTML = `<b>No data available for ${label}.</b>`; // This line checks if the length of the "breaks" array is 0, which means that there are no valid values available for the specified measure across all census tracts. If this condition is true, it updates the inner HTML of the legend container to display a message indicating that there is no data available for the selected measure. This provides feedback to users when they select a measure that has no valid data, ensuring that they understand why the legend cannot be displayed and preventing confusion about the absence of color classifications on the map for that measure.
        return; // This line exits the function early if there are no breaks available for the specified measure, which means that there is no valid data to classify and style on the map. By returning at this point, it prevents any further processing or attempts to generate a legend when there is no data available, ensuring that the application can handle this case gracefully without errors and providing clear feedback to users about the lack of data for the selected CDC measure.
    } // At this point, we know that there are valid breaks available for the specified measure, so we can proceed with generating the legend based on those breaks and the corresponding colors.

    let previous = null; // This line initializes a variable called "previous" and sets it to null. This variable will be used to keep track of the previous break value as the function iterates through the "breaks" array to generate the legend items. By starting with null, it allows the function to handle the first break value appropriately when generating the legend, ensuring that the range for the first class is displayed correctly (e.g., "lowest – breakValue") and that subsequent classes are displayed with their respective ranges based on the current and previous break values.
    let html = `<div class="cdc-legend-title">${label}: crude prevalence (%)</div>`; // This line initializes a variable called "html" with a string that contains the HTML for the legend title. It uses a div with the class "cdc-legend-title" to style the title, and it includes the label for the selected measure followed by a description of what the values represent (in this case, "crude prevalence (%)"). This title will be displayed at the top of the legend to provide context for the color classifications that will be generated based on the breaks for the selected CDC measure.

    breaks.forEach(function (breakValue, index) {
        const color = CDC_COLOR_SCHEME[index]; // This line iterates through the "breaks" array using the "forEach" method, which provides both the break value and its index in the array. For each break value, it retrieves the corresponding color from the "CDC_COLOR_SCHEME" array using the index. This color will be used to create a legend item that represents the range of values up to that break, allowing users to understand how the colors on the map correspond to different ranges of values for the selected CDC measure.
        const fromText = previous === null ? "lowest" : previous.toFixed(1); // This line determines the text to display for the lower bound of the range in the legend item. If "previous" is null (which means this is the first break), it sets "fromText" to "lowest" to indicate that the range starts from the lowest values. Otherwise, it formats the previous break value to one decimal place using "toFixed(1)" and assigns it to "fromText". This allows the legend to display a clear and descriptive range for each class based on the current and previous break values, enhancing users' understanding of how the colors correspond to different ranges of values for the selected CDC measure.
        const toText = breakValue.toFixed(1); // This line formats the current break value to one decimal place using "toFixed(1)" and assigns it to the variable "toText". This formatted value will be used in the legend item to indicate the upper bound of the range for the current class. By formatting it to one decimal place, it provides a clear and concise representation of the break value in the legend, making it easier for users to understand the ranges of values that correspond to each color classification on the map for the selected CDC measure.
        html += `
            <div class="cdc-legend-item">
                <span class="cdc-swatch" style="background:${color}"></span>
                <span>${fromText} – ${toText}</span>
            </div>`; // This block of code appends a new legend item to the "html" variable for each break value. It creates a div with the class "cdc-legend
        previous = breakValue; // This line appends a new legend item to the "html" variable for each break value. It creates a div with the class "cdc-legend
    }); // This block of code iterates through the "breaks" array to generate legend items for each break value. For each break, it retrieves the corresponding color from the color scheme, determines the text for the lower and upper bounds of the range, and appends a new legend item to the "html" variable. Each legend item consists of a colored swatch and a label indicating the range of values that correspond to that color on the map. After processing all breaks, it updates the "previous" variable to keep track of the current break value for use in the next iteration.

    html += `
        <div class="cdc-legend-item">
            <span class="cdc-swatch" style="background:${NO_DATA_COLOR}"></span>
            <span>No data / no CSV match</span>
        </div>`; // This block of code appends an additional legend item to the "html" variable to represent the case where there is no data available or no matching CSV row for a census tract. It creates a div with the class "cdc-legend

    container.innerHTML = html; // This line sets the inner HTML of the legend container to the generated "html" string, which includes the legend title and all the legend items corresponding to the breaks for the selected CDC measure, as well as an item for cases with no data. This updates the legend displayed on the map to reflect the current selection of the CDC measure and provides users with a clear understanding of how the colors on the map correspond to different ranges of values for that measure, as well as indicating where data is not available.
} // This function takes a container element and a measure field as input and generates the HTML for the legend based on the quantile breaks for the specified measure. It retrieves the label for the measure, calculates the breaks, and constructs the legend items with corresponding colors and value ranges. If there are no breaks (i.e., no valid data), it displays a message indicating that no data is available for that measure. Finally, it updates the inner HTML of the container to display the generated legend.

function renderSummary(container, measureField) {
    const label = getMeasureLabel(measureField); // This line calls the "getMeasureLabel" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getMeasureLabel" function returns a human-readable label for the selected measure, which is assigned to the variable "label". This label will be used in the summary to provide a clear and descriptive title for the information being summarized, enhancing the user's understanding of what the summary represents based on their selection of the CDC measure for this category.
    const values = getValuesForMeasure(measureField); // This line calls the "getValuesForMeasure" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getValuesForMeasure" function retrieves the corresponding values for that measure across all census tracts from the CDC dataset, filters out invalid values, and returns a sorted array of valid numeric values. The resulting array is assigned to the variable "values", which will be used to calculate summary statistics such as the minimum, median, and maximum values for the selected CDC measure across all census tracts, providing users with a quick overview of the distribution of values for that measure.
    if (values.length === 0) {
        container.innerHTML = `No valid values are available for <b>${label}</b>.`; // This line checks if the length of the "values" array is 0, which means that there are no valid values available for the specified measure across all census tracts. If this condition is true, it updates the inner HTML of the summary container to display a message indicating that there are no valid values available for the selected measure. This provides feedback to users when they select a measure that has no valid data, ensuring that they understand why the summary cannot be displayed and preventing confusion about the absence of summary statistics for that measure.
        return; // This line exits the function early if there are no valid values available for the specified measure, which means that there is no data to calculate summary statistics from. By returning at this point, it prevents any further processing or attempts to calculate and display summary statistics when there is no data available, ensuring that the application can handle this case gracefully without errors and providing clear feedback to users about the lack of valid data for the selected CDC measure.
    }

    const min = values[0]; // This line retrieves the minimum value from the sorted "values" array, which is the first element (index 0) since the array is sorted in ascending order. The minimum value represents the lowest value for the selected CDC measure across all census tracts, providing users with insight into the lower end of the distribution of values for that measure.
    const median = quantile(values, 0.5); // This line calculates the median value for the selected CDC measure by calling the "quantile" function with the sorted "values" array and a quantile proportion of 0.5. The median represents the middle value in the distribution of values for that measure across all census tracts, providing users with insight into the central tendency of the data for that measure.
    const max = values[values.length - 1]; // This line retrieves the maximum value from the sorted "values" array, which is the last element (index "values.length - 1") since the array is sorted in ascending order. The maximum value represents the highest value for the selected CDC measure across all census tracts, providing users with insight into the upper end of the distribution of values for that measure.

    container.innerHTML = `
        <b>${label}</b> across ${values.length} New Mexico census tracts:
        min ${min.toFixed(1)}%, median ${median.toFixed(1)}%, max ${max.toFixed(1)}%.
    `; // This block of code updates the inner HTML of the summary container to display a summary of the values for the selected CDC measure across all census tracts. It includes the label for the measure, the number of valid values available, and the calculated minimum, median, and maximum values formatted to one decimal place. This summary provides users with a quick overview of the distribution of values for the selected CDC measure, allowing them to understand the range and central tendency of the data for that measure across New Mexico census tracts.
} // This function takes a container element and a measure field as input and generates a summary of the values for the specified measure across all census tracts. It retrieves the label for the measure, gets the valid values, and calculates the minimum, median, and maximum values. If there are no valid values, it displays a message indicating that no valid data is available. Otherwise, it updates the inner HTML of the container to display a summary of the distribution of values for the selected CDC measure, providing users with insight into the range and central tendency of the data for that measure.

function getMeasureLabel(measureField) {
    for (const category of CDC_CATEGORIES) {
        for (const measure of category.variables) {
            if (measure.field === measureField) return measure.label; // This block of code defines the "getMeasureLabel" function, which takes a measure field as input and searches through the "CDC_CATEGORIES" array to find the corresponding label for that measure. It iterates through each category and its variables, checking if the "field" property of each measure matches the input "measureField". If a match is found, it returns the "label" property of that measure, which is a human-readable description of the measure. This function allows the application to display meaningful labels for the selected CDC measures in the legend, summary, and popup content based on the internal field names used in the dataset.
        }
    } // This block of code defines the "getMeasureLabel" function, which takes a measure field as input and searches through the "CDC_CATEGORIES" array to find the corresponding label for that measure. It iterates through each category and its variables, checking if the "field" property of each measure matches the input "measureField". If a match is found, it returns the "label" property of that measure, which is a human-readable description of the measure. This function allows the application to display meaningful labels for the selected CDC measures in the legend, summary, and popup content based on the internal field names used in the dataset.
    return measureField; // If no matching measure is found in the "CDC_CATEGORIES" array, this line returns the input "measureField" as a fallback. This means that if the function cannot find a corresponding label for the given measure field, it will simply return the field name itself. This ensures that the application can still display something meaningful in cases where the measure field does not have a defined label in the categories, preventing errors and providing a default display value based on the internal field name.
} // This function takes a measure field as input and searches through the "CDC_CATEGORIES" array to find and return the corresponding label for that measure. If a matching measure is found, it returns the human-readable label; otherwise, it returns the input measure field as a fallback.

function getMeasureCiField(measureField) {
    return measureField && measureField.endsWith("_CrudePrev")
        ? measureField.replace("_CrudePrev", "_Crude95CI")
        : null; // This function takes a measure field as input and checks if it is defined and ends with the suffix "_CrudePrev". If both conditions are true, it returns a new string where the "_CrudePrev" suffix is replaced with "_Crude95CI", which corresponds to the field name for the 95% confidence interval associated with that measure in the dataset. If the input measure field does not meet these conditions, it returns null. This function is used to determine the appropriate field name for retrieving confidence interval values when displaying information in the popup content for each census tract on the map, allowing users to see both the crude prevalence and its associated confidence interval for the selected CDC measure.
} // This function takes a measure field as input and checks if it is defined and ends with the suffix "_CrudePrev". If both conditions are true, it returns a new string where the "_CrudePrev" suffix is replaced with "_Crude95CI", which corresponds to the field name for the 95% confidence interval associated with that measure in the dataset. If the input measure field does not meet these conditions, it returns null. This function is used to determine the appropriate field name for retrieving confidence interval values when displaying information in the popup content for each census tract on the map, allowing users to see both the crude prevalence and its associated confidence interval for the selected CDC measure.

/* ------------------------------------------------------------
   9. Popup content
   ------------------------------------------------------------
*/
function buildPopupContent(feature, measureField) {
    const row = getRowForFeature(feature); // This line calls the "getRowForFeature" function, passing in the "feature" object that represents a census tract on the map. The "getRowForFeature" function retrieves the corresponding data row from the CDC dataset based on the GEOID property of the feature. The resulting row contains all the relevant data for that census tract, including values for the selected measure and its confidence interval. This row will be used to populate the content of the popup when a user clicks on a census tract, allowing them to see detailed information about that tract based on the selected CDC measure.
    const label = getMeasureLabel(measureField); // This line calls the "getMeasureLabel" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getMeasureLabel" function returns a human-readable label for the selected measure, which is assigned to the variable "label". This label will be used in the popup content to provide a clear and descriptive title for the information being displayed about the census tract, enhancing the user's understanding of what the values represent based on their selection of the CDC measure for this category.

    if (!row) {
        return `
            <b>${feature.properties.NAMELSAD || "Census tract"}</b><br>
            County: ${feature.properties.NAMELSADCO || "Unknown"}<br>
            GEOID: ${feature.properties.GEOID || "Unknown"}<br>
            <i>No matching CDC CSV row for this tract.</i>
        `; // This block of code checks if the "row" variable is falsy (which means that there is no corresponding data row for the given feature). If this condition is true, it returns a string of HTML content for the popup that includes the name of the census tract (or a default label if not available), the county name (or "Unknown" if not available), the GEOID (or "Unknown" if not available), and a message indicating that there is no matching CDC CSV row for this tract. This provides feedback to users when they click on a census tract that does not have corresponding data in the CDC dataset, ensuring that they understand why no specific measure values are displayed in the popup for that tract.
    } // This block of code checks if the "row" variable is falsy (which means that there is no corresponding data row for the given feature). If this condition is true, it returns a string of HTML content for the popup that includes the name of the census tract (or a default label if not available), the county name (or "Unknown" if not available), the GEOID (or "Unknown" if not available), and a message indicating that there is no matching CDC CSV row for this tract. This provides feedback to users when they click on a census tract that does not have corresponding data in the CDC dataset, ensuring that they understand why no specific measure values are displayed in the popup for that tract.

    const value = row[measureField + "_number"]; // This line retrieves the value for the selected measure from the data row corresponding to the clicked census tract. It constructs the field name by concatenating the "measureField" (which represents the selected variable) with the suffix "_number", which is how the numeric values for each measure are stored in the dataset. The resulting value will be used in the popup content to display the crude prevalence percentage for that measure in the selected census tract, allowing users to see specific information about that tract based on their selection of the CDC measure for this category.
    const ciField = getMeasureCiField(measureField); // This line calls the "getMeasureCiField" function, passing in the "measureField" variable that represents the currently selected variable (measure) from the dropdown. The "getMeasureCiField" function checks if the measure field is defined and ends with the suffix "_CrudePrev". If both conditions are true, it returns a new string where the "_CrudePrev" suffix is replaced with "_Crude95CI", which corresponds to the field name for the 95% confidence interval associated with that measure in the dataset. If the input measure field does not meet these conditions, it returns null. The resulting "ciField" variable will be used to retrieve the confidence interval value for the selected measure when displaying information in the popup content for each census tract on the map.
    const ci = ciField ? row[ciField] : ""; // This line retrieves the confidence interval value for the selected measure from the data row corresponding to the clicked census tract. It first checks if "ciField" is defined (which means that there is a valid field name for the confidence interval), and if so, it retrieves the value from the row using that field name. If "ciField" is not defined, it assigns an empty string to "ci". The resulting "ci" variable will be used in the popup content to display the 95% confidence interval for the selected measure in the census tract, allowing users to see both the crude prevalence and its associated confidence interval for that tract based on their selection of the CDC measure for this category.

    return `
        <b>${row.CountyName} County</b><br>
        Tract FIPS: ${row.TractFIPS}<br>
        Population: ${formatInteger(row.TotalPopulation_number)}<br>
        Adults 18+: ${formatInteger(row.TotalPop18plus_number)}<hr>
        <b>${label}</b><br>
        Crude prevalence: ${formatPercent(value)}<br>
        95% CI: ${ci || "not available"}
    `; // This block of code constructs and returns a string of HTML content for the popup when a user clicks on a census tract that has corresponding data in the CDC dataset. It includes the county name, tract FIPS code, total population, adult population, and the selected measure's label along with its crude prevalence percentage and 95% confidence interval. The values are formatted using the "formatInteger" and "formatPercent" functions to ensure they are displayed in a user-friendly manner. This content provides users with detailed information about the selected census tract based on their selection of the CDC measure for this category, allowing them to understand the specific values for that tract in the context of the selected measure.
} // This function takes a map feature (representing a census tract) and a measure field as input and builds the HTML content for the popup that appears when a user clicks on that tract. It retrieves the corresponding data row for the tract, gets the label for the selected measure, and constructs the content to display information about the county, tract FIPS code, population, and the selected measure's crude prevalence and confidence interval. If there is no matching data row for the tract, it returns a message indicating that no data is available for that tract.

function formatInteger(value) {
    return value === null || !Number.isFinite(value)
        ? "not available"
        : value.toLocaleString(); // This function takes a value as input and checks if it is null or not a finite number. If either condition is true, it returns the string "not available" to indicate that there is no valid data for that value. Otherwise, it formats the number using the "toLocaleString" method, which adds commas as thousands separators (or other locale-specific formatting) to make the number easier to read. This function is used to format population values and other integer values in the popup content and data table, ensuring that they are displayed in a user-friendly manner while also handling cases where data may be missing or invalid.
} // This function takes a value as input and checks if it is null or not a finite number. If either condition is true, it returns the string "not available" to indicate that there is no valid data for that value. Otherwise, it formats the number using the "toLocaleString" method, which adds commas as thousands separators (or other locale-specific formatting) to make the number easier to read. This function is used to format population values and other integer values in the popup content and data table, ensuring that they are displayed in a user-friendly manner while also handling cases where data may be missing or invalid.

function formatPercent(value) {
    return value === null || !Number.isFinite(value)
        ? "not available"
        : value.toFixed(1) + "%"; // This function takes a value as input and checks if it is null or not a finite number. If either condition is true, it returns the string "not available" to indicate that there is no valid data for that value. Otherwise, it formats the number to one decimal place using the "toFixed(1)" method and appends a percentage sign ("%") to indicate that the value represents a percentage. This function is used to format the crude prevalence values for the selected CDC measure in the popup content and data table, ensuring that they are displayed in a user-friendly manner while also handling cases where data may be missing or invalid.
} // This function takes a value as input and checks if it is null or not a finite number. If either condition is true, it returns the string "not available" to indicate that there is no valid data for that value. Otherwise, it formats the number to one decimal place using the "toFixed(1)" method and appends a percentage sign ("%") to indicate that the value represents a percentage. This function is used to format the crude prevalence values for the selected CDC measure in the popup content and data table, ensuring that they are displayed in a user-friendly manner while also handling cases where data may be missing or invalid.

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
            return `<td>${cell}</td>`; // This line constructs a table row by wrapping each cell value in a <td> element and joining them together. The "cells" array contains the values for the county name, tract FIPS code, total population, and the formatted percentage values for each active measure based on the current selections in the dropdowns. By mapping over the "cells" array and wrapping each cell value in a <td> element, it creates the HTML for a single table row. The resulting string is then returned for each row in the "cdcRows" array, and all rows are joined together to form the complete body of the data table.
        }).join("") + "</tr>"; // This block of code populates the body of the data table with rows of data from the "cdcRows" array. For each row in the "cdcRows" array, it creates an array of cell values that includes the county name, tract FIPS code, total population, and the formatted percentage values for each active measure based on the current selections in the dropdowns. It then constructs a table row by wrapping each cell value in a <td> element and joining them together. Finally, it sets the inner HTML of the table body to the generated rows, effectively rendering the data table with the current CDC measures for each census tract based on user selections.
    }).join(""); 

    if (typeof jQuery !== "undefined" && jQuery.fn.DataTable) {
        dataTable = jQuery("#cdc-data-table").DataTable({
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            scrollX: true,
            order: [[0, "asc"], [1, "asc"]]
        }); // This block of code initializes a new DataTable instance on the table with the ID "cdc-data-table" using jQuery. It sets various options for the DataTable, including the default page length (10 rows per page), the available length menu options (10, 25, 50, 100), enabling horizontal scrolling (scrollX: true), and setting the default sorting order to be ascending by the first column (County) and then by the second column (Tract FIPS). This enhances the usability of the data table by providing features like pagination, sorting, and horizontal scrolling, allowing users to easily navigate and analyze the CDC measures for each census tract based on their selections.
    } // This block of code defines the "renderDataTable" function, which is responsible for rendering the data table that displays the CDC measures for each census tract. It first checks if there is an existing DataTable instance and destroys it to allow for rebuilding the table with updated headers and rows based on the current selections. It then constructs the table headers based on the active categories and their selected measures, and populates the table body with rows of data from the "cdcRows" array, formatting values as needed. Finally, it initializes a new DataTable instance to provide features like pagination, sorting, and horizontal scrolling for better usability when viewing the data table.
} 

function loadLassoRegressionOutput() {
    const output = document.getElementById("lasso-regression-output");
    if (!output || lassoRegressionLoaded) {
        return;
    }

    d3.json(LASSO_REGRESSION_RESULTS_PATH).then(function (results) {
        lassoRegressionLoaded = true;
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
    const output = document.getElementById("lasso-regression-output");
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

    const optionHtml = options.map(function (option) {
        const selected = option.field === defaultDependentVariable ? " selected" : "";
        return `<option value="${escapeHtml(option.field)}"${selected}>${escapeHtml(option.label)}</option>`;
    }).join("");

    if (select) {
        select.innerHTML = optionHtml;
        select.value = defaultDependentVariable;
    }

    const findModel = function (field) {
        return models.find(function (model) {
            return model.dependent_variable === field;
        }) || models[0];
    };

    if (select) {
        select.addEventListener("change", function () {
            renderLassoRegressionModel(findModel(select.value));
        });
    }

    renderLassoRegressionModel(findModel(select ? select.value : defaultDependentVariable));
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
