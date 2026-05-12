from django.test import TestCase
from django.urls import reverse

from .models import Ingredient, Recipe, RecipeStep, User


class RecipeRouteTests(TestCase):
    def setUp(self):
        self.recipe = Recipe.objects.create(
            name='Spaghetti Carbonara',
            image_url='https://example.com/carbonara.jpg',
            summary='Roman comfort food',
        )
        Ingredient.objects.create(
            recipe=self.recipe,
            quantity='400g',
            name='Spaghetti',
        )
        RecipeStep.objects.create(
            recipe=self.recipe,
            order=1,
            body='Cook the pasta until al dente.',
        )

    def test_recipes_page_lists_recipe_with_slug_link(self):
        response = self.client.get(reverse('recipes'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Spaghetti Carbonara')
        self.assertContains(response, f"/dish/{self.recipe.slug}/")

    def test_dish_page_supports_slug_and_legacy_id(self):
        slug_response = self.client.get(reverse('dish', args=[self.recipe.slug]))
        id_response = self.client.get(reverse('dish', args=[str(self.recipe.id)]))

        self.assertEqual(slug_response.status_code, 200)
        self.assertEqual(id_response.status_code, 200)
        self.assertContains(slug_response, '400g Spaghetti')
        self.assertContains(slug_response, 'Cook the pasta until al dente.')

    def test_dish_page_does_not_show_empty_instruction_message_when_steps_exist(self):
        response = self.client.get(reverse('dish', args=[self.recipe.slug]))

        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, 'No instruction steps added.')

    def test_search_matches_recipe_and_ingredient_names(self):
        recipe_response = self.client.get(reverse('search'), {'q': 'Carbonara'})
        ingredient_response = self.client.get(reverse('search'), {'q': 'Spaghetti'})

        self.assertEqual(recipe_response.status_code, 200)
        self.assertEqual(ingredient_response.status_code, 200)
        self.assertContains(recipe_response, 'Spaghetti Carbonara')
        self.assertContains(ingredient_response, 'Spaghetti Carbonara')


class AdminPanelAccessTests(TestCase):
    def test_non_admin_user_is_redirected_from_admin_panel(self):
        user = User.objects.create_user(
            username='user@example.com',
            email='user@example.com',
            password='password123',
        )
        self.client.force_login(user)

        response = self.client.get(reverse('admin_panel'))

        self.assertRedirects(response, reverse('recipes'))

    def test_custom_admin_can_access_admin_panel(self):
        user = User.objects.create_user(
            username='admin@example.com',
            email='admin@example.com',
            password='password123',
            is_admin=True,
        )
        self.client.force_login(user)

        response = self.client.get(reverse('admin_panel'))

        self.assertEqual(response.status_code, 200)

    def test_superuser_can_access_custom_admin_panel(self):
        user = User.objects.create_superuser(
            username='super@example.com',
            email='super@example.com',
            password='password123',
        )
        self.client.force_login(user)

        response = self.client.get(reverse('admin_panel'))

        self.assertEqual(response.status_code, 200)

    def test_created_superuser_is_custom_admin(self):
        user = User.objects.create_superuser(
            username='owner@example.com',
            email='owner@example.com',
            password='password123',
        )

        self.assertTrue(user.is_admin)

    def test_admin_user_sees_admin_nav_link(self):
        user = User.objects.create_user(
            username='nav-admin@example.com',
            email='nav-admin@example.com',
            password='password123',
            is_admin=True,
        )
        self.client.force_login(user)

        response = self.client.get(reverse('recipes'))

        self.assertContains(response, reverse('admin_panel'))

    def test_admin_panel_uses_dashboard_layout(self):
        user = User.objects.create_user(
            username='layout-admin@example.com',
            email='layout-admin@example.com',
            password='password123',
            is_admin=True,
        )
        self.client.force_login(user)

        response = self.client.get(reverse('admin_panel'))

        self.assertContains(response, 'Admin Dashboard')
        self.assertContains(response, 'Add a New Recipe')
        self.assertContains(response, 'Existing Recipes')
        self.assertContains(response, 'id="add-ingredient-btn"')
        self.assertContains(response, 'id="add-instruction-btn"')

    def test_admin_panel_can_create_recipe_with_ingredients_and_steps(self):
        user = User.objects.create_user(
            username='create-admin@example.com',
            email='create-admin@example.com',
            password='password123',
            is_admin=True,
        )
        self.client.force_login(user)

        response = self.client.post(reverse('admin_panel'), {
            'name': 'Tomato Soup',
            'image_url': 'https://example.com/soup.jpg',
            'summary': 'A bright weeknight soup',
            'ingredients': '2 cups | Tomatoes\n1 tsp | Salt',
            'instructions': 'Simmer the tomatoes.\nBlend until smooth.',
        })

        recipe = Recipe.objects.get(slug='tomato-soup')
        self.assertRedirects(response, reverse('admin_panel'))
        self.assertEqual(recipe.ingredients.count(), 2)
        self.assertEqual(recipe.steps.count(), 2)

    def test_recipe_edit_page_uses_dynamic_rows(self):
        user = User.objects.create_user(
            username='edit-layout-admin@example.com',
            email='edit-layout-admin@example.com',
            password='password123',
            is_admin=True,
        )
        recipe = Recipe.objects.create(
            name='Edit Soup',
            image_url='https://example.com/edit-soup.jpg',
            summary='A soup to edit',
        )
        Ingredient.objects.create(recipe=recipe, quantity='1 cup', name='Stock')
        RecipeStep.objects.create(recipe=recipe, order=1, body='Warm the stock.')
        self.client.force_login(user)

        response = self.client.get(reverse('recipe_edit', args=[recipe.id]))

        self.assertContains(response, 'id="add-ingredient-btn"')
        self.assertContains(response, 'id="add-instruction-btn"')
        self.assertContains(response, 'Stock')
        self.assertContains(response, 'Warm the stock.')
