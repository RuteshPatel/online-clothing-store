$(document).ready(function () {
    $("#color_code").colorpicker()
    $("#color_form").validate({
        rules: {
            color_code: {
                required: true
            }
        },
        messages: {
            color_code: {
                required: "Please select Color"
            }
        }
    });
    $('#submit').click(function () {
        if ($('#color_form').valid()) {
            var data = {};
            $.each($('#color_form').serializeArray(), function (_, kv) {
                data[kv.name] = kv.value;
            });
            var csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();

            $.ajax({
                type: "POST",
                url: 'color-add',
                data: JSON.stringify(data),
                contentType: "application/json",
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
                            window.location.href = "color-list"
                        });
                    } else {
                        swal({
                            title: "Error",
                            icon: 'error',
                            text: response.messages,
                            type: "error"
                        }).then(function () {
                            window.location.href = "color-list"
                        });
                    }
                }
            })
        }
    })
});