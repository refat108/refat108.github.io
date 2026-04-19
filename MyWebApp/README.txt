Neighborhood Health Access Explorer

Files included:
- index.html
- styles.css
- main.js

This version is already written for:
- tl_2025_35_tract.json
- PLACES__Census_Tract_Data.csv

How to use:
1. Put these three files in the same folder as:
   - tl_2025_35_tract.json
   - PLACES__Census_Tract_Data.csv
2. Start a local server:
   python -m http.server 8000
3. Open:
   http://localhost:8000

Notes:
- The code joins tract polygons using GEOID in the JSON file and TractFIPS in the CSV.
- It filters the CSV to New Mexico rows only.
- Available indicators:
  - OBESITY_CrudePrev
  - DIABETES_CrudePrev
  - ACCESS2_CrudePrev
  - DEPRESSION_CrudePrev
