var reltek = new Framework7({
    pushState: true,
    material: true,
    fastClicks: true,

    onAjaxStart: function () {
        reltek.showIndicator();
    },

    onAjaxComplete: function () {
        reltek.hideIndicator();
    }
});

var $$ = Dom7;
var mainView = reltek.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('page:init', function (e) {
    var page = e.detail.page;
    if (page.name === 'categories-form-add') {
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
    }
});

function get_categories() {
    $$.get(io + 'select_all/token/' + token + '/project/' + project + '/collection/retail_category/appid/' + appid, function (data) {
        reltek.virtualList('#list-categories', {
            items: JSON.parse(data),
            renderItem: function (index, item) {
                return '<li class="swipeout category-list-' + item.id + '" id="category-list" data-id="' + item.id + '">' +
                    '<div class="swipeout-content item-content">' +
                    '<div class="item-inner">' + item.title + '</div>' +
                    '</div>' +
                    '<div class="swipeout-actions-right">' +
                    '<a data-confirm="Are you sure you want to delete this item?" class="swipeout-delete">Remove</a>' +
                    '</div>' +
                    '</li>';
            }
        });
    });
}

get_categories();

$$(document).on('click', '.form-to-data', function (e) {
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
        get_categories();
        mainView.router.load({pageName: 'index'});
    });
});

$$('#tab-categories').on('tab:show', function () {
    $$('#search-input').removeAttr('placeholder');
    $$('#search-input').attr('placeholder', 'Search Categories');
});

$$('#tab-products').on('tab:show', function () {
    $$('#search-input').removeAttr('placeholder');
    $$('#search-input').attr('placeholder', 'Search Products');
});

$$(document).on('swipeout:deleted', '#category-list', function (e) {
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

$$(document).on('click', '#category-list', function () {
    var id = $$(this).attr('data-id');
    reltek.swipeoutOpen('.category-list-' + id, "right");
    setTimeout(function () {
        reltek.swipeoutClose('.category-list-' + id);
    }, 10000);
});