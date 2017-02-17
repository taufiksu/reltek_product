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