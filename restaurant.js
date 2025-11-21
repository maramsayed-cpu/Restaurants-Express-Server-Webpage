

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send put request to update restaurant info
  document.getElementById("save").addEventListener("click", async () => {
    console.log("maram");
    let response = await fetch("/restaurants/" + restaurant.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        delivery_fee: document.getElementById("deliveryFee").value,
        min_order: document.getElementById("minOrder").value,
        menu: restaurant.menu,
      }),
    });

    if (!response.ok) {
      alert("failed");
    } else {
      // upon successful response, go to restaurants page
      alert("Changes successfully made.");
      //window.location.href = "/restaurants";
      let res = await response.json();
      window.location.href = "/restaurants/" + res.id;
    }
  });

  const container = document.getElementById("items");
  const list = document.getElementById("categories");

  // when dropdown list value changes...
  document.getElementById("categories").addEventListener("change", () => {
    document.getElementById("items").innerHTML = "";
    const currCategory = list.value;

    const addingSection = document.getElementById("items");

    // add new category
    if (currCategory === "Add a category") {
      addNewCategory(addingSection, list, currCategory);
    }
    // otherwise, display the category's items
    else {
      let items = [];
      let itemsObject = {};

      const itemsList = document.createElement("ul");

      (function displayCategoryItems() {
        const categoryTitle = document.createElement("h4");
        categoryTitle.classList.add("categoryTitle");
        categoryTitle.innerHTML = list.value;
        categoryTitle.setAttribute("id", list.value);

        const categoryItems = restaurant.menu[currCategory];

        container.appendChild(categoryTitle);

        addCategoryItems(categoryItems, itemsList);
      })();

      // add section to allow for adding new item to current category
      addItem(list, items, itemsObject, addingSection);
    }
  });
});

// adding category items to page
function addCategoryItems(categoryItems, items) {
  const container = document.getElementById("items");
  Object.values(categoryItems).forEach((element) => {
    const itemName = element.name;
    const itemDescription = element.description;
    const itemPrice = element.price;

    //make a div to store name, price, and add button
    const itemDiv = document.createElement("div");

    const listItem = document.createElement("li");
    listItem.innerHTML = itemName;
    listItem.textContent = itemName + "...$" + itemPrice.toFixed(2);

    document.createAttribute("name");
    listItem.setAttribute("name", itemName);

    //add components to div
    itemDiv.appendChild(listItem);

    //make a separate paragraph element for the item description
    const description = document.createElement("p");
    description.classList.add("description");
    description.innerHTML = itemDescription;

    // add these to items div
    items.appendChild(itemDiv);
    items.appendChild(description);
    container.appendChild(items);
  });
  items.appendChild(document.createElement("br"));
}

// add new category into items div
function addNewCategory(addingSection) {
  const categoryNameLabel = document.createElement("label");
  categoryNameLabel.innerHTML = "Category Name: ";
  const categoryName = document.createElement("input");
  categoryName.setAttribute("type", "text");

  const addCategoryButton = document.createElement("button");
  addCategoryButton.innerHTML = "Add Category";

  addingSection.append(
    categoryNameLabel,
    categoryName,
    addCategoryButton,
    document.createElement("br")
  );

  // anaitialize storage variables for new items
  let items = [];
  let itemsObject = {};

  // when button to add new category is clicked, display section
  // to add items
  addCategoryButton.addEventListener("click", () => {
    // only allow to add new item if category doesn't already exist
    if (!Object.keys(restaurant.menu).includes(String(categoryName.value))) {
      addItem(categoryName, items, itemsObject, addingSection);
    } else {
      alert("Category already exists");
    }
  });
}

// add item section
function addItem(categoryName, items, itemsObject, addingSection) {
  let addItemDiv = document.createElement("div");
  addItemDiv.classList.add("addItemDiv");

  // don't allow user to change category name unless
  // it's currently empty
  if (categoryName !== "") {
    categoryName.readOnly = true;
  }

  const addItemHeader = document.createElement("h4");
  addItemHeader.innerHTML = "Add New Item";
  const itemNameLabel = document.createElement("label");
  itemNameLabel.innerHTML = "Item Name: ";
  const itemName = document.createElement("input");
  itemName.setAttribute("type", "text");

  const itemDescriptionLabel = document.createElement("label");
  itemDescriptionLabel.innerHTML = "Item Description: ";
  let description = document.createElement("input");
  description.setAttribute("type", "text");

  const itemPriceLabel = document.createElement("label");
  itemPriceLabel.innerHTML = "Item Price: ";
  let price = document.createElement("input");
  price.setAttribute("type", "number");
  price.setAttribute("step", "any");

  const addItemButton = document.createElement("button");
  addItemButton.innerHTML = "Add Item";

  addItemDiv.append(
    addItemHeader,
    itemNameLabel,
    itemName,
    document.createElement("br"),
    document.createElement("br"),
    itemDescriptionLabel,
    description,
    document.createElement("br"),
    document.createElement("br"),
    itemPriceLabel,
    price,
    document.createElement("br"),
    document.createElement("br"),
    addItemButton
  );

  // if the div isn't already part of the items div, append it
  // this is so that when the button is clicked more than once,
  // it doesnt add another addItemDiv
  if (!addingSection.querySelector(".addItemDiv")) {
    addingSection.appendChild(addItemDiv);
  }

  // this is to know what index to add new items to if category
  // already exists
  let itemNumber = 0;
  if (Object.keys(restaurant.menu).includes(String(categoryName.value))) {
    itemNumber = Object.keys(
      restaurant.menu[String(categoryName.value)]
    ).length;
  }

  addItemButton.addEventListener("click", () => {
    addingSection.removeChild(addItemDiv);
    addingSection.appendChild(addItemDiv);
    categoryName.readOnly = false;
    let item = {};
    item["name"] = itemName.value;
    item["description"] = description.value;
    item["price"] = parseFloat(price.value);
    items.push(item);
    itemName.value = "";
    description.value = "";
    price.value = "";

    // turn the items array into an object essentially
    itemsObject = items.reduce((obj, item, index) => {
      obj[index] = item;
      return obj;
    }, {});

    // if category already exists, add the items so its existing items
    if (Object.keys(restaurant.menu).includes(String(categoryName.value))) {
      console.log("hi");

      items.forEach((item) => {
        const itemNumber = Object.keys(
          restaurant.menu[String(categoryName.value)]
        ).length;
        restaurant.menu[String(categoryName.value)][itemNumber] = item;
      });
    } // otherwise, set new category's items to itemsObject
    else {
      restaurant.menu[String(categoryName.value)] = itemsObject;
    }

    // increment item number since we just added one
    itemNumber++;
  });
}
