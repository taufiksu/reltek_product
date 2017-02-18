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