$(function() {
    var Mustache = require('mustache');

    $.getJSON('js/data.json', function(data) {
        var template = $('#portfolio-template').html();
        var html = Mustache.to_html(template, data);
        $('#portfolio').html(html);
    }); //getJSON

}); //function