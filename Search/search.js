document.addEventListener("DOMContentLoaded", () => {
	const dishSearchInput = document.getElementById("dishSearchInput");
	const ingredientSearchInput = document.getElementById("ingredientSearchInput");
	const searchButton = document.getElementById("searchButton");
	const noResultsMessage = document.getElementById("noResultsMessage");
	const recipeCards = document.querySelectorAll(".recipe-card");

	const filterRecipes = () => {
		const dish = dishSearchInput.value.trim().toLowerCase();
		const ingredient = ingredientSearchInput.value.trim().toLowerCase();
		let visible = 0;

			recipeCards.forEach((card) => {
			const dishName = card.querySelector(".card-p p").textContent.trim().toLowerCase();
			const ingredientName = card.querySelector(".ingredient-preview").textContent.trim().toLowerCase();

			const matchesDish = !dish || dishName.includes(dish);
			const matchesIngredient = !ingredient || ingredientName.includes(ingredient);
			const isVisible = matchesDish && matchesIngredient;

            if (isVisible) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

			if (isVisible) {
				visible += 1;
			}
		});

		if (visible === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }
	};

	searchButton.addEventListener("click", filterRecipes);
});
