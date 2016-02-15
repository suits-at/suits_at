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