from django.shortcuts import render

# Create your views here.
import json
import os.path

from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q, Count, Sum
from django.http import JsonResponse
from django.shortcuts import render, redirect
# from django.views.generic import ListView,
from django.views import View

from clothing_store_backend import settings
from products.forms import CategoryForm, BrandsForm, SizeForm, ColorForm
from products.models import Products, Category, Brand, Size, Color, ProductCategory, Images, ProductCombinationImage, \
    ProductCombination
from users.models import User, Order, UserAddress, OrderMapping
import constant

from utils import BarChartWeekWiseData, DateRageCalculation


class LoginView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard')
        return render(request, 'login.html', {'title': constant.LOGIN})

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                messages.error(request, constant.CORRECT_USERNAME_PASSWORD)
                return render(request, 'login.html')

        if user.check_password(password):
            messages.success(request, constant.WELLCOME_MSG.replace('{module}', user.username))
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            if 'next' in request.META.get('HTTP_REFERER'):
                redirect_url = request.META.get('HTTP_REFERER').split('/')[-1]
            else:
                redirect_url = 'dashboard'
            return redirect(redirect_url)


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('login')


class DashboardView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        # Week wise Bar Chart
        bar_chart_data = BarChartWeekWiseData()

        # Total Income
        income_date_data = DateRageCalculation()
        start_week = income_date_data[0]
        end_week = income_date_data[1]
        total_income = OrderMapping.objects.filter(order_id__order_status=2).filter(
            order_id__created_datetime__range=[start_week, end_week]).aggregate(
            total_income=Sum('combination_id__price'))
        context = {'user_count': User.objects.filter(is_superuser=False).count(),
                   'total_orders': Order.objects.all().count(),
                   'total_purchase_orders': Order.objects.filter(order_status=2).count(),
                   'total_cancel_orders': Order.objects.filter(order_status=3).count(), 'users': self.request.user,
                   'title': constant.DASHBOARD,
                   'total_income': total_income['total_income'] if total_income[
                       'total_income'] else 0, 'chart_data': bar_chart_data}
        return render(request, 'dashboard.html', context)


class CategoryList(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = Category.objects.all()
        context = {'header': constant.PRODUCT, 'card_title': constant.ADD.replace('{module}', constant.CATEGORY),
                   'sub_header': constant.MODULE_LISTING.replace('{module}', constant.CATEGORY), 'categories': queryset,
                   "title": constant.CATEGORY}
        return render(request, 'category_list.html', context)


class CategoryCreateView(LoginRequiredMixin, View):
    form = CategoryForm

    def get(self, request, *args, **kwargs):
        context = {'enter_name': constant.ENTER_FIELD_NAME.replace('{fieldname}', constant.NAME),
                   'proper_name': constant.PROPER_FIELD_NAME.replace('{fieldname}', constant.NAME)}
        category_id = kwargs.get('category_id')
        if category_id:
            get_category_data = Category.objects.get(id=category_id)
            context['category_id'] = category_id
            context['title'] = constant.UPDATE.replace('{module}', constant.CATEGORY)
            context['form'] = CategoryForm(initial={'name': get_category_data.name})
        else:
            context['title'] = constant.ADD.replace('{module}', constant.CATEGORY)
            context['form'] = self.form
        return render(request, 'category_form.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            category_name = form_data.get('name')
            category_id = form_data.get('category_id')
            if not category_id:
                category_exists = Category.objects.filter(name=category_name).exists()
                if not category_exists:
                    category_model = Category(name=category_name)
                    category_model.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ADDED_SUCCESSFULLY.replace('{module}', constant.CATEGORY)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.CATEGORY)
            else:
                category_exists = Category.objects.filter(name=category_name).exclude(id=category_id).exists()
                if not category_exists:
                    category_object = Category.objects.get(id=category_id)
                    category_object.name = category_name
                    category_object.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.CATEGORY)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.CATEGORY)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(
                constant.EXCEPTION_RAISED.replace('{module}', 'Category Create View Post method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)

    def delete(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            category_id = form_data.get('id')
            category_models = Category.objects.get(id=category_id)
            category_models.delete()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.DELETED_SUCCESSFULLY.replace('{module}', constant.CATEGORY)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(
                constant.EXCEPTION_RAISED.replace('{module}', 'Category Delete View Post method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class BrandsList(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = Brand.objects.all()
        context = {'header': constant.PRODUCT, 'card_title': constant.ADD.replace('{module}', constant.BRAND),
                   'sub_header': constant.MODULE_LISTING.replace('{module}', constant.BRAND), 'brands': queryset,
                   "title": constant.BRAND}
        return render(request, 'brands_list.html', context)


class BrandsCreateView(LoginRequiredMixin, View):
    form = BrandsForm

    def get(self, request, *args, **kwargs):
        context = {}
        brand_id = kwargs.get('brand_id')
        if brand_id:
            get_brand_data = Brand.objects.get(id=brand_id)
            context['brand_id'] = brand_id
            context['title'] = constant.UPDATE.replace('{module}', constant.BRAND)
            context['form'] = BrandsForm(initial={'name': get_brand_data.name})
        else:
            context['title'] = constant.ADD.replace('{module}', constant.BRAND)
            context['form'] = self.form
        return render(request, 'brands_form.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            brand_name = form_data.get("name")
            brand_id = form_data.get("brand_id")
            brand_exists = Brand.objects.filter(name=brand_name)
            if not brand_id:
                if not brand_exists:
                    brand_model = Brand(name=brand_name)
                    brand_model.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ADDED_SUCCESSFULLY.replace('{module}', constant.BRAND)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.BRAND)
            else:
                brand_exists = Brand.objects.filter(name=brand_name).exclude(id=brand_id).exists()
                if not brand_exists:
                    brand_object = Brand.objects.get(id=brand_id)
                    brand_object.name = brand_name
                    brand_object.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.BRAND)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.BRAND)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'Brand Create View Post method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)

    def delete(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            brand_id = form_data.get('id')
            brand_models = Brand.objects.get(id=brand_id)
            brand_models.delete()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.DELETED_SUCCESSFULLY.replace('{module}', constant.BRAND)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(
                constant.EXCEPTION_RAISED.replace('{module}', 'Brand Create View Delete method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class SizeList(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = Size.objects.all()
        context = {'header': constant.PRODUCT, 'card_title': constant.ADD.replace('{module}', constant.SIZE),
                   'sub_header': constant.MODULE_LISTING.replace('{module}', constant.SIZE), 'sizes': queryset,
                   "title": constant.SIZE}
        return render(request, 'size_list.html', context)


class SizeCreateView(LoginRequiredMixin, View):
    form = SizeForm

    def get(self, request, *args, **kwargs):
        context = {}
        size_id = kwargs.get('size_id')
        if size_id:
            get_size_data = Size.objects.get(id=size_id)
            context['size_id'] = size_id
            context['title'] = constant.UPDATE.replace('{module}', constant.SIZE)
            context['form'] = SizeForm(initial={'name': get_size_data.name, 'short_code': get_size_data.short_code})
        else:
            context['title'] = constant.ADD.replace('{module}', constant.SIZE)
            context['form'] = self.form
        return render(request, 'size_form.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            size_name = form_data.get("name")
            short_code = form_data.get("short_code")
            size_id = form_data.get("size_id")
            size_exists = Size.objects.filter(Q(name=size_name) | Q(short_code=short_code))
            if not size_id:
                if not size_exists:
                    size_model = Size(name=size_name, short_code=short_code)
                    size_model.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ADDED_SUCCESSFULLY.replace('{module}', constant.SIZE)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.SIZE)
            else:
                size_exists = Size.objects.filter(Q(name=size_name) | Q(short_code=short_code)).exclude(
                    id=size_id).exists()
                if not size_exists:
                    size_object = Size.objects.get(id=size_id)
                    size_object.name = size_name
                    size_object.short_code = short_code
                    size_object.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.SIZE)
                else:
                    context['status'] = constant.ERROR
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.SIZE)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'Size Create View Post method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)

    def delete(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            size_id = form_data.get('id')
            size_models = Size.objects.get(id=size_id)
            size_models.delete()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.DELETED_SUCCESSFULLY.replace('{module}', constant.SIZE)
        except (TypeError, IndexError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'Size Create View Delete method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class ColorList(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = Color.objects.all()
        context = {'header': constant.PRODUCT, 'card_title': constant.ADD.replace('{module}', constant.COLOR),
                   'sub_header': constant.MODULE_LISTING.replace('{module}', constant.COLOR), 'colors': queryset,
                   "title": constant.COLOR}
        return render(request, 'color_list.html', context)


class ColorCreateView(LoginRequiredMixin, View):
    form = ColorForm

    def get(self, request, *args, **kwargs):
        context = {}
        color_id = kwargs.get('color_id')
        if color_id:
            get_color_data = Color.objects.get(id=color_id)
            context['color_id'] = color_id
            context['title'] = constant.UPDATE.replace('{module}', constant.COLOR)
            context['form'] = ColorForm(initial={'color_code': get_color_data.color_code})
        else:
            context['title'] = constant.ADD.replace('{module}', constant.COLOR)
            context['form'] = self.form
        return render(request, 'color_form.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            color_code = form_data.get("color_code")
            color_id = form_data.get("color_id")
            color_exists = Color.objects.filter(color_code=color_code)
            if not color_id:
                if not color_exists:
                    color_model = Color(color_code=color_code)
                    color_model.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ADDED_SUCCESSFULLY.replace('{module}', constant.COLOR)
                else:
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.COLOR)
            else:
                color_exists = Color.objects.filter(color_code=color_code).exclude(id=color_id).exists()
                if not color_exists:
                    color_object = Color.objects.get(id=color_id)
                    color_object.color_code = color_code
                    color_object.save()
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.COLOR)
                else:
                    context['status'] = constant.SUCCESS
                    context['messages'] = constant.ALREADY_EXISTS.replace('{module}', constant.COLOR)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'Color Create View Post method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)

    def delete(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            color_id = form_data.get('id')
            color_models = Color.objects.get(id=color_id)
            color_models.delete()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.DELETED_SUCCESSFULLY.replace('{module}', constant.COLOR)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(
                constant.EXCEPTION_RAISED.replace('{module}', 'Color Create View Delete method').replace('{error}', e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class ProductsList(LoginRequiredMixin, View):
    model = Products

    def get(self, request, *args, **kwargs):
        context = {'header': constant.PRODUCT, 'card_title': constant.ADD.replace('{module}', constant.PRODUCT)}
        product_id = kwargs.get('product_id')
        queryset = []
        if not product_id:
            product_data = Products.objects.select_related('brand_id').all()
            for product in product_data:
                category = ProductCategory.objects.select_related('category_id').get(product_id=product.id)

                combination_data = ProductCombination.objects.filter(product_id=product.id)
                # images = [x.image_id.name for x in
                #           ProductImage.objects.select_related('image_id').filter(product_id=product.id)]

                data_dict = {'id': product.id, 'name': product.name, 'brands': product.brand_id.name,
                             'category': category.category_id.name, 'combination_data': combination_data}
                queryset.append(data_dict)
            context['products'] = queryset
            context['title'] = constant.PRODUCT
            context['sub_header'] = constant.MODULE_LISTING.replace('{module}', constant.PRODUCT)
            return render(request, 'products_list.html', context)
        else:
            product = Products.objects.select_related('brand_id').get(id=product_id)
            category = ProductCategory.objects.select_related('category_id').get(product_id=product_id)
            images = [x.image_id.name for x in
                      ProductCombinationImage.objects.select_related('image_id').filter(product_id=product_id)]
            combination_data = ProductCombination.objects.filter(product_id=product.id)
            data_dict = {'id': product.id, 'name': product.name,
                         'brands': product.brand_id.name, 'category': category.category_id.name, 'images': images,
                         'description': product.description, 'combination_data': combination_data}
            context['products'] = data_dict
            context['title'] = constant.PRODUCT
            context['sub_header'] = constant.MODULE_DETAILS.replace('{module}', constant.PRODUCT)
            return render(request, 'products_detail.html', context)


class ProductCreateView(LoginRequiredMixin, View):
    model = Products

    def get(self, request, *args, **kwargs):
        context = {}
        categories = Category.objects.all()
        brands = Brand.objects.all()
        colors = Color.objects.all()
        sizes = Size.objects.all()

        context['categories'] = categories
        context['brands'] = brands
        context['colors'] = colors
        context['sizes'] = sizes
        product_id = kwargs.get('product_id')
        if product_id:
            context['product_id'] = product_id
            context['title'] = constant.UPDATE.replace('{module}', constant.PRODUCT)

            product = Products.objects.get(id=product_id)
            category = ProductCategory.objects.get(product_id=product_id)
            # images = [x.image_id.name for x in
            #           ProductCombinationImage.objects.select_related('image_id').filter(product_id=product_id)]
            product_combination = ProductCombination.objects.filter(product_id=product_id)
            product_count = len(product_combination) - 1
            data_dict = {'id': product.id, 'name': product.name, 'brands': product.brand_id.id,
                         'category': category.category_id.id, 'description': product.description,
                         'product_combination': product_combination, 'product_count': product_count}
            context['products'] = data_dict
            context['header'] = constant.PRODUCT
            context['card_title'] = constant.UPDATE.replace('{module}', constant.PRODUCT)
            context['sub_header'] = constant.UPDATE.replace('{module}', constant.PRODUCT)
        else:
            context['title'] = constant.ADD.replace('{module}', constant.PRODUCT)
            context['header'] = constant.PRODUCT
            context['card_title'] = constant.ADD.replace('{module}', constant.PRODUCT)
            context['sub_header'] = constant.ADD.replace('{module}', constant.PRODUCT)

        return render(request, 'product_form.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        total_rows = request.POST.get('total_rows')
        category = request.POST.get('category')
        product_name = request.POST.get('product_name')
        brands = request.POST.get('brands')
        description = request.POST.get('description')
        # images = request.FILES.getlist('images')
        product_id = request.POST.get('product_id')
        try:
            category_objects = Category.objects.get(id=category)
            brand_object = Brand.objects.get(id=brands)
            if not product_id:
                product_model = Products(name=product_name, description=description, brand_id=brand_object)
                product_model.save()
                product_object = Products.objects.get(id=product_model.id)

                product_category_model = ProductCategory(category_id=category_objects, product_id=product_object)
                product_category_model.save()
                for i in range(0, int(total_rows) + 1):
                    size = request.POST.get('sizes_' + str(i))
                    color = request.POST.get('colors_' + str(i))
                    prices = request.POST.get('prices_' + str(i))
                    stocks = request.POST.get('stocks_' + str(i))
                    images = request.FILES.getlist('images_' + str(i))
                    size_objects = Size.objects.get(id=size)
                    color_objects = Color.objects.get(id=color)

                    product_combination = ProductCombination(product_id=product_object, color_id=color_objects,
                                                             size_id=size_objects, price=prices, stock=stocks)
                    product_combination.save()
                    product_combination_object = ProductCombination.objects.get(id=product_combination.id)
                    for image in images:
                        images_model = Images(name=image)
                        images_model.save()
                        image_object = Images.objects.get(id=images_model.id)

                        product_image_model = ProductCombinationImage(product_combination_id=product_combination_object,
                                                                      image_id=image_object)
                        product_image_model.save()
                messages.success(request, constant.ADDED_SUCCESSFULLY.replace('{module}', constant.PRODUCT))
            else:
                product_object = Products.objects.get(id=product_id)
                product_object.name = product_name
                product_object.description = description
                product_object.brand_id = brand_object
                product_object.save()
                product_category = ProductCategory.objects.get(product_id=product_id)
                if product_category.category_id != category:
                    product_category.category_id = category_objects
                    product_category.save()

                for i in range(0, int(total_rows) + 1):
                    size = request.POST.get('sizes_' + str(i))
                    color = request.POST.get('colors_' + str(i))
                    prices = request.POST.get('prices_' + str(i))
                    stocks = request.POST.get('stocks_' + str(i))
                    images = request.FILES.getlist('images_' + str(i))

                    check_product_combination = ProductCombination.objects.filter(size_id=size, color_id=color,
                                                                                  product_id=product_id).first()
                    if check_product_combination:
                        check_product_combination.price = prices
                        check_product_combination.stock = stocks
                        check_product_combination.save()

                        for image in images:
                            image_object = Images.objects.filter(name=image)
                            if image_object:
                                image_id = image_object.id
                            else:
                                images_model = Images(name=image)
                                images_model.save()
                                image_id = Images.objects.get(id=images_model.id)
                            product_image_model = ProductCombinationImage.objects.get(
                                product_combination_id=check_product_combination.id)
                            if not product_image_model:
                                product_combination_image_model = ProductCombinationImage(
                                    product_combination_id=check_product_combination,
                                    image_id=image_id)
                                product_combination_image_model.save()
                            else:
                                product_image_model.image_id = image_id
                                product_image_model.save()
                    else:
                        size_objects = Size.objects.get(id=size)
                        color_objects = Color.objects.get(id=color)
                        product_combination = ProductCombination(product_id=product_object, color_id=color_objects,
                                                                 size_id=size_objects,
                                                                 price=prices, stock=stocks)
                        product_combination.save()
                        product_combination_object = ProductCombination.objects.get(id=product_combination.id)
                        for image in images:
                            image_object = Images.objects.filter(name=image)
                            if image_object:
                                image_id = image_object.id
                            else:
                                images_model = Images(name=image)
                                images_model.save()
                                image_id = Images.objects.get(id=images_model.id)
                            product_image_model = ProductCombinationImage.objects.filter(
                                product_combination_id=product_combination.id).filter(
                                image_id=image_id).exists()
                            if not product_image_model:
                                product_combination_image_model = ProductCombinationImage(
                                    product_combination_id=product_combination_object,
                                    image_id=image_id)
                                product_combination_image_model.save()
                messages.success(request, constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.PRODUCT))
        except Exception as e:
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return render(request, 'products_list.html', context)

    def delete(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            product_id = form_data.get('id')
            product_models = Products.objects.get(id=product_id)
            product_image_model = ProductCombinationImage.objects.filter(
                product_combination_id__product_id=product_id).values_list('image_id', flat=True)
            image_model = Images.objects.filter(id__in=product_image_model)
            for index in image_model:
                file_upload_dir = os.path.join(settings.MEDIA_ROOT, str(index.name))
                os.remove(file_upload_dir)
            product_models.delete()
            image_model.delete()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.DELETED_SUCCESSFULLY.replace('{module}', constant.PRODUCT)
        except (TypeError, KeyError):
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'Product Create View Delete method').replace('{error}',
                                                                                                             e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class UsersList(LoginRequiredMixin, View):
    model = User

    def get(self, request, *args, **kwargs):
        context = {'header': constant.USER, 'card_title': constant.MODULE_LISTING.replace('{module}', constant.USER)}
        queryset = []
        try:
            user_data = User.objects.filter(is_superuser=False).all()
            for user in user_data:
                address_dict = []
                user_address = UserAddress.objects.filter(user_id=user.id)

                for address in user_address:
                    if address.address_type == 0:
                        type = 'Billing'
                    else:
                        type = 'Delivery'

                    address_dict.append({
                        'address': address.address_id.address_1 + ' ' + address.address_id.address_2 + ' ' + address.address_id.city + ' ' + str(
                            address.address_id.pin_code) + ' ' + address.address_id.state + ' ' + address.address_id.country,
                        'address_type': type})
                data_dict = {'id': user.id, 'name': user.first_name + ' ' + user.last_name, 'phone': user.phone,
                             'email': user.email, 'user_name': user.username, 'address': address_dict}
                queryset.append(data_dict)
            context['user_data'] = queryset
            context['title'] = constant.MODULE_LISTING.replace('{module}', constant.USER)
            context['sub_header'] = constant.MODULE_LISTING.replace('{module}', constant.USER)
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'UsersList GET method').replace('{error}',
                                                                                                e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return render(request, 'user.html', context)


class OrdersList(LoginRequiredMixin, View):
    model = Order

    def get(self, request, *args, **kwargs):
        global status
        context = {'header': constant.ORDER, 'card_title': constant.MODULE_LISTING.replace('{module}', constant.ORDER)}
        queryset = []
        try:
            orders_data = Order.objects.filter(~Q(order_status=3))
            for orders in orders_data:
                product_dict = []
                order_map_model = OrderMapping.objects.filter(order_id=orders.id)
                for combination in order_map_model:
                    product_dict.append(
                        {'id': combination.combination_id.product_id.id,
                         'name': combination.combination_id.product_id.name,
                         'user_name': combination.user_id.first_name + ' ' + combination.user_id.last_name})
                data_dict = {'id': orders.id,
                             'delivery_address': orders.address_id.address_id.address_1 + ' ' + orders.address_id.address_id.address_2 + ' ' + orders.address_id.address_id.city + ' ' + str(
                                 orders.address_id.address_id.pin_code) + ' ' + orders.address_id.address_id.state + ' ' + orders.address_id.address_id.country,
                             'billing_address': orders.billing_address_id.address_id.address_1 + ' ' + orders.billing_address_id.address_id.address_2 + ' ' + orders.billing_address_id.address_id.city + ' ' + str(
                                 orders.billing_address_id.address_id.pin_code) + ' ' + orders.billing_address_id.address_id.state + ' ' + orders.billing_address_id.address_id.country,
                             'status': int(orders.order_status), 'products': product_dict,
                             'type': orders.address_id.address_type}
                queryset.append(data_dict)
            context['orders_data'] = queryset
            context['title'] = constant.MODULE_LISTING.replace('{module}', constant.ORDER)
            context['sub_header'] = constant.MODULE_LISTING.replace('{module}', constant.ORDER)
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'OrdersList GET method').replace('{error}',
                                                                                                 e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return render(request, 'orders.html', context)

    def post(self, request):
        context = {}
        try:
            request_data = request.read()
            form_data = json.loads(request_data.decode('utf-8'))
            order_model = Order.objects.get(id=form_data.get('order_id'))
            order_model.order_status = form_data.get('status')
            order_model.save()
            context['status'] = constant.SUCCESS
            context['messages'] = constant.UPDATED_SUCCESSFULLY.replace('{module}', constant.STATUS)
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'OrdersList POST method').replace('{error}',
                                                                                                  e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return JsonResponse(context)


class CancelOrdersList(LoginRequiredMixin, View):
    model = Order

    def get(self, request, *args, **kwargs):
        global status
        context = {'header': constant.ORDER, 'card_title': constant.MODULE_LISTING.replace('{module}', constant.ORDER)}
        queryset = []
        try:
            orders_data = Order.objects.filter(order_status=3)
            for orders in orders_data:
                product_dict = []
                order_map_model = OrderMapping.objects.filter(order_id=orders.id)
                for combination in order_map_model:
                    product_dict.append(
                        {'id': combination.combination_id.product_id.id,
                         'name': combination.combination_id.product_id.name,
                         'user_name': combination.user_id.first_name + ' ' + combination.user_id.last_name})
                data_dict = {'id': orders.id,
                             'delivery_address': orders.address_id.address_id.address_1 + ' ' + orders.address_id.address_id.address_2 + ' ' + orders.address_id.address_id.city + ' ' + str(
                                 orders.address_id.address_id.pin_code) + ' ' + orders.address_id.address_id.state + ' ' + orders.address_id.address_id.country,
                             'billing_address': orders.billing_address_id.address_id.address_1 + ' ' + orders.billing_address_id.address_id.address_2 + ' ' + orders.billing_address_id.address_id.city + ' ' + str(
                                 orders.billing_address_id.address_id.pin_code) + ' ' + orders.billing_address_id.address_id.state + ' ' + orders.billing_address_id.address_id.country,
                             'status': constant.CANCELLED, 'products': product_dict,
                             'type': orders.address_id.address_type}
                queryset.append(data_dict)
            context['orders_data'] = queryset
            context['title'] = constant.MODULE_LISTING.replace('{module}', constant.ORDER)
            context['sub_header'] = constant.MODULE_LISTING.replace('{module}', constant.ORDER)
        except Exception as e:
            print(constant.EXCEPTION_RAISED.replace('{module}', 'CancelOrdersList GET method').replace('{error}',
                                                                                                       e))
            context['status'] = constant.ERROR
            context['messages'] = constant.SOMETHING_WRONG
        return render(request, 'cancel_orders.html', context)
