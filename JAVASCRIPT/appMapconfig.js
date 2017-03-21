/*jshint sub:true*/
var map1, arrlayers, visible=[], veTileLayer, clickedobjectid;

require(["esri/map", "esri/graphic", "esri/dijit/Search","esri/tasks/QueryTask",
         "esri/tasks/query", "dojo/dom", "esri/dijit/Scalebar", "dojo/query",
         "esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/LayerList", "esri/symbols/SimpleMarkerSymbol", "esri/InfoTemplate", 
         "esri/layers/FeatureLayer", "esri/dijit/BasemapGallery", "esri/dijit/Legend", 
         "dojo/_base/array", "esri/dijit/editing/AttachmentEditor", "esri/dijit/LocateButton", 
         "esri/dijit/HomeButton","esri/toolbars/navigation", "dojo/on", "dojo/parser",
         "dijit/registry", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol",
         "esri/symbols/SimpleLineSymbol", "dijit/Toolbar", "dijit/form/Button", "esri/Color", "esri/virtualearth/VETiledLayer","esri/dijit/FeatureTable", "dojo/domReady!"],
        
function(Map, Graphic, Search, QueryTask, Query,  dom, Scalebar, query, ArcGISDynamicMapServiceLayer, LayerList, SimpleMarkerSymbol, InfoTemplate,
	     FeatureLayer, BasemapGallery, Legend, arrayUtils, AttachmentEditor, LocateButton, 
	     HomeButton, Navigation, on, parser, registry, Draw, SimpleFillSymbol,  SimpleLineSymbol, Color, VETiledLayer,FeatureTable) 
	     {
	         
	parser.parse();
	map1 = new Map("map", {
        basemap : "streets", // For full list of pre-defined basemaps,
        center : [-76.627362, 39.283028], // longitude, latitude
        zoom : 18,
        sliderStyle : "large" //slidezoom

    });   
	
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

// add the MapServicelayer 
var arrlayers = [];
arrlayers[0] = BaltoTracking;
arrlayers[1] = BaltoQuery;

map1.addLayers(arrlayers);
//add layerlist

      var layerList = new LayerList({
        map: map1,
        showLegend: true,
        showSubLayers: true,
        showOpacitySlider: true,
        layers: []
      },"layerListDom"); 
	  layerList.startup();
	
//location tracker
 geoLocate = new LocateButton({
	map : map1
}, "LocateButton");


map1.on("load", mapLoaded);
// add FeatureLayer

var Featuretemplate;


var clickcount = 0;
var myFeatureTable;
function mapLoaded() {
    Featuretemplate = new FeatureLayer(featureurl, {
    opacity : 0.1,
    outFields:["*"],

            definitionExpression: "1=1", 

            id: "fLayer2"
    
});
map1.addLayer(Featuretemplate);
	Featuretemplate.on("click", function(evt) {
	   
		var objectId = evt.graphic.attributes["objectIdField"];
		 var idProperty = Featuretemplate.objectIdField;

            if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes[idProperty]) {

              

   Featuretemplate.setDefinitionExpression("OBJECTID="+evt.graphic.attributes.OBJECTID+"");

//                myFeatureTable.refresh();

            }
		
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
	    "<div id='customInfoWindowBtnDiv'><button id='activitybutton'>Click for Wachswash Activity</button><input type='checkbox' style='float:right;'></div>");
		map1.infoWindow.resize(250, 300);
		var attachmentEditor = new AttachmentEditor({}, dom.byId("" + objectId + clickcount + ""));
var button = new dijit.form.Button({         label: "click for wachwash activity",         onClick: function(){            loadtable();         }     }, "activitybutton");
		attachmentEditor.startup();
		attachmentEditor.showAttachments(evt.graphic, Featuretemplate);
		map1.infoWindow.show(evt.screenPoint, map1.getInfoWindowAnchor(evt.screenPoint));
		
		clickedobjectid = evt.graphic.attributes.OBJECTID;
    

		
	});	
	  myFeatureTable = new FeatureTable({

            featureLayer : Featuretemplate,

            map : map1,

            editable: true,

            syncSelection: true,

            dateOptions: {

              datePattern: 'M/d/y',

              timeEnabled: true,

              timePattern: 'H:mm',

            },

            // use fieldInfos object to change field's label (column header),

            // change the editability of the field, and to format how field values are displayed

            // you will not be able to edit callnumber field in this example.

            fieldInfos: [

              {

                name: 'callnumber',

                alias: 'Call Number',

                editable: false //disable editing on this field

              },

              {

                name: 'speed',

                alias: 'Current Speed',

                format: {

                  template: "${value} mph" //add mph at the of the value

                }

              },

              {

                name: 'type',

                alias: 'Vehicle Type'

              },

              {

                name: 'unitname',

                alias: 'Unit Name'

              }

            ],

            // add custom menu functions to the 'Options' drop-down Menu

             menuFunctions: [

            {

              label: "Filter Available Emergency Vehicles",

              callback: function(evt){

                console.log(" -- evt: ", evt);

                // set definition expression on the layer

                // show only available emergency vehicles

                Featuretemplate.setDefinitionExpression("OBJECTID='"+evt.graphic.attributes.OBJECTID+"'");

 

                // call FeatureTable.refresh() method to re-fetch features

                // from the layer. Table will only show records that meet

                // layer's definition expression creteria. 

                myFeatureTable.refresh();

              }

            },{

              label: "Show All Emergency Vehicles",

              callback: function(evt){

                console.log(" -- evt: ", evt);

                Featuretemplate.setDefinitionExpression("OBJECTID='"+evt.graphic.attributes.OBJECTID+"");

                myFeatureTable.refresh();

              }

            }]

          }, 'myTableNode');

 

          myFeatureTable.startup();   
    // listen to refresh event

          myFeatureTable.on("refresh", function(evt){

            console.log("refresh event - ", evt);

          });	
}

          
   // var mapExtentChange = map.on("extent-change", changeHandler);



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
 var basemaps = [];
        var basemapRoad = new esri.dijit.Basemap({
          layers: [new esri.dijit.BasemapLayer({
            type: "BingMapsRoad"
          })],
          id: "bmRoad",
          title: "Bing Road",
          thumbnailUrl:"images/topo_map_2.jpg"
        });
        
         basemaps.push(basemapRoad);
          var basemapHybrid = new esri.dijit.Basemap({
          layers: [new esri.dijit.BasemapLayer({
            type: "BingMapsHybrid"
          })],
          id: "bmHybrid",
          title: "Bing Aerial",
           thumbnailUrl:"images/imagery_labels.jpg"
        });
        basemaps.push(basemapHybrid);

var basemapGallery = new esri.dijit.BasemapGallery({
          showArcGISBasemaps: true,
          basemaps: basemaps,
          bingMapsKey: "Ao-1ZsdYgIJ78TGQYHHQ2BucDl37tg1R3iPX1ekLuMMoj7b3pOMkQHUV-myGUr3I",
          map: map1
        }, "basemapGallery");
basemapGallery.startup();

// adding scale to map
var scalebar = new Scalebar({
   
	map : map1,
	scalebarUnit : "dual"

});

// add the legend
 // map1.on("layers-add-result", function (evt) {
        // var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
          // return {layer:layer.layer, title:layer.layer.name};
        // });
        // if (layerInfo.length > 0) {
          // var legendDijit = new Legend({
            // map: map1,
            // layerInfos: layerInfo
          // }, "legendDiv");
          // legendDijit.startup();
        // }
      // });

     

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
function loadtable(){
                          myFeatureTable.startup();
                  
                      // listen to refresh event

                      myFeatureTable.on("refresh", function(evt){
                        console.log("refresh event - ", evt);
                      });
                      
                      Featuretemplate.setDefinitionExpression("OBJECTID="+evt.graphic.attributes.OBJECTID+"");
                        myFeatureTable.refresh();
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
$( "map" ).on( "click", "activitybutton", function() {
                Featuretemplate.setDefinitionExpression("OBJECTID='"+clickedobjectid+"");
                myFeatureTable.refresh();
                $("#featuretable").css("display","block");
                
            });
            
            $( "map" ).on( "click", "featuretableclose", function() {
                Featuretemplate.setDefinitionExpression("1=1");
                $("#featuretable").css("display","none");
            });

});

