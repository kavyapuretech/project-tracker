var basemapstatus = "off";
var legendstatus = "off";
var layerstatus = "off";
function openBasemap() {

    if (basemapstatus == "off") {
        document.getElementById("basemapPanelDiv").style.display = "block";
        document.getElementById("layerlistitemsdiv").style.display = "none";
        
        basemapstatus = "on";
    } else if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
}

function openLayer() {

    if (legendstatus == "off") {
        document.getElementById("layerlistitemsdiv").style.display = "block";
        document.getElementById("basemapPanelDiv").style.display = "none";
        
        legendstatus = "on";
    } else if (legendstatus == "on") {
        document.getElementById("layerlistitemsdiv").style.display = "none";
        legendstatus = "off";

    }
}

function closepanels() {
  
    if (legendstatus == "on") {
        document.getElementById("layerlistitemsdiv").style.display = "none";
        legendstatus = "off";

    }
    if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
    
    $('body').removeClass('nav-expanded');
    
}