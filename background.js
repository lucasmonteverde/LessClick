/** 
 * LessClick background page
 * 
 * Load data from json e save in localStorage
 * 
 * Based on background script from Skip Redirector Copyright(c) 2009 - yksk yoko@carbonfairy.org
 *
 *
 * @Copyright (c) 2010 Lucas Monteverde <monteverde13@yahoo.com.br>
 * @license GPLv3
**/

const API = chrome.extension.getURL("data.json");
const version = 1.4215;

var url = null;
var tab_removed = false;


/* chrome.webRequest.onBeforeRequest.addListener(function(details) { 
		console.log('blocking', details);
		return {cancel: true};
	},{urls: [
		"*://*.doubleclick.net/*",
		"*://*.yieldmanager.com/*",
		"*://*.yieldmanager.edgesuite.net/*", 
		"*://*.yahwroom.info/*", 
		"*://ad.z5x.net/*",
		"*://*.adbuyer.com/*",
	]},["blocking"]
); */

/* chrome.webRequest.onBeforeRequest.addListener(function(details) {
	console.log(details);
    return {cancel: false};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
); */

chrome.tabs.onCreated.addListener(function() {
	tab_removed = false;
	if(!url || url == "") {
		listener(null, null, function (stash) {
			var reg = "", data = stash.popup;
			for(var i = 0; i< data.length; i++){
				if(data[i].enable) reg+= data[i].url += '|';
			}
			url = reg.slice(0,-1);
		});
	}
	
	if(url && url != "") {
	
		chrome.tabs.onUpdated.addListener(function(id,info,tab){
			if (info.status == "loading" && new RegExp("http:\/\/.*(" + url + ").*","i").test(tab.url) && !tab_removed){
				chrome.tabs.remove(id);
				tab_removed = true;
			}
		})
	
	}
});

chrome.extension.onRequest.addListener(listener);

function listener(request, sender, callback) {
	//console.log("listening", request, sender, callback);
	var xhr, stash = load();
	if ((!request || request && !request.force_update) && stash && stash.version >= version)
		callback(stash);
	else {
		xhr = new XMLHttpRequest;
		xhr.open('GET', API, true);
		xhr.onload = function() {
			//console.log("loading",xhr);
			var data = JSON.parse(xhr.responseText);
			callback( save(data) );
		};
		xhr.onerror = function() {
			console.log('request error', xhr);
		};
		xhr.send();
	}
}

function load() {
	return localStorage.stash && JSON.parse(localStorage.stash);
}

function save(data,overhide) {
	var stash;
	if (data){
		stash = overhide ? data : updateData(data);
		stash.version = version;
		
		localStorage.stash = JSON.stringify(stash);
	}else
		delete localStorage.stash;
		
	return stash;
}

function updateData(data){
	var local = localStorage.stash ? JSON.parse( localStorage.stash ) : {};
	
	for(var m in data){
		if(!local[m]) local[m] = [];
		
		var obj = data[m];
		for( var i=0; i< obj.length; i++){
			var obj_enable = local[m][i] ? local[m][i].enable : true;
			local[m][i] = obj[i];
			local[m][i].enable = obj_enable;
		}
	}
	return local;
}