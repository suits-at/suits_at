//var $ = require('jquery');
var velocity = require('velocity-animate');

$(document).ready(function ($) {
    var win = $(window), body = $('body'), menuBtn = $('.menu-toggle'), menu = $('.le-menu'), navMenu = $('.main-navigation'), openMenuClass = ('menu-is-open');

    function openMenu() {
        body.toggleClass(openMenuClass);
        menuBtn.attr('aria-expanded', 'true');
        navMenu.attr('aria-expanded', 'true');
        menu.stop(true, true).show().velocity({translateY: '-100%'}, 0).velocity({
            translateY: '0%',
            opacity: 1
        }, 300, [.5, 0, 0, 1]);
        navMenu.find('li').css({'opacity': 0, 'top': '50px'});
        navMenu.find('li').each(function (index) {
            var delayTime = 300, delayIncrement = (index * 50) + delayTime;
            $(this).delay(delayIncrement).velocity({'opacity': 1, 'top': 0}, delayTime, [.5, 0, 0, 1]);
        });
    }

    function closeMenu() {
        body.removeClass(openMenuClass);
        menuBtn.attr('aria-expanded', 'false');
        navMenu.attr('aria-expanded', 'false');
        menu.stop(true, true).velocity({translateY: '0%'}, 0).velocity({translateY: '-100%'}, 600, [.5, 0, 0, 1]);
    }

    function onResizeAria() {
        if (1280 > win.width()) {
            menuBtn.attr('aria-expanded', 'false');
            navMenu.attr('aria-expanded', 'false');
            menuBtn.attr('aria-controls', 'secondary');
        } else {
            menuBtn.removeAttr('aria-expanded');
            navMenu.removeAttr('aria-expanded');
            menuBtn.removeAttr('aria-controls');
            body.removeClass(openMenuClass);
            state = true;
        }
    }

    var state = true;
    menuBtn.on('click', function (e) {
        e.stopPropagation();
        if (state) {
            openMenu();
            state = false;
        } else {
            closeMenu();
            state = true;
        }
    });
    onResizeAria();
    win.resize(onResizeAria);
});