var io = 'http://io.nowdb.net/v2/';
var token = '52f866f58d909e13236110e5';
var appid = '57aad4171f6d04fa10dd9d6b';
var project = 'newoffice';

var myApp = new Framework7({
    pushState: true,

    swipePanel: 'left',

    material: true,

    fastClicks: true,

    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },

    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('#dynamic-1').on('click', function () {
    dynamicContent();
});

function dynamicContent() {
    mainView.router.loadContent($$('#myPage').html());
    return;
}


$$.get(io + 'select_all/token/' + token + '/project/' + project + '/collection/letter/appid/' + appid, function (data) {
    myApp.virtualList('.list-block.virtual-list', {
        items: JSON.parse(data),
        searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].number.indexOf(query) >= 0 || query.trim() === '') found.push(i);
            }
            return found;
        },
        renderItem: function (index, item) {
            return '<li>' +
                '<a href="#" class="item-link item-content">' +
                '<div class="item-inner">' +
                '<div class="item-title-row">' +
                '<div class="item-title">' + item.number + '</div>' +
                '<div class="item-after">' + item.date + '</div>' +
                '</div>' +
                '<div class="item-subtitle">' + item.from + '</div>' +
                '<div class="item-text">' + item.about + '</div>' +
                '</div>' +
                '</a>' +
                '</li>';
        }
    });
});
