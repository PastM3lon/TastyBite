from django.db import migrations, models
from django.utils.text import slugify


def populate_recipe_slugs(apps, schema_editor):
    Recipe = apps.get_model('recipes', 'Recipe')
    used_slugs = set()

    for recipe in Recipe.objects.order_by('id'):
        base_slug = slugify(recipe.name) or f"recipe-{recipe.id}"
        slug = base_slug
        counter = 2

        while slug in used_slugs or Recipe.objects.filter(slug=slug).exclude(pk=recipe.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        recipe.slug = slug
        recipe.save(update_fields=['slug'])
        used_slugs.add(slug)


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=220),
            preserve_default=False,
        ),
        migrations.RunPython(populate_recipe_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='recipe',
            name='slug',
            field=models.SlugField(blank=True, max_length=220, unique=True),
        ),
    ]
