from django.shortcuts import render

from django.shortcuts import render

def welcome_view(request):
    return render(request, 'welcome.html')


def recipes_list(request):
    return render(request, 'recipes_list.html')


def favorites_view(request):
    return render(request, 'favorites.html')


def search_view(request):
    return render(request, 'search.html')


def dishes_view(request):
    return render(request, 'dishes.html')


def auth_view(request):
    return render(request, 'auth.html')
