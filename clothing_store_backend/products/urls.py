"""clothing_store URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from products.views import LoginView, LogoutView, DashboardView, CategoryList, CategoryCreateView, \
    BrandsList, BrandsCreateView, SizeList, SizeCreateView, ColorList, ColorCreateView, ProductsList, ProductCreateView, \
    UsersList, OrdersList, CancelOrdersList

urlpatterns = [
    path('', LoginView.as_view(), name="login"),
    path('logout', LogoutView.as_view(), name="logout"),
    path('dashboard', DashboardView.as_view(), name="dashboard"),

    # Category Part
    path('category-list', CategoryList.as_view(), name="category-list"),
    path('category-add', CategoryCreateView.as_view(), name="category-add"),
    path('category-add/<int:category_id>/', CategoryCreateView.as_view(), name="category-update"),

    # Brands Part
    path('brands-list', BrandsList.as_view(), name="brands-list"),
    path('brands-add', BrandsCreateView.as_view(), name="brands-add"),
    path('brands-add/<int:brand_id>/', BrandsCreateView.as_view(), name="brands-update"),

    # Size Part
    path('size-list', SizeList.as_view(), name="size-list"),
    path('size-add', SizeCreateView.as_view(), name="size-add"),
    path('size-add/<int:size_id>/', SizeCreateView.as_view(), name="size-update"),

    # Color Part
    path('color-list', ColorList.as_view(), name="color-list"),
    path('color-add', ColorCreateView.as_view(), name="color-add"),
    path('color-add/<int:color_id>/', ColorCreateView.as_view(), name="color-update"),

    # Products Part
    path('product-list', ProductsList.as_view(), name="product-list"),
    path('product-add', ProductCreateView.as_view(), name="product-add"),
    path('product-add/<int:product_id>/', ProductCreateView.as_view(), name="product-update"),
    path('product-details/<int:product_id>/', ProductsList.as_view(), name="product-details"),

    # User Part
    path('user-list', UsersList.as_view(), name="users-list"),
    path('orders-list', OrdersList.as_view(), name="orders-list"),
    path('cancel-orders-list', CancelOrdersList.as_view(), name="cancel-orders-list"),
    path('update-status', OrdersList.as_view(), name="update-status"),
]
