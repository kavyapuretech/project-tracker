require([ "dojo/dom", "dojo/_base/xhr", "dojo/domReady!" ], function(dom, xhr) {

	
	var url2 = require.toUrl("./amdloader/message.html");
	var url3 = require.toUrl("./amdloader/widgetPanelContent.htm");
	var url4 = require.toUrl("./amdloader/customBarConfig.htm");
    //var url5 = require.toUrl("./amdloader/valv.htm");
     
	

	//message pop up
	xhr.get({
		url : url2,
		load : function(html) {
			dom.byId("message_popup").innerHTML = html;
			
		}
	});

    //widgets sidnav
    xhr.get({
		url : url3,
		load : function(html) {
			dom.byId("widgetcontent").innerHTML = html;
			
		}
	});
	
	//basemap gallary and legend buttons
	xhr.get({
		url : url4,
		load : function(html) {
			dom.byId("basemapgallary_buttons").innerHTML = html;
			
		}
	});
	
	//valv and hydrant buttons
	// xhr.get({
		// url : url5,
		// load : function(html) {
			// dom.byId("valv_content").innerHTML = html;
// 			
		// }
	// });
});