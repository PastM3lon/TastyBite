document.addEventListener("DOMContentLoaded", () => {
   const isAdmin = localStorage.getItem("isAdmin") === "true";
   const adminNavItem = document.querySelector(".admin-link");
   const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
   const favoritesKey = "favoritesList_" + currentUserEmail;

   if (adminNavItem && !isAdmin) {
      adminNavItem.style.display = "none";
   }

   const recipesContainer = document.querySelector('.recipes');

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

   const getCustomRecipes = () => {
      const stored = localStorage.getItem('customRecipes');
      if (!stored) {
         return [];
      }
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
      const recipeLink = recipe.detailPage || recipe.pageLink || '#';
      card.innerHTML = `
         <div class="card-img">
            <a href="${recipeLink}" rel="noreferrer">
               <img src="${recipe.image}" width="400" height="300" alt="${recipe.title || recipe.name}">
            </a>
         </div>
         <div class="card-p">
            <p>${recipe.title || recipe.name}</p>
            ${ingredientPreview ? `<span class="ingredient-preview">${ingredientPreview}</span>` : ''}
         </div>
         <div class="add-fav">
            <button class="favorite-btn" type="button">Add to Favorites</button>
         </div>
      `;
      if (recipe.detailPage) {
         card.customRecipe = recipe;
      }
      if (recipeLink && recipeLink !== '#') {
         card.style.cursor = 'pointer';
         card.addEventListener('click', (event) => {
            if (event.target.closest('button')) return;
            if (recipe.detailPage) {
               localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
            }
            window.location.href = recipeLink;
         });
      }
      return card;
   };

   getCustomRecipes().forEach((recipe) => {
      if (recipesContainer) {
         recipesContainer.appendChild(createRecipeCard(recipe));
      }
   });

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

      if (recipeLink && recipeLink !== '#') {
         card.style.cursor = 'pointer';
         card.addEventListener('click', (event) => {
            if (event.target.closest('button')) return;
            window.location.href = recipeLink;
         });
      }

      favoriteButton.addEventListener("click", () => {
         const favorites = getFavorites();
         const existingItem = favorites.find(item => item.id === recipeId);

         if (!existingItem) {
            let favoriteItem = {
               id: recipeId,
               title: recipeName,
               image: recipeImage,
               link: recipeLink
            };

            if (card.customRecipe) {
               const custom = card.customRecipe;
               favoriteItem = {
                  ...favoriteItem,
                  detailPage: custom.detailPage,
                  link: custom.link,
                  ingredients: custom.ingredients,
                  instructions: custom.instructions
               };
            }

            favorites.push(favoriteItem);
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