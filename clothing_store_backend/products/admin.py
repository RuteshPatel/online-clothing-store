from django.contrib import admin
from products.models import Brand, Products, Category, ProductCategory, Size, Color, Images, ProductCombinationImage, \
    ProductCombination

# Register your models here.
admin.site.register(Brand)
admin.site.register(Products)
admin.site.register(Category)
admin.site.register(ProductCategory)
admin.site.register(Size)
admin.site.register(Color)
admin.site.register(Images)
admin.site.register(ProductCombinationImage)
admin.site.register(ProductCombination)
