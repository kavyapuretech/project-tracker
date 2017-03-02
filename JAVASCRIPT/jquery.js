$(function() {
	var height = $(window).height();
	$("#map").css("height", height - 80); // map in body
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
		 $(".collapse").collapse("hide");
	});
	
	//Layerlist toggle
    $("#layerlist").on('click',function() {
            $("#layer_list").slideToggle("slow");
                
        });
        $("#layer_list").slideUp("slow");
});