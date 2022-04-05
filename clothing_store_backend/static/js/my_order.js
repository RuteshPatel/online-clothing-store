function CancelOrder(order_id) {
    let data = {'order_id': order_id}
    $.confirmModal('Are you sure to Cancel this Order ?', function (el) {
        $.ajax({
            type: "POST",
            url: '/cancel-orders',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    toastr.success(response.messages)
                    $("#orders_status_" + order_id).empty()
                    // $("#status_" + order_id).remove()
                    // $("#cancel_" + order_id).remove()
                    $("#orders_status_" + order_id).append('<span id="status_' + order_id + '" class="order_status order_status_span Cancelled">Cancelled</span>')
                } else {
                    toastr.error(response.messages)
                }
            },
            error: function (response) {
                toastr.error(response.messages)
            }
        })
    });
}