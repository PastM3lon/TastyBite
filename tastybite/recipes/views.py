from functools import wraps

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.contrib import messages
from django.db.models import Q
import json

from .models import Recipe, Ingredient, Favorite, User
from .forms import LoginForm, SignupForm, RecipeForm


# ─────────────────────────────────────────
# Helper: build a recipe dict for templates
# ─────────────────────────────────────────
def recipe_to_dict(recipe):
    first_three = recipe.ingredients.all()[:3]
    ingredient_preview = ", ".join(
        f"{i.quantity} {i.name}" for i in first_three
    )
    return {
        'id': recipe.id,
        'title': recipe.name,
        'slug': recipe.slug,
        'image': recipe.image_url,
        'summary': recipe.summary,
        'ingredient_preview': ingredient_preview,
        'ingredients': list(recipe.ingredients.all().values('id', 'name', 'quantity')),
        'steps': list(recipe.steps.all().values('id', 'order', 'body')),
    }


# ─────────────────────────────────────────
# Welcome
# ─────────────────────────────────────────
def welcome_view(request):
    if request.user.is_authenticated:
        return redirect('recipes')
    return render(request, 'Welcome.html')


# ─────────────────────────────────────────
# Recipes list
# ─────────────────────────────────────────
def recipes_list(request):
    all_recipes = Recipe.objects.prefetch_related('ingredients', 'steps').all()

    user_favorites = []
    if request.user.is_authenticated:
        user_favorites = list(
            Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True)
        )
        user_favorites = [str(fid) for fid in user_favorites]

    return render(request, 'Recipes.html', {
        'recipes': all_recipes,
        'user_favorites': user_favorites,
    })


# ─────────────────────────────────────────
# Favorites
# ─────────────────────────────────────────
@login_required
def favorites_view(request):
    fav_recipes = Recipe.objects.filter(
        favorited_by__user=request.user
    ).prefetch_related('ingredients', 'steps')
    return render(request, 'Favorites.html', {'favorites': fav_recipes})


# ─────────────────────────────────────────
# Search
# ─────────────────────────────────────────
def search_view(request):
    query = request.GET.get('q', '').strip()
    results = []
    if query:
        matched = Recipe.objects.filter(
            name__icontains=query
        ).prefetch_related('ingredients', 'steps') | Recipe.objects.filter(
            ingredients__name__icontains=query
        ).prefetch_related('ingredients', 'steps')
        matched = matched.distinct()
        results = matched

    return render(request, 'search.html', {
        'query': query,
        'results': results,
    })


# ─────────────────────────────────────────
# Search API (AJAX)
# ─────────────────────────────────────────
def search_api(request):
    query = request.GET.get('q', '').strip()
    results = []
    
    if query:
        matched = Recipe.objects.filter(
            name__icontains=query
        ).prefetch_related('ingredients', 'steps') | Recipe.objects.filter(
            ingredients__name__icontains=query
        ).prefetch_related('ingredients', 'steps')
        matched = matched.distinct()
        results = [recipe_to_dict(r) for r in matched]
    
    return JsonResponse({'results': results})


# ─────────────────────────────────────────
# Dish detail
# ─────────────────────────────────────────
def dish_view(request, slug):
    lookup = Q(slug=slug)
    if slug.isdigit():
        lookup |= Q(id=int(slug))
    recipe_obj = get_object_or_404(Recipe, lookup)
    return render(request, 'dishes.html', {'recipe': recipe_obj})


# ─────────────────────────────────────────
# Auth — Login & Signup
# ─────────────────────────────────────────
def auth_view(request):
    mode = request.GET.get('mode', 'login')

    if request.user.is_authenticated:
        return redirect('recipes')

    # ── LOGIN ──
    if request.method == 'POST' and request.POST.get('form_type') == 'login':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            login(request, user)
            return redirect('recipes')
        return render(request, 'auth.html', {'mode': 'login', 'form': form})

    # ── SIGNUP ──
    if request.method == 'POST' and request.POST.get('form_type') == 'signup':
        form = SignupForm(request.POST)
        if form.is_valid():
            full_name = form.cleaned_data['full_name'].strip()
            email = form.cleaned_data['email']
            password = form.cleaned_data['password1']
            is_admin = form.cleaned_data['is_admin']

            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_admin=is_admin,
            )
            login(request, user)
            return redirect('recipes')
        return render(request, 'auth.html', {'mode': 'signup', 'form': form})

    # ── GET request ──
    form = LoginForm() if mode == 'login' else SignupForm()
    return render(request, 'auth.html', {'mode': mode, 'form': form})


# ─────────────────────────────────────────
# Logout
# ─────────────────────────────────────────
def logout_view(request):
    logout(request)
    return redirect('welcome')


# ─────────────────────────────────────────
# Toggle Favorite (AJAX)
# ─────────────────────────────────────────
@login_required
@require_POST
def toggle_favorite(request):
    try:
        data = json.loads(request.body)
        recipe_id = data.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        fav, created = Favorite.objects.get_or_create(
            user=request.user, recipe=recipe
        )
        if not created:
            fav.delete()
            added = False
        else:
            added = True

        return JsonResponse({'added': added, 'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


# ─────────────────────────────────────────
# Remove Favorite
# ─────────────────────────────────────────
@login_required
@require_POST
def remove_favorite(request, id):
    recipe = get_object_or_404(Recipe, id=id)
    Favorite.objects.filter(user=request.user, recipe=recipe).delete()
    return redirect('favorites')


# ─────────────────────────────────────────
# Admin — CRUD
# ─────────────────────────────────────────
def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')
        if not (request.user.is_admin or request.user.is_superuser):
            return redirect('recipes')
        return view_func(request, *args, **kwargs)
    return wrapper


@admin_required
def admin_view(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('admin_panel')
    else:
        form = RecipeForm()

    recipes = Recipe.objects.prefetch_related('ingredients', 'steps').all()
    return render(request, 'Admin.html', {'form': form, 'recipes': recipes})


@admin_required
def recipe_add(request):
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('admin_panel')
    else:
        form = RecipeForm()
    return render(request, 'recipe_form.html', {'form': form, 'action': 'Add'})


@admin_required
def recipe_edit(request, id):
    recipe = get_object_or_404(Recipe, id=id)
    if request.method == 'POST':
        form = RecipeForm(request.POST, instance=recipe)
        if form.is_valid():
            form.save()
            return redirect('admin_panel')
    else:
        form = RecipeForm(instance=recipe)
    return render(request, 'recipe_form.html', {'form': form, 'action': 'Edit'})


@admin_required
@require_POST
def recipe_delete(request, id):
    recipe = get_object_or_404(Recipe, id=id)
    recipe.delete()
    return redirect('admin_panel')
