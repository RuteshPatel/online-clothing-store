from django.db import models


# Create your models here.
class BaseModel(models.Model):
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Products(BaseModel):
    name = models.CharField(max_length=200)
    description = models.TextField()
    brand_id = models.ForeignKey(Brand, on_delete=models.CASCADE)

    def __str__(self):
        return self.name + ' ' + self.brand_id.name


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.product_id.name + ' ' + self.category_id.name


class Size(models.Model):
    name = models.CharField(max_length=50)
    short_code = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Color(models.Model):
    color_code = models.CharField(max_length=20)


class Images(models.Model):
    name = models.ImageField(upload_to="product_images")


class ProductCombination(models.Model):
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE)
    size_id = models.ForeignKey(Size, on_delete=models.CASCADE)
    color_id = models.ForeignKey(Color, on_delete=models.CASCADE)
    price = models.CharField(max_length=10)
    stock = models.IntegerField()


class ProductCombinationImage(models.Model):
    product_combination_id = models.ForeignKey(ProductCombination, on_delete=models.CASCADE)
    image_id = models.ForeignKey(Images, on_delete=models.CASCADE)
