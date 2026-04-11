let addrecipeBtn = document.getElementById('add-recipe-btn');
let adminForm = document.querySelectorAll('.admin-form');
addrecipeBtn.addEventListener('click', () => {
    adminForm.forEach(form => {
    form.hidden = !form.hidden;
});
    });
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    let recipeName = document.querySelector('input[name="recipe_name"]').value;
    let ingredients = [
        document.querySelectorAll('input[type="text"]')[1].value,
        document.querySelectorAll('input[type="text"]')[2].value,
        document.querySelectorAll('input[type="text"]')[3].value
    ];
    let instructions = document.querySelector('textarea').value;

    let recipeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${recipeName}</title>
</head>
<body>
    <h1>${recipeName}</h1>
    <p><strong>Ingredients:</strong></p>
    <ul>
        <li>${ingredients[0]}</li>
        <li>${ingredients[1]}</li>
        <li>${ingredients[2]}</li>
    </ul>
    <p><strong>Instructions:</strong></p>
    <p>${instructions}</p>
</body>
</html>`;

    let blob = new Blob([recipeHTML], { type: 'text/html' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = recipeName + '.html';
    link.click();
});