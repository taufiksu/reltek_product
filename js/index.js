$$('.progressbar').hide();

$$('#tab-categories').on('tab:show', function () {
    $$('#search-input').removeAttr('placeholder');
    $$('#search-input').attr('placeholder', 'Search Categories');
});

$$('#tab-products').on('tab:show', function () {
    $$('#search-input').removeAttr('placeholder');
    $$('#search-input').attr('placeholder', 'Search Products');
});

categories_list();
products_list();

$$(document).on('page:init', function (e) {
    var page = e.detail.page;
    if (page.name === 'index') {
        categories_list();
        products_list();
    }
});