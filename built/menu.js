var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
window.addEventListener("DOMContentLoaded", function (event) {
    addMenuEvents();
    console.log("Rules: ", "Doner Kebab,The Big Deal Meal | \n", "Battered Burger,The Big Deal Meal | \n", "Curry Sauce,Fresh Cod,Smoked Cod \n");
});
var menuState = { loading: false };
var addMenuEvents = function () {
    document
        .getElementById("submit-menu")
        .addEventListener("click", handleMenuSubmit);
};
var handleMenuBtnLoader = function (loading) {
    var button = document.getElementById("submit-menu");
    menuState.loading = loading;
    if (menuState.loading && button) {
        button.setAttribute("disabled", "true");
        button.innerHTML =
            '<i id="menu-loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
        document.getElementById("menu-loader-btn").style.display = "inline-block";
    }
    else if (!menuState.loading && button) {
        button.removeAttribute("disabled");
        // menuState.loading = false; // not needed?
        button.innerHTML = "Submit";
    }
};
var getRules2 = function (formData, debugMode) {
    if (debugMode === void 0) { debugMode = false; }
    var route = debugMode ? "debug" : "useMetabase";
    fetch("http://34.241.97.244:3500/" + route + "/login-dbs", {
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
            // console.log("data", data);
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
var handleMenuSubmit = function () {
    var storeId = document.getElementById("storeId").value;
    var username = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var formData = { storeId: storeId, username: username, password: password };
    getMenuItems(formData);
};
var getMenuItems = function (formData) {
    //#region dummy data
    //   createMenuItems(dummyMenu);
    //   handleMenuBtnLoader(false);
    //#endregion
    fetch("http://34.241.97.244:3500/useMetabase/login-dbs-demo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        if (data.errno) {
            handleError2(); // probably need handler for menu - this is the table rules one
            handleMenuBtnLoader(false);
        }
        else {
            // console.log("data", data);
            createMenuItems(data);
            handleMenuBtnLoader(false);
        }
    })
        .catch(function (err) {
        console.log("apiCall error", err);
        handleError2();
        handleMenuBtnLoader(false);
    });
};
var handleError2 = function () {
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
var basketState = [];
var addToBasket = function (menuItem) {
    basketState = [__spread(basketState, [menuItem]).join(",")];
    //   basketState = [...basketState, menuItem];
    console.log(basketState);
    // check if basket contains key from rules
    checkRules(basketState);
};
var checkRules = function (basketState) {
    // this should be extracted and done once, when the rules are returned from api
    var lhs = Object.keys(dummyRules);
    var isRule = lhs.includes(basketState.toString());
    if (isRule) {
        var stickyBar = document.getElementById("suggestedBar");
        var rhs = dummyRules[basketState.toString()];
        var suggestedItemBtn_1 = document.createElement("button");
        suggestedItemBtn_1.innerText = "" + rhs;
        suggestedItemBtn_1.className = "suggestedItemBtn";
        suggestedItemBtn_1.addEventListener("click", function () {
            return addToBasket(suggestedItemBtn_1.innerText);
        });
        if (stickyBar) {
            stickyBar.style.display = "block";
            stickyBar.appendChild(suggestedItemBtn_1);
        }
    }
    console.log(isRule);
};
var createMenuItems = function (menu) {
    var menuItemContainer = document.createElement("div");
    menuItemContainer.className = "menuItemContainer";
    document.body.appendChild(menuItemContainer);
    menu.forEach(function (item) {
        var menuItem = document.createElement("button");
        menuItem.className = "menuItem";
        menuItem.innerHTML = item;
        menuItem.addEventListener("click", function () { return addToBasket(menuItem.innerText); });
        menuItemContainer.appendChild(menuItem);
    });
};
//#region types
//#endregion
//#region dummy data
var dummyMenu = [
    "Southern Fried Chicken Fillet Burger",
    "Lunch Box",
    "Fish Goujon Wrap",
    "Grilled Chicken Fillet Burger",
    "Hamburger Kids Meal",
    "Large Bottle (1.25 l) ",
    "Southern Fried Chicken Kebab Tray",
    "12 Ham & Mushroom",
    "Doner Kebab Tray",
    "Bacon Garlic Cheese Chips",
    "Cheese Burger Meal",
    "The Big Beef Burger ",
    "Fresh Cod",
    "Sweet Chilli Dip",
    "Southern Fried Chicken Kebab",
    "Taco Sauce",
    "Thursday Special",
    "Friday Special",
    "Southern Fried Chicken Fillet Burger Meal",
    "Quarter Pounder Burger Meal",
    "Taco Chips",
    "Curry Sauce",
    "Wrap & Drink",
    "Doner Kebab",
    "Supreme Chicken Baguette",
    "Wednesday Special",
    "Garlic Cheese Chips",
    "Kebab Meal Deal",
    "Supreme Chicken Wrap",
    "Kebab Sauce",
    "Tuesday Special",
    "Southern Fried Chicken Kebab Meal",
    "Southern Fried Chicken Wing",
    "Vegetable Burger",
    "Veggie Kebab",
    "Curry Chip Baguette",
    "Fish Portion",
    "BBQ Sauce",
    "The Bacon Deluxe",
    "Chicken Goujons Wrap",
    "Lunch Box Meal",
    "Chicken Nuggets",
    "Chicken Burger",
    "The Cheesy Pitta",
    "Quarter Pounder Burger",
    "Goujon Box Meal",
    "Chicken Goujons",
    "Sausage Box Meal",
    "Chicken Wings",
    "Salad Burger",
    "The Spicy Pitta",
    "Chip Baguette & Drink",
    "Dinner Box",
];
var dummyRules = {
    "Battered Burger,Dinner For 2 Meal,Doner Kebab": "The Big Deal Meal",
    "Battered Burger,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray": "The Big Deal Meal",
    "Battered Burger,Doner Kebab,Southern Fried Chicken Kebab Tray": "The Big Deal Meal",
    "Battered Burger,Dinner For 2 Meal,Doner Kebab,Southern Fried Chicken Kebab Tray": "The Big Deal Meal",
    "Chicken Goujons,Doner Kebab Tray,Wrap Meal": "Bacon Deluxe Meal",
    "Battered Burger,The Big Deal Meal": "Dinner For 2 Meal",
    "Doner Kebab,The Big Deal Meal": "Dinner For 2 Meal",
    "Battered Burger,Doner Kebab,The Big Deal Meal": "Dinner For 2 Meal",
    "Battered Burger,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Dinner For 2 Meal",
    "Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Dinner For 2 Meal",
    "Battered Burger,Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Dinner For 2 Meal",
    "Battered Sausage,Curry Chips,Friday Special,Potato Cakes": "Dinner For 2 Meal",
    "Dinner For 2 Meal,Doner Kebab,The Big Deal Meal": "Battered Burger",
    "Dinner For 2 Meal,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Battered Burger",
    "Dinner For 2 Meal,Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Battered Burger",
    "Bacon Deluxe Meal,Chicken Goujons,Doner Kebab Tray": "Wrap Meal",
    "Curry Chips,Dinner For 2 Meal,Potato Cakes": "Friday Special",
    "Battered Sausage,Curry Chips,Dinner For 2 Meal": "Friday Special",
    "Battered Sausage,Curry Chips,Dinner For 2 Meal,Potato Cakes": "Friday Special",
    "Battered Sausage,Dinner For 2 Meal,Friday Special": "Potato Cakes",
    "Battered Sausage,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray": "Potato Cakes",
    "Battered Sausage,Friday Special,Southern Fried Chicken Kebab Tray": "Potato Cakes",
    "Battered Sausage,Chicken Burger,Southern Fried Chicken Kebab Tray": "Potato Cakes",
    "Battered Sausage,Curry Chips,Dinner For 2 Meal,Friday Special": "Potato Cakes",
    "Bacon Deluxe Meal,Doner Kebab Tray,Wrap Meal": "Chicken Goujons",
    "Battered Burger,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray,The Big Deal Meal": "Doner Kebab",
    "Battered Burger,Dinner For 2 Meal,Doner Kebab,The Big Deal Meal": "Southern Fried Chicken Kebab Tray",
    "Bacon Deluxe Meal,Chicken Goujons,Wrap Meal": "Doner Kebab Tray",
    "Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal": "Can (330 ml)",
    "Curry Sauce,Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal": "Can (330 ml)",
    "Cheese Burger,Garlic Dip,Grilled Chicken Baguette": "Quarter Pounder Burger",
    "Cheese Burger,Garlic Dip,Grilled Chicken Baguette,Large Chips": "Quarter Pounder Burger",
    "Can (330 ml),Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal": "Curry Sauce",
    "Dinner Box,Quarter Pounder Burger,Southern Fried Chicken Wing": "Battered Sausage",
    "Curry Chips,Dinner For 2 Meal,Friday Special,Potato Cakes": "Battered Sausage",
    "Curry Sauce,Fresh Cod,Smoked Cod": "Large Chips",
    "Chicken Nuggets,Garlic Dip,The Cheesy Pitta": "Large Chips",
};
//#endregion
