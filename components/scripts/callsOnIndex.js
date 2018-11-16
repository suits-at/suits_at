//async load images
$(function(){
    $( '.lazyload' ).each( function(){
        //* set the img src from data-src
        $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
    } );
} );


//scrolling from "more" triangle
$(function() {
    $(".more").on('click',function() {
        //maybe try changing animate to velocity
        $('html, body').animate({
            scrollTop: $('#referenzen').offset().top
        }, 500);
        return false;
    });
});

//calling typed.js
$(function() {
    $(".typed").typed({
      strings: ["Sebastian Ulbel IT-Solutions^3000","WEB DEVELOPER^3000", "FRONTEND DEVELOPER^3000", "JS DEVELOPER^3000", "PHP DEVELOPER^3000", "WORDPRESS DEVELOPER^3000", "VUE.JS DEVELOPER^3000"],
      typeSpeed: 100,
        loop: true,
        showCursor: true
    });
});

//calling grid effect on portfolio
$(function() {
    var support = {transitions: Modernizr.csstransitions},
    // transition end event name
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        onEndTransition = function (el, callback) {
            var onEndCallbackFn = function (ev) {
                if (support.transitions) {
                    if (ev.target != this) return;
                    this.removeEventListener(transEndEventName, onEndCallbackFn);
                }
                if (callback && typeof callback === 'function') {
                    callback.call(this);
                }
            };
            if (support.transitions) {
                el.addEventListener(transEndEventName, onEndCallbackFn);
            }
            else {
                onEndCallbackFn();
            }
        };

    new GridFx(document.querySelector('.grid'), {
        imgPosition: {
            x: -0.5,
            y: 1
        },
        onOpenItem: function (instance, item) {
            instance.items.forEach(function (el) {
                if (item != el) {
                    var delay = Math.floor(Math.random() * 50);
                    el.style.WebkitTransition = 'opacity .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1), -webkit-transform .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1)';
                    el.style.transition = 'opacity .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1), transform .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1)';
                    el.style.WebkitTransform = 'scale3d(0.1,0.1,1)';
                    el.style.transform = 'scale3d(0.1,0.1,1)';
                    el.style.opacity = 0;
                }
            });
        },
        onCloseItem: function (instance, item) {
            instance.items.forEach(function (el) {
                if (item != el) {
                    el.style.WebkitTransition = 'opacity .4s, -webkit-transform .4s';
                    el.style.transition = 'opacity .4s, transform .4s';
                    el.style.WebkitTransform = 'scale3d(1,1,1)';
                    el.style.transform = 'scale3d(1,1,1)';
                    el.style.opacity = 1;

                    onEndTransition(el, function () {
                        el.style.transition = 'none';
                        el.style.WebkitTransform = 'none';
                    });
                }
            });
        }
    });
});
