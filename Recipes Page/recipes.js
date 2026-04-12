document.addEventListener("DOMContentLoaded", () => {
   const isAdmin = localStorage.getItem("isAdmin") === "true";
   const adminNavItem = document.querySelector(".admin-link");
   const currentUserEmail = (localStorage.getItem("currentUserEmail")).toLowerCase();
   const favoritesKey = "favoritesList_" + currentUserEmail;
;

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


   const cards = document.querySelectorAll(".recipe-card");
   cards.forEach((card) => {
      const recipeId = card.id;
      const recipeName = card.querySelector(".card-p p").textContent.trim();
      const recipeImage = card.querySelector(".card-img img").getAttribute("src");
      const recipeLink = card.querySelector(".card-img a").getAttribute("href");
      const favoriteButton = card.querySelector(".favorite-btn");


      const syncButtonState = () => {
         const favorites = getFavorites();
         const isFavorite = favorites.some((item) => item.id === recipeId);

         if (isFavorite) {
            favoriteButton.textContent = "Remove from Favorite";
            favoriteButton.classList.add("is-favorite");
         } else {
            favoriteButton.textContent = "Add to Favorites";
            favoriteButton.classList.remove("is-favorite");
         }
      };

      syncButtonState();

      favoriteButton.addEventListener("click", () => {
         const favorites = getFavorites();
         const existingItem = favorites.find(item => item.id === recipeId);

         if (!existingItem) {
            favorites.push({
               id: recipeId,
               title: recipeName,
               image: recipeImage,
               link: recipeLink
            });
         } else {
            const updatedFavorites = favorites.filter(item => item.id !== recipeId);
            saveFavorites(updatedFavorites);
            syncButtonState();
            return;
         }

         saveFavorites(favorites);
         syncButtonState();
      });
   });
});