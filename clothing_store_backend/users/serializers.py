import datetime

from django.contrib.auth.hashers import make_password
from django.db.models import Q
from rest_framework import serializers

from products.models import Category, Brand, Color, Size
from users.models import User, Address, Cart, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user_data = User.objects.create(**validated_data)
        user_data.set_password(validated_data.get('password'))
        user_data.save()
        # user_data['user_id'] = user_data.id

        return user_data


class AddCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class AddWishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'
