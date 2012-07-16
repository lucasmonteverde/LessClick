/**
 * LessClick
 * 
 * This extension is a package with some features.
 *
 * In this first release, features are the redirection of protected sites, clean some of annoying ads and Close ads Popups.
 *
 * Redirect for:
 * - protectorlink.info;
 * - downgratis.com;
 * - mvdownloads.com;
 * - linkbucks.com; and Linkbucks Family
 * - urlcash.net;
 * - pburl.com/
 * - link-protector.com;

 * Remove popup content from image hosts:
 * - imagebam.com;
 * - pixhost.org;
 * - urimageupload.com;
 * - imagevenue.com;
 *
 * Close Popup:
 * - Livejasmin
 * - xmatch.com 
 * - xvideoslive.com 
 * - youjizzlive

 * Remove ads from default youtube player - Not work in embed player
 * Remove ads/webcam from thepirateybay.org, realraptalk.com and other adult video sites
 * 
 * Scripts can be disable in option page
 * 
 * List of all sites supported are listed in options page
 *
 *
 * Copyright (c) 2010 Lucas Monteverde <monteverde13@yahoo.com.br>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
**/


console.log = function() {}
chrome.extension.sendRequest({msg: "load"}, function(data) {
	//console.log(data);
	var stash = data.stash;
	console.log(stash);
	for (var i = 0; i < stash.length; i++){
		var item = stash[i];
		var url = new RegExp(item.url,"i");
		if ( url.test(location.href) ) {
			console.log("Page Detected");
			if(!item.enable) break;
			for(var obj in item){
				if(obj != 'name' && obj != 'url' && obj != 'enable') this[obj]( item[obj], url );
			}
			break;
		}
	}
	MultiScript(data.remove);
});

(function(d){
	removeQuery = function(rq){
		console.log("removed_query: " + rq);
		var node = d.querySelectorAll(rq);
		removeElementAll(node);
	},
	
	replaceUrl = function(rp, url){
		var link = location.href.replace(url,rp);
		console.log(link);
		if(!/http:\/\//.test(link)){
			console.log("revert");
			link = link.split('').reverse().join('');
		}
		location.href = link;
	},
	
	replaceQuery = function(rq){
		console.log(rq);
		var link = d.querySelector(rq);
		if(rq == "noscript") link = parseNode(link, "a");
		if(link.src)
			link = link.src;
		else if(link.href)
			link = link.href;
		
		location.href = link;
	},
	
	customScript = function(cs){
		if( new RegExp(cs).test(location.href) ){
			cs = cs.split('.');
			eval("" + cs[0] + "()");
		}
	}
	
	MultiScript = function(data){
		for(var i = 0;i<data.length; i++){
			var item = data[i];
			if(!item.enable) break;
			if(item.removeQuery) removeQuery(item.removeQuery);
		}
	}
	
	/** Utils **/
	var removeElement = function(obj){
		if(obj){
			obj.parentNode.removeChild(obj);
			return true;
		}else return false;
	},

	removeElementAll = function(node){
		var i = node.length;
		while(i--) removeElement(node[i]);
	},
	
	parseNode = function(node, query){
		var node_box = d.createElement('div');
		node_box.innerHTML = node.innerText;
		if(query) node_box = node_box.getElementsByTagName(query)[0];
		return node_box;
	}
	
	/** Custom Scripts **/

	// @copyright JoeSimmons
	// @revision Lucas Monteverde
	youtube = function(){
		var mp = d.getElementById("movie_player");
		if(!mp) return;
		var top =  mp.parentNode;
		var regex = /[\&\?]?(ad_|prerolls|interstitial|infringe|invideo|watermark)([^=]*)?=[^\&]*/gi
		mp.setAttribute("flashvars", mp.getAttribute("flashvars").replace(regex,"") + "&invideo=false")
		removeElement(mp);
		
		setTimeout(function(){top.appendChild(mp);},1000);
		return;
	},

	protector = function(){
		if(d.getElementsByName("Continue")[0]){
			var link = d.getElementsByName("Continue")[0].getAttribute("onClick");
			eval(link);
			return;
		}else
			var link = d.title.replace(/\:.*/, '').replace(/\s/g,'/');
		
		location.href = "http://" + link;
	},

	adf = function(){
		var link = /\"href\", \'(.*)\'/gi.exec(d.body.innerHTML);
		if(link) location.href = link[1];
	},
	
	ymages = function(){
		var link = /ymages.org\/lz\/[^t].*?(?=\')/gi.exec(d.body.innerHTML);
		if(link) location.href = "http://" + link[0];
	},
	
	revistasgratis = function(){

		var menu = d.querySelector('.styleNav');
		var imgs = d.querySelectorAll('#content img');
		
		d.body.innerHTML = '';
		d.body.appendChild(menu);
		
		for(var img in imgs) d.body.appendChild(imgs[img]);


	}
	
}(document));