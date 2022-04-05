$(document).ready(function () {
    $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 200,
        itemMargin: 5,
        asNavFor: '#slider'
    });

    $('#slider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel"
    });

    $('input[name="colors"]').change(function () {
        let color_id = this.value
        let product_id = $("#product_id").val()
        let data = {'color_id': color_id, 'product_id': product_id}
        $.ajax({
            type: "POST",
            url: '/get-sizes',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                $("#sizes_list").empty()
                var html = ''
                $(".color_label").removeClass('active')
                $.each(response, function (index, value) {
                    html += '<label class="size_label" for="size_' + value.size_id + '">' + value.size + '<input name="sizes" type="radio" id="size_' + value.size_id + '" value="' + value.size_id + '"></label>';
                });
                $("#sizes_list").append(html)
                $('.size_label:first-child > input[name="sizes"]').prop('checked', true).trigger('change')
                $('input[name="colors"]:checked').parent().addClass('active')
            }
        })
    })

    $(document).on('change', 'input[name="sizes"]', function (e) {
        let color_id = $('input[name="colors"]:checked').val()
        let size_id = this.value
        let product_id = $("#product_id").val()
        let data = {'color_id': color_id, 'size_id': size_id, 'product_id': product_id}
        $.ajax({
            type: "POST",
            url: '/get-price',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                $(".size_label").removeClass('active')
                $("#price").empty()
                $("#stocks").empty()
                $("#price").append('<label class="font-weight-bold">Prices: ₹ ' + response.price + '</label>')
                $("#stocks").append('<label class="font-weight-bold">Available Stocks: ' + response.stock + '</label>')
                $('input[name="sizes"]:checked').parent().addClass('active')
                if (response.is_cart){
                    $("#cart_detail_" + product_id).removeClass('btn-primary')
                    $("#cart_detail_" + product_id).addClass('btn-danger')
                    $("#cart_detail_" + product_id).text('Remove from Cart')
                } else {
                    $("#cart_detail_" + product_id).removeClass('btn-danger')
                    $("#cart_detail_" + product_id).addClass('btn-primary')
                    $("#cart_detail_" + product_id).text('Add to Cart')

                }
            }
        })
    });
});

function AddCart(product_id, user_id, page = 'home') {
    if (user_id !== 'None') {
        let color_id = $('input[name="colors"]:checked').val()
        let sizes_id = $('input[name="sizes"]:checked').val()
        if(color_id != "" || sizes_id != "")
        {
            let data = {'product_id': product_id, 'user_id': user_id, 'color_id': color_id, 'sizes_id': sizes_id}
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
        }
        else
        {
            toastr.error("Please select Color and Size")
        }

    } else {
        toastr.error("Please Log In to Add this product to your Cart")
    }
}
