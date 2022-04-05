$(document).ready(function () {
    $("#size_form").validate({
        rules: {
            name: {
                required: true
            },
            short_code: {
                required: true,
                maxlength: 3
            }
        },
        messages: {
            name: {
                required: "Please enter Size Name"
            },
            short_code: {
                required: "Please enter Short Code",
                maxlength: "Please enter character greater than 1 & less than 3"
            }
        }
    });
    $("#submit").click(function () {
        if ($("#size_form").valid()) {
            var data = {};
            $.each($('#size_form').serializeArray(), function (_, kv) {
                data[kv.name] = kv.value;
            });
            var csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
            $.ajax({
                type: "POST",
                url: "size-add",
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
                            window.location.href = "size-list"
                        });
                    } else {
                        swal({
                            title: "Error",
                            icon: 'error',
                            text: response.messages,
                            type: "error"
                        }).then(function () {
                            window.location.href = "size-list"
                        });
                    }
                }
            })
        }
    })
});