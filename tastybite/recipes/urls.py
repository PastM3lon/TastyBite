from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome_view, name='welcome'),
    path('auth/', views.auth_view, name='auth'),
    path('auth/login/', views.auth_view, name='login'),
    path('auth/signup/', views.auth_view, name='signup'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('recipes/', views.recipes_list, name='recipes'),
    path('favorites/', views.favorites_view, name='favorites'),
    path('search/', views.search_view, name='search'),
    path('api/search/', views.search_api, name='search_api'),
    path('dish/<slug:slug>/', views.dish_view, name='dish'),
    path('recipe/<int:id>/remove-favorite/', views.remove_favorite, name='remove_favorite'),
    path('recipe/toggle-favorite/', views.toggle_favorite, name='toggle_favorite'),
    # Admin CRUD
    path('admin-panel/', views.admin_view, name='admin_panel'),
    path('admin-panel/add/', views.recipe_add, name='recipe_add'),
    path('admin-panel/edit/<int:id>/', views.recipe_edit, name='recipe_edit'),
    path('admin-panel/delete/<int:id>/', views.recipe_delete, name='recipe_delete'),
]