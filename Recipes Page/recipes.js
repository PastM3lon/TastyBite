document.addEventListener("DOMContentLoaded", () => {
   const isAdmin = localStorage.getItem("isAdmin") === "true";
   const adminNavItem = document.querySelector(".admin-link");

   if (adminNavItem && !isAdmin) {
      adminNavItem.style.display = "none";
   }

   renderSavedRecipes();
});

const builtInRecipes = {
   carbonara: {
      title: 'Spaghetti Carbonara',
      image: 'https://www.allrecipes.com/thmb/zJzTLhtUWknHXVoFIzysljJ9wR8=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg',
      link: '',
      ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan cheese', 'Black pepper'],
      instructions: ['Cook spaghetti until al dente.', 'Cook pancetta until crisp.', 'Whisk eggs and cheese together.', 'Toss pasta with pancetta and remove from heat.', 'Stir in egg mixture and season.']
   },
   shawarma: {
      title: 'Shawarma',
      image: 'https://www.munatycooking.com/wp-content/uploads/2023/12/chicken-shawarma-image-feature-2023.jpg',
      link: '',
      ingredients: ['Chicken', 'Yogurt', 'Garlic', 'Spices', 'Veggies', 'Pita bread'],
      instructions: ['Marinate chicken with spices and yogurt.', 'Grill or roast chicken until cooked.', 'Slice the meat thinly.', 'Serve in pita with veggies and sauce.']
   },
   tacos: {
      title: 'Tacos',
      image: 'https://danosseasoning.com/wp-content/uploads/2022/03/Beef-Tacos-1024x767.jpg',
      link: '',
      ingredients: ['Tortillas', 'Beef', 'Lettuce', 'Cheese', 'Salsa'],
      instructions: ['Cook beef with seasoning.', 'Warm tortillas.', 'Fill tortillas with beef and toppings.', 'Serve immediately.']
   }
};

function renderSavedRecipes() {
   const recipeContainer = document.querySelector('.recipes');
   if (!recipeContainer) return;

   const savedRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
   savedRecipes.forEach((recipe, index) => {
      recipeContainer.insertAdjacentHTML('beforeend', createRecipeCardHtml(recipe, index));
   });

   recipeContainer.addEventListener('click', event => {
      const card = event.target.closest('.recipe-card');
      if (!card) {
         return;
      }

      if (event.target.closest('.add-fav') || event.target.closest('button')) {
         return;
      }

      const staticKey = card.getAttribute('data-static');
      const indexValue = card.getAttribute('data-index');
      let selectedRecipe = null;

      if (indexValue !== null) {
         const selectedIndex = parseInt(indexValue, 10);
         if (!Number.isNaN(selectedIndex)) {
            const storedRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
            selectedRecipe = storedRecipes[selectedIndex];
         }
      } else if (staticKey && builtInRecipes[staticKey]) {
         selectedRecipe = builtInRecipes[staticKey];
      }

      if (selectedRecipe) {
         localStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe));
      }

      const linkUrl = card.getAttribute('data-link');
      if (linkUrl) {
         window.location.href = linkUrl;
      }
   });
}

function createRecipeCardHtml(recipe, index) {
   const imageUrl = recipe.image || 'https://via.placeholder.com/400x300.png';
   const linkUrl = './newrecipescontainer/newrecipescontainer.html';
   const title = recipe.title || 'New Recipe';

   return `
      <div class="recipe-card" data-link="${linkUrl}" data-index="${index}">
         <div class="card-img">
            <img src="${imageUrl}" width="400" height="300" alt="${title}">
         </div>
         <div class="card-p">
            <p>${title}</p>
         </div>
         <div class="add-fav">
            <a href="../Favorites/Favorites.html">
               <button type="button">Add to Favorites</button>
            </a>
         </div>
      </div>
   `;
}