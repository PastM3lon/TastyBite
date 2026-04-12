let editingIndex = null;

const addRecipeBtn = document.getElementById('add-recipe-btn');
const adminForm = document.querySelector('.admin-form');
const ingredientList = document.getElementById('ingredients-list');
const stepsList = document.getElementById('steps-list');
const recipeForm = document.getElementById('recipe-form');
const addRecipeSubmitBtn = document.getElementById('add-recipe-submit');
const existingRecipesList = document.getElementById('existing-recipes-list');

function attachRemove(btn, parentList, rowClass) {
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (parentList.querySelectorAll(rowClass).length > 1) {
            btn.closest(rowClass).remove();
        }
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function addIngredientRow(ingredient = { quantity: '', ingredient: '' }) {
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
        <input type="text" name="quantity[]" placeholder="2 cups" value="${escapeHtml(ingredient.quantity)}">
        <input type="text" name="ingredient[]" placeholder="Ingredient name" value="${escapeHtml(ingredient.ingredient)}">
        <button type="button" class="remove-btn">&#10005;</button>
    `;
    ingredientList.appendChild(row);
    attachRemove(row.querySelector('.remove-btn'), ingredientList, '.ingredient-row');
}

function addInstructionRow(step = '') {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `
        <input type="text" name="instructions[]" placeholder="Describe this step..." value="${escapeHtml(step)}">
        <button type="button" class="remove-btn">&#10005;</button>
    `;
    stepsList.appendChild(row);
    attachRemove(row.querySelector('.remove-btn'), stepsList, '.step-row');
}

function getSavedRecipes() {
    const saved = localStorage.getItem('customRecipes');
    if (!saved) {
        return [];
    }
    try {
        return JSON.parse(saved);
    } catch (_error) {
        return [];
    }
}

function renderExistingRecipes() {
    if (!existingRecipesList) return;
    const recipes = getSavedRecipes();
    existingRecipesList.innerHTML = '';

    if (recipes.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'no-recipes';
        emptyItem.textContent = 'No custom recipes saved yet.';
        existingRecipesList.appendChild(emptyItem);
        return;
    }

    recipes.forEach((recipe, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'saved-recipe-item';
        listItem.dataset.index = index;
        listItem.innerHTML = `
            <a href="#" class="recipe-link">${escapeHtml(recipe.title || 'Untitled Recipe')}</a>
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
        `;
        existingRecipesList.appendChild(listItem);
    });
}

function populateForm(recipe) {
    recipeForm.elements.title.value = recipe.title || '';
    recipeForm.elements.image.value = recipe.image || '';
    recipeForm.elements.link.value = recipe.link || '';
    ingredientList.innerHTML = '';
    stepsList.innerHTML = '';

    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(item => addIngredientRow(item));
    } else {
        addIngredientRow();
    }

    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
        recipe.instructions.forEach(step => addInstructionRow(step));
    } else {
        addInstructionRow();
    }
}

function startEditRecipe(index) {
    const recipes = getSavedRecipes();
    const recipe = recipes[index];
    if (!recipe) return;
    editingIndex = index;
    adminForm.hidden = false;
    const titleEl = document.querySelector('.admin-header p');
    if (titleEl) titleEl.textContent = 'Edit Recipe';
    addRecipeSubmitBtn.textContent = 'Save Recipe';
    populateForm(recipe);
}

function deleteRecipe(index) {
    const recipes = getSavedRecipes();
    if (!recipes[index]) return;
    recipes.splice(index, 1);
    localStorage.setItem('customRecipes', JSON.stringify(recipes));
    if (editingIndex !== null) {
        if (editingIndex === index) {
            resetForm();
        } else if (editingIndex > index) {
            editingIndex -= 1;
        }
    }
    renderExistingRecipes();
}

function handleRecipeListClick(event) {
    const listItem = event.target.closest('.saved-recipe-item');
    if (!listItem) return;
    const index = parseInt(listItem.dataset.index, 10);
    if (Number.isNaN(index)) return;

    if (event.target.classList.contains('edit-btn')) {
        startEditRecipe(index);
        return;
    }

    if (event.target.classList.contains('delete-btn')) {
        deleteRecipe(index);
        return;
    }

    if (event.target.classList.contains('recipe-link')) {
        event.preventDefault();
        const recipes = getSavedRecipes();
        const recipe = recipes[index];
        if (!recipe) return;
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = './newrecipescontainer/newrecipescontainer.html';
    }
}

function getTrimmedValue(formData, key) {
    const value = formData.get(key);
    return value ? String(value).trim() : '';
}

function saveRecipe(recipe) {
    const recipes = getSavedRecipes();
    if (editingIndex !== null && recipes[editingIndex]) {
        recipes[editingIndex] = recipe;
    } else {
        recipes.push(recipe);
    }
    localStorage.setItem('customRecipes', JSON.stringify(recipes));
    renderExistingRecipes();
    resetForm();
}

function resetForm() {
    editingIndex = null;
    recipeForm.reset();
    adminForm.hidden = true;
    const titleEl = document.querySelector('.admin-header p');
    if (titleEl) titleEl.textContent = 'Add a New Recipe';
    addRecipeSubmitBtn.textContent = 'Add Recipe';
    ingredientList.innerHTML = '';
    stepsList.innerHTML = '';
    addIngredientRow();
    addInstructionRow();
}

addRecipeBtn?.addEventListener('click', () => {
    adminForm.hidden = !adminForm.hidden;
    if (!adminForm.hidden) {
        editingIndex = null;
        const titleEl = document.querySelector('.admin-header p');
        if (titleEl) titleEl.textContent = 'Add a New Recipe';
        addRecipeSubmitBtn.textContent = 'Add Recipe';
    }
});

document.getElementById('add-ingredient-btn')?.addEventListener('click', () => {
    addIngredientRow();
    ingredientList.lastElementChild?.querySelector('input')?.focus();
});

document.getElementById('add-step-btn')?.addEventListener('click', () => {
    addInstructionRow();
    stepsList.lastElementChild?.querySelector('input')?.focus();
});

existingRecipesList?.addEventListener('click', handleRecipeListClick);

addRecipeSubmitBtn?.addEventListener('click', () => {
    recipeForm.requestSubmit();
});

recipeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(recipeForm);
    const quantities = formData.getAll('quantity[]').map(value => String(value).trim());
    const ingredients = formData.getAll('ingredient[]').map(value => String(value).trim());
    const instructions = formData.getAll('instructions[]').map(value => String(value).trim()).filter(Boolean);
    const recipeData = {
        title: getTrimmedValue(formData, 'title'),
        image: getTrimmedValue(formData, 'image'),
        link: getTrimmedValue(formData, 'link'),
        ingredients: ingredients
            .map((ingredient, index) => ({
                quantity: quantities[index] || '',
                ingredient
            }))
            .filter(item => item.ingredient),
        instructions
    };
    saveRecipe(recipeData);
});

renderExistingRecipes();
resetForm();

    