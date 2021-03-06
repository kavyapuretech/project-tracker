var map1,barrierSymbol,
    arrlayers,
    visible = [],
    clickedmxassent;

require(["esri/map", "esri/graphic", "esri/dijit/Search", "esri/tasks/QueryTask", "esri/tasks/query", "dojo/dom",
 "esri/dijit/Scalebar", "dojo/query", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/LayerList", 
 "esri/symbols/SimpleMarkerSymbol", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/dijit/BasemapGallery", 
 "dojo/_base/array", "esri/dijit/editing/AttachmentEditor", "esri/dijit/LocateButton", "esri/toolbars/navigation", 
 "dojo/on", "dojo/parser", "dijit/registry", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol", 
 "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/dijit/FeatureTable", "dijit/Toolbar", "dijit/form/Button", "dojo/domReady!"], 
 function(Map, Graphic, Search, QueryTask, Query, dom, Scalebar, query, ArcGISDynamicMapServiceLayer, LayerList, 
     SimpleMarkerSymbol, InfoTemplate, FeatureLayer, BasemapGallery, arrayUtils, AttachmentEditor, LocateButton, 
     Navigation, on, parser, registry, Draw, SimpleFillSymbol, SimpleLineSymbol, Color, FeatureTable) {

    parser.parse();
    map1 = new Map("map", {
        basemap : "streets", // For full list of pre-defined basemaps,
        center : [-76.627362, 39.283028], // longitude, latitude
        zoom : 16,
        sliderStyle : "large" //slidezoom

    });

    //dynamic MapServicelayer
    var l1 = dom.byId("layer1_id").value;
    var l2 = dom.byId("layer2_id").value;

    var featureurl = dom.byId("template").value;
    var attributename = dom.byId("attribute_name").value;
    var infotext = dom.byId("txt_id").value;
    var searchinfo = dom.byId("search_optn").value;

    BaltoTracking = new ArcGISDynamicMapServiceLayer(l1, {

        "opacity" : 1.0,
        "id" : "BaltoTracking"
    });
    BaltoQuery = new ArcGISDynamicMapServiceLayer(l2, {

        "opacity" : 1.0,
        "id" : "BaltoQuery"
    });

    // add the MapServicelayer
    var arrlayers = [];
    arrlayers[0] = BaltoTracking;
    arrlayers[1] = BaltoQuery;

    map1.addLayers(arrlayers);
    //add layerlist

    var layerList = new LayerList({
        map : map1,
        showLegend : true,
        showSubLayers : true,
        showOpacitySlider : true,
        layers : []
    }, "layerListDom");
    layerList.startup();

    //location tracker
    geoLocate = new LocateButton({
        map : map1
    }, "LocateButton");

    map1.on("load", mapLoaded);
    // add FeatureLayer

    var clickcount = 0;
    var Featuretemplate;
    var myFeaturetable;
    var FeatureTableLayer;
    function mapLoaded() {
        Featuretemplate = new FeatureLayer(featureurl, {
            opacity : 0.5,
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields : ["*"],
            id : "fLayer"
       });
       
       FeatureTableLayer = new FeatureLayer("https://solutions.puretechltd.com/arcgis/rest/services/Baltimore/BaltoQuery/MapServer/9", {
            opacity : 0.5,
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields : ["*"],
            definitionExpression : "1=2",
            id : "fTableLayer"
       });
       
        map1.addLayer(Featuretemplate);
        
        barrierSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_X).setSize(20).setAngle(255);
        barrierSymbol.outline.setWidth(2).
        setColor(new Color([255,0,0]));
        
        
        Featuretemplate.on("click", function(evt) {
                   
            var objectId = evt.graphic.attributes[attributename];
            var idProperty = Featuretemplate.objectId;
            clickedmxassent = evt.graphic.attributes.FacilityID;
            

           // if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes[idProperty]) {
              //  Featuretemplate.setDefinitionExpression("MXASSETNUM=" + evt.graphic.attributes.MXASSETNUM + "");
                //myFeaturetable.refresh();

         //   }

            map1.infoWindow.setTitle(evt.graphic.attributes[attributename]);
            clickcount = clickcount + 1;
             var txt = "";
            //alert('mapconfig: '+txt);  
            for (i = 0; i < attributevalues.length; i++) {
                txt += "<b>"
                + attributevalues[i]
                + "</b> : "
                + evt.graphic.attributes[attributevalues[i]]  
                + "</br>";
               // console.log(evt.graphic.attributes[attributevalues[i]] );
    }
                                 
             map1.infoWindow.setContent(txt+
            // onclick='voteOnIncident(" + evt.graphic.attributes.objectid + ")'
             "<div id=\"" + objectId + clickcount + "\" style='width:100%'></div>" + "</br>" + 
            "<div id='customInfoWindowBtnDiv'><button id=\"" + objectId + clickcount + 1+"\" >Click for Wachswash Activity</button><input type='checkbox' style='float:right;'></div>");          
             map1.infoWindow.resize(250, 300);
            var attachmentEditor = new AttachmentEditor({}, dom.byId("" + objectId + clickcount + ""));
            var button = new dijit.form.Button({
                label : "click for wachwash activity",
                onClick : function() {
                    FeatureTableLayer.setDefinitionExpression("MXASSETNUM='" + clickedmxassent + "'");
                    myFeaturetable.refresh();  
                    $("#featuretable").css({"z-index": "100", "height": "300", "opacity": "1","transition": "all 2s","-webkit-transition": "all 2s"});
                    $("#featuretable").fadeIn("slow");
                 
                 }
            },  ""+objectId + clickcount + 1+"");
            
           
            
            attachmentEditor.startup();
            attachmentEditor.showAttachments(evt.graphic, Featuretemplate);
            map1.infoWindow.show(evt.screenPoint, map1.getInfoWindowAnchor(evt.screenPoint));

            
            addBarrier(evt);
        });
       var button1 = new dijit.form.Button({
                label : "X",
                onClick : function() {
                    FeatureTableLayer.setDefinitionExpression("1=2");
                    //myFeaturetable.refresh();
                    $("#featuretable").css({"z-index": "-100", "opacity": "0","transition": "all 1s","-webkit-transition": "all 1s"});
                    //$("#featuretable").fadeOut("slow");
                }
            }, "featuretableclose");
       
        var myFeaturetable = new FeatureTable({

            featureLayer : FeatureTableLayer,
            map : map1,
            editable : true,
            syncSelection : true,
            dateOptions : {
                datePattern : 'M/d/y',
                timeEnabled : true,
                timePattern : 'H:mm'
            },
            outFields: ["MXASSETNUM", "CREW_CHIEF", "FIELD_NOTES", "DATE_OPERATED", "PRIMARY_ACTIVITY", "VALVE_SIZE", "EXERCISE",
            "VALVE_CONDITION", "OPNUT_DEPTH", "SURFACE_COVER", "TURNS", "OP_METHOD", "OPEN_DIRECTION", "FROZEN"],
           
            // use fieldInfos object to change field's label (column header)

            fieldInfos : [{
                name : 'MXASSETNUM',
                alias : 'FacilityID',
                editable : false //disable editing on this field
            }, {
                name : 'CREW_CHIEF',
                alias : 'CREW CHIEF',
               },
            {
                name: 'FIELD_NOTES',
                alias: 'NOTES'
            }            
            ]
      }, 'myTableNode');

        myFeaturetable.startup();
        // listen to refresh event
        myFeaturetable.on("refresh", function(evt) {
            console.log("refresh event - ", evt);

        });
        }
function addBarrier(evt) {
         map1.graphics.clear();
            map1.graphics.add(
              new esri.Graphic(
                evt.mapPoint,
                barrierSymbol
              )
            );          
    }

    //adding the navigation toolbar on left
    var navToolbar;
    var drawToolbar;

    navToolbar = new Navigation(map1);
    //drawToolbar = new Draw(map1);
    //drawToolbar.on("draw-end", addPolygone);

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
        layers : [new esri.dijit.BasemapLayer({
            type : "BingMapsRoad"
        })],
        id : "bmRoad",
        title : "Bing Road",
        thumbnailUrl : "images/topo_map_2.jpg"
    });

    basemaps.push(basemapRoad);
    var basemapHybrid = new esri.dijit.Basemap({
        layers : [new esri.dijit.BasemapLayer({
            type : "BingMapsHybrid"
        })],
        id : "bmHybrid",
        title : "Bing Aerial",
        thumbnailUrl : "images/imagery_labels.jpg"
    });
    basemaps.push(basemapHybrid);

    var basemapGallery = new esri.dijit.BasemapGallery({
        showArcGISBasemaps : true,
        basemaps : basemaps,
        bingMapsKey : "Ao-1ZsdYgIJ78TGQYHHQ2BucDl37tg1R3iPX1ekLuMMoj7b3pOMkQHUV-myGUr3I",
        map : map1
    }, "basemapGallery");
    basemapGallery.startup();

    // adding scale to map
    var scalebar = new Scalebar({

        map : map1,
        scalebarUnit : "dual"

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
        placeholder : "59379",
        maxResults : 6,
        maxSuggestions : 6,

        // Create an InfoTemplate and include three fields
        infoTemplate : new InfoTemplate("${OBJECTID}", "OBJECTID: ${OBJECTID}</br>CREW_CHIEF: ${CREW_CHIEF}"),
        enableSuggestions : true,
        minCharacters : 0
    });
    // Set the sources above to the search widget
    search.set("sources", sources);

    search.startup();

    function extentHistoryChangeHandler() {
        registry.byId("zoomprev").disabled = navToolbar.isFirstExtent();
        registry.byId("zoomnext").disabled = navToolbar.isLastExtent();
    }

    //Adding query task quick select to the dynamic maplayer

    var queryTask = null;
    //var query = null;
    var QuickSelectSymbol = new SimpleMarkerSymbol();
    QuickSelectSymbol.setSize(10);
    QuickSelectSymbol = new SimpleMarkerSymbol({
        "color" : [204, 51, 255],
        "size" : 12,
        "angle" : -30,
        "xoffset" : 0,
        "yoffset" : 0,
        "type" : "esriSMS",
        "style" : "esriSMSCircle",

        "outline" : {
            "color" : [153, 0, 204, 255],
            "width" : 1,
            "type" : "esriSLS",
            "style" : "esriSLSSolid"
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

        for (var i = 0,il = resultFeatures.length; i < il; i++) {

            var graphic = resultFeatures[i];
            graphic.setSymbol(QuickSelectSymbol);
            graphic.setInfoTemplate(infoTemplate);
            map1.graphics.add(graphic);

        }
    }

});

