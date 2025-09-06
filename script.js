    document.addEventListener("DOMContentLoaded", () => {
        const plantsGrid = document.getElementById("plants-grid");
        const categoryLinks = document.querySelectorAll(".category-link");

    // Modal references
    const modal = document.getElementById("plant-modal");
    const modalClose = document.getElementById("modal-close");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalCategory = document.getElementById("modal-category");
    const modalPrice = document.getElementById("modal-price");
    const modalImage = document.getElementById("modal-image");

    // Cart references
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let totalPrice = 0;

    // 🔹 Render plant cards
    function renderPlants(plants) {
    plantsGrid.innerHTML = "";
    plants.forEach(plant => {
        const card = document.createElement("div");
        card.className = "card bg-white shadow-md rounded-lg overflow-hidden";

        card.innerHTML = `
            <figure class="h-32 flex items-center justify-center bg-white">
                <img src="${plant.image}" alt="${plant.name}" class="h-full w-full object-cover">
            </figure>
            <div class="card-body p-4">
                <h3 class="font-bold text-[#1F2937] cursor-pointer plant-title">${plant.name}</h3>
                <p class="text-sm text-[#1F2937]">${plant.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <p class="bg-[#DCFCE7] text-[#15803D] py-1 px-2 w-auto rounded-2xl font-semibold">${plant.category}</p>
                    <p class="text-[#1F2937] font-bold">৳<span>${plant.price}</span></p>
                </div>
                <button class="btn btn-sm bg-[#15803D] text-white mt-4 rounded-2xl">Add to Cart</button>
            </div>
        `;
        plantsGrid.appendChild(card);

        // 🔹 Name click → open modal
        const title = card.querySelector(".plant-title");
        title.addEventListener("click", () => openModal(plant));

        // 🔹 Add to Cart click
        const addBtn = card.querySelector(".btn");
        addBtn.addEventListener("click", () => addToCart(plant));
        });
    }

    // 🔹 Load all plants
    function loadAllPlants() {
        fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
            const plants = data.data || data.plants || [];
            renderPlants(plants);
        })
        .catch(err => console.error("Error loading all plants:", err));
    }

        // 🔹 Load plants by category
    function loadCategory(id) {
        if (id === "all") {
        loadAllPlants();
        } else {
        fetch(`https://openapi.programming-hero.com/api/category/${id}`)
            .then(res => res.json())
            .then(data => {
            const plants = data.data || data.plants || [];
            renderPlants(plants);
            })
            .catch(err => console.error("Error loading category plants:", err));
        }
    }

    // 🔹 Sidebar click events + active class
    categoryLinks.forEach(link => {
        link.addEventListener("click", (e) => {
        e.preventDefault();
        const categoryId = link.getAttribute("data-id");

        // Remove active from all
        categoryLinks.forEach(l => l.classList.remove("active"));
        // Add active to clicked
        link.classList.add("active");

        loadCategory(categoryId);
        });
    });

    // 🔹 Modal functions
    function openModal(plant) {
        modalName.textContent = plant.name;
        modalDescription.textContent = plant.description;
        modalCategory.textContent = plant.category;
        modalPrice.textContent = "৳ " + plant.price;
        modalImage.src = plant.image;
        modal.classList.remove("hidden");
    }

    // Close modal
    modalClose.addEventListener("click", () => modal.classList.add("hidden"));

    // Click outside modal to close
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // 🔹 Cart functions
    function addToCart(plant) {
        totalPrice += plant.price;

        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-100 p-2 rounded";

        li.innerHTML = `
        <span>${plant.name} - ৳${plant.price}</span>
        <button class="text-red-500 font-bold hover:text-red-700">×</button>
        `;

        const removeBtn = li.querySelector("button");
        removeBtn.addEventListener("click", () => {
        totalPrice -= plant.price;
        li.remove();
        cartTotal.textContent = totalPrice;
        });

        cartItems.appendChild(li);
        cartTotal.textContent = totalPrice;

        // 🔹 Alert
        alert(`${plant.name} has been added to the cart`);
    }

    // 🔹 Initial load
    loadAllPlants();
    });
    const spinner = document.getElementById("loading-spinner");

    function loadAllPlants() {
    spinner.classList.remove("hidden"); // show spinner
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
        const plants = data.data || data.plants || [];
        renderPlants(plants);
        spinner.classList.add("hidden"); // hide spinner
        })
        .catch(err => {
        console.error("Error loading all plants:", err);
        spinner.classList.add("hidden"); // hide spinner even on error
        });
    }

    function loadCategory(id) {
    spinner.classList.remove("hidden"); // show spinner
    if (id === "all") {
        loadAllPlants();
    } else {
        fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then(res => res.json())
        .then(data => {
            const plants = data.data || data.plants || [];
            renderPlants(plants);
            spinner.classList.add("hidden"); // hide spinner
        })
        .catch(err => {
            console.error("Error loading category plants:", err);
            spinner.classList.add("hidden");
        });
    }
    }
