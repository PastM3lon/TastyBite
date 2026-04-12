document.addEventListener("DOMContentLoaded", () => {
	const isAdmin = localStorage.getItem("isAdmin") === "true";
	const adminNavItem = document.querySelector(".admin-link");
	const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
    const favoritesKey = "favoritesList_" + currentUserEmail;
	const builtInRecipes = window.TastyBiteRecipes || {};
	const unifiedRecipePage = "../Recipes Page/All Dishes/dishes.html";

	if (adminNavItem && !isAdmin) {
		adminNavItem.style.display = "none";
	}

	const getFavorites = () => {
		const favStored = localStorage.getItem(favoritesKey);

		if (!favStored) {
			return [];
		}

		return JSON.parse(favStored);
	};

	const saveFavorites = (favorites) => {
		localStorage.setItem(favoritesKey, JSON.stringify(favorites));
	};

	const favoriteCards = document.querySelectorAll(".fav-recipe");
	const emptyMessage = document.querySelector(".empty-favorites");
	const favCardsWrapper = document.querySelector('.fav-cards');

	const renderCustomFavorites = (favorites) => {
		if (!favCardsWrapper) return;
		const customItems = favorites.filter(item => item.detailPage);
		const existingCustomCards = favCardsWrapper.querySelectorAll('.fav-recipe.custom-favorite');
		existingCustomCards.forEach(card => card.remove());

		customItems.forEach((item) => {
			const card = document.createElement('div');
			card.className = 'fav-recipe custom-favorite';
			card.id = item.id;
			card.innerHTML = `
				<div class="fav-img">
					<img src="${item.image}" width="350" alt="${item.title}">
				</div>
				<div class="fav-recipe-header">
					<h2>${item.title}</h2>
				</div>
				<div class="card-footer">
					<div class="view-recipe-link">
						<button class="btn view-custom-recipe" type="button">View Recipe</button>
					</div>
					<div class="heart-icon">
						<button type="button" class="remove-favorite">Remove</button>
					</div>
				</div>
			`;

			const viewButton = card.querySelector('.view-custom-recipe');
			const removeButton = card.querySelector('.remove-favorite');

			viewButton.addEventListener('click', () => {
				localStorage.setItem('selectedRecipe', JSON.stringify(item));
				window.location.href = unifiedRecipePage;
			});

			removeButton.addEventListener('click', () => {
				const updatedFavorites = getFavorites().filter((fav) => fav.id !== item.id);
				saveFavorites(updatedFavorites);
				syncFavoritesDisplay();
			});

			favCardsWrapper.appendChild(card);
		});
	};

	const syncFavoritesDisplay = () => {
		const favorites = getFavorites();

		favoriteCards.forEach((card) => {
			const recipeId = card.id;
            const shouldShow = favorites.some(item => item.id === recipeId);

			if (shouldShow) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
		});

		renderCustomFavorites(favorites);

		if (favorites.length > 0) {
            emptyMessage.style.display = "none";
            } else {
            emptyMessage.style.display = "block";
            }
        };

	favoriteCards.forEach((card) => {
		const removeButton = card.querySelector(".remove-favorite");
		const viewRecipeLink = card.querySelector(".view-recipe-link a");

		removeButton.addEventListener("click", () => {
			const recipeId = card.id;
			const updatedFavorites = getFavorites().filter((item) => item.id !== recipeId);

			saveFavorites(updatedFavorites);
			syncFavoritesDisplay();
		});

		if (viewRecipeLink) {
			viewRecipeLink.addEventListener("click", (event) => {
				event.preventDefault();
				const recipeId = card.id;
				const selected = builtInRecipes[recipeId];
				if (selected) {
					localStorage.setItem("selectedRecipe", JSON.stringify(selected));
					window.location.href = unifiedRecipePage;
				}
			});
		}
	});

	syncFavoritesDisplay();
});
