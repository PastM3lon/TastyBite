from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome_view, name='welcome'),
path('recipes/', views.recipes_list, name='recipes_list'),
path('favorites/', views.favorites_view, name='favorites'),
path('search/', views.search_view, name='search'),
path('dishes/', views.dishes_view, name='dishes'),
path('auth/', views.auth_view, name='auth'),
]