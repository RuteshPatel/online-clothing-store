from django.db.models import Count, Sum
from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import login

import constant
from products.models import Products, ProductCombination, ProductCombinationImage, Category, Brand, Color, Size, \
    ProductCategory
from users.models import UserAddress, User, Cart, Wishlist, Order, OrderMapping
from users.serializers import CategorySerializer, BrandSerializer, ColorSerializer, SizeSerializer, UserSerializer, \
    AddressSerializer, AddCartSerializer, AddWishlistSerializer
from .paginations import CustomPagination


class LoginView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            users = User.objects.get(username=username)
        except User.DoesNotExist:
            response_data = {
                'status': constant.ERROR,
                'message': constant.CORRECT_USERNAME_PASSWORD,
                'data': request.data
            }
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
        if users.check_password(password):
            token, created = Token.objects.get_or_create(user=users)
            response_data = {
                'status': constant.SUCCESS,
                'message': constant.WELLCOME_MSG.format(module=users.first_name),
                'data': {
                    'token': token.key,
                    'user_id': users.id,
                    'firstname': users.first_name + users.last_name,
                    'email': users.email,
                    'image': constant.LOCAL_SERVER_URL + users.image.url,
                }
            }
            return Response(response_data,
                            status=status.HTTP_200_OK)
        else:
            response_data = {
                'status': constant.ERROR,
                'message': constant.CORRECT_USERNAME_PASSWORD,
                'data': request.data
            }
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get('token')
            token_object = Token.objects.filter(key=token)
            if token_object:
                token_object.delete()
                return Response(
                    {'status': constant.SUCCESS, 'message': 'Logout Successfully'},
                    status=status.HTTP_200_OK)
            else:
                return Response(
                    {'status': constant.ERROR, 'message': 'Token is Invalid'},
                    status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'status': constant.ERROR, 'message': constant.SOMETHING_WRONG},
                            status=status.HTTP_403_FORBIDDEN)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user_data = request.data.pop('personal_data')
        address_data = request.data.pop('address_data')
        user_serializer = UserSerializer(data=user_data)
        address_serializer = AddressSerializer(data=address_data)
        if user_serializer.is_valid() and address_serializer.is_valid():
            user_id = user_serializer.save()
            address_id = address_serializer.save()
            user_address = UserAddress.objects.create(user_id=user_id, address_id=address_id, address_type=0)
            user_address.save()
            return Response(
                {'status': 'Success', 'message': 'User Register Successfully', 'personal_data': user_data,
                 'address_data': address_data},
                status=status.HTTP_200_OK)
        else:
            print(user_serializer.errors)
            print(address_serializer.errors)
            return Response({'status': 'Error', 'message': "Please enter Proper Data"},
                            status=status.HTTP_403_FORBIDDEN)


class MyAddresses(generics.ListCreateAPIView):
    serializer_class = AddressSerializer

    def get(self, request, *args, **kwargs):
        data_dict = {}
        billing_address = []
        delivery_address = []
        user_address = UserAddress.objects.filter(user_id=request.user.id)
        for address in user_address:
            address_dict = {
                'address_id': address.address_id_id,
                'address_1': address.address_id.address_1,
                'address_2': address.address_id.address_2,
                'city': address.address_id.city,
                'state': address.address_id.state,
                'pincode': address.address_id.pin_code,
                'country': address.address_id.country,
            }
            if address.address_type == 0:
                billing_address.append(address_dict)
            else:
                delivery_address.append(address_dict)
        data_dict['billing_address'] = billing_address
        data_dict['delivery_address'] = delivery_address
        return Response(data_dict, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        address_serializer = AddressSerializer(data=request.data)
        if address_serializer.is_valid():
            address_id = address_serializer.save()
            user_address = UserAddress.objects.create(user_id=request.user, address_id=address_id, address_type=1)
            user_address.save()
            return Response(
                {'status': 'Success', 'message': 'Delivery Address Added Successfully', 'data': request.data},
                status=status.HTTP_200_OK)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BrandsListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ColorListView(generics.ListAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class SizeListView(generics.ListAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class ProductListView(generics.ListAPIView):
    queryset = Products.objects.all()
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        queryset = []
        product_id = kwargs.get('product_id')
        if not product_id:
            products_data = Products.objects.select_related('brand_id').all()
            page = self.paginate_queryset(products_data)
            response = self.get_paginated_response(page)
            for products in response.data.get('results'):
                product_combination_data = ProductCombination.objects.filter(product_id=products.id).first()
                product_images = ProductCombinationImage.objects.filter(
                    product_combination_id=product_combination_data.id).order_by('-id').first()
                data_dict = {'product_id': products.id, 'product_name': products.name, 'brand': products.brand_id.name,
                             'prices': product_combination_data.price,
                             'images': constant.LOCAL_SERVER_URL + product_images.image_id.name.url}
                queryset.append(data_dict)
            paginated_dict = {
                'count': response.data.get('count'),
                'next': response.data.get('next'),
                'previous': response.data.get('previous'),
                'total_pages': int(response.data.get('count') / self.pagination_class.page_size),
                'product_details': queryset
            }
            return Response(paginated_dict, status=status.HTTP_200_OK)
        else:
            products_data = Products.objects.select_related('brand_id').get(id=product_id)
            products_category = ProductCategory.objects.select_related('category_id').get(product_id=products_data.id)
            product_info = {'product_id': products_data.id, 'product_name': products_data.name,
                            'brand': products_data.brand_id.name, 'description': products_data.description,
                            'category': products_category.category_id.name}
            get_product_sizes = ProductCombination.objects.filter(product_id=product_id) \
                .values('size_id', 'size_id__short_code').annotate(dcount=Count('size_id'))
            get_product_colors = ProductCombination.objects.filter(product_id=product_id,
                                                                   size_id=get_product_sizes[0].get('size_id')).values(
                'color_id', 'color_id__color_code').annotate(dcount=Count('color_id'))

            get_price_stock_images = ProductCombination.objects.filter(product_id=product_id,
                                                                       size_id=get_product_sizes[0].get('size_id'),
                                                                       color_id=get_product_colors[0].get(
                                                                           'color_id')).first()
            is_cart = None
            is_wishlist = None
            if request.user.id:
                is_cart = Cart.objects.filter(combination_id_id=get_price_stock_images.id,
                                              user_id_id=request.user.id).exists()
                is_wishlist = Wishlist.objects.filter(combination_id_id=get_price_stock_images.id,
                                                      user_id_id=request.user.id).exists()
            data_dict = {
                'product_info': product_info,
                'product_details': {'product_combination_id': get_price_stock_images.id,
                                    'prices': get_price_stock_images.price,
                                    'stock': get_price_stock_images.stock,
                                    'cart': is_cart,
                                    'wishlist': is_wishlist
                                    },
                'size_details': [
                    {'size_id': size.get('size_id'), 'short_code': size.get('size_id__short_code')}
                    for size in get_product_sizes],
                'colors_details': [
                    {'color_id': color.get('color_id'), 'color_code': color.get('color_id__color_code')}
                    for color in get_product_colors],
                'image_details': [constant.LOCAL_SERVER_URL + x.image_id.name.url for x in
                                  ProductCombinationImage.objects.select_related('image_id').filter(
                                      product_combination_id=get_price_stock_images.id)]
            }
            return Response(data_dict, status=status.HTTP_200_OK)


class ProductDetailInfoView(generics.ListAPIView):
    queryset = ProductCombination.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            product_id = kwargs.get('product_id')
            size_id = kwargs.get('size_id')
            color_id = kwargs.get('color_id')

            if not color_id:
                get_product_colors = ProductCombination.objects.filter(product_id=product_id,
                                                                       size_id=size_id).values(
                    'color_id', 'color_id__color_code').annotate(dcount=Count('color_id'))
                get_product_details = ProductCombination.objects.filter(product_id=product_id, size_id=size_id,
                                                                        color_id=get_product_colors[0].get(
                                                                            'color_id')).first()
                is_cart = Cart.objects.filter(combination_id=get_product_details.id).filter(
                    user_id=request.user.id).exists()
                is_wishlist = Wishlist.objects.filter(combination_id=get_product_details.id).filter(
                    user_id=request.user.id).exists()
                data_dict = {
                    'product_details': {
                        'product_combination_id': get_product_details.id,
                        'prices': get_product_details.price,
                        'stock': get_product_details.stock,
                        'cart': is_cart,
                        'wishlist': is_wishlist
                    },
                    'colors_details': [
                        {'color_id': color.get('color_id'), 'color_code': color.get('color_id__color_code')}
                        for color in get_product_colors],
                    'image_details': [constant.LOCAL_SERVER_URL + x.image_id.name.url for x in
                                      ProductCombinationImage.objects.select_related('image_id').filter(
                                          product_combination_id=get_product_details.id)]

                }
            else:
                get_product_details = ProductCombination.objects.filter(product_id=product_id, size_id=size_id,
                                                                        color_id=color_id).first()
                is_cart = Cart.objects.filter(combination_id=get_product_details.id).filter(
                    user_id=request.user.id).exists()
                is_wishlist = Wishlist.objects.filter(combination_id=get_product_details.id).filter(
                    user_id=request.user.id).exists()
                data_dict = {
                    'product_details': {
                        'product_combination_id': get_product_details.id,
                        'prices': get_product_details.price,
                        'stock': get_product_details.stock,
                        'cart': is_cart,
                        'wishlist': is_wishlist
                    },
                    'image_details': [constant.LOCAL_SERVER_URL + x.image_id.name.url for x in
                                      ProductCombinationImage.objects.select_related('image_id').filter(
                                          product_combination_id=get_product_details.id)],
                }
            return Response(data_dict, status=status.HTTP_200_OK)
        except (KeyError, ValueError, ProductCombination.DoesNotExist, AttributeError) as error:
            return Response(error, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response(e, status=status.HTTP_403_FORBIDDEN)


class CartListCreateView(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = AddCartSerializer()
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data_dict = {}
        cart_data_list = []
        cart_data = Cart.objects.filter(user_id=request.user.id).select_related('combination_id')
        total_amount = 0
        for cart in cart_data:
            combination_image = ProductCombinationImage.objects.filter(
                product_combination_id=cart.combination_id_id).select_related('image_id').order_by('-id').first()
            cart_data_list.append({
                'cart_id': cart.id,
                'product_price': cart.combination_id.price,
                'product_name': cart.combination_id.product_id.name,
                'product_image': constant.LOCAL_SERVER_URL + combination_image.image_id.name.url
            })
            total_amount += int(cart.combination_id.price)
        data_dict['cart_data'] = cart_data_list
        data_dict['total_amount'] = total_amount
        return Response(data_dict, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            product_combination_id = request.data.get('product_combination_id')
            is_added_to_cart = Cart.objects.filter(combination_id_id=product_combination_id,
                                                   user_id_id=request.user.id).first()
            if not is_added_to_cart:
                data = {
                    'combination_id': product_combination_id,
                    'user_id': request.user.id
                }
                add_cart_serializer = AddCartSerializer(data=data)
                if add_cart_serializer.is_valid(raise_exception=True):
                    add_cart_serializer.save()
                    response_data = {
                        'is_cart': True,
                        'status': constant.SUCCESS,
                        'message': constant.ADDED_CART
                    }
                    return Response(response_data, status=status.HTTP_202_ACCEPTED)
            else:
                is_added_to_cart.delete()
                response_data = {
                    'is_cart': False,
                    'status': constant.SUCCESS,
                    'message': constant.REMOVED_CART
                }
                return Response(response_data, status=status.HTTP_202_ACCEPTED)
        except (KeyError, Cart.DoesNotExist) as e:
            response_data = {
                'status': constant.ERROR,
                'message': constant.SOMETHING_WRONG
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            cart_id = kwargs.get('cart_id')
            cart_object = Cart.objects.get(id=cart_id, user_id=request.user.id)
            cart_object.delete()
            return Response(
                {'status': constant.SUCCESS, 'message': constant.REMOVED_CART},
                status=status.HTTP_200_OK)
        except (KeyError, Cart.DoesNotExist, AttributeError):
            response_data = {
                'status': constant.ERROR,
                'message': constant.SOMETHING_WRONG
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class HomeInfoView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        total_items = Cart.objects.filter(user_id=request.user.id).count()
        data_dict = {
            "total_items": total_items
        }
        return Response(data_dict, status=status.HTTP_200_OK)


class WishListCreateView(generics.ListCreateAPIView, generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data_dict = {}
        wishlist_data_list = []
        wishlist_data = Wishlist.objects.filter(user_id=request.user.id).select_related('combination_id')
        for wishlist in wishlist_data:
            combination_image = ProductCombinationImage.objects.filter(
                product_combination_id=wishlist.combination_id_id).select_related('image_id').order_by('-id').first()
            wishlist_data_list.append({
                'wishlist_id': wishlist.id,
                'product_price': wishlist.combination_id.price,
                'product_name': wishlist.combination_id.product_id.name,
                'product_image': constant.LOCAL_SERVER_URL + combination_image.image_id.name.url
            })
        data_dict['wishlist_data'] = wishlist_data_list
        return Response(data_dict, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            product_combination_id = request.data.get('product_combination_id')
            is_added_to_wishlist = Wishlist.objects.filter(combination_id_id=product_combination_id,
                                                           user_id_id=request.user.id)
            if not is_added_to_wishlist:
                data = {
                    'combination_id': product_combination_id,
                    'user_id': request.user.id
                }
                add_wishlist_serializer = AddWishlistSerializer(data=data)
                if add_wishlist_serializer.is_valid(raise_exception=True):
                    add_wishlist_serializer.save()
                    response_data = {
                        'is_wishlist': True,
                        'status': constant.SUCCESS,
                        'message': constant.ADDED_WISHLIST
                    }
                    return Response(response_data, status=status.HTTP_202_ACCEPTED)
            else:
                is_added_to_wishlist.delete()
                response_data = {
                    'is_wishlist': False,
                    'status': constant.SUCCESS,
                    'message': constant.REMOVED_WISHLIST
                }
                return Response(response_data, status=status.HTTP_202_ACCEPTED)
        except (KeyError, ProductCombination.DoesNotExist) as e:
            response_data = {
                'status': constant.ERROR,
                'message': constant.SOMETHING_WRONG
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            wishlist_id = kwargs.get('wishlist_id')
            wishlist_object = Wishlist.objects.filter(id=wishlist_id, user_id=request.user.id)
            if wishlist_object:
                wishlist_object.delete()
                return Response(
                    {'status': constant.SUCCESS, 'message': constant.REMOVED_WISHLIST},
                    status=status.HTTP_200_OK)
        except (KeyError, Wishlist.DoesNotExist, AttributeError):
            response_data = {
                'status': constant.ERROR,
                'message': constant.SOMETHING_WRONG
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class MyOrderView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        order_list = []
        get_orders = Order.objects.all()
        for order in get_orders:
            order_mapping_model = OrderMapping.objects.filter(order_id=order.id, user_id=request.user.id)
            for order_map in order_mapping_model:
                product_category = ProductCategory.objects.get(product_id=order_map.combination_id.product_id)
                product_combination = ProductCombination.objects.filter(id=order_map.combination_id.id).order_by(
                    '-id').first()
                product_combination_image = ProductCombinationImage.objects.filter(
                    id=product_combination.id).order_by('-id').first()
                if order.order_status == 0:
                    order_status = 'Shipped'
                elif order.order_status == 1:
                    order_status = 'Accepted'
                elif order.order_status == 2:
                    order_status = 'Delivered'
                elif order.order_status == 3:
                    order_status = 'Cancelled'
                order_list.append({'product_id': order_map.combination_id.product_id, 'status': order_status,
                                   'order_status': order.order_status,
                                   'product_name': order_map.combination_id.product_id.name,
                                   'brand': order_map.combination_id.product_id.brand_id.name,
                                   'category': product_category.category_id.name,
                                   'image': product_combination_image.image_id.name.url,
                                   'price': product_combination.price,
                                   'order_id': order.id})
        return Response(order_list, status=status.HTTP_200_OK)


class ProductFilterView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        return Response(request.data, status=status.HTTP_200_OK)
