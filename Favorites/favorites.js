document.addEventListener("DOMContentLoaded", () => {
	const isAdmin = localStorage.getItem("isAdmin") === "true";
	const adminNavItem = document.querySelector(".admin-link");

	if (adminNavItem && !isAdmin) {
		adminNavItem.style.display = "none";
	}

	const getFavorites = () => {
		const favStored = localStorage.getItem("favoritesList");

		if (!favStored) {
			return [];
		}

		return JSON.parse(favStored);
	};

	const saveFavorites = (favorites) => {
		localStorage.setItem("favoritesList", JSON.stringify(favorites));
	};

	const favoriteCards = document.querySelectorAll(".fav-recipe");
	const emptyMessage = document.querySelector(".empty-favorites");

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

		if (favorites.length > 0) {
            emptyMessage.style.display = "none";
            } else {
            emptyMessage.style.display = "block";
            }
        };

	favoriteCards.forEach((card) => {
		const removeButton = card.querySelector(".remove-favorite");

		removeButton.addEventListener("click", () => {
			const recipeId = card.id;
			const updatedFavorites = getFavorites().filter((item) => item.id !== recipeId);

			saveFavorites(updatedFavorites);
			syncFavoritesDisplay();
		});
	});

	syncFavoritesDisplay();
});
