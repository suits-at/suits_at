(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//scrolling from "more" triangle
//var velocity = require('velocity-animate');
$(function() {
    $(".more").on('click',function() {
        //maybe try changing animate to velocity
        $('html, body').animate({
            scrollTop: $('#page2').offset().top
        }, 500);
        return false;
    });
});

//fullPageScrolling
var pages = 2;
var currentpage = 1;
if (document.location.hash) { currentpage = parseInt(document.location.hash.replace('#', '')); }

var nextpage = currentpage + 1; if (nextpage > pages) { nextpage = pages; }
var prevpage = currentpage - 1; if (prevpage < 1) { prevpage = 1; }

var animatingup = false;
var animatingdown = false;

$(document).ready(function() {
    resizeDiv();
});

window.onresize = function(event) {
    resizeDiv();
    scrolltocurrent();
}

$(window).scroll(function(event) {

    if (animatingup==true) { return; }
    if (animatingdown==true) { return; }

    nextpage = currentpage + 1; if (nextpage > pages) { nextpage = pages; }
    prevpage = currentpage - 1; if (prevpage < 1) { prevpage = 1; }

    if (animatingup == false) {
        if ($(window).scrollTop()+$(window).height()>=$("#page"+(nextpage)).offset().top+50) {
            if (nextpage > currentpage) {
                var p2 = $( "#page"+(nextpage) );
                var pageheight = p2.position().top;
                animatingdown = true;
                $('html, body').animate({ scrollTop: pageheight }, 500, function() { currentpage = nextpage; animatingdown = false; document.location.hash = currentpage;});
                return;
            }
        }
    }

    if (animatingdown == false) {
        if ($(window).scrollTop()<=$("#page"+(currentpage)).offset().top-50) {
            if (prevpage < currentpage) {
                var p2 = $( "#page"+(currentpage) );
                var pageheight = p2.position().top-$(window).height();
                animatingup = true;
                $('html, body').animate({ scrollTop: pageheight }, 500, function() { currentpage = prevpage; animatingup = false; document.location.hash = currentpage;});
                return;
            }
        }
    }
});


function scrolltocurrent() {
    var p2 = $( "#page"+(currentpage) );
    var pageheight = p2.position().top;
    $('html, body').animate({ scrollTop: pageheight }, 200);
}

function resizeDiv() {
    vpw = $(window).width();
    vph = $(window).height();
    $('.page').css({'min-height': vph + 'px'});
}
},{}]},{},[1])