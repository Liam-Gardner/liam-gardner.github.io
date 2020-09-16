window.addEventListener("DOMContentLoaded", (event) => {
  addEvents();
});

const addEvents = () => {
  document
    .getElementById("submit")!
    .addEventListener("click", handleFormSubmit);
};

let state: State = { loading: false };

const clearElements = () => {
  const noData = document.getElementById("no-data");
  if (noData) {
    noData.parentNode?.removeChild(noData);
  }
  const table = document.getElementById("table-data");
  if (table) {
    table.parentNode?.removeChild(table);
  }
};

const createFullTable = (tableData: Rule[]) => {
  clearElements();
  const table = document.createElement("table");
  table.id = "table-data";
  const tableBody = document.createElement("tbody");
  const tableHeaders = Object.keys(tableData[0]).map((header) =>
    header.toUpperCase()
  );

  // table header
  const theadRow = document.createElement("tr");
  tableHeaders.forEach((header) => {
    const theadTh = document.createElement("th");
    theadRow.appendChild(theadTh);
    theadTh.appendChild(document.createTextNode(header));
  });
  tableBody.appendChild(theadRow);

  // table rows
  tableData.forEach((rowData) => {
    const row = document.createElement("tr");
    Object.values(rowData).forEach((cellData) => {
      const cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData as string));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
};

const handleBtnLoader = (loading: boolean) => {
  const button = document.getElementById("submit");
  state.loading = loading;
  if (state.loading && button) {
    button.setAttribute("disabled", "true");
    button.innerHTML =
      '<i id="loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
    document.getElementById("loader-btn")!.style.display = "inline-block";
  } else if (!state.loading && button) {
    button.removeAttribute("disabled");
    // state.loading = false; // not needed?
    button.innerHTML = "Submit";
  }
};

const handleFormSubmit = () => {
  handleBtnLoader(true);
  let username = (<HTMLInputElement>document.getElementById("name")).value;
  let password = (<HTMLInputElement>document.getElementById("password")).value;
  let storeId = (<HTMLInputElement>document.getElementById("storeId")).value;
  let confidence = (<HTMLInputElement>document.getElementById("confidence"))
    .value;
  let rulesAmount = (<HTMLInputElement>document.getElementById("rulesAmount"))
    .value;
  let byItemName = (<HTMLInputElement>document.getElementById("byItemName"))
    .value;
  let debugMode = (<HTMLInputElement>document.getElementById("debug")).checked;

  const formData: InitialFormData = {
    username,
    password,
    storeId,
    confidence,
    rulesAmount,
    byItemName,
  };

  getRules(formData, debugMode);
};

const getRules = (formData: InitialFormData, debugMode = false) => {
  const route: Route = debugMode ? "debug" : "useMetabase";
  fetch(`https://d736f8f720db.ngrok.io/${route}/login-dbs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    // parses JSON response into native JavaScript objects
    .then((data: any) => {
      if (data.errno) {
        handleError();
        handleBtnLoader(false);
      } else {
        console.log("data", data);
        createFullTable(data);
        handleBtnLoader(false);
      }
    })
    .catch((err) => {
      console.log("apiCall error", err);
      handleError();
      handleBtnLoader(false);
    });
};

const handleError = () => {
  const table = document.getElementById("table-data");
  if (table) {
    table.parentNode?.removeChild(table);
  }

  const noDataElement = document.createElement("p");
  noDataElement.innerHTML = "No data available";
  noDataElement.id = "no-data";

  document.body.appendChild(noDataElement);
};

//#region types
type State = { loading: boolean };

type InitialFormData = {
  username: string;
  password: string;
  storeId: string;
  confidence: string;
  rulesAmount: string;
  byItemName: string;
};

type Route = "debug" | "useMetabase";

type Rule = {
  number: number;
  lhs: string;
  rhs: string;
  lift: number;
  confidence: number;
  support: number;
  count: number;
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
