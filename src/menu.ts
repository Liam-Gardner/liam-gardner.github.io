window.addEventListener("DOMContentLoaded", (event) => {
  addMenuEvents();
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

// const getRules2 = (formData: InitialFormData, debugMode = false) => {
//   const route: Route = debugMode ? "debug" : "useMetabase";
//   fetch(`https://d736f8f720db.ngrok.io/${route}/login-dbs`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   })
//     .then((response) => response.json())
//     // parses JSON response into native JavaScript objects
//     .then((data: any) => {
//       if (data.errno) {
//         handleError();
//         handleBtnLoader(false);
//       } else {
//         // console.log("data", data);
//         createFullTable(data);
//         handleBtnLoader(false);
//       }
//     })
//     .catch((err) => {
//       console.log("apiCall error", err);
//       handleError();
//       handleBtnLoader(false);
//     });
// };

const handleMenuSubmit = () => {
  handleMenuBtnLoader(true);
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
  // createMenuItems(dummyMenu);
  // handleMenuBtnLoader(false);
  //#endregion
  fetch(`https://d736f8f720db.ngrok.io/useMetabase/login-dbs-demo`, {
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
  createBasketView();
  checkRules(basketState);
};

const clearBasket = () => {
  basketState = [];
  clearSuggestedItems();
  createBasketView();
  console.log(basketState);
};

const clearSuggestedItems = () => {
  let htmlCollection = document.getElementsByClassName("suggestedItemBtn");
  let arr = Array.from(htmlCollection);
  arr.forEach((el) => el.remove());
  let suggestedBar = document.getElementById("suggestedBar");
  suggestedBar!.style.display = "none";
};

const checkRules = (basketState: string[]) => {
  // this should be extracted and done once, when the rules are returned from api
  const lhs = Object.keys(dummyRules);
  const isRule = lhs.includes(basketState.toString());
  createSuggestedBar(isRule);
  console.log(isRule);
};

const createSuggestedBar = (isRule: boolean) => {
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
};

const createMenuItems = (menu: string[]) => {
  menu.sort();
  showBasket();
  createClearBasketBtn();
  let menuItemContainer = document.getElementById("menuItemContainer");
  menu.forEach((item) => {
    let menuItem = document.createElement("button");
    menuItem.className = "menuItem";
    menuItem.innerHTML = item;
    menuItem.addEventListener("click", () => addToBasket(menuItem.innerHTML));
    menuItemContainer!.appendChild(menuItem);
  });
};

const createBasketView = () => {
  const basketItem = document.getElementById("basketItem");
  const emptyIcon = document.getElementById("basketEmpty");
  if (emptyIcon!.style.display === "none" && !basketState.length) {
    emptyIcon!.style.display = "block";
  } else {
    emptyIcon!.style.display = "none";
  }

  if (basketState.length) {
    let arr = basketState.join(",").split(",");
    basketItem!.innerText = "";
    if (arr.length) {
      arr.forEach((item) => {
        basketItem!.innerHTML += `1 x ${item} <br />`;
      });
    }
  } else {
    basketItem!.innerText = "";
  }
};

const showBasket = () => {
  document.getElementById("basketContainer")!.style.display = "inline-table";
};

const createClearBasketBtn = () => {
  let clearBasketBtn = document.getElementById(
    "basketClearBtn"
  ) as HTMLInputElement;
  clearBasketBtn.addEventListener("click", clearBasket);
};
//#region types
//#endregion

//#region dummy data
const dummyMenu = [
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
