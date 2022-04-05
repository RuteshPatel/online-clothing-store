function RemoveOrder(product_id) {
    let product_value = $('#product_price_' + product_id).attr('data-price');
    let total_amount = $('#amount').attr('data-amount');
    $("#product_row_" + product_id).fadeOut(500, function () {
        let remaining_amount = parseInt(total_amount) - parseInt(product_value)
        $('#amount').attr('data-amount', remaining_amount);
        $('#amount').html('&#8377; ' + remaining_amount);
        $(this).remove()
        if ($(".order_section .product_row").length == 0) {
            $(".amount_div").remove()
            $("#billing_address_div").remove()
            $("#delivery_address_div").remove()
            $("#payment_div").remove()
        }
    });
}

function ConfirmOrder() {
    let combination_id = []
    $(".order_section .product_row").each(function () {
        combination_id.push($(this).attr('data-id'))
    })
    let total_amount = $('#amount').attr('data-amount');

    let billing_address_id = $('input[name="address_id"]:checked').val()
    let delivery_address_id = $('input[name="delivery_address_id"]:checked').val()
    let delivery_address = billing_address_id
    if (delivery_address_id != 0) {
        delivery_address = delivery_address_id
    }

    let data = {
        'combination_id': combination_id,
        'total_amount': total_amount,
        'billing_address': billing_address_id,
        'delivery_address': delivery_address
    }
    $.ajax({
        type: "POST",
        url: '/order-confirmation',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                toastr.success(response.message)
                $(combination_id).each(function (index, value) {
                    let product_value = $('#product_price_' + combination_id).attr('data-price');
                    let total_amount = $('#amount').attr('data-amount');
                    let remaining_amount = parseInt(total_amount) - parseInt(product_value)
                    $('#amount').attr('data-amount', remaining_amount);
                    $('#amount').html('&#8377; ' + remaining_amount);
                    $("#product_row_" + combination_id).remove()
                    if ($(".order_section .product_row").length == 0) {
                        $(".order_section .row:first").after('<div class="row"><div class="col-lg-10 col-md-10 offset-1 row_div">No Products are available in Cart</div></div>')
                        $(".amount_div").remove()
                        $("#billing_address_div").remove()
                        $("#delivery_address_div").remove()
                        $("#payment_div").remove()
                    }
                })
            } else {
                toastr.error(response.message)
            }
        },
        error: function (response) {
            toastr.error(response.message)
        }
    })
}