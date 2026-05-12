from django import forms
from django.contrib.auth import authenticate
from .models import User, Recipe, Ingredient, RecipeStep


class LoginForm(forms.Form):
    username = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'you@example.com'})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': '••••••••'})
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if email and password:
            # Find user by email
            try:
                user_obj = User.objects.get(email=email)
                username = user_obj.username
            except User.DoesNotExist:
                raise forms.ValidationError("No account found with that email.")

            user = authenticate(username=username, password=password)
            if user is None:
                raise forms.ValidationError("Incorrect password.")
            if not user.is_active:
                raise forms.ValidationError("This account is disabled.")

            cleaned_data['user'] = user
        return cleaned_data


class SignupForm(forms.Form):
    full_name = forms.CharField(max_length=150)
    email = forms.EmailField()
    password1 = forms.CharField(widget=forms.PasswordInput(), min_length=8)
    password2 = forms.CharField(widget=forms.PasswordInput())
    is_admin = forms.BooleanField(required=False)

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("An account with this email already exists.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password1')
        p2 = cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data


class RecipeForm(forms.ModelForm):
    ingredients = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'id': 'ingredients-data',
            'class': 'hidden-data-field',
            'placeholder': 'Write one ingredient per line, like: 2 cups | Flour',
            'rows': 5,
        }),
        help_text='Write one ingredient per line. Use quantity | ingredient name.',
    )
    instructions = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'id': 'instructions-data',
            'class': 'hidden-data-field',
            'placeholder': 'Write one instruction step per line...',
            'rows': 6,
        }),
        help_text='Write one instruction step per line.',
    )

    class Meta:
        model = Recipe
        fields = ['name', 'image_url', 'summary', 'ingredients', 'instructions']
        widgets = {
            'name': forms.TextInput(attrs={'id': 'recipe-name', 'placeholder': 'e.g. Spaghetti Carbonara'}),
            'image_url': forms.URLInput(attrs={'id': 'recipe-image', 'placeholder': 'https://example.com/image.jpg'}),
            'summary': forms.TextInput(attrs={'id': 'recipe-summary', 'placeholder': "e.g. The ultimate comfort food"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields['ingredients'].initial = "\n".join(
                f"{ingredient.quantity} | {ingredient.name}"
                for ingredient in self.instance.ingredients.all()
            )
            self.fields['instructions'].initial = "\n".join(
                self.instance.steps.values_list('body', flat=True)
            )

    def save(self, commit=True):
        recipe = super().save(commit=commit)
        if commit:
            instruction_lines = [
                line.strip()
                for line in self.cleaned_data.get('instructions', '').splitlines()
                if line.strip()
            ]

            ingredient_lines = [
                line.strip()
                for line in self.cleaned_data.get('ingredients', '').splitlines()
                if line.strip()
            ]
            parsed_ingredients = []
            for line in ingredient_lines:
                if '|' in line:
                    quantity, name = [part.strip() for part in line.split('|', 1)]
                else:
                    quantity, name = '', line
                if quantity or name:
                    parsed_ingredients.append((quantity, name))

            recipe.ingredients.all().delete()
            Ingredient.objects.bulk_create(
                Ingredient(recipe=recipe, quantity=quantity, name=name)
                for quantity, name in parsed_ingredients
            )

            recipe.steps.all().delete()
            RecipeStep.objects.bulk_create(
                RecipeStep(recipe=recipe, order=index, body=body)
                for index, body in enumerate(instruction_lines, start=1)
            )
        return recipe
