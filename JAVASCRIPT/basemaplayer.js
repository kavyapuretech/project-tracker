var basemapstatus = "off";
var layerstatus = "off";
function openBasemap() {

    if (basemapstatus == "off") {
        document.getElementById("basemapPanelDiv").style.display = "block";
        document.getElementById("layerlist").style.display = "none";
        
        basemapstatus = "on";
    } else if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
}

function openLayer() {

    if (layerstatus == "off") {
        document.getElementById("layerlist").style.display = "block";
        document.getElementById("basemapPanelDiv").style.display = "none";
        
        layerstatus = "on";
    } else if (layerstatus == "on") {
        document.getElementById("layerlist").style.display = "none";
        layerstatus = "off";

    }
}

function closepanels() {
  
    // if (layerstatus == "on") {
        // document.getElementById("layerlist").style.display = "none";
        // layerstatus = "off";
// 
    // }
    if (basemapstatus == "on") {
        document.getElementById("basemapPanelDiv").style.display = "none";
        basemapstatus = "off";
    }
    
    $('body').removeClass('nav-expanded');
     
    
}