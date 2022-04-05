$(document).ready(function () {
    $(".modal_btn").click(function (e) {
        e.preventDefault()
        let url = $(this).attr('href');
        $('.modal-content').load(url);
        $("#modal").show()
    })
    $(".registration_modal_btn").click(function (e) {
        e.preventDefault()
        let url = $(this).attr('href');
        $('.registration_modal .modal-content').load(url);
        $("#registration_modal").show()
    })
    $.validator.addMethod("letters_only", function (value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Letters only please");
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    let cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        let cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });
    let chart_data_val = $("#chart_data").val()
    let chart_data_seperator = chart_data_val.replace("[", "").replace("]", "").split(',')
    let chart_value = []
    $.each(chart_data_seperator, function (index, value) {
        let data_value = value.replace("{", "").replace("}", "").split(':')
        chart_value.push(parseInt(data_value[1]))
    });

    let totalIncomeChart = document.getElementById('totalIncomeChart').getContext('2d');
    let mytotalIncomeChart = new Chart(totalIncomeChart, {
        type: 'bar',
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Total Income",
                backgroundColor: '#ff9e27',
                borderColor: 'rgb(23, 125, 255)',
                // data: [6, 4, 9, 5, 4, 6, 4, 3, 8, 10],
                data: chart_value,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: true //this will remove only the label
                    },
                    gridLines: {
                        drawBorder: true,
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        drawBorder: true,
                        display: false
                    }
                }]
            },
        }
    });
    TotalPurchaseOrderCounter()
    TotalOrderCounter()
    TotalCancelOrderCounter()
})
window.toastr.options = {
    closeButton: true,
    debug: true,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "6000",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

function DeleteFunction(custom_data) {
    swal({
        title: "Are you sure !",
        icon: 'warning',
        text: "You want to delete this " + custom_data.module_names + " ?",
        type: "warning",
        buttons: {
            cancel: {
                text: "No",
                value: false,
                visible: true,
                closeModal: true
            },
            confirm: {
                text: "Yes, Delete It",
                value: true,
                closeModal: true
            }
        },
    }).then(function (isConfirm) {
        if (isConfirm) {
            let data = {};
            data['id'] = custom_data.ids
            let csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
            $.ajax({
                type: "DELETE",
                url: custom_data.ajaxs_url,
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json',
                headers: {
                    'X-CSRFToken': csrf_token_value
                },
                success: function (response) {
                    if (response.status === 'success') {
                        swal({
                            title: "Success",
                            icon: 'success',
                            text: response.messages,
                            type: "success"
                        }).then(function () {
                            window.location.href = custom_data.responses_url
                        });
                    } else {
                        swal({
                            title: "Error",
                            icon: 'error',
                            text: response.messages,
                            type: "error"
                        }).then(function () {
                            window.location.href = custom_data.responses_url
                        });
                    }
                }
            })
        }
    });
}

function AddWishlist(product_id, user_id, page = 'home') {
    if (user_id !== 'None') {
        let data = {'product_id': product_id, 'user_id': user_id}
        let csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
        $.ajax({
            type: "POST",
            url: '/add-wishlist',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrf_token_value
            },
            success: function (response) {
                if (response.status === 'success') {
                    if (page === 'wishlist') {
                        toastr.error(response.messages)
                        $("#wishlist_details_" + product_id).remove()
                        let wishlist_items = $('.wishlist_section div.wishlist_data .wishlist_content').length
                        if (wishlist_items === 0) {
                            $(".wishlist_section:first").after('<div class="row"><h5>Your Wishlist is Empty</h5></div>')
                        }
                    } else {
                        if (response.code === true) {
                            if (page === 'product_detail') {
                                toastr.success(response.messages)
                                $("#detail_" + product_id).removeClass('btn btn-primary btn-sm')
                                $("#detail_" + product_id).addClass('btn btn-danger btn-sm')
                                $("#detail_" + product_id).text('Remove from Wishlist')
                            } else {
                                $("#wishlist_" + product_id).empty()
                                $("#wishlist_" + product_id).append('<i class="fas fa-heart"></i>')
                                toastr.success(response.messages)
                            }
                        } else {
                            if (page === 'product_detail') {
                                $("#detail_" + product_id).removeClass('btn btn-danger btn-sm')
                                $("#detail_" + product_id).addClass('btn btn-primary btn-sm')
                                $("#detail_" + product_id).text('Add to Wishlist')
                                toastr.error(response.messages)
                            } else {
                                $("#wishlist_" + product_id).empty()
                                $("#wishlist_" + product_id).append('<i class="far fa-heart"></i>')
                                toastr.error(response.messages)
                            }
                        }
                    }
                } else {
                    toastr.error(response.messages)
                }
            }
        })
    } else {
        toastr.error("Please Log In to Add this product to your Wishlist")
    }
}

/*function AddCart(product_id, user_id, page = 'home') {
    if (user_id !== 'None') {
        let data = {'product_id': product_id, 'user_id': user_id}
        let csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
        $.ajax({
            type: "POST",
            url: '/add-cart',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrf_token_value
            },
            success: function (response) {
                if (response.status === 'success') {
                    if (page === 'cart') {
                        toastr.error(response.messages)
                        let product_value = $("#price_" + product_id + " > span").text()
                        let cart_amount = $("#cart_amount").text()
                        $("#cart_amount").text(parseInt(cart_amount) - parseInt(product_value))
                        $("#cart_details_" + product_id).remove()
                        let cart_items = $('.cart_section div.cart_data .cart_content').length
                        if (cart_items === 0) {
                            $(".cart_section:first").after('<div class="row"><div class="col-lg-12 col-md-12"><h5>Your Cart is Empty</h5></div></div>')
                        }
                    } else {
                        if (response.code === true) {
                            if (page === 'product_detail') {
                                toastr.success(response.messages)
                                $("#cart_detail_" + product_id).removeClass('btn btn-primary btn-sm')
                                $("#cart_detail_" + product_id).addClass('btn btn-danger btn-sm')
                                $("#cart_detail_" + product_id).text('Remove from Cart')
                            } else if (page === 'wishlist' || page === 'shop') {
                                $("#cart_" + product_id).empty()
                                $("#cart_" + product_id).removeClass('not_cart')
                                $("#cart_" + product_id).append('<i class="fas fa-shopping-cart"></i>')
                                toastr.success(response.messages)
                            } else {
                                // $("#cart_" + product_id).empty()
                                $("#cart_" + product_id).text('- Remove from Cart')
                                toastr.success(response.messages)
                            }
                        } else {
                            if (page === 'product_detail') {
                                $("#cart_detail_" + product_id).removeClass('btn btn-danger btn-sm')
                                $("#cart_detail_" + product_id).addClass('btn btn-primary btn-sm')
                                $("#cart_detail_" + product_id).text('+ Add to Cart')
                                toastr.error(response.messages)
                            } else if (page === 'wishlist' || page === 'shop') {
                                $("#cart_" + product_id).empty()
                                $("#cart_" + product_id).addClass('not_cart')
                                $("#cart_" + product_id).append('<i class="fas fa-cart-plus"></i>')
                                toastr.error(response.messages)
                            } else {
                                // $("#cart_" + product_id).empty()
                                $("#cart_" + product_id).text('+ Add to Cart')
                                toastr.error(response.messages)
                            }
                        }
                    }
                } else {
                    toastr.error(response.messages)
                }
            }
        })
    } else {
        toastr.error("Please Log In to Add this product to your Cart")
    }
}*/

function TotalPurchaseOrderCounter() {
    let total_purchase_order = $("#total_purchase_order").attr('data-users')
    Circles.create({
        id: 'circles-1',
        radius: 45,
        value: total_purchase_order,
        // maxValue: 100,
        width: 7,
        text: total_purchase_order,
        colors: ['#f1f1f1', '#FF9E27'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        styleWrapper: true,
        styleText: true
    })
}

function TotalOrderCounter() {
    let total_orders = $("#total_orders").attr('data-orders')
    Circles.create({
        id: 'circles-2',
        radius: 45,
        value: total_orders,
        maxValue: 100,
        width: 7,
        text: total_orders,
        colors: ['#f1f1f1', '#FF9E27'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        styleWrapper: true,
        styleText: true
    })
}

function TotalCancelOrderCounter() {
    let total_cancel_orders = $("#total_cancel_orders").attr('data-cancel_orders')
    Circles.create({
        id: 'circles-3',
        radius: 45,
        value: total_cancel_orders,
        maxValue: 100,
        width: 7,
        text: total_cancel_orders,
        colors: ['#f1f1f1', '#FF9E27'],
        duration: 400,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        styleWrapper: true,
        styleText: true
    })
}