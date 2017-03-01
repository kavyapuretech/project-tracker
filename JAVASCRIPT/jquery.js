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

	// Navigation Menu Slider for widgets
	$('.nav-expander').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('nav-expanded');
		 $(".collapse").collapse("hide");
	});

});