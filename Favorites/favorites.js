document.addEventListener("DOMContentLoaded", () => {

	const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
	const favoritesKey = "favoritesList_" + currentUserEmail;

	const unifiedRecipePage = "../Recipes Page/All Dishes/dishes.html";

	const favCardsWrapper = document.querySelector(".fav-cards");
	const emptyMessage = document.querySelector(".empty-favorites");


	const getFavorites = () => {
		return JSON.parse(localStorage.getItem(favoritesKey)) || [];
	};


	const saveFavorites = (favorites) => {
		localStorage.setItem(favoritesKey, JSON.stringify(favorites));
	};


	const createFavoriteCard = (item) => {

		const card = document.createElement("div");
		card.className = "fav-recipe";
		card.id = item.id;

		card.innerHTML = `
			<div class="fav-img">
				<img src="${item.image}" width="350">
			</div>

			<div class="fav-recipe-header">
				<h2>${item.title}</h2>
			</div>

			<div class="card-footer">
				<div class="view-recipe-link">
					<button class="btn view-recipe">View Recipe</button>
				</div>

				<div class="heart-icon">
					<button type="button" class="remove-favorite">Remove</button>
				</div>
			</div>
		`;


		card.querySelector(".view-recipe").addEventListener("click", () => {
			localStorage.setItem("selectedRecipe", JSON.stringify(item));
			window.location.href = unifiedRecipePage;
		});


		card.querySelector(".remove-favorite").addEventListener("click", () => {
			const updated = getFavorites().filter(fav => fav.id !== item.id);
			saveFavorites(updated);
			renderFavorites();
		});

		return card;
	};
	const renderFavorites = () => {

		const favorites = getFavorites();

		if (!favCardsWrapper) return;

		favCardsWrapper.innerHTML = "";

		if (favorites.length === 0) {
			emptyMessage.style.display = "block";
			return;
		}
		emptyMessage.style.display = "none";
		favorites.forEach(item => {
			favCardsWrapper.appendChild(createFavoriteCard(item));
		});
	};
	renderFavorites();
});