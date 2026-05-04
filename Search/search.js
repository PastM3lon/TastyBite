document.addEventListener("DOMContentLoaded", () => {
	const dishSearchInput = document.getElementById("dishSearchInput");
	const ingredientSearchInput = document.getElementById("ingredientSearchInput");
	const searchButton = document.getElementById("searchButton");
	const noResultsMessage = document.getElementById("noResultsMessage");
	const recipesContainer = document.querySelector(".recipes");

	const unifiedRecipePage = "../Recipes Page/All Dishes/dishes.html";

	const getCustomRecipes = () => {
		const stored = localStorage.getItem('customRecipes');
		return stored ? JSON.parse(stored) : [];
	};

	const createRecipeCard = (recipe) => {
		const card = document.createElement('div');
		card.className = 'recipe-card';
		card.id = recipe.id;
		card.dataset.recipeObject = JSON.stringify(recipe);
		const ingredientPreview = Array.isArray(recipe.ingredients)
			? recipe.ingredients.map(i => i.ingredient || '').join(', ')
			: '';

		card.innerHTML = `
			<div class="card-img">
				<a href="${unifiedRecipePage}">
					<img src="${recipe.image}" width="400" height="300">
				</a>
			</div>
			<div class="card-p">
				<p>${recipe.title || recipe.name}</p>
				<span class="ingredient-preview">${ingredientPreview}</span>
			</div>
			<div class="add-fav">
				<a class="view-recipe-btn" href="${unifiedRecipePage}">View Recipe</a>
			</div>
		`;

		const goToRecipe = (e) => {
			e.preventDefault();
			localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
			window.location.href = unifiedRecipePage;
		};

		card.querySelector('.view-recipe-btn').addEventListener('click', goToRecipe);
		card.querySelector('.card-img a').addEventListener('click', goToRecipe);

		return card;
	};

	const loadCustomRecipes = () => {
		getCustomRecipes().forEach(recipe => {
			recipesContainer.appendChild(createRecipeCard(recipe));
		});
	};

	const filterRecipes = () => {
		const dish = dishSearchInput.value.toLowerCase();
		const ingredient = ingredientSearchInput.value.toLowerCase();

		let visible = 0;

		recipesContainer.querySelectorAll('.recipe-card').forEach((card) => {
			const dishName = card.querySelector('.card-p p').textContent.toLowerCase();
			const ingredientName = card.querySelector('.ingredient-preview').textContent.toLowerCase();

			const isVisible =
				(!dish || dishName.includes(dish)) &&
				(!ingredient || ingredientName.includes(ingredient));

			card.style.display = isVisible ? 'block' : 'none';
			if (isVisible) visible++;
		});

		noResultsMessage.style.display = visible === 0 ? 'block' : 'none';
	};

	const wireBuiltInCards = () => {
		recipesContainer.querySelectorAll('.recipe-card').forEach((card) => {
			const buildSelectedRecipe = () => {
				if (card.dataset.recipeObject) {
					return JSON.parse(card.dataset.recipeObject);
				}

				const title = card.querySelector('.card-p p').textContent.trim();
				const image = card.querySelector('.card-img img').getAttribute('src');
				const ingredientPreview = card.querySelector('.ingredient-preview').textContent;

				return {
					id: card.id,
					title,
					image,
					ingredients: ingredientPreview
						.split(',')
						.map(i => ({ ingredient: i.trim() }))
						.filter(i => i.ingredient)
				};
			};

			const goToRecipe = (e) => {
				e.preventDefault();
				localStorage.setItem('selectedRecipe', JSON.stringify(buildSelectedRecipe()));
				window.location.href = unifiedRecipePage;
			};

			card.querySelector('.view-recipe-btn').addEventListener('click', goToRecipe);
			card.querySelector('.card-img a').addEventListener('click', goToRecipe);
		});
	};

	loadCustomRecipes();
	wireBuiltInCards();
	searchButton.addEventListener('click', filterRecipes);
});