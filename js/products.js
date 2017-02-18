/*
 * Categories List
 */

function products_list() {
    $$.get(io + 'select_all/token/' + token + '/project/' + project + '/collection/retail/appid/' + appid, function (data) {
        reltek.virtualList('#list-products', {
            items: JSON.parse(data),
            height: 111,
            renderItem: function (index, item) {
                return '<li class="swipeout product-list-' + item.id + '" id="product-list" data-id="' + item.id + '">' +
                    '<div class="swipeout-content">' +
                    '<a href="#" class="item-content item-link">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">' + item.name + '</div>' +
                    '</div>' +
                    '<div class="item-subtitle">' + item.type + '</div>' +
                    '<div class="item-text">' + item.description + '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div>' +
                    '<div class="swipeout-actions-right">' +
                    '<a href="#" class="mark bg-orange">Detail</a>' +
                    '<a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Delete</a>' +
                    '</div>' +
                    '</li>';
            }
        });
    });
}

/*
 * Product Add
 */

$$(document).on('click', '#btn-products-form-add', function () {
    var form_data = reltek.formToData('#form-product-add');
    var post_data = {
        token: token,
        project: project,
        collection: 'retail',
        appid: appid,
        code: form_data.code,
        name: form_data.name,
        description: form_data.description,
        feature: form_data.feature,
        type: form_data.type,
        price: form_data.price,
        discount: '0',
        cover: '0'
    }
    $$.post(io + 'insert', post_data, function () {
        products_list();
        mainView.router.load({pageName: 'index'});
    });
});

/*
 * Products Delete Action
 */

$$(document).on('swipeout:deleted', '#product-list', function () {
    var id = $$(this).attr('data-id');
    var url = 'remove_id' +
        '/token/' + token +
        '/project/' + project +
        '/collection/retail' +
        '/appid/' + appid +
        '/id/' + id;
    $$.ajax({
        url: io + url,
        method: 'DELETE'
    })
});

/*
 * Product Swipeout When List Clicked
 */

$$(document).on('click', '#product-list', function () {
    var id = $$(this).attr('data-id');
    reltek.swipeoutOpen('.product-list-' + id, "right");
    setTimeout(function () {
        reltek.swipeoutClose('.product-list-' + id);
    }, 10000);
});