$(document).ready(function () {
    $("#delivery_address_form").validate({
        success: function (label, element) {
            $(element).removeClass('error');
        },
        rules: {
            address_1: {
                required: true
            },
            address_2: {
                required: true
            },
            city: {
                required: true
            },
            state: {
                required: true
            },
            pin_code: {
                required: true,
                maxlength: 6,
                digits: true
            },
            country: {
                required: true
            },
        },
        messages: {
            address_1: {
                required: "Please enter Address 1"
            },
            address_2: {
                required: "Please enter Address 2"
            },
            city: {
                required: "Please enter City"
            },
            state: {
                required: "Please enter State"
            },
            pin_code: {
                required: "Please enter Pincode",
            },
            country: {
                required: "Please enter Country"
            },
        }
    });
})