"use strict";

const products = [

  {

    id: "loaf",

    name: "Signature Loaf",

    category: "bread",

    price: "$8–$10",

    description: "Fresh bread for toast and sandwiches."

  },

  {

    id: "rolls",

    name: "Dinner Rolls",

    category: "bread",

    price: "$6–$12",

    description: "Soft rolls to share with a meal."

  },

  {

    id: "croissant",

    name: "Butter Croissant",

    category: "pastry",

    price: "$4–$5",

    description: "A flaky pastry for a morning break."

  },

  {

    id: "cinnamon",

    name: "Cinnamon Roll",

    category: "pastry",

    price: "$4–$6",

    description: "A sweet roll with a cinnamon swirl."

  },

  {

    id: "cake",

    name: "Celebration Cake",

    category: "cake",

    price: "$30–$65",

    description: "Ask about flavors for your occasion."

  }

];

let favorites = [];

let storageAvailable = true;

const storageKey = "northStarFavorites";

function loadFavorites() {

  try {

    const saved = JSON.parse(

      localStorage.getItem(storageKey) || "[]"

    );

    if (Array.isArray(saved)) {

      favorites = [...new Set(

        saved.filter(id =>

          products.some(product => product.id === id)

        )

      )];

    }

  } catch {

    favorites = [];

    storageAvailable = false;

  }

}

function saveFavorites() {

  try {

    localStorage.setItem(

      storageKey,

      JSON.stringify(favorites)

    );

  } catch {

    storageAvailable = false;

  }

}

function toggleFavorite(id) {

  if (favorites.includes(id)) {

    favorites = favorites.filter(item => item !== id);

  } else {

    favorites.push(id);

  }

  saveFavorites();

  renderProducts();

  const button = document.querySelector(

    `[data-product-id="${id}"]`

  );

  if (button) {

    button.focus();

  } else {

    document.getElementById("category").focus();

  }

}

function renderProducts() {

  const list = document.getElementById("product-list");

  if (!list) {

    return;

  }

  const category = document.getElementById("category").value;

  const visibleProducts = products.filter(product => {

    if (category === "all") {

      return true;

    }

    if (category === "favorites") {

      return favorites.includes(product.id);

    }

    return product.category === category;

  });

  list.replaceChildren();

  visibleProducts.forEach(product => {

    const card = document.createElement("article");

    card.className = "product-card";

    const heading = document.createElement("h3");

    heading.textContent = product.name;

    const description = document.createElement("p");

    description.textContent = product.description;

    const price = document.createElement("p");

    price.textContent = product.price;

    const button = document.createElement("button");

    const saved = favorites.includes(product.id);

    button.type = "button";

    button.dataset.productId = product.id;

    button.textContent = saved

      ? "Remove favorite"

      : "Save favorite";

    button.setAttribute("aria-pressed", String(saved));

    button.setAttribute(

      "aria-label",

      `${saved ? "Remove" : "Save"} ${product.name} ${

        saved ? "from" : "to"

      } favorites`

    );

    button.addEventListener("click", () => {

      toggleFavorite(product.id);

    });

    card.append(heading, description, price, button);

    list.append(card);

  });

  if (visibleProducts.length === 0) {

    const message = document.createElement("p");

    message.textContent =

      "No favorites yet. Choose All products to save an item.";

    list.append(message);

  }

  const storageMessage = storageAvailable

    ? "Favorites are remembered on this browser."

    : "Storage is unavailable. Favorites last for this visit only.";

  document.getElementById("favorite-count").textContent =

    `${favorites.length} favorite(s) saved. ${storageMessage}`;

}

function getToday() {

  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

function validateForm() {

  const errors = {};

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const pickup = document.getElementById("pickup").value;

  const details = document.getElementById("details").value.trim();

  const requestType =

    document.getElementById("request-type").value;

  if (name.length < 2 || name.length > 80) {

    errors.name = "Enter a name between 2 and 80 characters.";

  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

    errors.email = "Enter a valid email, like name@example.com.";

  }

  if (requestType === "preorder" && !pickup) {

    errors.pickup = "Choose a pickup date for your pre-order.";

  } else if (pickup && pickup < getToday()) {

    errors.pickup = "Choose today or a future pickup date.";

  }

  if (details.length < 10 || details.length > 1000) {

    errors.details =

      "Enter between 10 and 1,000 characters for your request.";

  }

  return errors;

}

function showErrors(errors) {

  const fields = ["name", "email", "pickup", "details"];

  fields.forEach(field => {

    document.getElementById(`${field}-error`).textContent =

      errors[field] || "";

    document.getElementById(field).setAttribute(

      "aria-invalid",

      String(Boolean(errors[field]))

    );

  });

}

function setupForm() {

  const form = document.getElementById("contact-form");

  if (!form) {

    return;

  }

  let attempted = false;

  const status = document.getElementById("form-status");

  const requestType = document.getElementById("request-type");

  const pickup = document.getElementById("pickup");

  function updatePickupRequirement() {

    pickup.required = requestType.value === "preorder";

  }

  updatePickupRequirement();

  requestType.addEventListener(

    "change",

    updatePickupRequirement

  );

  form.addEventListener("submit", event => {

    event.preventDefault();

    attempted = true;

    const errors = validateForm();

    showErrors(errors);

    const firstError = Object.keys(errors)[0];

    if (firstError) {

      status.textContent =

        "Fix the marked fields. Your entries are still here.";

      document.getElementById(firstError).focus();

    } else {

      status.textContent =

        "Your request passes validation. This demo does not send requests or place orders.";

    }

  });

  form.addEventListener("input", () => {

    if (attempted) {

      showErrors(validateForm());

      status.textContent =

        "Your entries changed. Click Check my request again.";

    }

  });

}

loadFavorites();

renderProducts();

setupForm();

const categorySelect = document.getElementById("category");

if (categorySelect) {

  categorySelect.addEventListener("change", renderProducts);

}
