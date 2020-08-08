window.addEventListener("DOMContentLoaded", function (event) {
  addEvents();
});
var state = { loading: false };
var clearElements = function () {
  var _a, _b;
  var noData = document.getElementById("no-data");
  if (noData) {
    (_a = noData.parentNode) === null || _a === void 0
      ? void 0
      : _a.removeChild(noData);
  }
  var table = document.getElementById("table-data");
  if (table) {
    (_b = table.parentNode) === null || _b === void 0
      ? void 0
      : _b.removeChild(table);
  }
};
var createTable = function (tableData) {
  // clear no data element if it exists
  clearElements();
  var table = document.createElement("table");
  table.id = "table-data";
  var tableBody = document.createElement("tbody");
  var headers = ["lhs", "rhs"];
  var theadRow = document.createElement("tr");
  headers.forEach(function (header) {
    var theadTh = document.createElement("th");
    theadRow.appendChild(theadTh);
    theadTh.appendChild(document.createTextNode(header));
  });
  tableBody.appendChild(theadRow);
  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
  document.body.appendChild(table);
};
var prettifyData = function (data) {
  // entries = [ ["Battered Burger,Dinner For 2 Meal", "Doner Kebab"], ["The Big Deal Meal, Coke", "Chips"] ]
  var entries = Object.entries(data); // what will happen if we use ids here?
  createTable(entries);
};
var addEvents = function () {
  document.getElementById("submit").addEventListener("click", handleFormSubmit);
};
var handleBtnLoader = function (loading) {
  var button = document.getElementById("submit");
  state.loading = loading;
  if (state.loading && button) {
    button.setAttribute("disabled", "true");
    button.innerHTML =
      '<i id="loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
    document.getElementById("loader-btn").style.display = "inline-block";
  } else if (!state.loading && button) {
    button.removeAttribute("disabled");
    // state.loading = false; // not needed?
    button.innerHTML = "Submit";
  }
};
var handleFormSubmit = function () {
  handleBtnLoader(true);
  var username = document.getElementById("name").value;
  var password = document.getElementById("password").value;
  var storeId = document.getElementById("storeId").value;
  var confidence = document.getElementById("confidence").value;
  var rulesAmount = document.getElementById("rulesAmount").value;
  var byItemName = document.getElementById("byItemName").value;
  var debugMode = document.getElementById("debug").checked;
  var formData = {
    username: username,
    password: password,
    storeId: storeId,
    confidence: confidence,
    rulesAmount: rulesAmount,
    byItemName: byItemName,
  };
  getRules(formData, debugMode);
};
var getRules = function (formData, debugMode) {
  if (debugMode === void 0) {
    debugMode = false;
  }
  var route = debugMode ? "debug" : "useMetabase";
  fetch("https://34.241.97.244:3500/" + route + "/login-dbs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(function (response) {
      return response.json();
    })
    // parses JSON response into native JavaScript objects
    .then(function (data) {
      if (data.errno) {
        handleError();
        handleBtnLoader(false);
      } else {
        console.log("data", data);
        prettifyData(data);
        handleBtnLoader(false);
      }
    })
    .catch(function (err) {
      console.log("apiCall error", err);
      handleError();
      handleBtnLoader(false);
    });
};
var handleError = function () {
  var _a;
  var table = document.getElementById("table-data");
  if (table) {
    (_a = table.parentNode) === null || _a === void 0
      ? void 0
      : _a.removeChild(table);
  }
  var noDataElement = document.createElement("p");
  noDataElement.innerHTML = "No data available";
  noDataElement.id = "no-data";
  document.body.appendChild(noDataElement);
};
//#endregion
//#region demo item selection and suggestion
/*
  1. List of menuitems - [Battered Burger,Dinner For 2 Meal,Doner Kebab]
    - construct this from the response
    - get unique entries
    - or load the menu from metabase
*/
//#endregion
