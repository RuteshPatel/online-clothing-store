$(document).ready(function () {
    $("#brand_form").validate({
        rules: {
            name: {
                required: true
            },
        },
        messages: {
            name: {
                required: "Please enter Brand Name"
            },
        }
    });
    $("#submit").click(function () {
        if ($("#brand_form").valid()) {
            var data = {};
            $.each($('#brand_form').serializeArray(), function (_, kv) {
                data[kv.name] = kv.value;
            });
            var csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
            $.ajax({
                type: "POST",
                url: "brands-add",
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
                            window.location.href = "brands-list"
                        });
                    } else {
                        swal({
                            title: "Error",
                            icon: 'error',
                            text: response.messages,
                            type: "error"
                        }).then(function () {
                            window.location.href = "brands-list"
                        });
                    }
                }
            })
        }
    })
});