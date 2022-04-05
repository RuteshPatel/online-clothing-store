$(document).ready(function () {
    $(".data-tables").DataTable({
        "pageLength": 10,
    });
    $(".selectgroup-item").change(function () {
        let status_value = $(this).attr("data-value")
        let order_id = $(this).attr("data-order_id")
        let data = {'status': status_value, 'order_id': order_id}
        $.ajax({
            type: "POST",
            url: "update-status",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            // headers: {
            //     'X-CSRFToken': csrf_token_value
            // },
            success: function (response) {
                if (response.status === 'success') {
                    toastr.success(response.messages)
                    let table = $("table.datatable").dataTable();
                    table.fnPageChange("first", 1);
                } else {
                    toastr.error(response.messages)
                }
            }
        })
    })
})