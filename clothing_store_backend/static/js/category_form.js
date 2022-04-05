$(document).ready(function () {
    $("#category_form").validate({
        rules: {
            name: {
                required: true,
                letters_only: true
            },
        },
        messages: {
            name: {
                required: enter_name,
                letters_only: proper_name
            },
        }
    });
    $("#submit").click(function () {
        if ($("#category_form").valid()) {
            var data = {};
            $.each($('#category_form').serializeArray(), function (_, kv) {
                data[kv.name] = kv.value;
            });
            var csrf_token_value = $("input[name=csrfmiddlewaretoken]").val();
            $.ajax({
                type: "POST",
                url: "category-add",
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
                            window.location.href = "category-list"
                        });
                    } else {
                        swal({
                            title: "Error",
                            icon: 'error',
                            text: response.messages,
                            type: "error"
                        }).then(function () {
                            window.location.href = "category-list"
                        });
                    }
                }
            })
        }
    })
});