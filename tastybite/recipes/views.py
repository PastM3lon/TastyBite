from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json


def welcome_view(request):
    return render(request, 'Welcome.html')


def recipes_list(request):
    recipes = []
    user_favorites = []
    return render(request, 'Recipes.html', {
        'recipes': recipes,
        'user_favorites': user_favorites,
    })


def favorites_view(request):
    favorites = []
    return render(request, 'Favorites.html', {'favorites': favorites})


def search_view(request):
    query = request.GET.get('q', '')
    results = []
    return render(request, 'search.html', {
        'query': query,
        'results': results,
    })


def dish_view(request, slug):
    recipe = None
    return render(request, 'dishes.html', {'recipe': recipe})


def auth_view(request):
    mode = request.GET.get('mode', 'login')
    return render(request, 'auth.html', {'mode': mode})


@login_required
@require_POST
def toggle_favorite(request):
    try:
        data = json.loads(request.body)
        recipe_id = data.get('recipe_id')
        added = False
        return JsonResponse({'added': added, 'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_POST
def remove_favorite(request, id):
    return redirect('favorites')
