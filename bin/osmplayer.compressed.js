jQuery.fn.osmplayer||(jQuery.fn.osmplayer=function(a){return jQuery(this).each(function(){a=a||{};a.id=a.id||$(this).attr("id")||Math.random();minplayer.plugins[a.id]||(a.template=a.template||"default",osmplayer[a.template]?new osmplayer[a.template](jQuery(this),a):new osmplayer(jQuery(this),a))})});osmplayer=function(a,b){minplayer.call(this,a,b)};osmplayer.prototype=new minplayer;osmplayer.prototype.constructor=osmplayer;
osmplayer.prototype.create=function(a,b,c){return minplayer.prototype.create.call(this,a,"osmplayer",c)};osmplayer.prototype.construct=function(){this.options=jQuery.extend({playlist:"",swfplayer:"minplayer/flash/minplayer.swf"},this.options);minplayer.prototype.construct.call(this);this.playQueue=[];this.playIndex=0;this.playlist=this.create("playlist","osmplayer");this.playlist.bind("nodeLoad",function(a){return function(b,c){a.loadNode(c)}}(this))};osmplayer.prototype.fullScreenElement=function(){return this.elements.minplayer};
osmplayer.prototype.loadNode=function(a){if(a.mediafiles){var b=a.mediafiles.media;if(b){this.playQueue.length=0;this.playQueue=[];this.playIndex=0;this.addToQueue(b.intro);this.addToQueue(b.commercial);this.addToQueue(b.prereel);this.addToQueue(b.media);this.addToQueue(b.postreel)}this.options.preview=osmplayer.getImage(a.mediafiles.image,"preview");this.playLoader.loadPreview();this.playNext()}};osmplayer.prototype.addToQueue=function(a){a&&this.playQueue.push(this.getFile(a))};
osmplayer.prototype.getFile=function(a){if(a){var b=typeof a;if((b==="object"||b==="array")&&a[0])a=this.getBestMedia(a)}return a};osmplayer.prototype.getBestMedia=function(a){for(var b=null,c=a.length;c--;){var d=new minplayer.file(a[c]);if(!b||d.priority>b.priority)b=d}return b};osmplayer.prototype.playNext=function(){if(this.playQueue.length>this.playIndex){this.load(this.playQueue[this.playIndex]);this.playIndex++}else{if(!this.options.repeat)this.options.autostart=false;this.playIndex=0;this.playNext()}};
osmplayer.getImage=function(a,b){var c="";if(a)if(a[b])c=a[b];else for(b in a)if(a.hasOwnProperty(b)){c=a[b];break}return typeof c==="string"?c:c.path};var osmplayer=osmplayer||{};osmplayer.parser=osmplayer.parser||{};osmplayer.parser["default"]={priority:1,valid:function(){return true},getType:function(){return"json"},getFeed:function(a,b,c){a=a.replace(/(.*)\??(.*)/i,"$1");return a+("?start-index="+b)+("&max-results="+c)},parse:function(a){return a}};osmplayer=osmplayer||{};
osmplayer.parser=osmplayer.parser||{};
osmplayer.parser.youtube={priority:10,valid:function(a){return a.search(/^http(s)?\:\/\/gdata\.youtube\.com/i)===0},getType:function(){return"jsonp"},getFeed:function(a,b,c){a=a.replace(/(.*)\??(.*)/i,"$1");return a+("?start-index="+(b+1))+("&max-results="+c)+"&v=2&alt=jsonc"},parse:function(a){var a=a.data,b={total_rows:a.totalItems,nodes:[]},c;for(c in a.items){var d=a.items[c];b.nodes.push({title:d.title,description:d.description,mediafiles:{image:{thumbnail:{path:d.thumbnail.sqDefault},image:{path:d.thumbnail.hqDefault}},
media:{media:{player:"youtube",id:d.id}}}})}return b}};osmplayer=osmplayer||{};osmplayer.parser=osmplayer.parser||{};
osmplayer.parser.rss={priority:8,valid:function(a){a=a.replace(/(.*)\??(.*)/i,"$1");return a.match(/\.rss$/i)!==null},getType:function(){return"xml"},getFeed:function(a){return a},parse:function(a){var b={total_rows:0,nodes:[]};jQuery("rss channel",a).find("item").each(function(){osmplayer.parser.rss.addRSSItem(b,$(this))});return b},addRSSItem:function(a,b){a.total_rows++;a.nodes.push({title:b.find("title").text(),description:b.find("annotation").text(),mediafiles:{image:{image:{path:b.find("image").text()}},
media:{media:{path:b.find("location").text()}}}})}};osmplayer=osmplayer||{};osmplayer.parser=osmplayer.parser||{};osmplayer.parser.asx={priority:8,valid:function(a){a=a.replace(/(.*)\??(.*)/i,"$1");return a.match(/\.asx$/i)!==null},getType:function(){return"xml"},getFeed:function(a){return a},parse:function(a){var b={total_rows:0,nodes:[]};jQuery("asx entry",a).each(function(){osmplayer.parser.rss.addRSSItem(b,$(this))});return b}};osmplayer=osmplayer||{};osmplayer.parser=osmplayer.parser||{};
osmplayer.parser.xsfp={priority:8,valid:function(a){a=a.replace(/(.*)\??(.*)/i,"$1");return a.match(/\.xml$/i)!==null},getType:function(){return"xml"},getFeed:function(a){return a},parse:function(a){var b={total_rows:0,nodes:[]};jQuery("playlist trackList track",a).each(function(){osmplayer.parser.rss.addRSSItem(b,$(this))});return b}};osmplayer=osmplayer||{};osmplayer.playlist=function(a,b){minplayer.display.call(this,"playlist",a,b)};osmplayer.playlist.prototype=new minplayer.display;
osmplayer.playlist.prototype.constructor=osmplayer.playlist;
osmplayer.playlist.prototype.construct=function(){this.options=jQuery.extend({vertical:true,playlist:"",pageLimit:10,autoNext:true,shuffle:false,loop:false},this.options);minplayer.display.prototype.construct.call(this);this.nodes=[];this.page=-1;this.totalItems=0;this.currentItem=-1;this.queue=[];this.queuepos=0;this.playlist=this.options.playlist;this.scroll=this.create("scroll","osmplayer");this.pager=this.create("pager","osmplayer");this.pager.bind("nextPage",function(a){return function(){a.nextPage()}}(this));
this.pager.bind("prevPage",function(a){return function(){a.prevPage()}}(this));this.options.autoNext&&this.get("media",function(a){a.bind("ended",function(b){return function(){a.options.autoplay=true;b.next()}}(this))});this.next()};
osmplayer.playlist.prototype.set=function(a,b){if(typeof a!=="object")this.trigger("error","Playlist must be an object to set");else if(a.hasOwnProperty("total_rows")){if(a.total_rows&&a.nodes.length){this.totalItems=a.total_rows;this.currentItem=0;(this.page+1)*this.options.pageLimit>=this.totalItems?this.pager.nextPage.hide():this.pager.nextPage.show();var c=null,d=a.nodes.length;this.scroll.elements.list.empty();this.nodes=[];for(var e=0;e<d;e++){c=this.create("teaser","osmplayer",this.scroll.elements.list);
c.setNode(a.nodes[e]);c.bind("nodeLoad",function(a,b){return function(){a.loadItem(b)}}(this,e));this.nodes.push(c);b===e&&this.loadItem(e)}this.scroll.refresh();this.trigger("playlistLoad",a)}}else this.trigger("error","Unknown playlist format.")};osmplayer.playlist.prototype.setQueue=function(){this.queue.push({page:this.page,item:this.currentItem});this.queuepos=this.queue.length};
osmplayer.playlist.prototype.next=function(){var a=0,b=this.page;if(this.queuepos>=this.queue.length)if(this.options.shuffle){a=Math.floor(Math.random()*this.totalItems);b=Math.floor(a/this.options.pageLimit);a=a%this.options.pageLimit;this.load(b,a)}else{a=this.currentItem+1;a>=this.nodes.length?this.load(b+1,0):this.loadItem(a)}else{this.queuepos=this.queuepos+1;a=this.queue[this.queuepos];this.load(a.page,a.item)}};
osmplayer.playlist.prototype.prev=function(){this.queuepos=this.queuepos-1;this.queuepos=this.queuepos<0?0:this.queuepos;var a=this.queue[this.queuepos];a&&this.load(a.page,a.item)};osmplayer.playlist.prototype.loadItem=function(a){if(a<this.nodes.length){this.setQueue();var b=this.nodes[this.currentItem];b.select(false);this.currentItem=a;b=this.nodes[a];b.select(true);this.trigger("nodeLoad",b.node)}};osmplayer.playlist.prototype.nextPage=function(a){this.load(this.page+1,a)};
osmplayer.playlist.prototype.prevPage=function(a){this.load(this.page-1,a)};
osmplayer.playlist.prototype.load=function(a,b){this.playlist==this.options.playlist&&a==this.page&&this.loadItem(b);this.playlist=this.options.playlist;if(typeof this.playlist=="object"){this.set(this.playlist);this.playlist=this.playlist.endpoint}else{this.scroll.elements.playlist_busy&&this.scroll.elements.playlist_busy.show();var c=Math.floor(this.totalItems/this.options.pageLimit);if(this.options.loop&&a>=c)b=a=0;a=a||0;a=a<0?0:a;a=a>=c?c:a;this.setQueue();this.page=a;this.page==0?this.pager.prevPage.hide():
this.pager.prevPage.show();var d=osmplayer.parser["default"],e;for(e in osmplayer.parser)osmplayer.parser[e].valid(this.playlist)&&osmplayer.parser[e].priority>d.priority&&(d=osmplayer.parser[e]);c={type:"GET",url:d.getFeed(this.playlist,this.page*this.options.pageLimit,this.options.pageLimit),success:function(a){return function(c){a.scroll.elements.playlist_busy&&a.scroll.elements.playlist_busy.hide();a.set(d.parse(c),b)}}(this),error:function(a){return function(b,c){a.scroll.elements.playlist_busy&&
a.scroll.elements.playlist_busy.hide();a.trigger("error",c)}}(this)};e="";if(e=d.getType())c.dataType=e;jQuery.ajax(c)}};osmplayer=osmplayer||{};osmplayer.scroll=function(a,b){minplayer.display.call(this,"scroll",a,b)};osmplayer.scroll.prototype=new minplayer.display;osmplayer.scroll.prototype.constructor=osmplayer.scroll;
osmplayer.scroll.prototype.construct=function(){this.options=jQuery.extend({vertical:true,hysteresis:40,scrollSpeed:20,scrollMode:"auto"},this.options);minplayer.display.prototype.construct.call(this);this.pos=this.options.vertical?"pageY":"pageX";this.offset=this.options.vertical?"top":"left";this.margin=this.options.vertical?"marginTop":"marginLeft";this.size=this.options.vertical?"height":"width";this.outer=this.options.vertical?"outerHeight":"outerWidth";this.getMousePos=function(a){return a[this.pos]-
this.display.offset()[this.offset]};this.getPos=function(a){return this.options.vertical?this.ratio*(this.scrollSize-(a+this.handleSize)):this.ratio*a};this.getHandlePos=function(a){return this.options.vertical?this.scrollSize-(this.handleSize+a/this.ratio):a/this.ratio};if(this.elements.scroll){var a=this.elements.scroll;this.mousePos=this.scrollTop=this.handleSize=0;this.refresh();this.scroll=a.slider({orientation:this.options.vertical?"vertical":"horizontal",max:this.scrollSize,create:function(a,
c){return function(d){d=jQuery(".ui-slider-handle",d.target);a.handleSize=d[a.outer]();a.scrollTop=a.scrollSize-a.handleSize;d=c?a.scrollTop:0;jQuery(this).slider("option","value",d)}}(this,this.options.vertical),slide:function(a,c){return function(d,e){var g=a.getPos(e.value);if(c&&g<0){a.scroll.slider("option","value",a.scrollTop);return false}if(!c&&e.value>a.scrollTop){a.scroll.slider("option","value",a.scrollTop);return false}a.elements.list.css(a.margin,-g+"px");return true}}(this,this.options.vertical)});
this.options.scrollMode=="auto"&&this.elements.list.bind("mousemove",function(a){return function(c){c.preventDefault();a.mousePos=c[a.pos];a.mousePos=a.mousePos-a.display.offset()[a.offset]}}(this)).bind("mouseenter",function(a){return function(c){c.preventDefault();a.scrolling=true;setTimeout(function e(){if(a.scrolling){var c=a.mousePos-a.scrollMid;if(Math.abs(c)>a.options.hysteresis){var f=a.options.hysteresis,c=a.options.scrollSpeed*(c+f*(c>0?-1:0)),c=c/a.scrollMid,f=a.elements.list.css(a.margin),
f=parseFloat(f)-c,f=f>0?0:f,c=-a.listSize+a.scrollSize,f=f<c?c:f;a.elements.list.css(a.margin,f+"px");f=a.getHandlePos(-f);a.scroll.slider("option","value",f)}setTimeout(e,20)}},20)}}(this)).bind("mouseleave",function(a){return function(c){c.preventDefault();a.scrolling=false}}(this))}};
osmplayer.scroll.prototype.refresh=function(){if(this.options.vertical)this.listSize=this.elements.list.height();else{this.listSize=0;jQuery.each(this.elements.list.children(),function(a){return function(){a.listSize=a.listSize+$(this)[a.outer]()}}(this));this.elements.list[this.size](this.listSize)}this.onResize();if(this.scroll){this.elements.list.css(this.margin,"0px");this.scroll.slider("option","value",this.getHandlePos(0))}};
osmplayer.scroll.prototype.onResize=function(){this.scrollSize=this.elements.scroll[this.size]();this.scrollMid=this.scrollSize/2;this.scrollTop=this.scrollSize-this.handleSize;this.ratio=this.listSize-this.scrollSize;this.ratio=this.ratio/(this.scrollSize-this.handleSize);this.scroll&&this.scroll.slider("option","max",this.scrollSize)};osmplayer=osmplayer||{};osmplayer.pager=function(a,b){minplayer.display.call(this,"pager",a,b)};osmplayer.pager.prototype=new minplayer.display;
osmplayer.pager.prototype.constructor=osmplayer.pager;osmplayer.pager.prototype.construct=function(){minplayer.display.prototype.construct.call(this);this.prevPage=this.elements.prevPage.click(function(a){return function(b){b.preventDefault();a.trigger("prevPage")}}(this));this.nextPage=this.elements.nextPage.click(function(a){return function(b){b.preventDefault();a.trigger("nextPage")}}(this))};osmplayer=osmplayer||{};
osmplayer.teaser=function(a,b){this.preview=null;minplayer.display.call(this,"teaser",a,b)};osmplayer.teaser.prototype=new minplayer.display;osmplayer.teaser.prototype.constructor=osmplayer.teaser;osmplayer.teaser.prototype.select=function(){};
osmplayer.teaser.prototype.setNode=function(a){this.node=a;this.elements.title&&this.elements.title.text(a.title);if((a=osmplayer.getImage(a.mediafiles.image,"thumbnail"))&&this.elements.image){this.preview=new minplayer.image(this.elements.image);this.preview.load(a)}this.display.unbind("click").click(function(a){return function(c){c.preventDefault();a.trigger("nodeLoad",a.node)}}(this))};
