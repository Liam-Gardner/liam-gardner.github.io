window.addEventListener("DOMContentLoaded", (event) => {
  addEvents();
});

const addEvents = () => {
  document
    .getElementById("submit")!
    .addEventListener("click", handleFormSubmit);
};

let state: State = { loading: false };
const BASE_URL = "https://marketbasket.ngrok.io";

const clearElements = () => {
  const noData = document.getElementById("no-data");
  if (noData) {
    noData.parentNode?.removeChild(noData);
  }
  const table = document.getElementById("table-data");
  if (table) {
    table.parentNode?.removeChild(table);
  }
  const plots = document.getElementById("plot-wrapper");
  if (plots) {
    plots.parentNode?.removeChild(plots);
  }
};

const createFullTable = (tableData: Rule[], plots: Plots) => {
  clearElements();

  // create table
  const table = document.createElement("table");
  table.id = "table-data";

  // create caption
  const caption = document.createElement("caption");
  caption.style.textAlign = "left";
  caption.style.fontSize = "24px";
  caption.style.padding = "8px";
  caption.innerText = "Association Rules";

  // create table body
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
    Object.values(rowData).forEach((cellData, index) => {
      const cell = document.createElement("td");
      if (index == 0 || index > 2) {
        cell.style.textAlign = "right";
      }
      cell.appendChild(document.createTextNode(cellData as string));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  // apend table to document
  table.appendChild(caption);
  table.appendChild(tableBody);
  document.body.appendChild(table);

  // add pagination
  if (table) {
    addPagerToTable(table);
  }

  // create plots after table
  createPlots(plots);
};

const createPlots = (plots: Plots) => {
  const plotWrapper = document.createElement("div");
  plotWrapper.id = "plot-wrapper";
  plotWrapper.style.textAlign = "center";

  Object.values(plots).forEach((plotSrc) => {
    const plotContainer = document.createElement("div");
    const plot = document.createElement("img");
    plot.style.width = "75%";
    plot.style.marginTop = "72px";
    plot.src = `${BASE_URL}${plotSrc}`;

    plotContainer.append(plot);
    plotWrapper.append(plotContainer);
    document.body.append(plotWrapper);
  });
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
  // let debugMode = (<HTMLInputElement>document.getElementById("debug")).checked;
  let debugMode = false;

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
  fetch(`${BASE_URL}/${route}/login-dbs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    // parses JSON response into native JavaScript objects
    .then((data: MarketBasketResponse) => {
      if (data.errno) {
        handleError();
        handleBtnLoader(false);
      } else {
        localStorage.setItem("username", formData.username);
        localStorage.setItem("password", formData.password);
        localStorage.setItem("storeId", formData.storeId);

        console.log("data", data);
        const {
          rules,
          itemsBoughtPlot,
          popularTimesPlot,
          topTenBestSellersPlot,
        } = data;
        const plots = {
          itemsBoughtPlot,
          popularTimesPlot,
          topTenBestSellersPlot,
        };
        createFullTable(rules, plots);
        handleBtnLoader(false);
        setRulesInStorage(rules);
      }
    })
    .catch((err) => {
      console.log("apiCall error", err);
      handleError();
      handleBtnLoader(false);
    });
};

const setRulesInStorage = (rules: Rule[]) => {
  const ruleList = JSON.stringify(
    rules.map((r) => {
      return { [r.lhs]: r.rhs };
    })
  );
  localStorage.setItem("rules", ruleList);
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

//#region Pagination
const addPagerToTable = (table: HTMLTableElement, rowsPerPage = 5) => {
  let tBodyRows = Array.from(table.querySelectorAll("tBody tr")).slice(1);
  let numPages = Math.ceil(tBodyRows.length / rowsPerPage);

  let colCount = [].slice
    //@ts-ignore
    .call(table.querySelector("tr").cells)
    .reduce((a, b) => a + parseInt(b.colSpan), 0);

  table
    .createTFoot()
    .insertRow().innerHTML = `<td colspan=${colCount}><div class="nav" style="text-align: right">Pages: </div></td>`;

  if (numPages == 1) return;

  for (let i = 0; i < numPages; i++) {
    let pageNum = i + 1;
    //@ts-ignore
    table
      .querySelector(".nav")
      .insertAdjacentHTML(
        "beforeend",
        `<a href="#" style="text-decoration: none" rel="${i}">${pageNum}</a> `
      );
  }

  changeToPage(table, 1, rowsPerPage);

  //@ts-ignore
  for (let navA of table.querySelectorAll(".nav a"))
    navA.addEventListener("click", (e) => {
      e.preventDefault();
      changeToPage(table, parseInt(e.target.innerHTML), rowsPerPage);
    });
};

const changeToPage = (table, page, rowsPerPage) => {
  let startItem = (page - 1) * rowsPerPage;
  let endItem = startItem + rowsPerPage;
  let navAs = table.querySelectorAll(".nav a");
  let tBodyRows = Array.from<HTMLElement>(
    table.querySelectorAll("tBody tr")
  ).slice(1);

  for (let nix = 0; nix < navAs.length; nix++) {
    if (nix == page - 1) navAs[nix].classList.add("active");
    else navAs[nix].classList.remove("active");

    for (let trix = 0; trix < tBodyRows.length; trix++)
      tBodyRows[trix].style.display =
        trix >= startItem && trix < endItem ? "table-row" : "none";
  }
};

//#endregion
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

type MarketBasketResponse = {
  errno?: any;
  rules: Rule[];
  itemsBoughtPlot: string;
  popularTimesPlot: string;
  topTenBestSellersPlot: string;
};

type Rule = {
  number: number;
  lhs: string;
  rhs: string;
  lift: number;
  confidence: number;
  support: number;
  count: number;
};

type Plots = {
  itemsBoughtPlot: string;
  popularTimesPlot: string;
  topTenBestSellersPlot: string;
};
