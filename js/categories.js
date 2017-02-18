/*
 * Categories List
 */

function categories_list() {
    $$.get(io + 'select_all/token/' + token + '/project/' + project + '/collection/retail_category/appid/' + appid, function (data) {
        reltek.virtualList('#list-categories', {
            items: JSON.parse(data),
            renderItem: function (index, item) {
                return '<li class="swipeout category-list-' + item.id + '" id="category-list" data-id="' + item.id + '">' +
                    '<div class="swipeout-content">' +
                    '<a href="#" class="item-content item-link">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' + item.title + '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div>' +
                    '<div class="swipeout-actions-right">' +
                    '<a data-confirm="Are you sure you want to delete this item?" class="swipeout-delete">Remove</a>' +
                    '</div>' +
                    '</li>';
            }
        });
    });
}

/*
 * Categories Form Add Init
 */

reltek.onPageInit('categories-form-add', function () {
    $$('#form-category-add').attr('action', io + 'insert');

    var url = 'select_where' +
        '/token/' + token +
        '/project/' + project +
        '/collection/retail_category' +
        '/appid/' + appid +
        '/where_field/parent_id' +
        '/where_value/0'

    $$.get(io + url, function (data) {
        var real_data = JSON.parse(data);
        if (real_data.Data != 0) {
            $$.each(real_data, function (index, value) {
                $$('#parent_id').append('<option value="' + value.id + '">' + value.title + '</option>')
            });
        }
    });
});

/*
 * Categories Add
 */

$$(document).on('click', '#btn-categories-form-add', function () {
    var form_data = reltek.formToData('#form-category-add');
    var post_data = {
        token: token,
        project: project,
        collection: 'retail_category',
        appid: appid,
        parent_id: form_data.parent_id,
        title: form_data.title
    }
    $$.post(io + 'insert', post_data, function () {
        categories_list();
        mainView.router.load({pageName: 'index'});
    });
});

/*
 * Categories Delete Action
 */

$$(document).on('swipeout:deleted', '#category-list', function () {
    var id = $$(this).attr('data-id');
    var url = 'remove_id' +
        '/token/' + token +
        '/project/' + project +
        '/collection/retail_category' +
        '/appid/' + appid +
        '/id/' + id;
    $$.ajax({
        url: io + url,
        method: 'DELETE'
    })
});

/*
 * Categories Swipeout When List Clicked
 */

$$(document).on('click', '#category-list', function () {
    var id = $$(this).attr('data-id');
    reltek.swipeoutOpen('.category-list-' + id, "right");
    setTimeout(function () {
        reltek.swipeoutClose('.category-list-' + id);
    }, 10000);
});