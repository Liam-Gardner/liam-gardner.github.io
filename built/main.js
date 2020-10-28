var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
window.addEventListener("DOMContentLoaded", function (event) {
    addEvents();
});
var addEvents = function () {
    document
        .getElementById("submit")
        .addEventListener("click", handleFormSubmit);
};
var state = { loading: false };
var BASE_URL = "https://marketbasket.ngrok.io";
var clearElements = function () {
    var _a, _b, _c;
    var noData = document.getElementById("no-data");
    if (noData) {
        (_a = noData.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(noData);
    }
    var table = document.getElementById("table-data");
    if (table) {
        (_b = table.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(table);
    }
    var plots = document.getElementById("plot-wrapper");
    if (plots) {
        (_c = plots.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(plots);
    }
};
var createFullTable = function (tableData, plots) {
    clearElements();
    // create table
    var table = document.createElement("table");
    table.id = "table-data";
    // create caption
    var caption = document.createElement("caption");
    caption.style.textAlign = "left";
    caption.style.fontSize = "24px";
    caption.style.padding = "8px";
    caption.innerText = "Association Rules";
    // create table body
    var tableBody = document.createElement("tbody");
    var tableHeaders = Object.keys(tableData[0]).map(function (header) {
        return header.toUpperCase();
    });
    // table header
    var theadRow = document.createElement("tr");
    tableHeaders.forEach(function (header) {
        var theadTh = document.createElement("th");
        theadRow.appendChild(theadTh);
        theadTh.appendChild(document.createTextNode(header));
    });
    tableBody.appendChild(theadRow);
    // table rows
    tableData.forEach(function (rowData) {
        var row = document.createElement("tr");
        Object.values(rowData).forEach(function (cellData, index) {
            var cell = document.createElement("td");
            if (index == 0 || index > 2) {
                cell.style.textAlign = "right";
            }
            cell.appendChild(document.createTextNode(cellData));
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
var createPlots = function (plots) {
    var plotWrapper = document.createElement("div");
    plotWrapper.id = "plot-wrapper";
    plotWrapper.style.textAlign = "center";
    Object.values(plots).forEach(function (plotSrc) {
        var plotContainer = document.createElement("div");
        var plot = document.createElement("img");
        plot.style.width = "75%";
        plot.style.marginTop = "72px";
        plot.src = "" + BASE_URL + plotSrc;
        plotContainer.append(plot);
        plotWrapper.append(plotContainer);
        document.body.append(plotWrapper);
    });
};
var handleBtnLoader = function (loading) {
    var button = document.getElementById("submit");
    state.loading = loading;
    if (state.loading && button) {
        button.setAttribute("disabled", "true");
        button.innerHTML =
            '<i id="loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
        document.getElementById("loader-btn").style.display = "inline-block";
    }
    else if (!state.loading && button) {
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
    var confidence = document.getElementById("confidence")
        .value;
    var rulesAmount = document.getElementById("rulesAmount")
        .value;
    var byItemName = document.getElementById("byItemName")
        .value;
    // let debugMode = (<HTMLInputElement>document.getElementById("debug")).checked;
    var debugMode = false;
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
    if (debugMode === void 0) { debugMode = false; }
    var route = debugMode ? "debug" : "useMetabase";
    fetch(BASE_URL + "/" + route + "/login-dbs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(function (response) { return response.json(); })
        // parses JSON response into native JavaScript objects
        .then(function (data) {
        if (data.errno) {
            handleError();
            handleBtnLoader(false);
        }
        else {
            localStorage.setItem("username", formData.username);
            localStorage.setItem("password", formData.password);
            localStorage.setItem("storeId", formData.storeId);
            console.log("data", data);
            var rules = data.rules, itemsBoughtPlot = data.itemsBoughtPlot, popularTimesPlot = data.popularTimesPlot, topTenBestSellersPlot = data.topTenBestSellersPlot;
            var plots = {
                itemsBoughtPlot: itemsBoughtPlot,
                popularTimesPlot: popularTimesPlot,
                topTenBestSellersPlot: topTenBestSellersPlot,
            };
            createFullTable(rules, plots);
            handleBtnLoader(false);
            setRulesInStorage(rules);
        }
    })
        .catch(function (err) {
        console.log("apiCall error", err);
        handleError();
        handleBtnLoader(false);
    });
};
var setRulesInStorage = function (rules) {
    var ruleList = JSON.stringify(rules.map(function (r) {
        var _a;
        return _a = {}, _a[r.lhs] = r.rhs, _a;
    }));
    localStorage.setItem("rules", ruleList);
};
var handleError = function () {
    var _a;
    var table = document.getElementById("table-data");
    if (table) {
        (_a = table.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(table);
    }
    var noDataElement = document.createElement("p");
    noDataElement.innerHTML = "No data available";
    noDataElement.id = "no-data";
    document.body.appendChild(noDataElement);
};
//#region Pagination
var addPagerToTable = function (table, rowsPerPage) {
    var e_1, _a;
    if (rowsPerPage === void 0) { rowsPerPage = 5; }
    var tBodyRows = Array.from(table.querySelectorAll("tBody tr")).slice(1);
    var numPages = Math.ceil(tBodyRows.length / rowsPerPage);
    var colCount = [].slice
        //@ts-ignore
        .call(table.querySelector("tr").cells)
        .reduce(function (a, b) { return a + parseInt(b.colSpan); }, 0);
    table
        .createTFoot()
        .insertRow().innerHTML = "<td colspan=" + colCount + "><div class=\"nav\" style=\"text-align: right\">Pages: </div></td>";
    if (numPages == 1)
        return;
    for (var i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        //@ts-ignore
        table
            .querySelector(".nav")
            .insertAdjacentHTML("beforeend", "<a href=\"#\" style=\"text-decoration: none\" rel=\"" + i + "\">" + pageNum + "</a> ");
    }
    changeToPage(table, 1, rowsPerPage);
    try {
        //@ts-ignore
        for (var _b = __values(table.querySelectorAll(".nav a")), _c = _b.next(); !_c.done; _c = _b.next()) {
            var navA = _c.value;
            navA.addEventListener("click", function (e) {
                e.preventDefault();
                changeToPage(table, parseInt(e.target.innerHTML), rowsPerPage);
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
var changeToPage = function (table, page, rowsPerPage) {
    var startItem = (page - 1) * rowsPerPage;
    var endItem = startItem + rowsPerPage;
    var navAs = table.querySelectorAll(".nav a");
    var tBodyRows = Array.from(table.querySelectorAll("tBody tr")).slice(1);
    for (var nix = 0; nix < navAs.length; nix++) {
        if (nix == page - 1)
            navAs[nix].classList.add("active");
        else
            navAs[nix].classList.remove("active");
        for (var trix = 0; trix < tBodyRows.length; trix++)
            tBodyRows[trix].style.display =
                trix >= startItem && trix < endItem ? "table-row" : "none";
    }
};
