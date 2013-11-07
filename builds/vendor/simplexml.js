/*
 * Author: Vivek Jishtu
 *
 * Copyright (c) 2006 Viamatic Softwares. All Rights Reserved.
 * 
 * This software is provided "AS IS," without a warranty of any kind. 
 *
 */
 
function SimpleXMLElement() {
	
	var rootNode = this;
	var xmlDoc = null; 
	this.textNode = "";
	this.__attributes = new Array();
	
	this.getAttributes = function() {
		return this.__attributes;	
	}
	
	this.toString = function() {
		return this.textNode;
	}
	
	this.getDoc = function() {
		return xmlDoc;
	}
	
	this.asXML = function() {
		if(xmlDoc.xml) return xmlDoc.xml;
		if(window.XMLSerializer) return (new XMLSerializer().serializeToString(xmlDoc));
		var errMsg = "asXML not implemented as yet for this browser";
		throw(errMsg);
	}
	
	
	function parseElements(elements, parent) {		
		for(var i=0; i<elements.length; i++)
		{
			if(elements[i].nodeType==3 || elements[i].nodeType==4) { 
				try {
					parent.textNode += elements[i].nodeValue;
				} catch(e) { throw(e); }
			}
			
	  		if(elements[i].nodeType==1) { 
				var objElement = new SimpleXMLElement();
				if(!parent[elements[i].nodeName]) parent[elements[i].nodeName] = new Array();
				
				try {					
					parent[elements[i].nodeName].push(objElement);
				} catch(e) { throw(e);}
				
				if(elements[i].childNodes) parseElements(elements[i].childNodes, objElement);
				
				try {					
					if(elements[i].attributes.length != 0) {						
						var att = elements[i].attributes;
						for(var j = 0; j < att.length; j++) {
							objElement[att[j].nodeName] = att[j].nodeValue;
							objElement.__attributes.push(att[j].nodeName);
						}
					}
				}
				catch(e) { throw(e);}
			} 
		 }		 
	}	
	
	this.load = function(filename, func_onload) {
		if (document.implementation && document.implementation.createDocument)
		{
			xmlDoc = document.implementation.createDocument("", "", null);
			xmlDoc.onload = function() {
				if(!xmlDoc.documentElement) { 
					throw("Error loading the document " + filename);
					return;
				}
				parseElements(xmlDoc.documentElement.childNodes, rootNode);
				func_onload();
			}
		}
		else if (window.ActiveXObject)
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.onreadystatechange = function () {
				if (xmlDoc.readyState == 4)  {
					parseElements(xmlDoc.documentElement.childNodes, rootNode);
					func_onload();
				}
			};
		} else {
			throw('Your browser can\'t handle this script');
			return;
		}
		
		if (xmlDoc.load) 
		{
			xmlDoc.load(filename);
			return;
		}
		if(window.XMLHttpRequest)
		{
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", filename, true);
			xmlhttp.onreadystatechange = function() {
				if(xmlhttp.readyState == 4) {
			   		xmlDoc = xmlhttp.responseXML;
					parseElements(xmlDoc.documentElement.childNodes, rootNode);
			   		func_onload();
			   } 			   
			};
			xmlhttp.send(null);			
			return;
		}
		
		throw("No method found to load the file - " + filename);		
	}

	this.loadXML = function(text) {
		if (window.ActiveXObject)
		{
		  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		  xmlDoc.async = "false";
		  xmlDoc.loadXML(text);
		  parseElements(xmlDoc.documentElement.childNodes, rootNode);
	  	} else {
		  var parser=new DOMParser();
	   	  xmlDoc = parser.parseFromString(text,"text/xml");
		  parseElements(xmlDoc.documentElement.childNodes, rootNode);
	  	}
	}
	
	this.loadXMLDom = function(xml) {
		xmlDoc = xml;
		if(xml.element) {
			parseElements(xml.element.childNodes, rootNode);
			return true;
		} 
		if(xml.documentElement) {
			parseElements(xml.documentElement.childNodes, rootNode);
			return true;
		}
		return false;
	}	
}

function simplexml_import_dom(dom) {
	var sx = new SimpleXMLElement();
	sx.loadXMLDom(dom);
	return sx;
}

function simplexml_load_string(string) {
	var sx = new SimpleXMLElement();
	sx.loadXML(string);
	return sx;
}

function simplexml_load_file(filename, callback) {
	var sx = new SimpleXMLElement();	
	var mycallback = function() {
		callback(sx);	
	}	
	sx.load(filename, mycallback);	
}