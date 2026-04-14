document.addEventListener('DOMContentLoaded', () => {
    const dishViews = document.getElementById('dishViews');
    const noRecipeMessage = document.getElementById('noRecipeMessage');
    if (!dishViews || !noRecipeMessage) return;

    const allDishViews = dishViews.querySelectorAll('.dish-view');
    allDishViews.forEach((view) => {
        view.style.display = 'none';
    });

    noRecipeMessage.style.display = 'none';

    const recipe = getSelectedRecipe();
    if (!recipe || !recipe.id) {
        noRecipeMessage.style.display = 'block';
        return;
    }

    const selectedDish = document.getElementById(`dish-${recipe.id}`);
    if (!selectedDish) {
        noRecipeMessage.style.display = 'block';
        return;
    }

    selectedDish.style.display = 'block';
    noRecipeMessage.style.display = 'none';
});

function getSelectedRecipe() {
    const raw = localStorage.getItem('selectedRecipe');
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        const builtInRecipes = window.TastyBiteRecipes || {};
        if (parsed.id && builtInRecipes[parsed.id]) {
            return builtInRecipes[parsed.id];
        }
        return parsed;
    } catch (error) {
        return null;
    }
}
