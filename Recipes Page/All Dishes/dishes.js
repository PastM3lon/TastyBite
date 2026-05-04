document.addEventListener('DOMContentLoaded', () => {
    const dishViews = document.getElementById('dishViews');
    const noRecipeMessage = document.getElementById('noRecipeMessage');
    if (!dishViews || !noRecipeMessage) return;

    const allDishViews = dishViews.querySelectorAll('.dish-view');
    allDishViews.forEach(view => view.style.display = 'none');

    noRecipeMessage.style.display = 'none';

    const recipe = getSelectedRecipe();
    if (!recipe || !recipe.id) {
        noRecipeMessage.style.display = 'block';
        return;
    }

    const selectedDish = document.getElementById(`dish-${recipe.id}`);
    if (selectedDish) {
        selectedDish.style.display = 'block';
        noRecipeMessage.style.display = 'none';
        return;
    }

    const customDishView = createCustomDishView(recipe);
    if (customDishView) {
        dishViews.appendChild(customDishView);
        noRecipeMessage.style.display = 'none';
        return;
    }

    noRecipeMessage.style.display = 'block';
});


function getSelectedRecipe() {
    const raw = localStorage.getItem('selectedRecipe');
    if (!raw) return null;
    return JSON.parse(raw);
}


function createCustomDishView(recipe) {
    if (!recipe || !recipe.id) return null;

    const title = recipe.title || recipe.name || 'New Recipe';
    const summary = recipe.summary || recipe.description || recipe.link || '';
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.filter(Boolean) : [];
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions.filter(Boolean) : [];

    const ingredientItems = ingredients.map(item => {
    const quantity = item.quantity || '';
    const ingredient = item.ingredient || item;

    return `<li>${quantity} ${ingredient}</li>`;
}).join('');
    const instructionItems = instructions.map((step, index) => `
        <li>
            <span class="step-dot"></span>
            <div>
                <div class="step-title">Step ${index + 1}</div>
                <div class="step-body">${step}</div>
            </div>
        </li>
    `).join('');

    const view = document.createElement('div');
    view.className = 'dish-view';
    view.id = `dish-${recipe.id}`;

    view.innerHTML = `
        <section class="dish-hero">
            <h1 class="dish-title">${title}</h1>
            ${summary ? `<p class="dish-summary">${summary}</p>` : ''}
        </section>

        <section class="dish-detail">
            <div class="dish-detail-grid">
                <article class="panel">
                    <h2>Ingredients</h2>
                    <ul class="ingredients-list">
                        ${ingredientItems || '<li>No ingredients added.</li>'}
                    </ul>
                </article>

                <article class="panel">
                    <h2>Instructions</h2>
                    <ol class="instructions-list">
                        ${instructionItems || '<li>No instruction steps added.</li>'}
                    </ol>
                </article>
            </div>
        </section>
    `;

    return view;
}