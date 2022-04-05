$(document).ready(function () {
    $(document).on('click', 'a.pagination_links', function (e) {
        e.preventDefault();
        let page_no = $(this).attr('href');
        let per_page = $('#per_page').val();
        $.ajax({
            type: "GET",
            url: "/shop/" + page_no + "/" + per_page,
            success: function (response) {
                $("#start_page").text(page_no)
                $(".pagination_links").removeClass(
                    'btn-primary')
                $(".pagination_links").addClass('btn-outline-primary')
                $("#" + page_no).removeClass('btn-outline-primary')
                $("#" + page_no).addClass('btn-primary')
                $(".products_listing").empty()
                let html = ''
                $(response.products).each(function (index, product) {
                    html += '<div class="col-lg-3 col-md-6 product_div" id="product_' + product.id + '">'
                    html += '<div class="display_content"><a href="/product-detail/' + product.id + '/"><div class="product_img"><img src="' + product.images + '"></div></a>'
                    html += '<div class="product_content"><a href="/product-detail/' + product.id + '/"><p>' + product.name + '</p><p>' + product.brands + '</p><p>Price: &#8377; ' + product.price + '</p></a>'
                    html += '<div class="product_price"><div class="cart">&nbsp;</div><div class="wishlist">'
                    if(product.wishlist == true) {
                        html += '<a id="wishlist_' + product.id + '" href="javascript:void(0)" onClick="AddWishlist(' + product.id + ', ' + response.user_id + ', \'product\')"><i class="fas fa-heart"></i></a>'
                    } else {
                        html += '<a id="wishlist_' + product.id + '" href="javascript:void(0)" onClick="AddWishlist(' + product.id + ', ' + response.user_id + ', \'product\')"><i class="far fa-heart"></i></a>'
                    }
                    html +='</div></div></div></div></div>'
                });
                $(".products_listing").append(html).hide().fadeIn(2000);
            },
            error: function () {
                alert('Something went wrong. Please try again later !');
            }
        });
    });
    $("#per_page").change(function () {
        let per_page = this.value
        let page_number = 1
        $.ajax({
            type: "GET",
            url: "/shop/" + page_number + "/" + per_page,
            success: function (response) {
                $(".products_listing").empty()
                let html = ''
                $(response.products).each(function (index, product) {
                    html += '<div class="col-lg-3 col-md-6 product_div" id="product_' + product.id + '">'
                    html += '<div class="display_content"><a href="/product-detail/' + product.id + '/"><div class="product_img"><img src="' + product.images + '"></div></a>'
                    html += '<div class="product_content"><a href="/product-detail/' + product.id + '/"><p>' + product.name + '</p><p>' + product.brands + '</p><p>Price: &#8377; ' + product.price + '</p></a>'
                    html += '<div class="product_price"><div class="cart">&nbsp;</div><div class="wishlist">'
                    if(product.wishlist == true) {
                        html += '<a id="wishlist_' + product.id + '" href="javascript:void(0)" onClick="AddWishlist(' + product.id + ', ' + response.user_id + ', \'product\')"><i class="fas fa-heart"></i></a>'
                    } else {
                        html += '<a id="wishlist_' + product.id + '" href="javascript:void(0)" onClick="AddWishlist(' + product.id + ', ' + response.user_id + ', \'product\')"><i class="far fa-heart"></i></a>'
                    }
                    html += '</div></div></div></div></div>'
                });
                $(".products_listing").append(html).fadeIn(2000);
                PaginationLinks(response.start_page, response.end_page)
            },
            error: function () {
                alert('Something went wrong. Please try again later !');
            }
        });
    })
});
function FilterFunction() {
    let data = {}
    let category_value = $('input[name="category"]:checked').val()
    let brand_value = $('input[name="brand"]:checked').val()
    let size_value = $('input[name="size"]:checked').val()
    let color_value = $('input[name="color"]:checked').val()
    let per_page = $('#per_page').val();
    data['per_page'] = per_page

    if (category_value !== undefined) {
        data['category_value'] = category_value
    }
    if (brand_value !== undefined) {
        data['brand_value'] = brand_value
    }
    if (size_value !== undefined) {
        data['size_value'] = size_value
    }
    if (color_value !== undefined) {
        data['color_value'] = color_value
    }
    FilterProductAjaxCall(data)
}
function FilterProductAjaxCall(data = {}) {
    $.ajax({
        type: "POST",
        url: '/filter-product',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            // $(".product_div").hide()
            let data_length = Object.keys(data).length
            if (data_length === 0) {
                $('input[name="category"]:checked').prop('checked', false);
                $('input[name="brand"]:checked').prop('checked', false);
                $('input[name="size"]:checked').prop('checked', false);
                $('input[name="color"]:checked').prop('checked', false);
                FilterResponse(response)
            } else {
                FilterResponse(response)
            }
        }
    })
}
function FilterResponse(response) {
    $(".product_div").hide()
    let filter_length = Object.keys(response['products']).length
    if (filter_length > 0) {
        $(".no_product_div").fadeOut(150)
        let html = ''
        for (let i = 0; i < filter_length; i++) {
            html += '<div class="col-lg-3 col-md-6 product_div" id="product_' + response['products'][i].id + '">'
            html += '<div class="display_content"><a href="/product-detail/' + response['products'][i].id + '/"><div class="product_img"><img src="' + response['products'][i].images + '"></div></a>'
            html += '<div class="product_content"><a href="/product-detail/' + response['products'][i].id + '/"><p>' + response['products'][i].name + '</p><p>' + response['products'][i].brands + '</p><p>Price: &#8377; ' + response['products'][i].price + '</p></a>'
            html += '<div class="product_price"><div class="cart">&nbsp;</div><div class="wishlist">'
            if(response['products'][i].wishlist == true) {
                html += '<a id="wishlist_' + response['products'][i].id + '" href="javascript:void(0)" onClick="AddWishlist(' + response['products'][i].id + ', ' + response.user_id + ', \'product\')"><i class="fas fa-heart"></i></a>'
            }
            else {
                html += '<a id="wishlist_' + response['products'][i].id + '" href="javascript:void(0)" onClick="AddWishlist(' + response['products'][i].id + ', ' + response.user_id + ', \'product\')"><i class="far fa-heart"></i></a>'
            }
            html += '</div></div></div></div></div>'
        }
        $(".products_listing").empty()
        $(".products_listing").append(html).hide().fadeIn(500);
        PaginationLinks(response.start_page, response.end_page)

    } else {
        $(".product_div").addClass('d-none')
        $(".no_product_div").fadeIn(150)
        $(".pagination_div").hide()
    }
}
function PaginationLinks(start_page, end_page) {
    $(".pagination_div").empty()
    let pagination_html = ''
    pagination_html += '<div class = "col-lg-12 col-md-12" ><label>Page<span id="start_page"> ' + start_page + '</span> from ' + end_page + '</label></div>'
    pagination_html += '<div class = "col-lg-12 col-md-12">'
    for (var i = start_page; i <= end_page; i++) {
        if (i == 1) {
            pagination_html += '<a class="pagination_links btn btn-primary btn-sm mr-2" href="' + i + '" id="' + i + '">' + i + '</a>'
        } else {
            pagination_html += '<a class="pagination_links btn btn-outline-primary btn-sm mr-2" href="' + i + '" id="' + i + '">' + i + '</a>'
        }
    }
    $(".pagination_div").append(pagination_html).show()
}