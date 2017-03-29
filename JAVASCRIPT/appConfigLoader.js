var attributevalues;
var layer1_url;
var layer2_url;

var base_url;
var configdata;
var quickselectdata;

$(document).ready(function() {

	configdata = xmlreader("config_file/appConfig.xml");
	quickselectdata = xmlreader("config_file/xmlQuickSelectConfig.xml");
    
	map(configdata);
	quickselect(quickselectdata);

});

function xmlreader(filename) {

	if (window.XMLHttpRequest)

	{
		xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome,
										// Opera, Safari
	}
	else
	{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
	}

	xmlhttp.open("GET", filename, false);
	xmlhttp.send();
	return xmlhttp;

}

function map(xml) {
	var xmlDoc = xml.responseXML;
	
	//dynamic layer
	var dyanamiclayer0 = xmlDoc.getElementsByTagName('dynamiclayer')[0];
	var dyanamiclayer0_url = dyanamiclayer0.getElementsByTagName("url")[0];
	var layer_url1 = dyanamiclayer0_url.childNodes[0];

	var dyanamiclayer1 = xmlDoc.getElementsByTagName('dynamiclayer2')[0];
	var dyanamiclayer1_url = dyanamiclayer1.getElementsByTagName("url")[0];
	var layer_url2 = dyanamiclayer1_url.childNodes[0];
	
	
	document.getElementById("layer1_id").value = layer_url1.nodeValue;
	document.getElementById("layer2_id").value = layer_url2.nodeValue;
	
    // client logo details
	var clientlogo = xmlDoc.getElementsByTagName('clientlogo')[0];
	var apptitle = xmlDoc.getElementsByTagName('apptitle')[0];
    var companylogo = xmlDoc.getElementsByTagName('companylogo')[0];
    var companysmalllogo = xmlDoc.getElementsByTagName('companysmalllogo')[0];
	
	document.getElementById("clienticon").href = clientlogo.childNodes[0].nodeValue;
	document.getElementById("clientmainlogo").src = clientlogo.childNodes[0].nodeValue;
	document.getElementById("citytagname").innerHTML = apptitle.childNodes[0].nodeValue;
	document.getElementById("companyicon").src = companylogo.childNodes[0].nodeValue;
    document.getElementById("companyminiicon").src = companysmalllogo.childNodes[0].nodeValue;

    // search option
    var searchoptions = xmlDoc.getElementsByTagName('search')[0];
    var searchoptions_url = searchoptions.getElementsByTagName("url")[0];
    var search_id = searchoptions_url.childNodes[0];
    
     document.getElementById("search_optn").value = search_id.nodeValue;
     
    // feature layer 
    var Featurelayer0 = xmlDoc.getElementsByTagName('infowindowfeaturelayer')[0];
    var Featurelayer0_url = Featurelayer0.getElementsByTagName("url")[0];
    var Featurelayer0_id = Featurelayer0.getElementsByTagName("uniqueid")[0];
    
    var infodata= Featurelayer0_url.childNodes[0];
    var uniqid= Featurelayer0_id.childNodes[0];
   
    document.getElementById("template").value = infodata.nodeValue;
    document.getElementById("attribute_name").value = uniqid.nodeValue;

	attributevalues = Featurelayer0.getElementsByTagName("outFields")[0].childNodes[0].nodeValue.split(",");
	//alert('outfields: '+attributevalues);
	//var txt = "";
	// for (i = 0; i < attributes.length; i++) {
// 
		// txt += "<b>"
				// + attributes[i].getElementsByTagName("name")[0].childNodes[0].nodeValue
				// + "</b> : "
				// + attributes[i].getElementsByTagName("value")[0].childNodes[0].nodeValue
				// + "<br>";
// 
	// }

	//document.getElementById("txt_id").value = txt;
 
 // feature table
//  
    // var Featurelayer0 = xmlDoc.getElementsByTagName('infowindowfeaturelayer')[0];
    // var Featurelayer0_url = Featurelayer0.getElementsByTagName("url")[0];
    // var Featurelayer0_id = Featurelayer0.getElementsByTagName("uniqueid")[0];
//     
    // var infodata= Featurelayer0_url.childNodes[0];
    // var uniqid= Featurelayer0_id.childNodes[0];
//    
    // document.getElementById("template").value = infodata.nodeValue;
    // document.getElementById("attribute_name").value = uniqid.nodeValue;
     }
     
function quickselect(quickselectdataresponse){
	
	var xmlQuickSelectDoc = quickselectdataresponse.responseXML;
	var rootQuickSelectNode = xmlQuickSelectDoc.getElementsByTagName('root')[0];
	var querySelectionNode = rootQuickSelectNode.getElementsByTagName("QueryItem");
	
	var query_url = xmlQuickSelectDoc.getElementsByTagName('querybaseurl')[0];
	     base_url = query_url.getAttribute('baseurl');
	//alert('base_url : '+base_url);
	
	var defaultAttributes = rootQuickSelectNode.getElementsByTagName("QuickSelectAttributes");
	var defaultvalue = defaultAttributes[0].getAttribute('defaultlabel');
	$("#quickselect").append('<option >'+defaultvalue+'</option>');	
	
	for ( i = 0; i < querySelectionNode.length; i++) 
	{	
    var elementid = querySelectionNode[i].getAttribute('serviceindex');
	var elementvalue = querySelectionNode[i].getAttribute('label');
	var elementdata = querySelectionNode[i].getAttribute('where');
	
	var optValue=elementid+","+elementdata;
	
		$("#quickselect").append('<option id="'+elementid+'" where="'+elementdata+'" value="'+optValue+'" >'+elementvalue+'</option>');		
	}	
}
