const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientList = document.getElementById('ingredients-list');
const addInstructionBtn = document.getElementById('add-instruction-btn');
const instructionList = document.getElementById('instructions-list');
const recipeNameInput = document.getElementById('recipe-name');
const recipeImageInput = document.getElementById('recipe-image');
const recipeYoutubeInput = document.getElementById('recipe-youtube');
const saveRecipeBtn = document.getElementById('save-recipe-btn');
const editingRecipeIdInput = document.getElementById('editing-recipe-id');
const customRecipesList = document.getElementById('custom-recipes-list');
const builtInRecipes = window.TastyBiteRecipes || {};
const unifiedRecipePage = '../Recipes Page/All Dishes/dishes.html';
let editingRecipeId = null;

function createIngredientRow(value = '', name = '') {
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    row.innerHTML = `
        <input class="qty" type="text" placeholder="2 cups" value="${escapeHtml(value)}">
        <input class="name" type="text" placeholder="Ingredient name" value="${escapeHtml(name)}">
        <button type="button" class="remove-btn">&#10005;</button>
    `;
    attachRemove(row.querySelector('.remove-btn'));
    return row;
}

function createInstructionRow(text = '') {
    const row = document.createElement('div');
    row.className = 'instruction-row';
    row.innerHTML = `
        <input class="instruction-text" type="text" placeholder="Instruction step" value="${escapeHtml(text)}">
        <button type="button" class="remove-btn">&#10005;</button>
    `;
    attachRemove(row.querySelector('.remove-btn'));
    return row;
}

function updateRemoveButtons(list) {
    const rows = list.querySelectorAll('.ingredient-row, .instruction-row');
    const buttons = list.querySelectorAll('.remove-btn');
    const hide = rows.length <= 1;
    buttons.forEach(btn => btn.hidden = hide);
}

function attachRemove(button) {
    if (!button) return;
    button.addEventListener('click', () => {
        const row = button.closest('.ingredient-row, .instruction-row');
        if (!row) return;
        const list = row.parentElement;
        const rows = list.querySelectorAll('.ingredient-row, .instruction-row');
        if (rows.length <= 1) return;
        row.remove();
        updateRemoveButtons(list);
    });
}

function sanitizeRecipeId(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'custom-recipe';
}

function escapeHtml(value) {
    if (!value) return '';
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCustomRecipes() {
    const stored = localStorage.getItem('customRecipes');
    if (!stored) {
        return [];
    }
    try {
        return JSON.parse(stored);
    } catch (error) {
        return [];
    }
}

function saveCustomRecipes(recipes) {
    localStorage.setItem('customRecipes', JSON.stringify(recipes));
}

function buildRecipeData() {
    const name = recipeNameInput.value.trim();
    const image = recipeImageInput.value.trim();
    const youtube = recipeYoutubeInput.value.trim();
    const ingredients = Array.from(ingredientList.querySelectorAll('.ingredient-row')).map(row => ({
        quantity: row.querySelector('.qty').value.trim(),
        ingredient: row.querySelector('.name').value.trim()
    })).filter(item => item.quantity || item.ingredient);
    const instructions = Array.from(instructionList.querySelectorAll('.instruction-row')).map(row => row.querySelector('.instruction-text').value.trim()).filter(Boolean);

    return {
        id: editingRecipeId || `${sanitizeRecipeId(name)}-${Date.now()}`,
        title: name,
        name,
        image,
        link: youtube,
        ingredients,
        instructions,
        detailPage: 'All Dishes/dishes.html',
        createdAt: Date.now()
    };
}

function resetForm() {
    editingRecipeId = null;
    editingRecipeIdInput.value = '';
    saveRecipeBtn.textContent = 'Add Recipe';
    recipeNameInput.value = '';
    recipeImageInput.value = '';
    recipeYoutubeInput.value = '';
    ingredientList.innerHTML = '';
    ingredientList.appendChild(createIngredientRow());
    instructionList.innerHTML = '';
    instructionList.appendChild(createInstructionRow());
    updateRemoveButtons(ingredientList);
    updateRemoveButtons(instructionList);
}

function populateForm(recipe) {
    editingRecipeId = recipe.id;
    editingRecipeIdInput.value = recipe.id;
    saveRecipeBtn.textContent = 'Update Recipe';
    recipeNameInput.value = recipe.name;
    recipeImageInput.value = recipe.image;
    recipeYoutubeInput.value = recipe.link || '';
    ingredientList.innerHTML = '';
    if (recipe.ingredients && recipe.ingredients.length) {
        recipe.ingredients.forEach(item => {
            ingredientList.appendChild(createIngredientRow(item.quantity, item.ingredient));
        });
    } else {
        ingredientList.appendChild(createIngredientRow());
    }
    instructionList.innerHTML = '';
    if (recipe.instructions && recipe.instructions.length) {
        recipe.instructions.forEach(text => {
            instructionList.appendChild(createInstructionRow(text));
        });
    } else {
        instructionList.appendChild(createInstructionRow());
    }
    updateRemoveButtons(ingredientList);
    updateRemoveButtons(instructionList);
}

function createCustomRecipeItem(recipe) {
    const item = document.createElement('div');
    item.className = 'recipe-item custom-recipe-item';
    item.dataset.id = recipe.id;
    item.innerHTML = `
        <a href="#" class="recipe-name">${escapeHtml(recipe.name)}</a>
        <div class="recipe-actions">
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
        </div>
    `;

    const nameLink = item.querySelector('.recipe-name');
    const editButton = item.querySelector('.edit-btn');
    const deleteButton = item.querySelector('.delete-btn');

    nameLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = unifiedRecipePage;
    });

    editButton.addEventListener('click', () => {
        populateForm(recipe);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    deleteButton.addEventListener('click', () => {
        const recipes = getCustomRecipes().filter(item => item.id !== recipe.id);
        saveCustomRecipes(recipes);
        renderCustomRecipes();
        if (editingRecipeId === recipe.id) {
            resetForm();
        }
    });

    return item;
}

function renderCustomRecipes() {
    if (!customRecipesList) return;
    customRecipesList.innerHTML = '';
    const recipes = getCustomRecipes();
    recipes.forEach(recipe => {
        customRecipesList.appendChild(createCustomRecipeItem(recipe));
    });
}

if (addIngredientBtn) {
    addIngredientBtn.addEventListener('click', () => {
        ingredientList.appendChild(createIngredientRow());
        updateRemoveButtons(ingredientList);
    });
}

if (addInstructionBtn) {
    addInstructionBtn.addEventListener('click', () => {
        instructionList.appendChild(createInstructionRow());
        updateRemoveButtons(instructionList);
    });
}

if (saveRecipeBtn) {
    saveRecipeBtn.addEventListener('click', () => {
        const recipe = buildRecipeData();
        if (!recipe.name || !recipe.image) {
            alert('Please enter a recipe name and image URL.');
            return;
        }

        let recipes = getCustomRecipes();
        if (editingRecipeId) {
            recipes = recipes.map(item => item.id === editingRecipeId ? recipe : item);
        } else {
            recipes.push(recipe);
        }

        saveCustomRecipes(recipes);
        renderCustomRecipes();
        resetForm();
        alert(editingRecipeId ? 'Recipe updated successfully.' : 'Recipe added successfully. It will appear on the home page.');
    });
}

const initialRemoveButtons = document.querySelectorAll('#ingredients-list .remove-btn, #instructions-list .remove-btn');
initialRemoveButtons.forEach(attachRemove);
updateRemoveButtons(ingredientList);
updateRemoveButtons(instructionList);
renderCustomRecipes();

const staticRecipeLinks = document.querySelectorAll('.existing-recipes .recipe-item .recipe-name');
staticRecipeLinks.forEach((link) => {
    if (link.closest('.custom-recipe-item')) return;

    const href = (link.getAttribute('href') || '').toLowerCase();
    let recipeId = '';

    if (href.includes('spaghetticarbonara')) {
        recipeId = 'spaghetti-carbonara';
    } else if (href.includes('shawarma')) {
        recipeId = 'shawarma';
    } else if (href.includes('tacos')) {
        recipeId = 'tacos';
    }

    if (!recipeId || !builtInRecipes[recipeId]) return;

    link.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('selectedRecipe', JSON.stringify(builtInRecipes[recipeId]));
        window.location.href = unifiedRecipePage;
    });
});
