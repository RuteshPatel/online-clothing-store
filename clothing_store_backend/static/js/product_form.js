$(document).ready(function () {
    $("#product_form").validate({
        rules: {
            category: {
                required: true
            },
            product_name: {
                required: true
            },
            brands: {
                required: true
            },
            // images: {
            //     required: true,
            // },
            description: {
                required: true,
            }
        },
        messages: {
            category: {
                required: "Please select Category"
            },
            product_name: {
                required: "Please enter Product Name"
            },
            brands: {
                required: "Please select Brands"
            },
            // images: {
            //     required: "Please select Images",
            // },
            description: {
                required: "Please enter Description",
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
    let p = $('p')
    if (p.find('img').length <= 0) {
        $("#images").rules("add", {
            required: true,
            messages: {required: 'Please select Images'}
        });
    }

    $("#add_combination").click(function () {
        let size_length = Object.keys(product_size).length
        let color_length = Object.keys(product_color).length

        let total_rows = $("#total_rows").val()
        let add_row = parseInt(total_rows) + 1
        let html = '<div class = "row" id = "combination_' + add_row + '" >';
        html += '<div class="col-md-2">';
        html += '<div class = "form-group" ><label class="form-label">Sizes</label>';
        html += '<div class="selectgroup w-100"><div class="row">';
        for (var i = 0; i < size_length; i++) {
            html += '<div class="col-lg-5 col-md-5 col-sm-5"><label class="selectgroup-item"><input type="radio" name="sizes_' + add_row + '" value="' + product_size[i]['id'] + '" class="selectgroup-input" required ><span class="selectgroup-button">' + product_size[i]['size_code'] + '</span></label></div>';
        }
        html += '</div></div><label id="sizes_' + add_row + '-error" class="error" for="sizes_' + add_row + '" style="display: none"></label></div></div>';
        html += '<div class="col-md-2"><div class="form-group"><label class="form-label">Colors</label>';
        html += '<div class="row gutters-xs"><div class="row">';
        for (var i = 0; i < color_length; i++) {
            html += '<div class="col-auto"><label class="colorinput"><input name="colors_' + add_row + '" type="radio" value="' + product_color[i]['id'] + '" class="colorinput-input" required><span class="colorinput-color" style="background-color: ' + product_color[i]['color_code'] + ';"></span></label></div>';
        }
        html += '</div></div><label id="colors_' + add_row + '-error" class="error" for="colors_' + add_row + '" style="display: none"></label></div></div>';
        html += '<div class="col-md-2"><div class="form-group"><label for="prices" class="placeholder">Price</label><input id="prices_' + add_row + '" type="text" class="form-control input-border-bottom" name="prices_' + add_row + '" required value="" placeholder="Price"></div><label id="prices_' + add_row + '-error" class="error" for="prices" style="display: none"></label></div>';
        html += '<div class="col-md-2"><div class="form-group"><label for="stocks" class="placeholder">Available Stocks</label><input id="stocks_' + add_row + '" type="text" class="form-control input-border-bottom" name="stocks_' + add_row + '" required value="" placeholder="Available Stocks"></div><label id="stocks_' + add_row + '-error" class="error" for="stocks" style="display: none"></label></div>';
        html += '<div class="col-md-3"><div class="form-group"><label for="images" class="placeholder">Images</label><input type="file" class="form-control input-border-bottom" name="images_' + add_row + '" id="images_' + add_row + '" multiple></div><label id="images_0-error" class="error" for="images_' + add_row + '" style="display: none"></label></div>'
        html += '<div class="col-md-1"><label class="form-group remove_row" onclick="RemoveRow(' + add_row + ')">&times;</label></div></div>';
        $("#combination_" + total_rows).after(html)
        $("#total_rows").val(add_row)
    })
})

function RemoveRow(id) {
    let total_rows = $("#total_rows").val()
    let remove_row = parseInt(total_rows) - 1
    $("#combination_" + id).remove()
    $("#total_rows").val(remove_row)
    if (remove_row == 0) {
        $(".remove_row").remove()
    }
}