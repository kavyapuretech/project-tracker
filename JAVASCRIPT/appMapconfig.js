/*jshint sub:true*/
var map1, arrlayers, visible=[], veTileLayer;

require(["esri/map", "esri/graphic", "esri/dijit/Search","esri/tasks/QueryTask",
         "esri/tasks/query", "dojo/dom", "esri/dijit/Scalebar", "dojo/query",
         "esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/LayerList", "esri/symbols/SimpleMarkerSymbol", "esri/InfoTemplate", 
         "esri/layers/FeatureLayer", "esri/dijit/BasemapGallery", "esri/dijit/Legend", 
         "dojo/_base/array", "esri/dijit/editing/AttachmentEditor", "esri/dijit/LocateButton", 
         "esri/dijit/HomeButton","esri/toolbars/navigation", "dojo/on", "dojo/parser",
         "dijit/registry", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol",
         "esri/symbols/SimpleLineSymbol", "dijit/Toolbar", "dijit/form/Button", "esri/Color", "esri/virtualearth/VETiledLayer", "dojo/domReady!"],
        
function(Map, Graphic, Search, QueryTask, Query,  dom, Scalebar, query, ArcGISDynamicMapServiceLayer, LayerList, SimpleMarkerSymbol, InfoTemplate,
	     FeatureLayer, BasemapGallery, Legend, arrayUtils, AttachmentEditor, LocateButton, 
	     HomeButton, Navigation, on, parser, registry, Draw, SimpleFillSymbol,  SimpleLineSymbol, Color, VETiledLayer) {
	         
	parser.parse();
	
	map1 = new esri. Map("map", {
		basemap : "streets", // For full list of pre-defined basemaps,
		center : [-76.627362, 39.283028], // longitude, latitude
		zoom : 11,
		sliderStyle : "large" //slidezoom

	});
//location tracker
geoLocate = new LocateButton({
	map : map1
}, "LocateButton");


//dynamic MapServicelayer
var l1 = dom.byId("layer1_id").value;
var l2 = dom.byId("layer2_id").value;

var featureurl = dom.byId("template").value;
var infotext = dom.byId("txt_id").value;
var searchinfo = dom.byId("search_optn").value;

 BaltoTracking = new ArcGISDynamicMapServiceLayer(l1, {

	"opacity" : 1.0,
    "id":"BaltoTracking"
});
 BaltoQuery = new ArcGISDynamicMapServiceLayer(l2, {

	"opacity" :1.0,
    "id":"BaltoQuery"
});

// add the Servicelayer 
var arrlayers = [];
arrlayers[0] = BaltoTracking;
arrlayers[1] = BaltoQuery;
BaltoTracking.on("load",
buildLayerList);
map1.addLayers(arrlayers);
function buildLayerList() {
         var items = arrayUtils.map(BaltoTracking.layerInfos, function(info, index) {
           if (info.defaultVisibility) {
             visible.push(info.id);
           }
           return "<input type='checkbox' class='list_item'" + (info.defaultVisibility ? "checked=checked" : "") + "' id='" + info.id + "'' /><label for='" + info.id + "'>" + info.name + "</label><br>";
         });
         var ll = dom.byId("layer_list");
         ll.innerHTML = items.join(' ');
         BaltoTracking.setVisibleLayers(visible);
         on(ll, "click", updateLayerVisibility);
       }
       
       function updateLayerVisibility() {
         var inputs = query(".list_item");
         var input;
         visible = [];

         arrayUtils.forEach(inputs, function(input) {
           if (input.checked) {
             visible.push(input.id);
           }
         });
         //if there aren't any layers visible set the array to be -1
         if (visible.length === 0) {
           visible.push(-1);
         }
         BaltoTracking.setVisibleLayers(visible);
       }
    


        // var myWidget = new LayerList({
           // map: map1,
           // layers: arrlayers
        // },"layerlist");
        // myWidget.startup();

var Featuretemplate = new FeatureLayer(featureurl, {
	opacity : 0.1
});

map1.addLayer(Featuretemplate);

var clickcount = 0;
function mapLoaded() {
	Featuretemplate.on("click", function(evt) {
	    
		var objectId = evt.graphic.attributes["objectIdField"];
		map1.infoWindow.setTitle(evt.graphic.attributes["OBJECTID"]);
		clickcount = clickcount + 1;
		map1.infoWindow.setContent("<b>FacilityID: </b>" + evt.graphic.attributes["FacilityID"] + "</br>" + 
		"<b>OBJECTID: </b>" + evt.graphic.attributes["OBJECTID"] + "</br>" + 
		"<b>GRID: </b>" + evt.graphic.attributes["GRID"] + "</br>" + 
		"<b>PRIMARY_ACTIVITY: </b>" + evt.graphic.attributes["PRIMARY_ACTIVITY"] + "</br>" + 
		"<b>VALVE_SIZE: </b>" + evt.graphic.attributes["VALVE_SIZE"] + "</br>" + 
		"<b>OPNUT_DEPTH: </b>" + evt.graphic.attributes["OPNUT_DEPTH"] + "</br>" + 
		"<b>FIELD_NOTES: </b>" + evt.graphic.attributes["FIELD_NOTES"] + "</br>" + 
		"<b>VALVE_CONDITION: </b>" + evt.graphic.attributes["VALVE_CONDITION"] + "</br>" + 
		"<b>EXERCISED: </b>" + evt.graphic.attributes["EXERCISED"] + "</br>" + 
		"<b>TURNS: </b>" + evt.graphic.attributes["TURNS"] + "</br>" + 
		"<div id=\"" + objectId + clickcount + "\" style='width:100%'></div>" + "</br>" +
	    "<div id='customInfoWindowBtnDiv'><button onclick='loadtable("+evt.graphic.attributes["OBJECTID"]+")'>Click for Wachswash Activity</button><input type='checkbox' style='float:right;'></div>");
		map1.infoWindow.resize(250, 300);
		var attachmentEditor = new AttachmentEditor({}, dom.byId("" + objectId + clickcount + ""));

		attachmentEditor.startup();
		attachmentEditor.showAttachments(evt.graphic, Featuretemplate);
		map1.infoWindow.show(evt.screenPoint, map1.getInfoWindowAnchor(evt.screenPoint));
	});	
	
}

function loadtable(objectid){
        document.getElementById("datatable").style.display = "block";
        document.getElementById("objectidvalue").value = objectid;
    }
//adding the navigation toolbar on left
var navToolbar;
var drawToolbar;

navToolbar = new Navigation(map1);
drawToolbar = new Draw(map1);
drawToolbar.on("draw-end", addPolygone);

on(navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);
registry.byId("zoomin").on("click", function() {
	navToolbar.activate(Navigation.ZOOM_IN);
});

registry.byId("zoomout").on("click", function() {
	navToolbar.activate(Navigation.ZOOM_OUT);
});

registry.byId("zoomfullext").on("click", function() {
	navToolbar.zoomToFullExtent();
});

registry.byId("zoomprev").on("click", function() {
	navToolbar.zoomToPrevExtent();
});

registry.byId("zoomnext").on("click", function() {
	navToolbar.zoomToNextExtent();
});

 registry.byId("pan").on("click", function() {
	 navToolbar.activate(Navigation.PAN);
});

// add basemapgallary
var basemapGallery = new BasemapGallery({
	showArcGISBasemaps : true,
	map : map1
}, "basemapGallery");
basemapGallery.startup();

// adding scale to map
var scalebar = new Scalebar({
	map : map1,
	scalebarUnit : "dual"

});

// add the legend
 map1.on("layers-add-result", function (evt) {
        var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
          return {layer:layer.layer, title:layer.layer.name};
        });
        if (layerInfo.length > 0) {
          var legendDijit = new Legend({
            map: map1,
            layerInfos: layerInfo
          }, "legendDiv");
          legendDijit.startup();
        }
      });

     

// add Search
var search = new Search({
	enableButtonMode : true, // this enables the search widget to display as a single button
	enableLabel : false,
	enableInfoWindow : true,
	showInfoWindowOnSelect : false,
	map : map1
}, "search");

var sources = search.get("sources");
// Push the sources used to search, by default the ArcGIS Online

sources.push({
	featureLayer : new FeatureLayer(searchinfo),
	searchFields : ["OBJECTID"],
	displayField : "OBJECTID",
	exactMatch : false,
	outFields : ["*"],
	name : "Valvs",
	placeholder : "36357",
	maxResults : 6,
	maxSuggestions : 6,
         
	// Create an InfoTemplate and include three fields
	infoTemplate : new InfoTemplate("${OBJECTID}", "FacilityID: ${FacilityID}</br>GRID: ${GRID}</br>FEAT_STATUS: ${FEAT_STATUS}"),
	enableSuggestions : true,
	minCharacters : 0
});

// Set the sources above to the search widget
search.set("sources", sources);

search.startup();
function addPolygone(evt) {
	drawToolbar.deactivate();
	var graphics = new Graphics(evt.geometry, symbol);
	map1.graphics.add(graphic);
}

function extentHistoryChangeHandler() {
	registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
	registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
}

//Adding query task to the dynamiclayer


var queryTask = null;
//var query = null;
var QuickSelectSymbol =  new SimpleMarkerSymbol();
QuickSelectSymbol.setSize(10); 
QuickSelectSymbol = new SimpleMarkerSymbol({
  "color": [204, 51, 255],
  "size": 12,
  "angle": -30,
  "xoffset": 0,
  "yoffset": 0,
  "type": "esriSMS",
  "style": "esriSMSCircle",
  
  "outline": {
    "color": [153, 0, 204, 255],  
    "width": 1,
    "type": "esriSLS",
    "style": "esriSLSSolid"
  }
});


on(dom.byId("quickselect"), "change", executeQueryTask);
function executeQueryTask() {

	var strSelectedLayer = dom.byId("quickselect").value;

	//alert('strSelectedLayer :' + strSelectedLayer);

	var optArray = [];
	optArray = strSelectedLayer.split(",");

	//alert("index : " + optArray[0] + " where : " + optArray[1] + " baseurl : " + base_url);
closepanels();
	
	queryTask = new QueryTask(base_url + "" + optArray[0]);
    
	query = new Query();
	query.returnGeometry = true;
	query.outFields = ["*"];

infoTemplate = new InfoTemplate("${OBJECTID}");
	
	query.where = optArray[1];
	queryTask.execute(query, showResults);
}

function showResults(featureSet) {

	map1.graphics.clear();
	var resultFeatures = featureSet.features;

	for (var i = 0,
	    il = resultFeatures.length; i < il; i++) {

		var graphic = resultFeatures[i];
		graphic.setSymbol(QuickSelectSymbol);
		graphic.setInfoTemplate(infoTemplate);
		map1.graphics.add(graphic);
	
	}
}


});

