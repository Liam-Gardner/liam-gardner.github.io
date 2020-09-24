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
    getMenuItems();
    createRulesToTry();
});
var parsedRules = JSON.parse(localStorage.rules);
var basketState = [];
var createRulesToTry = function () {
    var top5Rules = parsedRules.slice(0, 5);
    var rulesContainer = document.getElementById("rulesToTry");
    top5Rules.forEach(function (rule) {
        var p = document.createElement("p");
        p.innerText = Object.entries(rule).join().replace(",", " => ");
        rulesContainer.appendChild(p);
    });
};
var getMenuItems = function () {
    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");
    var storeId = localStorage.getItem("storeId");
    var formData = { username: username, password: password, storeId: storeId };
    fetch("https://d736f8f720db.ngrok.io/useMetabase/login-dbs-demo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        if (data.errno) {
            handleErrorMenu();
        }
        else {
            createMenuItems(data);
        }
    })
        .catch(function (err) {
        console.log("apiCall error", err);
        handleErrorMenu();
    });
};
var handleErrorMenu = function () {
    console.log("error loading menu!");
};
var addToBasket = function (menuItem) {
    basketState = [__spread(basketState, [menuItem]).join(",")];
    createBasketView();
    checkRules(basketState);
};
var clearBasket = function () {
    basketState = [];
    clearSuggestedItems();
    createBasketView();
    console.log(basketState);
};
var clearSuggestedItems = function () {
    var htmlCollection = document.getElementsByClassName("suggestedItemBtn");
    var arr = Array.from(htmlCollection);
    arr.forEach(function (el) { return el.remove(); });
    var suggestedBar = document.getElementById("suggestedBar");
    suggestedBar.style.display = "none";
};
var checkRules = function (basketState) {
    var check = parsedRules.find(function (r) { return r[basketState.toString()]; });
    if (check) {
        createSuggestedBar(Object.values(check).toString());
    }
};
var createSuggestedBar = function (rhs) {
    if (rhs) {
        var stickyBar = document.getElementById("suggestedBar");
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
};
var createMenuItems = function (menu) {
    menu.sort();
    showBasket();
    createClearBasketBtn();
    var menuItemContainer = document.getElementById("menuItemContainer");
    menu.forEach(function (item) {
        var menuItem = document.createElement("button");
        menuItem.className = "menuItem";
        menuItem.innerHTML = item;
        menuItem.addEventListener("click", function () { return addToBasket(menuItem.innerHTML); });
        menuItemContainer.appendChild(menuItem);
    });
};
var createBasketView = function () {
    var basketItem = document.getElementById("basketItem");
    var emptyIcon = document.getElementById("basketEmpty");
    if (emptyIcon.style.display === "none" && !basketState.length) {
        emptyIcon.style.display = "block";
    }
    else {
        emptyIcon.style.display = "none";
    }
    if (basketState.length) {
        var arr = basketState.join(",").split(",");
        basketItem.innerText = "";
        if (arr.length) {
            arr.forEach(function (item) {
                basketItem.innerHTML += "1 x " + item + " <br />";
            });
        }
    }
    else {
        basketItem.innerText = "";
    }
};
var showBasket = function () {
    document.getElementById("basketContainer").style.display = "inline-table";
};
var createClearBasketBtn = function () {
    var clearBasketBtn = document.getElementById("basketClearBtn");
    clearBasketBtn.addEventListener("click", clearBasket);
};
//#region types
//#endregion
//#region dummy data
var dummyMenu = [
    "The Big Deal Meal",
    "Dinner For 2 Meal",
    "Fresh Cod",
    "Smoked Cod",
    "Curry Chips",
    "Friday Special",
    "Potato Cakes",
    "Battered Sausage",
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
var dummyRules2 = '[{ "Doner Kebab,The Big Deal Meal": "The Big Deal Meal" },{ "Curry Sauce,Fresh Cod,Smoked Cod": "Large Chips" }]';
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
