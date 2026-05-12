from django.contrib import admin
from .models import User, Recipe, Ingredient, RecipeStep, Favorite

admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(RecipeStep)
admin.site.register(Favorite)
