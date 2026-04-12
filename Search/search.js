document.addEventListener("DOMContentLoaded", () => {
	const dishSearchInput = document.getElementById("dishSearchInput");
	const ingredientSearchInput = document.getElementById("ingredientSearchInput");
	const searchButton = document.getElementById("searchButton");
	const noResultsMessage = document.getElementById("noResultsMessage");
	const recipesContainer = document.querySelector(".recipes");

	const getCustomRecipes = () => {
		const stored = localStorage.getItem('customRecipes');
		if (!stored) return [];
		try {
			return JSON.parse(stored);
		} catch (error) {
			return [];
		}
	};

	const createRecipeCard = (recipe) => {
		const card = document.createElement('div');
		card.className = 'recipe-card';
		card.id = recipe.id;
		const ingredientPreview = Array.isArray(recipe.ingredients)
			? recipe.ingredients.map(i => i.ingredient || i.quantity || '').filter(Boolean).join(', ')
			: '';
		const recipeLink = recipe.detailPage ? `../Recipes Page/${recipe.detailPage}` : recipe.pageLink || '#';

		card.innerHTML = `
			<div class="card-img">
				<a href="${recipeLink}" rel="noreferrer">
					<img src="${recipe.image}" width="400" height="300" alt="${recipe.title || recipe.name}">
				</a>
			</div>
			<div class="card-p">
				<p>${recipe.title || recipe.name}</p>
				<span class="ingredient-preview">${ingredientPreview}</span>
			</div>
			<div class="add-fav">
				<a class="view-recipe-btn" href="${recipeLink}">View Recipe</a>
			</div>
		`;

		const viewBtn = card.querySelector('.view-recipe-btn');
		viewBtn.addEventListener('click', (event) => {
			if (recipe.detailPage) {
				event.preventDefault();
				localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
				window.location.href = recipeLink;
			}
		});

		return card;
	};

	const loadCustomRecipes = () => {
		const customRecipes = getCustomRecipes();
		customRecipes.forEach(recipe => {
			recipesContainer.appendChild(createRecipeCard(recipe));
		});
	};

	const filterRecipes = () => {
		const dish = dishSearchInput.value.trim().toLowerCase();
		const ingredient = ingredientSearchInput.value.trim().toLowerCase();
		const recipeCards = recipesContainer.querySelectorAll('.recipe-card');
		let visible = 0;

		recipeCards.forEach((card) => {
			const dishName = card.querySelector('.card-p p')?.textContent.trim().toLowerCase() || '';
			const ingredientName = card.querySelector('.ingredient-preview')?.textContent.trim().toLowerCase() || '';

			const matchesDish = !dish || dishName.includes(dish);
			const matchesIngredient = !ingredient || ingredientName.includes(ingredient);
			const isVisible = matchesDish && matchesIngredient;

			card.style.display = isVisible ? 'block' : 'none';
			if (isVisible) visible += 1;
		});

		noResultsMessage.style.display = visible === 0 ? 'block' : 'none';
	};

	loadCustomRecipes();
	searchButton.addEventListener('click', filterRecipes);
});
