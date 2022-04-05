from django import forms
from .models import Category, Brand, Size, Color


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'id': 'category_name'})
        }


class BrandsForm(forms.ModelForm):
    class Meta:
        model = Brand
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'id': 'brand_name'})
        }


class SizeForm(forms.ModelForm):
    class Meta:
        model = Size
        fields = ['name', 'short_code']
        widgets = {
            'name': forms.TextInput(attrs={'id': 'size_name'}),
            'short_code': forms.TextInput(attrs={'id': 'short_code'})
        }


class ColorForm(forms.ModelForm):
    class Meta:
        model = Color
        fields = ['color_code']
        widgets = {
            'color_code': forms.TextInput(attrs={'id': 'color_code'}),
        }
