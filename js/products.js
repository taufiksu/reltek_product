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
                    '<a href="products_detail.html?id=' + item.id + '" class="mark bg-orange">Detail</a>' +
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
        method: 'DELETE',
        success: function () {
            products_list();
            mainView.router.load({pageName: 'index'});
        }
    });
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

/*
 * Product Detail
 */

reltek.onPageInit('products-detail', function (page) {
    var id = page.query.id;
    $$.get(io + 'select_id/token/' + token + '/project/' + project + '/collection/retail/appid/' + appid + '/id/' + id, function (data) {
        var data_json = JSON.parse(data);
        $$('#product-title').html(data_json[0].name);
        $$('#product-type').html(data_json[0].type);
        $$('#product-description').html(data_json[0].description);
        $$('#btn-products-categories').attr('href', 'products_categories_form_add.html?id=' + id);
        $$('#btn-products-images').attr('href', 'products_images_form_upload.html?id=' + id);
    });

    products_categories_list(id);
});

/*
 * Product Categories List
 */

function products_categories_list(id) {
    $$.get(io + 'select_where/token/' + token + '/project/' + project + '/collection/retail_category_linked/appid/' + appid + '/where_field/retail_id/where_value/' + id, function (data) {
        var data_json = JSON.parse(data);
        if (data_json.Data != 0) {
            $$('#categories-list').empty();
            $$.each(data_json, function (index, item) {
                $$('#categories-list').append('<div class="chip" style="margin-right: 3px;">' +
                    '<div class="chip-label">' + item.category_title + '</div>' +
                    '<a class="chip-delete" data-id="' + item.id + '"></a>' +
                    '</div>');
            });
        }
    });
}

/*
 * Product Categories Form Add
 */

reltek.onPageInit('products-categories-form-add', function (page) {
    $$('#form-product-category-add').attr('action', io + 'insert');

    var url = 'select_where' +
        '/token/' + token +
        '/project/' + project +
        '/collection/retail_category' +
        '/appid/' + appid +
        '/where_field/parent_id' +
        '/where_value/0'

    $$.get(io + url, function (data) {
        var data_json = JSON.parse(data);
        if (data_json.Data != 0) {
            $$.each(data_json, function (index, item) {
                $$('#category_id').append('<option value="' + item.id + '">' + item.title + '</option>')
            });
        }
    });

    $$('#retail_id').val(page.query.id);
});

/*
 * Product Category Add
 */

$$(document).on('click', '#btn-products-categories-form-add', function () {
    var form_data = reltek.formToData('#form-product-category-add');

    var url = 'select_id' +
        '/token/' + token +
        '/project/' + project +
        '/collection/retail_category' +
        '/appid/' + appid +
        '/id/' + form_data.category_id

    $$.get(io + url, function (data) {
        var data_json = JSON.parse(data);

        var post_data = {
            token: token,
            project: project,
            collection: 'retail_category_linked',
            appid: appid,
            category_id: form_data.category_id,
            category_title: data_json[0].title,
            retail_id: form_data.retail_id
        }

        $$.post(io + 'insert', post_data, function () {
            products_categories_list(form_data.retail_id);
            mainView.router.loadPage('products_detail.html?id=' + form_data.retail_id);
        });
    });
});

/*
 * Products Categories Remove
 */

$$(document).on('click', '.chip-delete', function (e) {
    var chip = $$(this).parents('.chip');
    var id = $$(this).attr('data-id');
    reltek.confirm('Do you want to delete this category?', function () {
        var uri = 'remove_id' +
            '/token/' + token +
            '/project/' + project +
            '/collection/retail_category_linked' +
            '/appid/' + appid +
            '/id/' + id;
        $$.ajax({
            url: io + uri,
            type: "DELETE",
            success: function () {
                chip.remove();
            }
        });
    });
});

/*
 * Product Images Form Add
 */

reltek.onPageInit('products-images-form-upload', function (page) {
    $$('#form-product-image-upload').attr('action', io + 'insert');
    $$('#retail_id').val(page.query.id);
});

/*
 * Product Upload
 */

function supportAjaxUpload() {
    return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
    function supportFileAPI() {
        var fi = document.createElement('INPUT');
        fi.type = 'file';
        return 'files' in fi;
    }

    function supportAjaxUploadProgressEvents() {
        var xhr = new XMLHttpRequest();
        return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
    }

    function supportFormData() {
        return !!window.FormData;
    }
}

if (supportAjaxUpload()) {
    initAjaxFormUpload();
}

function initAjaxFormUpload() {
    $$(document).on('click', '#btn-products-images-form-upload', function () {
        var uploadInfo = new (FormData);
        uploadInfo.append("token", token);
        uploadInfo.append("project", project);
        uploadInfo.append("fileToUpload", $$('#image_file')[0].files[0]);

        var action = io_plain + 'files/uploader';

        sendXHRequest(uploadInfo, action);
        return false;
    });
}

function sendXHRequest(uploadInfo, uri) {
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('loadstart', false);
    xhr.upload.addEventListener('progress', on_progress, false);
    xhr.upload.addEventListener('load', false);
    xhr.addEventListener('readystatechange', on_ready, false);
    xhr.open('POST', uri, true);
    xhr.send(uploadInfo);
}

function on_progress(callback) {
    var percent = Math.round(callback.loaded / callback.total * 100).toFixed(0);
    var progress = 100 - percent;
    $$('.progressbar').show();
    $$('.progress').css('transform', 'translate3d(-' + progress + '%, 0px, 0px)');
}

function on_ready(callback) {
    if (callback.target.readyState == 4 && callback.target.status == '200' && callback.target.responseText) {
        //var obj = JSON.parse(callback.target.responseText);
        $$('.progressbar').hide();
        reltek.addNotification({
            message: 'Upload Success'
        });
    }
}