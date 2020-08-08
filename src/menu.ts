window.addEventListener("DOMContentLoaded", (event) => {
  addMenuEvents();
  console.log(
    "Rules: ",
    "Doner Kebab,The Big Deal Meal | \n",
    "Battered Burger,The Big Deal Meal | \n",
    "Curry Sauce,Fresh Cod,Smoked Cod \n"
  );
});

let menuState: { loading: boolean } = { loading: false };

const addMenuEvents = () => {
  document
    .getElementById("submit-menu")!
    .addEventListener("click", handleMenuSubmit);
};

const handleMenuBtnLoader = (loading: boolean) => {
  const button = document.getElementById("submit-menu");
  menuState.loading = loading;
  if (menuState.loading && button) {
    button.setAttribute("disabled", "true");
    button.innerHTML =
      '<i id="menu-loader-btn" class="fa fa-circle-o-notch fa-spin"></i> Loading';
    document.getElementById("menu-loader-btn")!.style.display = "inline-block";
  } else if (!menuState.loading && button) {
    button.removeAttribute("disabled");
    // menuState.loading = false; // not needed?
    button.innerHTML = "Submit";
  }
};

const getRules2 = (formData: InitialFormData, debugMode = false) => {
  const route: Route = debugMode ? "debug" : "useMetabase";
  fetch(`http://34.241.97.244:3500/${route}/login-dbs`, {
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
        // console.log("data", data);
        prettifyData(data);
        handleBtnLoader(false);
      }
    })
    .catch((err) => {
      console.log("apiCall error", err);
      handleError();
      handleBtnLoader(false);
    });
};

const handleMenuSubmit = () => {
  let storeId = (<HTMLInputElement>document.getElementById("storeId")).value;
  let username = (<HTMLInputElement>document.getElementById("name")).value;
  let password = (<HTMLInputElement>document.getElementById("password")).value;
  const formData = { storeId, username, password };

  getMenuItems(formData);
};

const getMenuItems = (formData: {
  storeId: string;
  username: string;
  password: string;
}) => {
  //#region dummy data
  //   createMenuItems(dummyMenu);
  //   handleMenuBtnLoader(false);
  //#endregion

  fetch(`http://34.241.97.244:3500/useMetabase/login-dbs-demo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data: any) => {
      if (data.errno) {
        handleError2(); // probably need handler for menu - this is the table rules one
        handleMenuBtnLoader(false);
      } else {
        // console.log("data", data);
        createMenuItems(data);
        handleMenuBtnLoader(false);
      }
    })
    .catch((err) => {
      console.log("apiCall error", err);
      handleError2();
      handleMenuBtnLoader(false);
    });
};

const handleError2 = () => {
  const table = document.getElementById("table-data");
  if (table) {
    table.parentNode?.removeChild(table);
  }

  const noDataElement = document.createElement("p");
  noDataElement.innerHTML = "No data available";
  noDataElement.id = "no-data";

  document.body.appendChild(noDataElement);
};

let basketState: string[] = [];
const addToBasket = (menuItem: string) => {
  basketState = [[...basketState, menuItem].join(",")];
  //   basketState = [...basketState, menuItem];
  console.log(basketState);
  // check if basket contains key from rules
  checkRules(basketState);
};

const checkRules = (basketState: string[]) => {
  // this should be extracted and done once, when the rules are returned from api
  const lhs = Object.keys(dummyRules);
  const isRule = lhs.includes(basketState.toString());
  if (isRule) {
    const stickyBar = document.getElementById("suggestedBar");

    const rhs = dummyRules[basketState.toString()];

    const suggestedItemBtn = document.createElement("button");
    suggestedItemBtn.innerText = `${rhs}`;
    suggestedItemBtn.className = "suggestedItemBtn";
    suggestedItemBtn.addEventListener("click", () =>
      addToBasket(suggestedItemBtn.innerText)
    );

    if (stickyBar) {
      stickyBar.style.display = "block";
      stickyBar.appendChild(suggestedItemBtn);
    }
  }
  console.log(isRule);
};

const createMenuItems = (menu: string[]) => {
  let menuItemContainer = document.createElement("div");
  menuItemContainer.className = "menuItemContainer";
  document.body.appendChild(menuItemContainer);
  menu.forEach((item) => {
    let menuItem = document.createElement("button");
    menuItem.className = "menuItem";
    menuItem.innerHTML = item;
    menuItem.addEventListener("click", () => addToBasket(menuItem.innerText));
    menuItemContainer.appendChild(menuItem);
  });
};

//#region types
//#endregion

//#region dummy data
const dummyMenu = [
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

const dummyRules = {
  "Battered Burger,Dinner For 2 Meal,Doner Kebab": "The Big Deal Meal",
  "Battered Burger,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray":
    "The Big Deal Meal",
  "Battered Burger,Doner Kebab,Southern Fried Chicken Kebab Tray":
    "The Big Deal Meal",
  "Battered Burger,Dinner For 2 Meal,Doner Kebab,Southern Fried Chicken Kebab Tray":
    "The Big Deal Meal",
  "Chicken Goujons,Doner Kebab Tray,Wrap Meal": "Bacon Deluxe Meal",
  "Battered Burger,The Big Deal Meal": "Dinner For 2 Meal",
  "Doner Kebab,The Big Deal Meal": "Dinner For 2 Meal",
  "Battered Burger,Doner Kebab,The Big Deal Meal": "Dinner For 2 Meal",
  "Battered Burger,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Dinner For 2 Meal",
  "Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Dinner For 2 Meal",
  "Battered Burger,Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Dinner For 2 Meal",
  "Battered Sausage,Curry Chips,Friday Special,Potato Cakes":
    "Dinner For 2 Meal",
  "Dinner For 2 Meal,Doner Kebab,The Big Deal Meal": "Battered Burger",
  "Dinner For 2 Meal,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Battered Burger",
  "Dinner For 2 Meal,Doner Kebab,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Battered Burger",
  "Bacon Deluxe Meal,Chicken Goujons,Doner Kebab Tray": "Wrap Meal",
  "Curry Chips,Dinner For 2 Meal,Potato Cakes": "Friday Special",
  "Battered Sausage,Curry Chips,Dinner For 2 Meal": "Friday Special",
  "Battered Sausage,Curry Chips,Dinner For 2 Meal,Potato Cakes":
    "Friday Special",
  "Battered Sausage,Dinner For 2 Meal,Friday Special": "Potato Cakes",
  "Battered Sausage,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray":
    "Potato Cakes",
  "Battered Sausage,Friday Special,Southern Fried Chicken Kebab Tray":
    "Potato Cakes",
  "Battered Sausage,Chicken Burger,Southern Fried Chicken Kebab Tray":
    "Potato Cakes",
  "Battered Sausage,Curry Chips,Dinner For 2 Meal,Friday Special":
    "Potato Cakes",
  "Bacon Deluxe Meal,Doner Kebab Tray,Wrap Meal": "Chicken Goujons",
  "Battered Burger,Dinner For 2 Meal,Southern Fried Chicken Kebab Tray,The Big Deal Meal":
    "Doner Kebab",
  "Battered Burger,Dinner For 2 Meal,Doner Kebab,The Big Deal Meal":
    "Southern Fried Chicken Kebab Tray",
  "Bacon Deluxe Meal,Chicken Goujons,Wrap Meal": "Doner Kebab Tray",
  "Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal":
    "Can (330 ml)",
  "Curry Sauce,Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal":
    "Can (330 ml)",
  "Cheese Burger,Garlic Dip,Grilled Chicken Baguette": "Quarter Pounder Burger",
  "Cheese Burger,Garlic Dip,Grilled Chicken Baguette,Large Chips":
    "Quarter Pounder Burger",
  "Can (330 ml),Grilled Chicken Fillet Burger,Southern Fried Chicken Kebab Meal":
    "Curry Sauce",
  "Dinner Box,Quarter Pounder Burger,Southern Fried Chicken Wing":
    "Battered Sausage",
  "Curry Chips,Dinner For 2 Meal,Friday Special,Potato Cakes":
    "Battered Sausage",
  "Curry Sauce,Fresh Cod,Smoked Cod": "Large Chips",
  "Chicken Nuggets,Garlic Dip,The Cheesy Pitta": "Large Chips",
};
//#endregion
