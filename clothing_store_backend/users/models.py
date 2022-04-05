from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

from products.models import ProductCombination, BaseModel, Products


class User(AbstractUser):
    phone = models.CharField(max_length=10)
    image = models.ImageField(upload_to="user_images", default='default.png')


class Address(models.Model):
    address_1 = models.CharField(max_length=100)
    address_2 = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pin_code = models.IntegerField()
    country = models.CharField(max_length=100)


class UserAddress(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
    ADDRESS_TYPES = [(0, 'Billing'), (1, 'Delivery')]
    address_type = models.IntegerField(choices=ADDRESS_TYPES, default=0)


class Cart(models.Model):
    combination_id = models.ForeignKey(ProductCombination, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Wishlist(models.Model):
    combination_id = models.ForeignKey(ProductCombination, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Order(BaseModel):
    billing_address_id = models.ForeignKey(UserAddress, on_delete=models.CASCADE, related_name="billing_address")
    address_id = models.ForeignKey(UserAddress, on_delete=models.CASCADE)
    ORDER_TYPES = [(0, 'Shipped'), (1, 'Accepted'), (2, 'Delivered'), (3, 'Cancelled')]
    order_status = models.IntegerField(choices=ORDER_TYPES, default=0)


class OrderMapping(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    combination_id = models.ForeignKey(ProductCombination, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Payment(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    is_paid = models.BooleanField(default=False)
    total_amount = models.FloatField(default=0)
