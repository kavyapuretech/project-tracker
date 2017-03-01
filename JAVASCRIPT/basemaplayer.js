var basemapstatus = "off";
var legendstatus = "off";
var layerstatus = "off";
function openBasemap() {

    if (basemapstatus == "off") {
        document.getElementById("basemapPanelDiv").style.display = "block";
        document.getElementById("layerlistdiv").style.display = "none";
        document.getElementById("legendDiv").style.display = "none";
        basemapstatus = "on";
    } else if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
}

function openLayer() {

    if (legendstatus == "off") {
        document.getElementById("layerlistdiv").style.display = "block";
        document.getElementById("basemapPanelDiv").style.display = "none";
        document.getElementById("legendDiv").style.display = "none";
        legendstatus = "on";
    } else if (legendstatus == "on") {
        document.getElementById("layerlistdiv").style.display = "none";
        legendstatus = "off";

    }
}

function openLegend() {

    if (layerstatus == "off") {
        document.getElementById("legendDiv").style.display = "block";
        document.getElementById("layerlistdiv").style.display = "none";
        document.getElementById("basemapPanelDiv").style.display = "none";
        layerstatus = "on";
    } else if (layerstatus == "on") {
        document.getElementById("legendDiv").style.display = "none";
        layerstatus = "off";

    }
}

function closepanels() {
    if (layerstatus == "on") {
        document.getElementById("legendDiv").style.display = "none";
        layerstatus = "off";

    }
    if (legendstatus == "on") {
        document.getElementById("layerlistdiv").style.display = "none";
        legendstatus = "off";

    }
    if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
    
    $('body').removeClass('nav-expanded');
    $(".collapse").collapse("hide");
}