from django.db import migrations, models
import django.db.models.deletion


DEFAULT_STEPS = {
    'spaghetti-carbonara': [
        'Cook the spaghetti in salted boiling water until al dente, then reserve a little pasta water before draining.',
        'Crisp the pancetta in a pan over medium heat while the pasta cooks.',
        'Whisk eggs and parmesan together, then season with black pepper.',
        'Toss the hot pasta with pancetta, remove from heat, and stir in the egg mixture until glossy.',
        'Loosen with reserved pasta water as needed and serve immediately.',
    ],
    'shawarma': [
        'Mix garlic, cumin, salt, pepper, oil, and lemon juice into a marinade.',
        'Coat the chicken thighs and let them marinate for at least 30 minutes.',
        'Cook the chicken in a hot pan or oven until browned and fully cooked.',
        'Rest briefly, then slice the chicken into thin strips.',
        'Serve in warm pita bread with vegetables and sauce.',
    ],
    'tacos': [
        'Brown the ground beef in a skillet over medium-high heat.',
        'Add chili powder, salt, and a splash of water, then simmer until saucy.',
        'Warm the corn tortillas until soft and flexible.',
        'Fill each tortilla with beef and finish with lime juice.',
        'Serve hot with your favorite toppings.',
    ],
}


def seed_recipe_steps(apps, schema_editor):
    Recipe = apps.get_model('recipes', 'Recipe')
    RecipeStep = apps.get_model('recipes', 'RecipeStep')

    for slug, steps in DEFAULT_STEPS.items():
        try:
            recipe = Recipe.objects.get(slug=slug)
        except Recipe.DoesNotExist:
            continue

        if RecipeStep.objects.filter(recipe=recipe).exists():
            continue

        RecipeStep.objects.bulk_create(
            RecipeStep(recipe=recipe, order=index, body=body)
            for index, body in enumerate(steps, start=1)
        )


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_alter_user_managers'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecipeStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(default=1)),
                ('body', models.TextField()),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='recipes.recipe')),
            ],
            options={
                'ordering': ['order', 'id'],
                'unique_together': {('recipe', 'order')},
            },
        ),
        migrations.RunPython(seed_recipe_steps, migrations.RunPython.noop),
    ]
