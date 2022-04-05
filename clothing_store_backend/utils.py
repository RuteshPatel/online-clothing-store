from django.shortcuts import render
import datetime

from users.models import OrderMapping


# def PageNotFoundView(request, exception=None):
#     url_path = '/'
#     if '/administration/' in request.path_info:
#         url_path = '/administration/'
#     return render(request, 'errors/404.html', {'url_path': url_path})
#
#
# def ServerErrorView(request, exception=None):
#     url_path = '/'
#     if '/administration/' in request.path_info:
#         url_path = '/administration/'
#     return render(request, 'errors/500.html', {'url_path': url_path})
#
#
# def PermissionDeniedView(request, exception=None):
#     url_path = '/'
#     if '/administration/' in request.path_info:
#         url_path = '/administration/'
#     return render(request, 'errors/403.html', {'url_path': url_path})
#
#
# def BadRequestView(request, exception=None):
#     url_path = '/'
#     if '/administration/' in request.path_info:
#         url_path = '/administration/'
#     return render(request, 'errors/403.html', {'url_path': url_path})


def DateRageCalculation():
    date = datetime.date.today()
    weekday_number = date.weekday()
    if weekday_number == 0:
        start_week = date
    else:
        start_week = date - datetime.timedelta(weekday_number)
    end_week = start_week + datetime.timedelta(6)
    return start_week, end_week


def BarChartWeekWiseData():
    get_date_data = DateRageCalculation()
    start_week = get_date_data[0]
    end_week = get_date_data[1]

    entries = OrderMapping.objects.filter(order_id__order_status=2).filter(
        order_id__created_datetime__range=[start_week, end_week]).values('combination_id__price',
                                                                         'order_id__created_datetime')
    delta = datetime.timedelta(days=1)
    list_append = []
    week_index = 0
    while start_week <= end_week:
        product_price = 0
        data_dict = {}
        for entry in entries:
            if start_week == entry.get('order_id__created_datetime').date():
                product_price += int(entry.get('combination_id__price'))
            else:
                product_price = 0
            data_dict = {week_index: product_price}
        list_append.append(data_dict)
        start_week += delta
        week_index += 1
    return list_append
