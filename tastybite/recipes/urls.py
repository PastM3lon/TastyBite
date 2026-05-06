from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome_view, name='welcome'),
    path('auth/', views.auth_view, name='auth'),
    path('recipes/', views.recipes_list, name='recipes'),
    path('favorites/', views.favorites_view, name='favorites'),
    path('search/', views.search_view, name='search'),
    path('auth/login/', views.auth_view, name='login'),
    path('auth/signup/', views.auth_view, name='signup'),
    path('dish/<slug:slug>/', views.dish_view, name='dish'),
    path('recipe/<int:id>/remove-favorite/', views.remove_favorite, name='remove_favorite'),
    path('recipe/toggle-favorite/', views.toggle_favorite, name='toggle_favorite'),
]