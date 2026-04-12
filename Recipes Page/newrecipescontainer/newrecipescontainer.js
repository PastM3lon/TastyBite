document.addEventListener('DOMContentLoaded', () => {
    const recipeDetail = document.getElementById('recipe-detail');
    if (!recipeDetail) {
        return;
    }

    const recipe = getSelectedRecipe();
    if (!recipe) {
        recipeDetail.innerHTML = '<p class="no-recipe">No recipe selected. Go back and choose a recipe.</p>';
        return;
    }

    recipeDetail.innerHTML = renderRecipeDetailHtml(recipe);
});

function getSelectedRecipe() {
    const raw = localStorage.getItem('selectedRecipe');
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
}

function renderRecipeDetailHtml(recipe) {
    var imageUrl = recipe.image;
    if (!imageUrl) {
        imageUrl = 'https://via.placeholder.com/800x450.png';
    }

    var title = recipe.title;
    if (!title) {
        title = 'New Recipe';
    }

    var ingredientItems = '';
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        for (var i = 0; i < recipe.ingredients.length; i += 1) {
            var item = recipe.ingredients[i];
            var quantity = item.quantity;
            var ingredient = item.ingredient;
            var text = '';
            if (quantity) {
                text = quantity;
            }
            if (ingredient) {
                if (text) {
                    text = text + ' - ' + ingredient;
                } else {
                    text = ingredient;
                }
            }
            ingredientItems += '<li>' + escapeHtml(text) + '</li>';
        }
    }

    var instructionItems = '';
    if (recipe.instructions && recipe.instructions.length > 0) {
        for (var j = 0; j < recipe.instructions.length; j += 1) {
            instructionItems += '<li>' + escapeHtml(recipe.instructions[j]) + '</li>';
        }
    }

    var videoHtml = '';
    if (recipe.link) {
        var embedUrl = getYoutubeEmbedUrl(recipe.link);
        if (embedUrl) {
            videoHtml = '<div class="recipe-video"><iframe width="100%" height="450" src="' + escapeHtml(embedUrl) + '" title="' + escapeHtml(title) + ' video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
        } else {
            videoHtml = '<p><a href="' + escapeHtml(recipe.link) + '" target="_blank" rel="noreferrer">Watch recipe video</a></p>';
        }
    }

    return `
        <article class="recipe-card-detail">
            <div class="recipe-header">
                <h1>${escapeHtml(title)}</h1>
            </div>
            <div class="recipe-image">
                <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">
            </div>
            ${videoHtml}
            <div class="recipe-content">
                <div class="recipe-section">
                    <h2>Ingredients</h2>
                    <ul>${ingredientItems}</ul>
                </div>
                <div class="recipe-section">
                    <h2>Instructions</h2>
                    <ol>${instructionItems}</ol>
                </div>
            </div>
        </article>
    `;
}

function getYoutubeEmbedUrl(link) {
    if (!link) {
        return '';
    }

    var youtubeMatch = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/);
    if (youtubeMatch && youtubeMatch[1]) {
        return 'https://www.youtube.com/embed/' + youtubeMatch[1];
    }

    return '';
}

function escapeHtml(value) {
    if (!value) {
        return '';
    }

    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
