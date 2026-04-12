// let addrecipeBtn = document.getElementById('add-recipe-btn');
// let adminForm = document.querySelectorAll('.admin-form');
// addrecipeBtn.addEventListener('click', () => {
//     adminForm.forEach(form => {
//     form.hidden = !form.hidden;
// });
//     });
// const addBtn = document.getElementById('add-ingredient-btn');
// const list = document.getElementById('ingredients-list');

// addBtn.addEventListener('click', () => {
//     const row = document.createElement('div');
//     row.className = 'ingredient-row';
//     row.innerHTML = `
//         <input type="text" name="quantity[]" placeholder="2 cups">
//         <input type="text" name="ingredient[]" placeholder="Ingredient name">
//         <button type="button" class="remove-btn">&#10005;</button>
//     `;
//     list.appendChild(row);
//     attachRemove(row.querySelector('.remove-btn'));
// });

// function attachRemove(btn) {
//     btn.addEventListener('click', () => {
//         btn.closest('.ingredient-row').remove();
//     });
// }

// document.querySelectorAll('.remove-btn').forEach(attachRemove);