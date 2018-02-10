//load google web fonts
WebFontConfig = {
    google: {families: ['Work+Sans:400,700:latin']}
};
(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

//scrolling bot from "more" triangle
$(function() {
    $(".more").on('click',function() {
        //maybe try changing animate to velocity
        $('html, body').animate({
            scrollTop: $('#portfolio').offset().top
        }, 500);
        return false;
    });
});

//typed js effect
$(function() {
    $(".typed").typed({
      strings: ["Sebastian Ulbel IT-Solutions^3000","WEB DEVELOPER^3000", "FRONTEND DEVELOPER^3000", "JS DEVELOPER^3000", "PHP DEVELOPER^3000", "WORDPRESS DEVELOPER^3000", "VUE.JS DEVELOPER^3000"],
        typeSpeed: 100,
        loop: true,
        showCursor: true
    });
});

//portfolio grid effect
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

//google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-13000597-11', 'auto');
ga('send', 'pageview');