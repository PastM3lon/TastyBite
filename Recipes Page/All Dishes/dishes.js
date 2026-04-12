document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('dish-hero');
    const recipeDetail = document.getElementById('recipe-detail');
    if (!hero || !recipeDetail) return;

    const recipe = getSelectedRecipe();
    if (!recipe) {
        hero.innerHTML = '<h1 class="dish-title">No Recipe Selected</h1>';
        recipeDetail.innerHTML = '<p class="no-recipe">Choose a recipe from Home, Search, or Favorites to view it here.</p>';
        return;
    }

    hero.innerHTML = renderHeroHtml(recipe);
    recipeDetail.innerHTML = renderRecipeDetailHtml(recipe);
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

function renderHeroHtml(recipe) {
    const title = recipe.title || recipe.name || 'Recipe';
    const summary = recipe.summary || buildSummary(recipe);

    return `
        <h1 class="dish-title">${escapeHtml(title)}</h1>
        <p class="dish-summary">${escapeHtml(summary)}</p>
    `;
}

function renderRecipeDetailHtml(recipe) {
    const ingredients = normalizeIngredients(recipe.ingredients);
    const instructions = normalizeInstructions(recipe.instructions);

    const ingredientItems = ingredients.length > 0
        ? ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
        : '<li>No ingredients available yet.</li>';

    const instructionItems = instructions.length > 0
        ? instructions.map((step, index) => `
            <li>
                <span class="step-dot" aria-hidden="true"></span>
                <div>
                    <div class="step-title">Step ${index + 1}</div>
                    <div class="step-body">${escapeHtml(step)}</div>
                </div>
            </li>
        `).join('')
        : `
            <li>
                <span class="step-dot" aria-hidden="true"></span>
                <div>
                    <div class="step-title">Step 1</div>
                    <div class="step-body">No instructions available yet.</div>
                </div>
            </li>
        `;

    return `
        <div class="dish-detail-grid">
            <article class="panel">
                <h2>Ingredients</h2>
                <ul class="ingredients-list">${ingredientItems}</ul>
            </article>
            <article class="panel">
                <h2>Instructions</h2>
                <ol class="instructions-list">${instructionItems}</ol>
            </article>
        </div>
    `;
}

function normalizeIngredients(ingredients) {
    if (!Array.isArray(ingredients)) return [];

    return ingredients
        .map((item) => {
            if (typeof item === 'string') return item.trim();
            if (!item || typeof item !== 'object') return '';
            const quantity = (item.quantity || '').trim();
            const ingredient = (item.ingredient || '').trim();
            if (quantity && ingredient) return `${quantity} ${ingredient}`;
            return quantity || ingredient;
        })
        .filter(Boolean);
}

function normalizeInstructions(instructions) {
    if (!Array.isArray(instructions)) return [];
    return instructions
        .map((step) => String(step || '').trim())
        .filter(Boolean);
}

function buildSummary(recipe) {
    const ingredients = normalizeIngredients(recipe.ingredients);
    if (ingredients.length >= 3) {
        return `Made with ${ingredients.slice(0, 3).join(', ')}.`;
    }

    const instructions = normalizeInstructions(recipe.instructions);
    if (instructions.length > 0) {
        return instructions[0];
    }

    return 'A delicious recipe ready to cook.';
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
