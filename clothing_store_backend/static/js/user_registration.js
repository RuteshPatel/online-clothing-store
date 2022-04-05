$(document).ready(function () {
    $("#registration_form").validate({
        success: function (label, element) {
            $(element).removeClass('error');
        },
        rules: {
            first_name: {
                required: true,
                letters_only: true,
            },
            last_name: {
                required: true,
                letters_only: true,
            },
            phone: {
                required: true,
                digits: true,
                minlength: 9,
                maxlength: 10
            },
            email: {
                required: true
            },
            username: {
                required: true,
            },
            password: {
                required: true
            },
            confirm_password: {
                required: true,
                equalTo: "#password",
            },
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
            first_name: {
                required: "Please enter First Name",
                letters_only: "Please enter Proper First Name",
            },
            last_name: {
                required: "Please enter Last Name",
                letters_only: "Please enter Proper Last Name",
            },
            phone: {
                required: "Please enter Phone No."
            },
            email: {
                required: "Please enter Email"
            },
            username: {
                required: "Please enter Username",
            },
            password: {
                required: "Please enter Password"
            },
            confirm_password: {
                required: "Please enter Confirm Password"
            },
            profile: {
                required: "Please select Profile"
            },
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