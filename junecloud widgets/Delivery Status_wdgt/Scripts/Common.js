// Queue class

function Queue () {

	var self = this;

	this.reset = function () {
		this.busy = false;
		this.items = [];
		this.froms = [];
		this.oneByOne = false;
		this.delay = 500;
	}
	
	this.reset();

	this.add = function (delivery) {
		this.items.push(delivery);
		if (!this.oneByOne) {
			if (delivery.passRequired || delivery.oneByOne) {
				var checkValue = (delivery.passRequired) ? delivery.extra : delivery.no;
				if (this.froms[delivery.from]) {
					if (this.froms[delivery.from] != checkValue) this.oneByOne = true;
				} else this.froms[delivery.from] = checkValue;
			}
		}
	}

	this.update = function () {
		if (this.items.length) {
			this.busy = true;
			if (this.oneByOne || this.delay) {
				var delivery = this.items.shift();
				delivery.updateStatus();
				if (!this.oneByOne) setTimeout(function(){ self.update() },this.delay);
				if (!this.items.length) this.reset();
			} else {
				do {
					var delivery = this.items.shift();
					delivery.updateStatus();
				} while (this.items.length);
				this.reset();
			}
		} else if (!iPhone) {
			setTimeout(finishUpdate,500);
		}
	}

	this.updateIfIdle = function () {
		if (!this.busy) this.update();
	}

	this.count = function () {
		return this.items.length;
	}

}

// Delivery class

function Delivery (settings) {

	var self = this;
	this.req = [];

	// Functions
	this.setUpdatableFunctions = setUpdatableFunctions;
	this.setUpdatableFunctions();

	this.setDelivery = setDelivery;
	this.loadPage = loadPage;
	this.loadCookiePage = loadCookiePage;
	this.loadSection = loadSection;
	this.resetRequests = resetRequests;
	this.connectFailed = connectFailed;
	this.notFound = notFound;
	this.shouldShowError = shouldShowError;
	this.updateComplete = updateComplete;
	this.updateItems = updateItems;
	this.showMessage = showMessage;
	this.saveItems = saveItems;

	if (!iPhone) {
		this.loading = false;
		this.spinAngle = 0;
		this.startLoad = startLoad;
		this.stopLoad = stopLoad;
		this.addButtons = addButtons;
		this.editParent = editParent;
		this.closeParent = closeParent;
	}
	this.setDelivery(settings);

}

function setUpdatableFunctions () {
	this.updateStatus = updateStatus;
	this.startUpdate = startUpdate;
	this.cleanLocation = cleanLocation;
}

function setDelivery (settings) {

	this.reqCount = 0;
	this.reqComplete = 0;

	//  Success values:
	// -1: Couldn't connect, no internet or keychain locked
	//  0: Couldn't connect, site down
	//  1: Not found
	//  2: Found

	this.success = 2;
	this.lastUpdate = false;
	this.lastError = false;
	this.nextUpdate = 0;
	this.backgroundUpdate = 0;
	this.interval = 0;
	this.items = [];
	this.previousItems = false;
	this.count = 0;

	this.fromEdited = false;
	this.skipExtra = false;
	this.tries = 0;
	this.tap = false;

	// Initialization
	this.id = settings.uuid;
	this.name = (settings.name) ? settings.name : '';
	this.from = (settings.from) ? settings.from : 'www.amazon.com';
	this.extra = (settings.extra) ? settings.extra : '';
	this.no = (settings.no) ? settings.no : '';
	this.date = (settings.date) ? new Date(settings.date.toString().replace(/-/g,'/')) : false;

	if (!iPhone) {
		this.lastUpdated = (settings.lastupdated) ? parseFloat(settings.lastupdated) : 0;
		if (this.extra) this.password = getPassword(this.from,this.extra);
	} else this.password = (settings.password) ? settings.password : 0;
	this.keychainLocked = (settings.keychainLocked) ? settings.keychainLocked : false;

	this.html = '';
	this.htmlhash = (settings.htmlhash) ? settings.htmlhash : 0;
	this.htmldate = (settings.htmldate) ? settings.htmldate : 0;
	this.displayed = (settings.displayed) ? settings.displayed : 0;

	setService(this,false,false);
	this.fromName = getFromName(this.from,false,false);
	this.fromTrans = getFromName(this.from,true,false);

}

function loadPage (url,method,postData,args) {

	var reqNo = this.reqCount;
	this.reqCount++;
	this.req[reqNo] = new XMLHttpRequest();
	if (!this.sync) this.req[reqNo].delivery = this;
	this.req[reqNo].args = args;
	this.req[reqNo].getTracker = getTracker;
	this.req[reqNo].onload = method;
	this.req[reqNo].url = url;
	this.req[reqNo].startTime = new Date();

	var request = this.req[reqNo];
	this.req[reqNo].onreadystatechange = function(){
		if (this.timer && this.readyState >= 3) clearTimeout(this.timer);
		if (this.readyState == 4) {
			if (this.status == 0 && !this.responseText) {
				if (!request.delivery) {
					if (syncFail) syncFail(args);
				} else {
					var seconds = secondsSince(this.startTime);
					logMessage(1,'Timed out after '+seconds+' seconds');
					logRequest(1,this);
					this.abort(); // Stops onload from getting called in 10.5
					var connectionDown = (seconds < 1 || seconds > 280);
					this.delivery.connectFailed(connectionDown);
				}
			}
		}
	}

	// iPhone check is for iOS 6.0 and 6.0.1 only?
	var noCache = (this.noCache || args.noCache || iPhone || (args.service && args.service.noCache));
	if (postData) {
		this.req[reqNo].open('POST',url);
		this.req[reqNo].setRequestHeader('Cache-Control','no-cache');
		this.req[reqNo].setRequestHeader('Content-type','application/x-www-form-urlencoded');
		this.req[reqNo].setRequestHeader('Content-length',postData.length);
		this.req[reqNo].setRequestHeader('Connection','close');
		this.req[reqNo].send(postData);
	} else {
		this.req[reqNo].open('GET',url);
		if (noCache) {
			this.req[reqNo].setRequestHeader('Cache-Control','no-cache'); // max-age=60
			this.req[reqNo].setRequestHeader('Date',(new Date()).toUTCString());
		}
		this.req[reqNo].send();
	}

	if (this.sync) {
		var timeout = (sync.updated > 1) ? 15000 : 30000;
		this.req[reqNo].timer = setTimeout(function(){
			syncFail(args);
		},timeout);
	} else if (iPhone && inBackground) {
		this.req[reqNo].timer = setTimeout(function(){
			request.abort();
			// request.delivery.connectFailed();
		},25000);
	}

}

function setArgs (site,childNo) {
	var args = {};
	args.site = site;
	args.childNo = (childNo === false) ? 0 : childNo;
	args.isChild = (childNo === false) ? false : true;
	return args;
}

function DummyRequest (delivery,responseText,args) {
	this.delivery = delivery;
	this.responseText = responseText;
	this.status = 200;
	this.args = args;
	this.abort = function(){};
	this.getTracker = getTracker;
	this.getTracker();
}

function loadSection (section,args) {
	var reqNo = this.reqCount;
	this.reqCount++;
	this.req[reqNo] = new DummyRequest(this,section,args);
}

function resetRequests (cancelAll) {
	if (cancelAll) {
		for (i in this.req) {
			var thisReq = this.req[i];
			if (thisReq) {
				if (typeof thisReq.abort == 'function') thisReq.abort();
				clearTimeout(thisReq.timer);
			}
		}
	}
	this.reqCount = 0;
	this.reqComplete = 0;
}

function connectFailed (connectionDown) {
	if (!this.count) this.count = -1;
	this.notFound(false,connectionDown);
	this.reqComplete++;
	this.updateItems();
}

function notFound (message,connectionDown) {

	if (!iPhone) this.stopLoad();
	if (this.count == 0) {

		if (missingPassword(this)) {

			var item = errorItem(this.name,this.no);
			item.shipText = translate('Password required');
			if (iPhone) {
				this.tap = 'password';
				item.deliverText = translate('Tap to enter your password.');
			} else {
				item.deliverText = '<a href="javascript:editPassword(\''+this.id+'\');">'+
					translate('Click to enter your password.')+'</a>';
				item.clickable = true;
			}
			this.success = (this.keychainLocked) ? -1 : 1;
			this.items = [item];
			this.count = -1;
			this.displayed = 0;

		} else if (manualSignIn[this.from+'-'+this.extra]) {

			var item = errorItem(this.name,this.no);
			item.shipText = translate('Sign in required');
			if (iPhone) {
				this.tap = 'signin';
				item.deliverText = translate('Tap here to sign in.');
			} else {
				item.deliverText = '<a href="javascript:openSafariSite(\''+this.url+'\',\''+this.from+'\',\''+this.extra+'\');">'+
					translate('Click to sign in with Safari.')+'</a>';
				item.clickable = true;
			}
			this.success = 1;
			this.items = [item];
			this.count = -1;
			this.displayed = 0;

		} else if (!iPhone && DeliveryStatus && !DeliveryStatus.cookiesEnabled()) {

			var item = errorItem(this.name,this.no);
			item.shipText = translate('Cookies are required');
			item.deliverText = '<a href="javascript:openSite(\'http://junecloud.com/support/delivery-status-cookies.html\');">'+
				translate('Click here for help.')+'</a>';
			item.clickable = true;
			this.success = 1;
			this.items = [item];
			this.count = -1;
			this.displayed = 0;

		} else if (iPhone || this.shouldShowError()) { 

			var item = errorItem(this.name,this.no);
			item.shipText = (message) ? message : translate('Not found');
			item.deliverText = translate('Please check your settings.');
			this.success = 1;
			this.items = [item];
			this.count = -1;
			this.displayed = 0;

		} else {

			// Ideally, we should stop setting the count in Definitions.js
			// Just pass the type of error to this function, so it can set it!
			logMessage(1,'Ignoring not found error for '+this.from+'. Last success: '+this.lastUpdate);
			this.items = this.previousItems;
			this.count = this.items.length;
			this.success = 0;
			if (!this.lastError) this.lastError = new Date();

		}

	} else if (this.count == -1) {

		var item = errorItem(this.name,this.no);
		item.shipText = translate('Couldn’t connect');
		item.deliverText = this.fromTrans+' '+translate('is not available.');

		this.items = [item];
		this.displayed = 0;
		this.success = (connectionDown) ? -1 : 0;

	} else this.success = (connectionDown) ? -1 : 0;

	if (!iPhone) checkVersion(3,true);

}

function shouldShowError () {
	if (!this.lastUpdate) return true;
	if (!this.previousItems) return true;
	if (this.previousItems[0] && this.previousItems[0].icon == 'error') return true;
	if (!this.lastError) return false; // First error
	if ((this.lastError.getTime()/1000) + (5*60*60) < getUnixTime()) return true; // 5 hours
	return false;
}

// End of Delivery class

function getOther () {
	var delivery = this.delivery;
	if ((this.status == 200 || this.status == 0) && this.responseText) {
		delivery.html = stripWhiteSpace(this.responseText);
	} else {
		if (!delivery.count) delivery.count = -1;
		delivery.notFound();
	}
	updateOther(delivery);
	delivery.reqComplete++;
	delivery.updateItems();
	return;
}

function updateOther (delivery) {

	var item = resetItem();
	if (delivery.name) {
		item.title = htmlEntities(delivery.name);
	} else if (delivery.no) {
		item.title = htmlEntities(delivery.no);
	}

	if (delivery.url) {
		item.shipText = translate('Never updated');
		item.shipBold = false;
		var string = cleanOtherHTML(delivery.html,delivery.url);
		if (string) {
			var hash = string.hashCode();
			if (hash != delivery.htmlhash) {
				if (delivery.htmlhash) delivery.htmldate = (new Date()).getTime();
				delivery.htmlhash = hash;
				if (!iPhone) saveHTML(delivery);
			}
		}
	} else {
		item.shipText = translate('Ship date unknown');
		item.shipBold = false;
		if (delivery.htmlhash || delivery.htmldate) {
			delivery.htmlhash = 0;
			delivery.htmldate = '';
			if (!iPhone) saveHTML(delivery);
		}
	}

	if (delivery.date) {
		var daysApart = getDaysApart(delivery.date.getTime());
		item.icon = (daysApart < 0) ? 'checkmark' : '';
		item.date = convertDate(delivery.date);
		item.deliverText = translate('Delivered by %@');
		item.deliverBold = false;
		item.deliverDate = convertDate(delivery.date);
	} else {
		item.icon = 'transit';
		item.date = '';
		item.deliverText = translate('Delivery date unknown');
		item.deliverBold = false;
		item.deliverDate = '';
	}
	delivery.items = [];
	delivery.items[0] = item;
	delivery.count = 1;

}

function updateComplete () {
	return (this.reqComplete >= this.reqCount) ? true : false;
}

function updateItems () {

	if (this.updateComplete()) {

		this.previousItems = false;

		var newInterval = 43200;
		if (this.success == -1) { // Couldn't connect, no internet
			newInterval = 0;
		} else if (this.success <= 1) { // Not found or couldn't connect, site down
			newInterval = 60;
		}

		if (this.from == 'other') {
			if (this.extra && newInterval > 480) newInterval = 480;
		} else if (this.count > 0) {

			for (var x in this.items) {

				var item = this.items[x];
				var hasDeliveryDays = false;

				var shipInput = item.shipSaved;
				var deliverInput = item.deliverSaved;
				var isComplete = (item.status.match(/^complete$/i)) ? true : false;
				var statusDate = false;

				if (shipInput || !item.shipText) {

					var isShipped = (isComplete || item.status.match(/^shipped$/i)) ? true : false;

					item.shipText = translate('Ship date unknown');
					item.shipBold = false;
					var shipDate = statusDate = dateFromString(shipInput);

					if (isComplete) {

						item.shipText = translate('Shipped!');
						if (shipDate) {
							item.shipExtra = translate('Shipped %@');
						} else item.shipExtra = translate('Shipped!');
						if (this.countToShip) item.daysNo = getDaysApart(shipDate);
						item.shipBold = true;
						item.shipExtraBold = true;

					} else if (shipInput) {

						if (shipDate) {

							if (isShipped) {
								item.shipText = translate('Shipped!');
								item.shipExtra = translate('Shipped %@');
								item.shipBold = true;
							} else item.shipText = translate('Shipped by %@');
							if (this.countToShip) item.daysNo = getDaysApart(shipDate);

						} else {
							item.shipText = shipInput;
							item.shipBold = true;
						}

					} else if (isShipped) {

						item.shipText = translate('Shipped!');
						item.shipBold = true;

					}

					if (item.details) {
						var thisStatus = stripHTML(item.details.status);
						var thisLocation = stripHTML(item.details.location);
						if (thisLocation || (thisStatus && !thisStatus.match(/^delivered$/i))) {

							item.shipText = thisStatus;
							if (thisLocation && item.shipText.indexOf(thisLocation) == -1) item.shipText += ': '+thisLocation;

							var detailDate = dateFromString(item.details.date);
							if (detailDate) {
								item.shipExtra = translate('Status updated %@');
								statusDate = detailDate;
							}
							item.shipBold = true;

						}
					} else if (item.status && !isComplete && !isShipped) {
						item.shipText = item.status;
						item.shipBold = true;
					}

					item.shipDate = convertDate(shipDate);
					item.date = item.shipDate;

				}

				if (deliverInput || !item.deliverText) {

					var deliverDaysNo = false;
					item.deliverText = translate('Delivery date unknown');
					item.deliverBold = false;
					var deliverDate = dateFromString(deliverInput);

					if (isComplete) {

						item.deliverText = translate('Delivered!');
						if (deliverDate) {
							item.deliverExtra = translate('Delivered %@');
						} else item.deliverExtra = translate('Delivered!');
						deliverDaysNo = getDaysApart(deliverDate);
						item.deliverBold = item.deliverExtraBold = true;

					} else if (deliverInput) {

						if (deliverDate) {
							item.deliverText = translate('Delivered by %@');
							deliverDaysNo = getDaysApart(deliverDate);
						} else {
							item.deliverText = deliverInput;
							item.deliverBold = item.deliverExtraBold = true;
						}

					}

					if (deliverDaysNo !== false) {
						item.daysNo = deliverDaysNo;
						hasDeliveryDays = true;
					}

					item.deliverDate = convertDate(deliverDate);
					if (item.deliverDate) item.date = item.deliverDate;

				}

				if (isComplete) {
					item.icon = 'checkmark';
				} else if (item.daysNo > 0 || (item.daysNo === 0 && hasDeliveryDays)) {
					item.icon = '';
				} else if (!item.icon) {
					item.icon = 'transit';
				}

				var minutes = 60;
				if (item.icon == 'checkmark') {
					minutes = (hasDeliveryDays && item.daysNo <= -7) ? 43200 : 1440;
				} else if (item.daysNo === false) {
					if (statusDate) {
						var daysApart = getDaysApart(statusDate);
						if (daysApart <= -30) {
							minutes = 1440;
						} else if (daysApart <= -10) {
							minutes = 720;
						} else if (daysApart <= -3) {
							minutes = 180;
						}
					}
				} else if (item.daysNo <= -1) {
					var daysApart = (hasDeliveryDays) ? item.daysNo : -1;
					if (daysApart <= -30) {
						minutes = 1440;
					} else if (daysApart <= -10) {
						minutes = 720;
					} else if (daysApart <= -3) {
						minutes = 180;
					}
				} else if (item.daysNo <= 3) {
					minutes = 20;
				} else if (item.daysNo <= 10) {
					minutes = 60;
				} else if (item.daysNo <= 30) {
					minutes = 360;
				} else if (item.daysNo > 30) {
					minutes = 1440;
				}
				if (minutes < newInterval) newInterval = minutes;
				if (statusDate) item.statusDate = convertDate(statusDate);

				this.items[x] = item;

			}

		}

		if (this.success > 0) {
			this.lastUpdate = new Date();
			this.lastError = false;
		}
		this.resetRequests(false);
		this.interval = newInterval;

		if (!iPhone) {
			var rightNow = getUnixTime();
			this.nextUpdate = rightNow + (this.interval * 60);
			var backgroundInterval = this.interval;
			if (backgroundInterval < 1440) {
				backgroundInterval = backgroundInterval * 3;
				if (backgroundInterval >= 720) backgroundInterval = Math.max(backgroundInterval,720);
			}
			this.backgroundUpdate = rightNow + (backgroundInterval * 60);
			if (this.success > 0) {
				hadSuccess = true;
				if (this.success == 2) setHistoryTitle(this.id);
			}
			displayItem(this.id,this.displayed,false);
			checkForChanges(this);
		}

		this.saveItems();
		updateQueue.update();

	}

}

function resetItem () {

	var item = {};
	item.title = translate('Unknown Item');
	item.status = '';
	item.statusDate = false;
	item.date = '';
	item.icon = '';
	item.daysNo = false;

	item.details = {};
	item.details.date = '';
	item.details.location = '';
	item.details.mapLocation = '';
	item.details.status = '';

	item.shipSaved = '';
	item.shipText = ''; 
	item.shipBold = false;
	item.shipExtra = '';
	item.shipExtraBold = false;
	item.shipDate = 0;

	item.deliverSaved = '';
	item.deliverText = '';
	item.deliverBold = false;
	item.deliverExtra = '';
	item.deliverExtraBold = false;
	item.deliverDate = 0;
	item.clickable = false;

	return item;

}

function errorItem (name, no) {
	var item = resetItem();
	item.icon = 'error';
	var title = (name) ? htmlEntities(name) : htmlEntities(no);
	if (!title) title = translate('Unknown Item');
	item.title = title;
	item.shipBold = true;
	item.deliverBold = false;
	return item;
}

// Helper functions

function translate (key) {
	try {
		var ret = translation[key];
		if (ret === undefined || ret === '') ret = key;
		return ret;
	} catch (ex) { }
	return key;
}

function translateFormat (key,value1,value2,value3) {
	key = translate(key);
	if (value1) key = key.replace('%@',value1);
	if (value2) key = key.replace('%@',value2);
	if (value3) key = key.replace('%@',value3);
	return key;
}

function getUnixTime () {
	var currentTime = new Date();
	return currentTime.getTime()/1000;
}

function secondsSince(date) {
	return ((new Date()).getTime() - date.getTime()) / 1000
}

// Display text

function stripWhiteSpace (string) {
	// \s should match [\f\n\r\t\v\u00A0\u2028\u2029] but \u2028 is needed for iOS 4
	return (typeof string == 'string') ? string.replace(/[\s\n\u2028]+/g,' ') : '';
}

function trim (string) {
	if (typeof string == 'string') {
		// Remove non-breaking space characters (&#160; or \xAO)
		// while (string.indexOf(' ') > -1) string = string.replace(' ',' ');
		string = string.replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/ig,'');
	}
	return string;
}

function cleanSpaces (string) {
	return (typeof string == 'string') ? string.replace(/(\s|&nbsp;)+/g,' ') : '';
}

function clearEmptyString (string) {
	return (typeof string == 'string') ? string.replace(/^ ?-+ ?$/,'') : '';
}

function stripHTML (string) {
	if (typeof string == 'string') {

		// Deal with some really ugly HTML from UPS Mail Innovations
		string = string.replace(/<a [^>]*onmouseover="([^"]*)"[^>]*>/g,' ');

		// Remove script, noscript, and style tags
		string = string.replace(/<(noscript|script|style) ?[^>]*>(.*?)<\/\1>/ig,' ');

		// Remove HTML tags
		string = string.replace(/<[^>]*>/g,' ');

		// Remove non-breaking space characters (&#160; or \xAO) and reduce mutiple spaces
		// while (string.indexOf(' ') > -1) string = string.replace(' ',' ');
		string = cleanSpaces(string);

		// Convert some HTML entities
		string = string.replace(/&quot;/g,'"');

	}
	return trim(string);
}

function htmlEntities (string) {
	if (typeof string == 'string') {
		string = string.replace(/\&/g,'&#38;');
		string = string.replace(/"/g,'&quot;');
		string = string.replace(/</g,'&#60;');
		string = string.replace(/>/g,'&#62;');
	}
	return string;
}

function decodeDecimalEntities (string) {
	return string.replace(/&#(\d+);/g, 
		function (whole,parens) {
			if (parens >= -32768 && parens <= 65535) {
				return String.fromCharCode(parens);
			} else return whole;
		});
}

function removeHtmlEntities (string) {
	if (typeof string == 'string') {
		var entities = {
			'amp':'&',
			'quot':'"',
			'nbsp':' ',
			'ndash':'–',
			'mdash':'—',

			'auml':'ä',
			'euml':'ë',
			'iuml':'ï',
			'ouml':'ö',
			'uuml':'ü',
			'Auml':'Ä',
			'Euml':'Ë',
			'Iuml':'Ï',
			'Ouml':'Ö',
			'Uuml':'Ü',

			'aacute':'á',
			'eacute':'é',
			'iacute':'í',
			'oacute':'ó',
			'uacute':'ú',
			'Aacute':'Á',
			'Eacute':'É',
			'Iacute':'Í',
			'Oacute':'Ó',
			'Uacute':'Ú',

			'agrave':'à',
			'egrave':'è',
			'igrave':'ì',
			'ograve':'ò',
			'ugrave':'ù',
			'Agrave':'À',
			'Egrave':'È',
			'Igrave':'Ì',
			'Ograve':'Ò',
			'Ugrave':'Ù',

			'acirc':'â',
			'ecirc':'ê',
			'icirc':'î',
			'ocirc':'ô',
			'ucirc':'û',
			'Acirc':'Â',
			'Ecirc':'Ê',
			'Icirc':'Î',
			'Ocirc':'Ô',
			'Ucirc':'Û',

			'agrave':'à',
			'egrave':'è',
			'igrave':'ì',
			'ograve':'ò',
			'ugrave':'ù',
			'Agrave':'À',
			'Egrave':'È',
			'Igrave':'Ì',
			'Ograve':'Ò',
			'Ugrave':'Ù',

			'ntilde':'ñ',
			'atilde':'ã',
			'otilde':'õ',
			'Ntilde':'Ñ',
			'Atilde':'Ã',
			'Otilde':'Õ',

			'aring':'å',
			'Aring':'Å',

			'oslash':'ø',
			'Oslash':'Ø',
		
			'copy':'©',
			'trade':'™',
			'reg':'®'
		};
		return string.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function(whole,parens) {
			if (parens[0] === "#") {
				var charCode = parens[1].toLowerCase() === 'x' ? parseInt(parens.substr(2),16) : parseInt(parens.substr(1),10);
				return String.fromCharCode(charCode);
			} else return entities.hasOwnProperty(parens) ? entities[parens] : whole;
		});
	}
	return string;
}

function cleanOtherHTML (string,url) {
	if (typeof string == 'string') {

		var domain = '';
		if (url) {
			var parts = url.split('/');
			if (parts[2]) domain = parts[2].replace(/(^www\.|:[0-9]+$)/i,'').toLowerCase(); // Remove www and port number
		}
		switch (domain) {
			case 'threadless.com':
			case 'beta.threadless.com':
				string = string.replace(/<span class="tweet_text"[^>]*>(.*?)<\/span>/i,' ');
				break;
		}

		string = string.replace(/<[^>]*FOOTER START[^>]*>(.*?)<[^>]*FOOTER END[^>]*>/i,' '); // interparcel.com
		string = string.replace(/<font class="secretTextNextGen"[^>]*>[^<]*<\/font>/i,' '); // dell.com
		string = stripWhiteSpace(stripHTML(string));

	}
	return string;
}

function doublePlusEncode (string) {
	return encodeURIComponent(string).replace(/%2B/g,'%252B');
}

// Parse dates

function splitDate (string) {
	string = trim(string);
	if (result = string.match(/(.{2,}) - ([^(]+)/i)) return result[2]; // March 12 - March 22
	if (result = string.match(/([a-z]+) ([0-9]{1,2})-([0-9]{1,2})/i)) return result[1]+' '+result[3]; // March 16-22
	return string;
}

function cleanGermanDate (string) {
	string = string.replace('.',' ');
	string = string.replace(/\bJanuar\s/i,'January ');
	string = string.replace(/\bFebruar\s/i,'February ');
	string = string.replace(/\bMärz\s/i,'March ');
	string = string.replace(/\bMai\s/i,'May ');
	string = string.replace(/\bJuni\s/i,'June ');
	string = string.replace(/\bJuli\s/i,'July ');
	string = string.replace(/\bOktober\s/i,'October ');
	string = string.replace(/\bDezember\s/i,'December ');
	return string;
}

function cleanSpanishDate (string) {
	string = string.replace(/\b(enero)\s/i,'January ');
	string = string.replace(/\b(feb)\.?\s/i,'February ');
	string = string.replace(/\b(marzo)\s/i,'March ');
	string = string.replace(/\b(abr)\.?\s/i,'April ');
	string = string.replace(/\b(mayo)\s/i,'May ');
	string = string.replace(/\b(jun)\.?\s/i,'June ');
	string = string.replace(/\b(jul)\.?\s/i,'July ');
	string = string.replace(/\b(agosto)\s/i,'August ');
	string = string.replace(/\b(sept|set)\.?\s/i,'September ');
	string = string.replace(/\b(oct)\.?\s/i,'October ');
	string = string.replace(/\b(nov)\.?\s/i,'November ');
	string = string.replace(/\b(dic)\.?\s/i,'December ');
	return string;
}

function cleanFrenchDate (string) {
	string = string.replace('.',' ');
	string = string.replace(/\bjanvier\s/i,'January ');
	string = string.replace(/\bfévrier\s/i,'February ');
	string = string.replace(/\bmars\s/i,'March ');
	string = string.replace(/\bavril\s/i,'April ');
	string = string.replace(/\bmai\s/i,'May ');
	string = string.replace(/\bjuin\s/i,'June ');
	string = string.replace(/\bjuillet\s/i,'July ');
	string = string.replace(/\baoût\s/i,'August ');
	string = string.replace(/\bseptembre\s/i,'September ');
	string = string.replace(/\boctobre\s/i,'October ');
	string = string.replace(/\bnovembre\s/i,'November ');
	string = string.replace(/\bdécembre\s/i,'December ');
	return string;
}

function cleanItalianDate (string) {
	string = string.replace(/\b(gen|genn)\.?\s/i,'January ');
	string = string.replace(/\b(feb|febbr)\.?\s/i,'February ');
	string = string.replace(/\b(mar)\.?\s/i,'March ');
	string = string.replace(/\b(apr)\.?\s/i,'April ');
	string = string.replace(/\b(mag|magg)\.?\s/i,'May ');
	string = string.replace(/\b(giu|giugno)\.?\s/i,'June ');
	string = string.replace(/\b(lug|luglio)\.?\s/i,'July ');
	string = string.replace(/\b(ago|ag)\.?\s/i,'August ');
	string = string.replace(/\b(set|sett)\.?\s/i,'September ');
	string = string.replace(/\b(ott)\.?\s/i,'October ');
	string = string.replace(/\b(nov)\.?\s/i,'November ');
	string = string.replace(/\b(dic)\.?\s/i,'December ');
	return string;
}

function cleanDutchDate (string) {
	string = string.replace(/[a-z]+ ([0-9]+ [a-z]+ [0-9]{4})/i,'$1');
	string = string.replace(/\b(jan)\s/i,'January ');
	string = string.replace(/\b(feb)\.?\s/i,'February ');
	string = string.replace(/\b(maart)\s/i,'March ');
	string = string.replace(/\b(apr)\.?\s/i,'April ');
	string = string.replace(/\b(mei)\s/i,'May ');
	string = string.replace(/\b(juni)\.?\s/i,'June ');
	string = string.replace(/\b(juli)\.?\s/i,'July ');
	string = string.replace(/\b(aug)\s/i,'August ');
	string = string.replace(/\b(sept)\.?\s/i,'September ');
	string = string.replace(/\b(oct|okt)\.?\s/i,'October ');
	string = string.replace(/\b(nov)\.?\s/i,'November ');
	string = string.replace(/\b(dec)\.?\s/i,'December ');
	return string;
}

function cleanDanishDate (string) {
	string = string.replace('.',' ');
	string = string.replace(/\bjanuar\s/i,'January ');
	string = string.replace(/\bfebruar\s/i,'February ');
	string = string.replace(/\bmarts\s/i,'March ');
	string = string.replace(/\bmaj\s/i,'May ');
	string = string.replace(/\bjuni\s/i,'June ');
	string = string.replace(/\bjuli\s/i,'July ');
	string = string.replace(/\boktober\s/i,'October ');
	return string;
}

function getSwedishMonth (string) {
	switch (string) {
		case 'januari':		case 'jan':	return '1';
		case 'februari':	case 'feb':	return '2';
		case 'mars':		case 'mar':	return '3';
		case 'april':		case 'apr':	return '4';
		case 'maj':						return '5';
		case 'juni':		case 'jun':	return '6';
		case 'juli':		case 'jul':	return '7';
		case 'augusti':		case 'aug':	return '8';
		case 'september':	case 'sep':	return '9';
		case 'oktober':		case 'okt':	return '10';
		case 'november':	case 'mov':	return '11';
		case 'december':	case 'dec':	return '12';
	}
}

function getDaysApart (fromDate) {
	if (!iPhone && DeliveryStatus) {
		return DeliveryStatus.getDaysApart(fromDate/1000);
	} else {
		// Note: this is approximate
		var date = new Date();
		date.setTime(fromDate);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return Math.ceil((date-new Date())/86400000);
	}
}

function getMonthsApart (fromDate) {
	if (!iPhone && DeliveryStatus) return DeliveryStatus.getMonthsApart(fromDate/1000);
}

function getData (url) {
	var index = url.indexOf('?');
	if (index != -1) url = url.substring(index+1);
	url = url.replace(/\&amp;/g,'&');
	var parts = url.split('&');	
	var data = [];
	for (x in parts) {
		var part = parts[x].split('=');
		if (part[1]) data[decodeURIComponent(part[0])] = decodeURIComponent(part[1]);
	}
	return data;
}

String.prototype.hashCode = function(){
	var hash = 0, i, l, charCode;
	if (this.length == 0) return hash;
	for (i = 0, l = this.length; i < l; i++) {
		charCode  = this.charCodeAt(i);
		hash  = ((hash<<5)-hash)+charCode;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};