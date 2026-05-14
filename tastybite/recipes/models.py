from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.text import slugify


class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        return super().create_superuser(username, email, password, **extra_fields)

class User(AbstractUser):
    # AbstractUser already gives us: username, email, password, first_name, last_name
    # We just add the is_admin flag
    is_admin = models.BooleanField(default=False)
    objects = CustomUserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='recipe_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='recipe_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.email


class Recipe(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    image_url = models.URLField(max_length=500)
    summary = models.CharField(max_length=300, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "recipe"
            slug = base_slug
            counter = 2
            while Recipe.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    quantity = models.CharField(max_length=100)   
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.quantity} {self.name}"


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    order = models.PositiveIntegerField(default=1)
    body = models.TextField()

    class Meta:
        ordering = ['order', 'id']
        unique_together = ('recipe', 'order')

    def __str__(self):
        return f"{self.recipe.name} step {self.order}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')  # prevents duplicate favorites

    def __str__(self):
        return f"{self.user.email} → {self.recipe.name}"
