from django.contrib import admin
from django.urls import path, include
from .views import ProductListView, CategoryListView, BrandsListView, ColorListView, SizeListView, \
    ProductDetailInfoView, CartListCreateView, UserRegistrationView, LoginView, LogoutView, HomeInfoView, \
    WishListCreateView, MyOrderView, MyAddresses, ProductFilterView

urlpatterns = [
    # path('rest-auth/', include('rest_auth.urls')),
    # Home Page
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('registration/', UserRegistrationView.as_view(), name="registration"),
    path('home-info', HomeInfoView.as_view(), name="home-info"),

    # Product Listing Page
    path('products-list', ProductListView.as_view(), name="products-list"),
    path('category-list', CategoryListView.as_view(), name="category-list"),
    path('brands-list', BrandsListView.as_view(), name="brands-list"),
    path('color-list', ColorListView.as_view(), name="color-list"),
    path('sizes-list', SizeListView.as_view(), name="sizes-list"),
    path('filter-product/', ProductFilterView.as_view(), name="filter-product"),

    # Product Detail Page URLS
    path('product-details/<int:product_id>', ProductListView.as_view(), name="product-details"),
    path('product-detail-info/<int:product_id>/<int:size_id>', ProductDetailInfoView.as_view(),
         name="color-price-stock-details"),
    path('product-detail-info/<int:product_id>/<int:size_id>/<int:color_id>', ProductDetailInfoView.as_view(),
         name="price-stock-details"),

    # Cart URLS
    # path('add-cart/<int:product_combination_id>', CartListCreateView.as_view(), name="add-cart"),
    path('add-cart/', CartListCreateView.as_view(), name="add-cart"),
    path('my-cart', CartListCreateView.as_view(), name="my-cart"),
    path('remove-cart/<int:cart_id>', CartListCreateView.as_view(), name="remove-cart"),

    # Wishlist URLS
    path('my-wishlist', WishListCreateView.as_view(), name="my-wishlist"),
    # path('add-wishlist/<int:product_combination_id>', WishListCreateView.as_view(), name="add-wishlist"),
    path('add-wishlist/', WishListCreateView.as_view(), name="add-wishlist"),
    path('remove-wishlist/<int:wishlist_id>', WishListCreateView.as_view(), name="remove-wishlist"),

    # Checkout Page URLS
    path('my-orders', MyOrderView.as_view(), name="my-orders"),

    # Checkout Page URLS
    path('get-address', MyAddresses.as_view(), name="get-address"),
    path('add-address/', MyAddresses.as_view(), name="add-address"),
]
