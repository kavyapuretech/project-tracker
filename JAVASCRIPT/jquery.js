$(function() {
    var height = $(window).height();
    $("#map").css("height", height - 90); // map in body
    $("#basemapdiv").css("max-height", height - 120);
    $("#map").css("z-index", "-1");
    $("#map").show();
    $("#search").hide();


    $("#maps").click(function() {
        $("#map").show();
        $("#search").show();
    });

    //  Menu Slider for widgets
    $('.nav-expander').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('nav-expanded');
        
    });
    
});