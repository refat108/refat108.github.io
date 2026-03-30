// create a leaflet map that visualizes health indicators by census tract in New Mexico, using data from a GeoJSON file and a CSV file.
const map = L.map('map');

// Get references to UI elements
const hoverInfo = document.getElementById('hoverInfo');
const compareInfo = document.getElementById('compareInfo');
const indicatorSelect = document.getElementById('indicatorSelect');
const resetCompareBtn = document.getElementById('resetCompareBtn');

const indicatorMeta = {
  OBESITY_CrudePrev: { label: 'Obesity', suffix: '%' },
  DIABETES_CrudePrev: { label: 'Diabetes', suffix: '%' },
  ACCESS2_CrudePrev: { label: 'No health insurance', suffix: '%' },
  DEPRESSION_CrudePrev: { label: 'Depression', suffix: '%' }
};

let currentIndicator = indicatorSelect.value;
let geojsonLayer = null;
let joinedGeoData = null;
let selectedFeatures = [];
let legendControl = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

Promise.all([
  d3.json('tl_2025_35_tract.json'),
  d3.csv('PLACES__Census_Tract_Data.csv')
]).then(([tracts, csvRows]) => {
  const nmRows = csvRows.filter(row => String(row.StateAbbr).trim() === 'NM');

  const lookup = {};
  nmRows.forEach(row => {
    const tractId = String(row.TractFIPS).replace(/\.0$/, '').trim().padStart(11, '0');
    lookup[tractId] = {
      ...row,
      ACCESS2_CrudePrev: toNumber(row.ACCESS2_CrudePrev),
      DEPRESSION_CrudePrev: toNumber(row.DEPRESSION_CrudePrev),
      DIABETES_CrudePrev: toNumber(row.DIABETES_CrudePrev),
      OBESITY_CrudePrev: toNumber(row.OBESITY_CrudePrev),
      TotalPopulation: toNumber(String(row.TotalPopulation).replace(/,/g, '')),
      TotalPop18plus: toNumber(String(row.TotalPop18plus).replace(/,/g, ''))
    };
  });

  tracts.features.forEach(feature => {
    const geoid = String(feature.properties.GEOID).trim();
    const match = lookup[geoid];

    feature.properties.joined = !!match;
    feature.properties.places = match || null;

    if (match) {
      feature.properties.ACCESS2_CrudePrev = match.ACCESS2_CrudePrev;
      feature.properties.DEPRESSION_CrudePrev = match.DEPRESSION_CrudePrev;
      feature.properties.DIABETES_CrudePrev = match.DIABETES_CrudePrev;
      feature.properties.OBESITY_CrudePrev = match.OBESITY_CrudePrev;
      feature.properties.CountyName = match.CountyName;
      feature.properties.TotalPopulation = match.TotalPopulation;
      feature.properties.TotalPop18plus = match.TotalPop18plus;
    } else {
      feature.properties.ACCESS2_CrudePrev = null;
      feature.properties.DEPRESSION_CrudePrev = null;
      feature.properties.DIABETES_CrudePrev = null;
      feature.properties.OBESITY_CrudePrev = null;
      feature.properties.CountyName = null;
      feature.properties.TotalPopulation = null;
      feature.properties.TotalPop18plus = null;
    }
  });

  joinedGeoData = tracts;
  drawMap();
}).catch(error => {
  console.error(error);
  hoverInfo.innerHTML = 'Error loading data. Open the browser console to inspect the problem.';
});

indicatorSelect.addEventListener('change', () => {
  currentIndicator = indicatorSelect.value;
  drawMap();
});

resetCompareBtn.addEventListener('click', () => {
  selectedFeatures = [];
  compareInfo.innerHTML = 'Click two tracts on the map to compare them.';
  if (geojsonLayer) {
    geojsonLayer.resetStyle();
  }
});

function drawMap() {
  if (!joinedGeoData) return;

  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }
  if (legendControl) {
    map.removeControl(legendControl);
  }

  geojsonLayer = L.geoJSON(joinedGeoData, {
    style: styleFeature,
    onEachFeature: onEachFeature
  }).addTo(map);

  map.fitBounds(geojsonLayer.getBounds());
  addLegend();
}

function styleFeature(feature) {
  const value = feature.properties[currentIndicator];
  const isSelected = selectedFeatures.some(f => f.properties.GEOID === feature.properties.GEOID);

  return {
    fillColor: getColor(value),
    weight: isSelected ? 3 : 1,
    opacity: 1,
    color: isSelected ? '#111' : '#ffffff',
    fillOpacity: value == null ? 0.35 : 0.72
  };
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: event => {
      const target = event.target;
      target.setStyle({
        weight: 2,
        color: '#333',
        fillOpacity: 0.9
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        target.bringToFront();
      }
      updateHoverPanel(feature);
    },
    mouseout: event => {
      geojsonLayer.resetStyle(event.target);
      updateHoverPanel();
    },
    click: () => {
      updateComparison(feature);
      geojsonLayer.resetStyle();
    }
  });

  layer.bindPopup(buildPopupHtml(feature));
}

function updateHoverPanel(feature = null) {
  if (!feature) {
    hoverInfo.innerHTML = 'Hover over a tract to view details.';
    return;
  }

  const p = feature.properties;
  hoverInfo.innerHTML = `
    <strong>Tract:</strong> ${p.NAMELSAD}<br>
    <strong>GEOID:</strong> ${p.GEOID}<br>
    <strong>County:</strong> ${p.CountyName ?? 'No data'}<br>
    <strong>${indicatorMeta[currentIndicator].label}:</strong> ${formatValue(p[currentIndicator])}<br>
    <strong>Total population:</strong> ${formatInteger(p.TotalPopulation)}<br>
    <strong>Adults 18+:</strong> ${formatInteger(p.TotalPop18plus)}
  `;
}

function updateComparison(feature) {
  const geoid = feature.properties.GEOID;
  const existingIndex = selectedFeatures.findIndex(f => f.properties.GEOID === geoid);

  if (existingIndex >= 0) {
    selectedFeatures.splice(existingIndex, 1);
  } else {
    if (selectedFeatures.length === 2) selectedFeatures.shift();
    selectedFeatures.push(feature);
  }

  if (selectedFeatures.length === 0) {
    compareInfo.innerHTML = 'Click two tracts on the map to compare them.';
    return;
  }

  compareInfo.innerHTML = selectedFeatures.map((f, idx) => {
    const p = f.properties;
    return `
      <div style="margin-bottom: 12px;">
        <strong>Tract ${idx + 1}</strong><br>
        ${p.NAMELSAD}<br>
        GEOID: ${p.GEOID}<br>
        County: ${p.CountyName ?? 'No data'}<br>
        ${indicatorMeta[currentIndicator].label}: ${formatValue(p[currentIndicator])}<br>
        Population: ${formatInteger(p.TotalPopulation)}
      </div>
    `;
  }).join('');
}

function buildPopupHtml(feature) {
  const p = feature.properties;
  return `
    <div>
      <strong>${p.NAMELSAD}</strong><br>
      <strong>GEOID:</strong> ${p.GEOID}<br>
      <strong>County:</strong> ${p.CountyName ?? 'No data'}<br>
      <hr>
      <strong>Obesity:</strong> ${formatValue(p.OBESITY_CrudePrev)}<br>
      <strong>Diabetes:</strong> ${formatValue(p.DIABETES_CrudePrev)}<br>
      <strong>No health insurance:</strong> ${formatValue(p.ACCESS2_CrudePrev)}<br>
      <strong>Depression:</strong> ${formatValue(p.DEPRESSION_CrudePrev)}<br>
      <hr>
      <strong>Total population:</strong> ${formatInteger(p.TotalPopulation)}<br>
      <strong>Adults 18+:</strong> ${formatInteger(p.TotalPop18plus)}
    </div>
  `;
}

function addLegend() {
  legendControl = L.control({ position: 'bottomright' });

  legendControl.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    const bins = [0, 10, 20, 30, 40];
    const title = indicatorMeta[currentIndicator].label;

    div.innerHTML = `<div class="legend-title">${title}</div>`;

    for (let i = 0; i < bins.length; i++) {
      const from = bins[i];
      const to = bins[i + 1];
      div.innerHTML += `
        <div class="legend-row">
          <span class="legend-color" style="background:${getColor(from + 0.1)}"></span>
          <span>${to ? `${from}–${to}` : `${from}+`}%</span>
        </div>
      `;
    }

    div.innerHTML += `
      <div class="legend-row">
        <span class="legend-color" style="background:#d9d9d9"></span>
        <span>No data</span>
      </div>
    `;

    return div;
  };

  legendControl.addTo(map);
}

function getColor(value) {
  if (value == null || Number.isNaN(value)) return '#d9d9d9';
  return value > 40 ? '#800026' :
         value > 30 ? '#e31a1c' :
         value > 20 ? '#fc4e2a' :
         value > 10 ? '#fd8d3c' :
                      '#feb24c';
}

function formatValue(value) {
  if (value == null || Number.isNaN(value)) return 'No data';
  return `${value.toFixed(1)}${indicatorMeta[currentIndicator].suffix}`;
}

function formatInteger(value) {
  if (value == null || Number.isNaN(value)) return 'No data';
  return Number(value).toLocaleString();
}

function toNumber(value) {
  if (value == null || value === '') return null;
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isNaN(parsed) ? null : parsed;
}
