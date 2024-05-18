const loadAllMeals = () => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s')
        .then(res => res.json())
        .then((data) => {
            displayMeals(data.meals);
        });
};

const displayMeals = (meals) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = '';

    if (!meals) {
        productContainer.innerHTML = '<p>No meals found.</p>';
        return;
    }

    meals.forEach((meal) => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img class="card-img-top" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <button class="btn btn-primary" onclick="showMealDetails('${meal.idMeal}')">Details</button>
            </div>
        `;

        productContainer.appendChild(div);
    });
};

const showMealDetails = (idMeal) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            const modalTitle = document.getElementById("productModalLabel");
            const modalBody = document.getElementById("productDetails");

            modalTitle.innerText = meal.strMeal;
            modalBody.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid mb-3">
                <h5>Category: ${meal.strCategory}</h5>
                <h5>Area: ${meal.strArea}</h5>
                <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
                <h6>Ingredients:</h6>
                <ul>
                    ${Object.keys(meal)
                        .filter(key => key.startsWith('strIngredient') && meal[key])
                        .map(key => `<li>${meal[key]} - ${meal['strMeasure' + key.slice(13)]}</li>`)
                        .join('')}
                </ul>
            `;
            $('#productModal').modal('show');
        });
};

const searchProducts = () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(res => res.json())
        .then(data => {
            displayMeals(data.meals);
        });
};

document.getElementById("searchInput").addEventListener("input", searchProducts);

loadAllMeals();
