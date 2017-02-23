var basemapstatus = "off";
  var legendstatus = "off";
 function openBasemap(){

           
                   if(basemapstatus == "off"){
                        document.getElementById("basemapPanelDiv").style.display="block";
                        document.getElementById("layerlistdiv").style.display="none";
                        basemapstatus = "on";
                  }

                   else if(basemapstatus == "on"){
                         document.getElementById("basemapPanelDiv").style.display="none";
                         basemapstatus = "off";
                   }
             }

function openLegend(){

                   if(legendstatus == "off"){
                        document.getElementById("layerlistdiv").style.display="block";
                        document.getElementById("basemapPanelDiv").style.display="none";
                        legendstatus = "on";
                  }
                   else if(legendstatus == "on"){
                         document.getElementById("layerlistdiv").style.display="none";
                         legendstatus = "off";

                   }
             }
