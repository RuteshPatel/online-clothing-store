from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from users.models import User, Address, UserAddress, Payment, Cart, Wishlist, Order, OrderMapping


@admin.register(User)
class UserAdminConfig(UserAdmin):
    model = User
    list_display = ('first_name', 'last_name', 'username', 'phone', 'email')
    list_display_links = ('first_name', 'last_name', 'username', 'phone', 'email')
    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'username', 'phone', 'email', 'password')
        }),
    )
    add_fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'username', 'phone', 'email', 'password')
        }),
    )


@admin.register(Address)
class AddressAdminConfig(admin.ModelAdmin):
    model = Address
    list_display = ('address_1', 'address_2', 'city', 'state', 'pin_code', 'country')


@admin.register(UserAddress)
class UserAddressAdminConfig(admin.ModelAdmin):
    model = UserAddress
    list_display = ('user_id', 'address_id', 'address_type')


@admin.register(Payment)
class UserPaymentConfig(admin.ModelAdmin):
    model = Payment
    list_display = ('order_id', 'is_paid', 'total_amount')
    list_filter = ('is_paid', 'total_amount')


admin.site.register(Cart)
admin.site.register(Wishlist)
admin.site.register(Order)
admin.site.register(OrderMapping)
