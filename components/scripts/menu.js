var $ = require('jquery');

(function() {
    var triggerBttn = document.getElementById( 'menu' ),
        overlay = document.querySelector( 'div.overlay' ),
        close = overlay.querySelector( '.overlay-close' );
    transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    },
        transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
        support = { transitions : Modernizr.csstransitions };

    function toggleOverlay() {
        $overlay = $(".overlay");
        if($overlay.hasClass( "open" )){
            $overlay.removeClass("open");
            $overlay.addClass("close");
            var onEndTransitionFn = function( ev ) {
                if( support.transitions ) {
                    if( ev.propertyName !== 'visibility' ) return;
                    this.removeEventListener( transEndEventName, onEndTransitionFn );
                }
                $overlay.removeClass("close");
            };
            if( support.transitions ) {
                overlay.addEventListener( transEndEventName, onEndTransitionFn );
            }
            else {
                onEndTransitionFn();
            }
        }
        else if(!$overlay.hasClass( "open" )){
            $overlay.addClass("open");
        }
    }

    triggerBttn.addEventListener( 'click', toggleOverlay );
    close.addEventListener( 'click', toggleOverlay );
})();

//Burger Menu
$(document).ready(function(){
    $burger = $('#menu');
    $burger.click(function(){
        $(this).toggleClass('open');
    });
    $('.overlay-close').click(function(){
        $burger.toggleClass('open');
    });
});


//
//
//$(document).ready(function ($) {
//    var win = $(window), body = $('body'), menuBtn = $('.menu-toggle'), menu = $('.le-menu'), navMenu = $('.main-navigation'), openMenuClass = ('menu-is-open'), downloadBtn = $('.download-btn'), popupContainer = $('.download-popup'), popupModal = popupContainer.find('.download-popup-inner'), openPopupClass = ('popup-is-open');
//
//    function openMenu() {
//        body.toggleClass(openMenuClass);
//        menuBtn.attr('aria-expanded', 'true');
//        navMenu.attr('aria-expanded', 'true');
//        menu.stop(true, true).show().velocity({translateY: '-100%'}, 0).velocity({
//            translateY: '0%',
//            opacity: 1
//        }, 300, [.5, 0, 0, 1]);
//        navMenu.find('li').css({'opacity': 0, 'top': '50px'});
//        navMenu.find('li').each(function (index) {
//            var delayTime = 300, delayIncrement = (index * 50) + delayTime;
//            $(this).delay(delayIncrement).velocity({'opacity': 1, 'top': 0}, delayTime, [.5, 0, 0, 1]);
//        });
//    }
//
//    function closeMenu() {
//        body.removeClass(openMenuClass);
//        menuBtn.attr('aria-expanded', 'false');
//        navMenu.attr('aria-expanded', 'false');
//        menu.stop(true, true).velocity({translateY: '0%'}, 0).velocity({translateY: '-100%'}, 600, [.5, 0, 0, 1]);
//    }
//
//    function onResizeAria() {
//        if (1280 > win.width()) {
//            menuBtn.attr('aria-expanded', 'false');
//            navMenu.attr('aria-expanded', 'false');
//            menuBtn.attr('aria-controls', 'secondary');
//        } else {
//            menuBtn.removeAttr('aria-expanded');
//            navMenu.removeAttr('aria-expanded');
//            menuBtn.removeAttr('aria-controls');
//            body.removeClass(openMenuClass);
//            state = true;
//        }
//    }
//
//    var state = true;
//    menuBtn.on('click', function (e) {
//        e.stopPropagation();
//        if (state) {
//            openMenu();
//            state = false;
//        } else {
//            closeMenu();
//            state = true;
//        }
//    });
//    onResizeAria();
//    win.resize(onResizeAria);
//    function openPopup() {
//        body.addClass(openPopupClass)
//        popupContainer.stop(true, true).show().velocity({translateY: '100%'}, 0).velocity({
//            translateY: '0%',
//            opacity: 1
//        }, 300, [.5, 0, 0, 1]);
//        popupModal.css({'opacity': 0, 'top': '60%'});
//        popupModal.delay(450).velocity({'opacity': 1, 'top': '50%'}, 300, [.5, 0, 0, 1]);
//    }
//
//    function closePopup() {
//        body.removeClass(openPopupClass);
//        popupContainer.stop(true, true).velocity({translateY: '0%'}, 0).velocity({translateY: '100%'}, 600, [.5, 0, 0, 1]);
//    }
//
//    var popupState = true;
//    downloadBtn.on('click', function (e) {
//        e.stopPropagation();
//        e.preventDefault();
//        if (popupState) {
//            openPopup();
//            popupState = false;
//        }
//    });
//    $('body').on('click', function (e) {
//        if (popupState === false && !$(e.target).closest('.download-popup-inner').length) {
//            closePopup();
//            popupState = true;
//            console.log($(e.target));
//        }
//    });
//});