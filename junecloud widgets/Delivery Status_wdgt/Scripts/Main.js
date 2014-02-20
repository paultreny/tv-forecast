var appId = 'com.junecloud.widget.deliverystatus';
var installedVersion;
var readableVersion;
var syncVersion = 5.0;
var defsVersion = 120;
var iPhone = false;
var localeCode = 'US';
var timeZone = new Date().getTimezoneOffset();

var historyDays = 30; // days to keep old items in the history
var dismissDays = 30; // days to dismiss version checking
var lastVersion = 0; // last version installed
var currentVersion; // most recent version available
var downloadUrl = 'http://junecloud.com/software/mac/delivery-status.html';
var logLevel = 1; // TODO: change!
var disableTooltips = false;

var deliveries = [];
var updateQueue;
var hadSuccess = false;
var updateStamp = 0;

var currentSide = 'front';
var currentView = 'deliveries';
var nextSide = '';
var nextView = '';

var doneButton;
var cancelButton;
var signInButton;
var registerButton;
var logOutButton;
var donateButton;

var editingDelivery;
var lastFrom;
var openQueue = [];
var closeQueue = [];
var extraEdited = false;

var clickSpeed = 500;
var lastClick = 0;
var clickTimer;

var sortBy = 0;
var localNotifications = 0;
var notifierPath = false;
var pushEnabled = false;
var statusBoardPath = false;
var updateTimer = null;
var dashboardActive = true;
var scrollTimer;

var largePrint = false;

// create an object to handle sync and version check requests

var sync = {};
sync.sync = true;
sync.req = [];
sync.reqCount = 0;
sync.reqComplete = 0;
sync.loadPage = loadPage;
sync.client = '';
sync.code = '';
sync.password = false;
sync.updated = 0;
sync.force = true;
sync.success;
sync.failures = 0;
sync.retry = false;
sync.first = 0;
sync.updateAfter = true;
var syncQueue = [];

var defsPath = 'Scripts/Definitions.js';
var defsUpdate = 0;
var defsLocal = defsVersion;

var services = [
	'www.adobe.com',
	'www.amazon.com',
	'www.amazon.ca',
	'www.amazon.co.uk',
	'www.amazon.co.jp',
	'www.amazon.de',
	'www.amazon.at',
	'www.amazon.es',
	'www.amazon.fr',
	'www.amazon.it',
	'www.apple.com',
	'www.apple.com/japan',
	'www.apple.com/hk',
	'www.aramex.com',
	'auspost.com.au',
	'em.canadapost.ca',
	'www.chronopost.fr',
	'www.city-link.co.uk',
	'www.dhl.com',
	'www.dhlglobalmail.com',
	'nolp.dhl.de',
	'www.dhl.co.uk',
	'www.dpd.com',
	'www.dpd.co.uk',
	'www.fedex.com',
	'www.gls-germany.com',
	'checkout.google.com',
	'www.hlg.de',
	'www.hongkongpost.com',
	'www.japanpost.jp/yupack',
	'www.laposte.fr',
	'www.lasership.com',
	'www.ontrac.com',
	'www.parcelforce.com',
	'www.post.at',
	'www.postdanmark.dk',
	'www.poste.it',
	'www.posten.no',
	'www.posten.se',
	'www.postnl.nl',
	'www.purolator.com',
	'www.royalmail.com',
	'www.sagawa-exp.co.jp',
	'www.post.ch',
	'www.tnt.com',
	'www.tnt.com/ref',
	'www.tntexpress.com.au',
	'www.ups.com',
	'www.ups-mi.net',
	'www.usps.com',
	'www.kuronekoyamato.co.jp',
	'www.yodel.co.uk',
	'other'];
var favorites = [];
var showAll = true;
var useCount = [];

var relativeDate = {
	none: 'none',
	past: 'past',
	any: 'any'
}

var notificationType = {
	none: 0,
	notificationCenter: 1,
	growl: 2
}

var sortByType = {
	none: 0,
	deliveryDate: 1,
	lastUpdated: 2
}

function $ (id) {
	return document.getElementById(id);
}

function setup () {

	if (typeof DeliveryStatus == 'undefined' || typeof JSON == 'undefined') {
		document.body.className = 'unsupported';
		$('unsupported').innerHTML = translate('Delivery Status requires OS X 10.5.8 or later and a Mac with an Intel processor.');
		return;
	}

	if (window.widget) {

		// load settings

		localeCode = DeliveryStatus.getLocaleCode();

		lastVersion = (widget.preferenceForKey('lastversion')) ? 
			parseFloat(widget.preferenceForKey('lastversion')) : 0;

		sync.client = (widget.preferenceForKey(widget.identifier+'-syncclient')) ? 
			widget.preferenceForKey(widget.identifier+'-syncclient') : '';
		// if (sync.client) sync.code = getPassword('junecloud.com',appId);
		sync.email = (widget.preferenceForKey('syncemail')) ? 
			widget.preferenceForKey('syncemail') : '';
		if (sync.email) sync.password = (getPassword('junecloud.com',sync.email)) ? true : false;	
		sync.updated = (widget.preferenceForKey('syncupdated')) ? 
			parseInt(widget.preferenceForKey('syncupdated'),10) : 0;
		sync.offset = (widget.preferenceForKey('syncoffset')) ? 
			parseFloat(widget.preferenceForKey('syncoffset')) : 0;
		syncQueue = (widget.preferenceForKey('syncqueue') && typeof JSON.parse == 'function') ? 
			JSON.parse(widget.preferenceForKey('syncqueue')) : [];
		if (widget.preferenceForKey('betaupdates') == true) syncVersion = 99.0;

		updateClickSpeed();
		disableTooltips = (widget.preferenceForKey('disabletooltips') == '1') ? true : false;

		if (widget.preferenceForKey('favorites')) favorites = widget.preferenceForKey('favorites').split(';');
		showAll = (widget.preferenceForKey('showall') != null) ? widget.preferenceForKey('showall') : true;

		if (widget.preferenceForKey('usecount')) {
			var useTemp = widget.preferenceForKey('usecount').split(';');
			for (var i in useTemp) {
				if (useTemp[i]) {
					var service = useTemp[i].split(':');
					useCount[service[0]] = parseInt(service[1],10);
				}
			}
			sortUseCount();
		}

		// reset syncing when upgrading from a pre-5.0 version

		if (lastVersion < 5.0) {
			// if (DeliveryStatus) DeliveryStatus.deletePassword('junecloud.com',appId);
			sync.client = '';
			sync.code = '';
			sync.updated = 0;
		}

		checkNotifications();
		if (localNotifications == notificationType.notificationCenter) setNotifierPath();
		setStatusBoardPath();

		if (widget.preferenceForKey('sortbydate') != null) {
			sortBy = (widget.preferenceForKey('sortbydate')) ? sortByType.deliveryDate : sortByType.none;
			widget.setPreferenceForKey(null,'sortbydate');
		} else sortBy = (widget.preferenceForKey('sortby') != null) ? parseInt(widget.preferenceForKey('sortby')) : sortByType.deliveryDate;

		largePrint = (widget.preferenceForKey('size')) ? true : false;
		$('size').checked = largePrint;

	}

	// set up the resize handles

	$('resizer-front').addEventListener('mousedown',startResize,true);
	$('resizer-back').addEventListener('mousedown',startResize,true);

	// adjust AppleScrollArea to call didScroll(), since using onscroll doesn't work reliably

	AppleScrollArea.prototype.mousewheelScroll = function (event) {
		didScroll();
		var deltaScroll = event.wheelDelta / 120 * this.singlepressScrollPixels;
		this.verticalScrollTo(this.content.scrollTop - deltaScroll);
		event.stopPropagation();
		event.preventDefault();
	}

	// adjust AppleScrollbar so it scrolls one delivery when the track is clicked

	AppleScrollbar.prototype._trackScrollOnePage = function (self) {
		var scrollPixels = this.scrollarea.singlepressScrollPixels * 14.8;
		if (self._track_mouse_temp < self._thumbStart)
			this.scrollarea.verticalScrollTo(this.scrollarea.content.scrollTop - scrollPixels);
		else if (self._track_mouse_temp > (self._thumbStart + self._thumbLength))
			this.scrollarea.verticalScrollTo(this.scrollarea.content.scrollTop + scrollPixels);
	}

	// set up the scroll bar

	setUpScrollBar();
	scrollArea = new AppleScrollArea($('scroll'),scrollBar);
	scrollBar.setAutohide(true);
	scrollArea.singlepressScrollPixels = (webKitVersion() > 534) ? 20 : 5;

	// set up the add and info buttons

	$('add').innerText = translate('Add');
	$('info').innerText = translate('Settings');

	// set up the tabs

	$('general-tab').innerText = translate('General');
	$('sync-tab').innerText = translate('Sync');
	$('donate-tab').innerText = translate('Donate');
	$('signin-segment').innerText = translate('Sign In');
	$('register-segment').innerText = translate('Register');

	// set up the edit view

	$('editlabel').innerText = translate('Enter your tracking information');
	$('fromlabel').innerText = translate('Delivery From:');
	$('fav').title = translate('Click here to mark this service as a favorite.');
	$('passwordlabel').innerText = translate('Password:');
	$('namelabel').innerText = translate('Item Name:');
	$('name').placeholder = translate('Optional');
	$('historylabel').innerText = translate('Or choose an item from your history');
	$('helplink').innerText = translate('Help');

	// set up the date select menus

	$('dateField').className = localeCode;

	var yearSelect = newObject('select','year','year');
	var year = (new Date()).getFullYear();
	for (var i = 0; i <= 5; i++) {
		var text = (i == 0) ? '' : year+i-1;
		var no = text;
		if (text && localeCode == 'JP') text += '年';
		yearSelect.options[i] = new Option(text,no);
	}
	var monthSelect = newObject('select','month','month');
	monthSelect.options[0] = new Option('','');
	for (var i = 0; i < 12; i++) {
		var text = DeliveryStatus.displayMonth(i+1);
		monthSelect.options[i+1] = new Option(text,i);
	}
	var daySelect = newObject('select','day','day');
	for (var i = 0; i <= 31; i++) {
		var text = (i == 0) ? '' : i;
		var no = text;
		if (text && localeCode == 'JP') text += '日'; 
		daySelect.options[i] = new Option(text,no);
	}

	monthSelect = newSelectWrapper(monthSelect);
	daySelect = newSelectWrapper(daySelect);
	yearSelect = newSelectWrapper(yearSelect);

	if (localeCode == 'US') {
		$('dateselects').appendChild(monthSelect);
		$('dateselects').appendChild(daySelect);
		$('dateselects').appendChild(yearSelect);
	} else if (localeCode == 'JP') {
		$('dateselects').appendChild(yearSelect);
		$('dateselects').appendChild(monthSelect);
		$('dateselects').appendChild(daySelect);
	} else {
		$('dateselects').appendChild(daySelect);
		$('dateselects').appendChild(monthSelect);
		$('dateselects').appendChild(yearSelect);
	}

	// set up the info view

	$('sortbylabel').innerHTML = translate('Sort By');
	$('sortby').options[0].innerText = translate('Manually');
	$('sortby').options[1].innerText = translate('Delivery Date');
	$('sortby').options[2].innerText = translate('Last Updated');
	$('notificationslabel').innerHTML = translate('Notifications');
	// $('pushlabel').innerHTML = translate('Send notifications to <a href="http://junecloud.com/software/iphone/delivery-status-touch.html" onclick="return openSite(this.href)">Delivery Status touch</a> (requires syncing)');
	$('sizelabel').innerHTML = translate('Use larger text');

	$('junecloud').title = translate('Copyright © 2006-2013 Junecloud LLC. Delivery Status is not affiliated with or endorsed by any of the supported shipping services.');

	$('syncemaillabel').innerText = translate('Email Address:');
	$('syncpasswordlabel').innerText = translate('Password:');
	$('syncconfirmlabel').innerText = translate('Confirm Password:');
	$('syncnamelabel').innerText = translate('Your Name:');
	$('syncname').placeholder = translate('Optional');
	$('synctermslabel').innerHTML = translate('I agree to the <a href="http://junecloud.com/sync/legal/terms.html" onclick="return openSite(this.href)">Terms of Service</a>');
	$('sync-info').innerText = translate('Sign in to your Junecloud account to sync with any Mac, iPhone, iPad, iPod touch, or web browser. Data will be synced securely through junecloud.com.');
	$('forgot').innerHTML = '<a href="https://junecloud.com/sync/?cmd=reset" onclick="return openSite(this.href)">'+translate('Forgot your password?')+'</a>';

	// create buttons

	createButtons();

	// display the front view

	$('loading').style.display = 'none';
	$('front').style.display = 'block';

	if (window.widget) {

		// make sure the service definitions are up to date, and finish setting up

		defsUpdate = (widget.preferenceForKey('defsupdate')) ? 
			parseFloat(widget.preferenceForKey('defsupdate')) : 0;
		if (widget.preferenceForKey('defspath')) {
			var tempPath = widget.preferenceForKey('defspath');
			if (DeliveryStatus.fileExists(tempPath)) {
				if (widget.preferenceForKey('defs')) defsVersion = parseInt(widget.preferenceForKey('defs'),10);
				if (defsVersion <= defsLocal) {
					resetDefinitions();
				} else defsPath = tempPath;
			}	
		}
		loadDefinitions(defsPath,true);
		getCurrentVersion();

		widget.ondragend = function () {

			scrollArea.removeScrollbar(scrollBar);
			scrollBar.remove();
			setUpScrollBar();
			scrollArea.addScrollbar(scrollBar);
			setMinMax(currentView);

			doneButton.remove();
			cancelButton.remove();
			signInButton.remove();
			registerButton.remove();
			logOutButton.remove();
			donateButton.remove();
			createButtons();

		};
		widget.onhide = function () {
			dashboardActive = false;
		};
		widget.onshow = function () {
			if (!dashboardActive) { // prevent calling this on initial load
				dashboardActive = true;
				showScrollBar();
				setStatusBoardPath();
				var currentZone = new Date().getTimezoneOffset();
				if (timeZone != currentZone && DeliveryStatus) {
					timeZone = currentZone;
					DeliveryStatus.localeOrTimeChanged();
				}
				displayAllItems();
				updateDeliveries(0,false);
			}
			updateClickSpeed();
		};
		widget.onremove = function () {
			widget.setPreferenceForKey(null,widget.identifier+'-syncclient');
		};
		widget.setPreferenceForKey(installedVersion,'lastversion');

	}

}

function createButtons () {
	doneButton = new AppleGlassButton($('done-button'),translate('Done'),function(){saveSettings(true)});
	cancelButton = new AppleGlassButton($('cancel-button'),translate('Cancel'),finishEditing);
	signInButton = new AppleGlassButton($('signin-button'),translate('Sign In'),saveSync);
	registerButton = new AppleGlassButton($('register-button'),translate('Register'),saveSync);
	logOutButton = new AppleGlassButton($('logout-button'),translate('Log Out'),function(){logOut(true)});
	donateButton = new AppleGlassButton($('donate-button'),translate('Donate'),openDonate);
}

function updateClickSpeed () {
	clickSpeed = parseInt(DeliveryStatus.clickSpeed() * 1000);
}

function setUpScrollBar () {
	scrollBar = new AppleVerticalScrollbar($('scrollbar'));
	scrollBar.setSize(8);
	scrollBar.setTrackStart('Images/Scroll/spacer.png',6);
	scrollBar.setTrackMiddle('Images/Scroll/spacer.png');
	scrollBar.setTrackEnd('Images/Scroll/spacer.png',6);
	if (window.devicePixelRatio > 1) {
		scrollBar.setThumbStart('Images/Scroll/thumb-top@2x.png',6);
		scrollBar.setThumbMiddle('Images/Scroll/thumb-middle@2x.png');
		scrollBar.setThumbEnd('Images/Scroll/thumb-bottom@2x.png',6);	
	} else {
		scrollBar.setThumbStart('Images/Scroll/thumb-top.png',6);
		scrollBar.setThumbMiddle('Images/Scroll/thumb-middle.png');
		scrollBar.setThumbEnd('Images/Scroll/thumb-bottom.png',6);
	}
}

function showScrollBar () {
	clearTimeout(scrollTimer);
	$('scrollbar').className = 'visible';
	scrollTimer = setTimeout(function(){ $('scrollbar').className = ''; },300);
}

function didScroll () {
	showScrollBar();
}

function loadDeliveries () {

	// load the deliveries

	if (widget.preferenceForKey('deliveries')) {
		var deliveryIds = widget.preferenceForKey('deliveries').split(';');
		for (var i in deliveryIds) {
			if (deliveryIds[i]) {
				deliveries[i] = loadDelivery(deliveryIds[i],i);
				if (deliveries[i].unfrozen) {
					displayItem(deliveries[i].id,deliveries[i].displayed,false);
					var thisStamp = (deliveries[i].lastUpdate) ? deliveries[i].lastUpdate.getTime() : 0;
					if (thisStamp > updateStamp) updateStamp = thisStamp;
				}
				if (updateStamp) hadSuccess = true;
			}
		}
	}
	
	$('deliveries').style.height = (deliveries.length * 74) + 'px';
	showNoDeliveries();

	size = savedSize();
	setMinMax(currentView);
	setSize(size.width,size.height,true,false);
	setMaximized(size);
	setTimeout(showScrollBar,1000);

	updateQueue = new Queue();
	if (installedVersion > lastVersion) {
		updateDeliveries(2,false);
	} else startSync();

}

function loadDelivery (id,index) {

	/* the HTML generated below looks like this:

	<div class="delivery">
		<div class="highlight"></div>
		<div class="shadow"></div>
		<div class="icon">
			<img class="spinner"/>
			<div class="daycount"></div>
			<div class="daytext"></div>
		</div>
		<div class="text">
			<div class="item"></div>
			<div class="ship"></div>
			<div class="deliver"></div>
		</div>
		<div class="button" onclick="clickDelivery('id',event)"></div>
	</div> */

	var deliveryObj = newObject('div',id,'delivery');

	var iconObj = newObject('div',id+'-icon','icon');
	iconObj.appendChild(newObject('img',id+'-spinner','spinner'));
	iconObj.appendChild(newObject('div',id+'-daycount','daycount'));
	iconObj.appendChild(newObject('div',id+'-daytext','daytext'));
	deliveryObj.appendChild(iconObj);

	var textObj = newObject('div',id+'-text','text updating');
	textObj.appendChild(newObject('div',id+'-item','item'));
	textObj.appendChild(newObject('div',id+'-ship','ship'));
	textObj.appendChild(newObject('div',id+'-deliver','deliver'));
	deliveryObj.appendChild(textObj);

	var buttonObj = newObject('div',id+'-button','button');
	buttonObj.addEventListener('click',function(e){ clickDelivery(id,e) },true);
	deliveryObj.appendChild(buttonObj);

	var settings = [];
	settings.uuid = id;
	if (window.widget) {
		settings.from = widget.preferenceForKey(id+'-store');
		settings.name = widget.preferenceForKey(id+'-itemname');
		settings.no = widget.preferenceForKey(id+'-orderno');
		settings.extra = widget.preferenceForKey(id+'-email');
		settings.date = widget.preferenceForKey(id+'-date');
		settings.htmlhash = widget.preferenceForKey(id+'-htmlhash');
		settings.htmldate = widget.preferenceForKey(id+'-htmldate');
		settings.displayed = widget.preferenceForKey(id+'-displayed');
		settings.lastupdated = widget.preferenceForKey(id+'-lastupdated');
	}

	if (index < 0) {
		deliveryObj.style.opacity = 0;
		deliveryObj.style.height = 0;
		var newDelivery = $('deliveries').insertBefore(deliveryObj,$('deliveries').childNodes[0]);
		openQueue.push(newDelivery);
	} else if ($(id)) {
		$('deliveries').replaceChild(deliveryObj,$(id));
	} else $('deliveries').appendChild(deliveryObj);

	var delivery;
	if (deliveries[index]) {
		delivery = deliveries[index];
		delivery.resetRequests(true);
		delivery.setDelivery(settings);
	} else {
		delivery = new Delivery(settings);
		if (window.widget && widget.preferenceForKey(id+'-saved')) {
			var jsonData = JSON.parse(widget.preferenceForKey(id+'-saved'));
			if (jsonData.items) {
				delivery.url = jsonData.url;
				delivery.count = jsonData.count;
				if (jsonData.lastupdate) delivery.lastUpdate = new Date(jsonData.lastupdate);
				if (jsonData.nextupdate) delivery.nextUpdate = jsonData.nextupdate;
				if (jsonData.backgroundupdate) delivery.backgroundUpdate = jsonData.backgroundupdate;
				delivery.items = jsonData.items
				delivery.unfrozen = true;
			}
		}
	}

	deliveryObj.className = 'delivery '+delivery.fromClass;
	delivery.addButtons();

	return delivery;

}

function saveItems () {
	if (typeof JSON.stringify == 'function' && window.widget) {
		var lastUpdateTime = (this.lastUpdate) ? this.lastUpdate.getTime() : null;
		var jsonData = {
				url:				this.url,
				count:				this.count,
				lastupdate:			lastUpdateTime,
				nextupdate:			this.nextUpdate,
				backgroundupdate:	this.backgroundUpdate,
				items:				this.items
			};
		widget.setPreferenceForKey(JSON.stringify(jsonData),this.id+'-saved');
	}
}

function addButtons () {
	var editButton = newObject('a',this.id+'-edit','edit');
	editButton.innerText = translate('Edit');
	editButton.parent = this;
	editButton.addEventListener('click',this.editParent,true);
	var closeButton = newObject('a',this.id+'-close','close');
	closeButton.innerText = translate('Delete');
	closeButton.parent = this;
	closeButton.addEventListener('click',this.closeParent,true);
	var buttons = [editButton,closeButton];
	this.buttons = new Buttons(this.id,'edit-buttons',buttons,true);
}

function getIndex (id) {
	for (var i in deliveries) {
		if (deliveries[i].id == id) return i;
	}
	return -1;
}

function getUUID () {
	return DeliveryStatus.getUUID();
}

function getPassword (from,extra) {
	var result = DeliveryStatus.getPassword(from,extra);
	if (result == null) result = '';
	return result;
}

function newObject (element,id,classname) {
	var object = document.createElement(element);
	if (id) object.setAttribute('id',id);
	object.className = classname;
	if (element == 'a') object.href = '#';
	return object;
}

function newSelectWrapper (select) {

	select.onkeyup = function(){ setSelect(select.id,false); }
	select.onchange = function(){ setSelect(select.id,false); }
	
	// Show focus?
	// select.onfocus = function(){ $(select.id+'-popup').style.border = '1px solid red'; }
	// select.onblur = function(){ $(select.id+'-popup').style.border = 'none'; }
	
	var wrapperObj = newObject('div',select.id+'-popup','popup');
	wrapperObj.appendChild(newObject('div',select.id+'-text','text'));
	wrapperObj.appendChild(select);

	return wrapperObj;

}

function setSelect (id,value) {
	if (value !== false) $(id).value = value;
	var thisOption = $(id).options[$(id).selectedIndex];
	if (thisOption) $(id+'-text').innerText = thisOption.innerText;
}

function updateDeliveries (force,skipSync) {

	var rightNow = getUnixTime();

	if (force) {
		// 1: update deliveries that haven't been updated in the last 10 minutes
		// 2: update all deliveries immediately
		if (force == 2) updateQueue.reset();
		for (var i in deliveries) {
			var nextUpdate = (force == 1 && deliveries[i].lastUpdate) ? 
				(deliveries[i].lastUpdate.getTime()/1000) + (10*60) : 0;
			if (nextUpdate < rightNow) deliveries[i].nextUpdate = nextUpdate;
		}
	}

	if (!skipSync) {

		if (force) {
			sync.force = true;
			sync.updateAfter = true;
		}
		startSync();

	} else {

		clearTimeout(updateTimer);
		var resetSuccess = false;
		var inuse = activeUse();

		for (var i in deliveries) {
			var updateTime = (inuse) ? deliveries[i].nextUpdate : deliveries[i].backgroundUpdate;
			if (rightNow >= updateTime && deliveries[i].reqComplete >= deliveries[i].reqCount) {
				if (!resetSuccess) {
					hadSuccess = false;
					resetSuccess = true;
				}
				updateQueue.add(deliveries[i]);
			}
		}
		if (updateQueue.count()) {
			updateQueue.update();
		} else showTime(false);
		if (localNotifications != notificationType.none || pushActive() || statusBoardPath) 
			updateTimer = setTimeout('updateDeliveries(0,false)',30*60*1000);

	}

}

function setHistoryTitle (id) {
	var index = getIndex(id);
	if (deliveries[index]) {
		var item = deliveries[index].items[0];
		if (item && window.widget) {
			widget.setPreferenceForKey(removeHtmlEntities(item.title),id+'-historytitle');
		}
	}
}

function setIcon (id,icon) {
	$(id+'-icon').className = (icon) ? 'icon '+icon : 'icon days';
}

function convertDate (date) {
	return (date) ? date.getTime() : 0;
}

function dateToString (date) {
	var string = date.getFullYear()+'-';
	var month = date.getMonth()+1;
	if (month < 10) month = '0'+month;
	string += month+'-';
	var day = date.getDate();
	if (day < 10) day = '0'+day;
	string += day;
	return string; // yyyy-MM-dd
}

function displayItem (id,x,update) {

	var index = getIndex(id);
	var delivery = deliveries[index];
	if (delivery) {

		if (parseInt(x,10) + 1 > delivery.count) x = 0;
		if (update) {
			deliveries[index].displayed = x;
			if (window.widget) widget.setPreferenceForKey(x,id+'-displayed');
		}

		delivery.stopLoad();

		if (delivery.items[x]) {

			var item = delivery.items[x];
			var icon = item.icon;
			var dayCount = '';
			var dayText = '';
			var dayClass = '';
			var isOther = (delivery.from == 'other');

			if (delivery.loading || (!icon && item.date == undefined)) {
				icon = 'loading';
			} else {
				var dayCount = getDaysApart(item.date);
				if (dayCount < 0) {
					if (!icon) icon = (delivery.from == 'other') ? 'checkmark' : 'transit';
				} else if (dayCount < 100) {
					dayText = (dayCount == 1) ? translate('day') : translate('days');
					if (dayCount < 20) dayClass = 'compress';
				} else {
					var monthCount = getMonthsApart(item.date);
					if (monthCount < 100) {
						dayCount = monthCount;
						dayText = (dayCount == 1) ? translate('month') : translate('months');
						if (dayCount < 20) dayClass = 'compress';
					} else {
						dayCount = '99+';
						dayText = translate('months');
						dayClass = 'many';
					}
				}
			}
			setIcon(id,icon);
			$(delivery.id+'-daycount').className = 'daycount '+dayClass;
			$(delivery.id+'-daycount').innerText = dayCount;
			$(delivery.id+'-daytext').innerText = translate(dayText);

			var itemObj = $(delivery.id+'-item');
			if (delivery.count > 1) {
				var nextItem = x + 1;
				if (nextItem > delivery.count - 1) nextItem = 0;
				var displayNo = x + 1;
				if (displayNo > 9) displayNo = 'plus';
				itemObj.innerHTML = '<img src="Images/Dots/'+displayNo+'.png" class="no" onclick="displayItem(\''+
					id+'\','+nextItem+',true)"><a href="javascript:displayItem(\''+id+'\','+nextItem+',true)">'+item.title+'</a>';
				itemObj.className = 'item number';
			} else {
				itemObj.innerHTML = item.title;
				itemObj.className = 'item';
			}

			if (isOther && delivery.htmldate) {
				item.shipText = updatedText('Site updated %@',delivery.htmldate/1000);
				item.shipBold = true;
			}

			var title = delivery.fromTrans+'\n'+trim(removeHtmlEntities(item.title))+'\n';
			if (delivery.no && title.indexOf(delivery.no) == -1) title += delivery.no+'\n';
			var lastUpdate = false;
			if (delivery.lastUpdate) lastUpdate = delivery.lastUpdate.getTime();
			if (isOther && !delivery.extra) lastUpdate = false;
			if (lastUpdate) title += updatedText('Last checked %@',lastUpdate/1000)+'\n';

			title += '\n'+formatLine(item.shipText,item.shipDate,relativeDate.none,false,true)+'\n';
			if (item.shipExtra && item.shipExtra != item.shipText) {
				var date = item.statusDate;
				title += formatLine(item.shipExtra,date,relativeDate.past,false,true)+'\n\n';
			}
			title += formatLine(item.deliverText,item.deliverDate,relativeDate.none,false,true);
			if (item.deliverExtra && item.deliverExtra != item.deliverText) {
				title += '\n'+formatLine(item.deliverExtra,item.deliverDate,relativeDate.none,false,true);
			}			
			setTitle(delivery.id,title);

			var shipDate = item.shipText;
			var deliveryDate = item.deliverText;

			if (getDonated() + 1 < installedVersion && deliveryDate == translate('Delivered!')) {
				if (shipDate == translate('Shipped!')) shipDate = deliveryDate;
				deliveryDate = '<a href="javascript:showInfo(\'donate\')">'+
					translate('Please consider a donation')+'</a>';
				item.clickable = true;
			}

			$(delivery.id+'-text').className = 'text';
			$(delivery.id+'-deliver').className = (item.clickable) ? 'deliver clickable' : 'deliver';
			$(delivery.id+'-ship').innerHTML = formatLine(shipDate,item.shipDate,relativeDate.any,item.shipBold,false);
			$(delivery.id+'-deliver').innerHTML = formatLine(deliveryDate,item.deliverDate,relativeDate.any,item.deliverBold,false);

		}

	}

}

function displayAllItems () {
	for (var i in deliveries) if (!deliveries[i].reqCount) {
		displayItem(deliveries[i].id,deliveries[i].displayed,false);
	}
}

function formatLine (text,date,relative,bold,clean) {
	var dateString = '';
	if (date) {
		dateString = DeliveryStatus.displayDate(date/1000,relative);
		if (dateString) dateString = translate(dateString);
		if (!bold) dateString = '<b>'+dateString+'</b>';
	}
	text = text.replace('%@',dateString);
	if (bold) text = '<b>'+text+'</b>';
	if (clean) text = trim(removeHtmlEntities(stripHTML(text))).replace(/\s+/ig,' ');
	return text;
}

function setTitle (id,title) {
	if (!disableTooltips && title) {
		$(id+'-item').title = title;
		$(id+'-button').title = title;
	}
}

function showMessage (message) {
	$('message').innerHTML = message;
	if (this.id && $(this.id+'-text').className == 'text updating') $(this.id+'-ship').innerHTML = message;
}

function updatedText (text,timeStamp) {
	var updatedArray = DeliveryStatus.updatedText(timeStamp);
	if (updatedArray) {
		timeString = translateFormat(updatedArray[0],updatedArray[1]);
		if (text) timeString = translateFormat(text,timeString);
	}
	return timeString;
}

function showTime (setToNow) {
	var message = '';
	if (hadSuccess) {
		if (setToNow || updateStamp) {
			if (setToNow) updateStamp = (new Date()).getTime();
			message = updatedText('Updated %@',updateStamp/1000);
		}
	} else if (deliveries.length > 0) {
		message = translate('Couldn’t connect');
	}
	showMessage(message);
}

function currentlyUpdating () {
	var updating = false;
	if (updateQueue.busy) {
		updating = true;
	} else {
		for (var i in deliveries) {
			if (!deliveries[i].updateComplete()) {
				updating = true;
				break;
			}
		}
	}
	return updating;
}

function finishUpdate () {
	if (!currentlyUpdating()) {
		sortDeliveries();
		showTime(true);
		checkVersion(7,false);
		updateStatusBoard();
	}
}

function openSite (url) {
	if (window.widget) {
		widget.openURL(url);
		return false;
	}
	return true;
}

function openSafariSite (url,from,extra) {
	if (window.widget) {
		var thisCommand = widget.system("/usr/bin/osascript -e \"tell application \\\"Safari\\\" to open location \\\""+url+"\\\"\"",function(){
			manualSignIn[from+'-'+extra] = false;
			for (var i in deliveries) {	
				if (deliveries[i].from == from && deliveries[i].extra == extra) {
					deliveries[i].nextUpdate = 0;
					deliveries[i].backgroundUpdate = 0;
				}
			}
		});
		thisCommand.onreaderror = function(output){
			alert('Error opening site in Safari: '+output);
		};
		return false;
	}
	return true;
}

function clickDelivery (id,event) {

	event.stopPropagation(); // ???
	event.preventDefault(); // ???
	clearTimeout(clickTimer);

	var i = getIndex(id);
	if (i >= 0) {
		var rightNow = new Date();
		if (rightNow - lastClick < clickSpeed) {
			openDeliverySite(i,2);
		} else clickTimer = setTimeout(openDeliverySite,clickSpeed,i,1);
		lastClick = rightNow;
	}

}

function openDeliverySite (i,clicks) {

	lastClick = 0;
	var x = (deliveries[i].displayed) ? deliveries[i].displayed : 0;
	var location = (clicks > 1 && deliveries[i].items[x]) ? 
		deliveries[i].items[x].details.mapLocation : false;

	if (clicks > 1 && location) {
		// escaping the location causes problems with Japanese characters
		openSite('http://maps.google.com/maps?q='+location);
	} else if (deliveries[i].url) {
		openSite(deliveries[i].url);
	}

}


// sort deliveries


function sortDeliveries () {

	if (sortBy == sortByType.none) return;

	if (currentlyUpdating()) {
		setTimeout(sortDeliveries,500);
	} else {

		var sortedDeliveries = deliveries.slice(0);
		sortedDeliveries.sort(compareDeliveryDates);

		var orderChanged = false;
		for (var x in deliveries) {
			if (deliveries[x] != sortedDeliveries[x]) {
				orderChanged = true;
				break;
			}
		}
		if (orderChanged) {
			var deliveriesObject = document.getElementById('deliveries');
			var deliveryObjects = deliveriesObject.childNodes;
			var objectStorage = {};

			// Store the current delivery objects
			for (var x in deliveryObjects) {
				var id = deliveryObjects[x].id;
				if (id) objectStorage[id] = deliveryObjects[x];
			}
			// Remove them
			for (var x in deliveryObjects) {
				var id = deliveryObjects[x].id;
				if (id) deliveriesObject.removeChild(deliveryObjects[x]);
			}
			// Then re-add them in the new order
			for (var x in sortedDeliveries) {
				var id = sortedDeliveries[x].id;
				deliveriesObject.appendChild(objectStorage[id]);
			}

			deliveries = sortedDeliveries;
			saveDeliveries();
		}

	}

}

function compareDeliveryDates (a,b) {
	var result = (sortBy == sortByType.lastUpdated) ?
		comparisonValue(b) - comparisonValue(a) :
		comparisonValue(a) - comparisonValue(b);	
	if (!result) result = services.indexOf(a.from) - services.indexOf(b.from);
	if (!result && a.no != b.no) {
		var noArray = [a.no,b.no];
		noArray.sort();
		result = (a.no == noArray[0]) ? -1 : 1;
	}
	return result;
}

// TODO: remove!
function dateFromTimeStamp (timestamp) {
	return new Date(timestamp);
}

function comparisonValue (delivery) {
	if (sortBy == sortByType.lastUpdated) {
		var lastUpdated = delivery.lastUpdated;
		if (lastUpdated == 0 && delivery.modified) lastUpdated = delivery.modified * 1000;
		return lastUpdated;
	} else { // sortByType.deliveryDate
		var value = 99999999999;
		if (delivery.items) {
			var item = delivery.items[delivery.displayed];
			if (item) {
				var icon = item.icon;
				if (icon == 'error') {
					value = 99999999999;
				} else {
					value = item.deliverDate/1000;
					if (value < 1) {
						if (item.shipDate) value = (item.shipDate/1000) + 3000000000;
					} else if (icon == 'checkmark') {
						value -= 43200; // subtract 12 hours to force delivered items to the top
					}
					if (value < 1) value = 99999999998;
				}
			}
		}
		return value;
	}
}


// open or close a delivery


function animateQueues () {
	if (openQueue.length > 0 || closeQueue.length > 0) {
		setTimeout(refreshDeliveriesView,0);
		var wait = (openQueue.length > closeQueue.length) ? 100 : 0;
		setTimeout(function(){
				for (var i in openQueue) startAnimation(openQueue[i],0,74,0,1,false,false);
				openQueue = [];
				for (var i in closeQueue) startAnimation(closeQueue[i],closeQueue[i].offsetHeight,0,1,0,finishClose,false);
				closeQueue = [];
			},wait);
	}
}

function startAnimation (object,startHeight,stopHeight,startFade,stopFade,stopAction,id) {

	var startingRect = new AppleRect(0,0,object.offsetWidth,startHeight);
	var finishingRect = new AppleRect(0,0,object.offsetWidth,stopHeight);	
	var rectAnimation = new AppleRectAnimation(startingRect,finishingRect,closeRectHandler);
	rectAnimation.object = object;

	var fadeAnimation = new AppleAnimation(startFade,stopFade,fadeHandler);
	fadeAnimation.object = object;

	var animator = new AppleAnimator(300,13);
	animator.addAnimation(rectAnimation);
	animator.addAnimation(fadeAnimation);
	animator.id = id;
	animator.object = object;
	if (stopAction) animator.oncomplete = stopAction;
	animator.start();

	showScrollBar();

}

function finishClose () {
	$('deliveries').removeChild(this.object);
}

function closeParent () {
	var object = $(this.parent.id);
	startAnimation(object,object.offsetHeight,0,1,0,deliveryClosed,this.parent.id);
}

function closeRectHandler (rectAnimation,currentRect,startingRect,finishingRect) {
	this.object.style.height = currentRect.bottom + 'px';
}

function fadeHandler (currentAnimator,current,start,finish) {
	this.object.style.opacity = current;
}

function deliveryClosed () {
	var index = getIndex(this.id);
	if (index >= 0) {
		deliveries.splice(index,1);
		saveDeliveries();
		$('deliveries').removeChild(this.object);
		refreshDeliveriesView();
		syncDelivery(this.id,'delete',getUnixTime()-sync.offset);
	}
}

function refreshDeliveriesView () {

	var oldDeliveries = $('deliveries').offsetHeight;
	$('deliveries').style.height = (deliveries.length * 74) + 'px';

	if (oldDeliveries != $('deliveries').offsetHeight) {
		setMinMax(currentView);
		
		if (size.height > max.height) {

			nextSide = 'front';
			nextView = 'deliveries';
			adjustSize();

		} else if (maximized && size.height < max.height) {

			nextSide = 'front';
			nextView = 'deliveries';

			var completeOutput = '';
			var thisCommand = widget.system('/usr/bin/defaults read com.apple.dashboard layer-gadgets',function(){

				var top = 0;
				var regex = new RegExp('id = '+widget.identifier+';(.*?)"pos-y" = ([0-9]+);','i');
				var result = stripWhiteSpace(completeOutput).match(regex);
				if (result && result[2]) top = parseInt(result[2],10);

				if (top + max.height + 66 < screen.height) {
					adjustSize(true);
				} else setSize(size.width,size.height,true,false);
			
			});
			thisCommand.onreadoutput = function(thisOutput){
				completeOutput += thisOutput;
			};

		} else setSize(size.width,size.height,true,false);

	}
	showNoDeliveries();

}

function showNoDeliveries () {
	if (deliveries.length == 0) {
		$('no-deliveries').innerText = translate('You do not have any deliveries');
		$('no-deliveries').style.display = 'block';
	} else $('no-deliveries').style.display = 'none';
}


// display loading spinner


function startLoad () {

	setIcon(this.id,'loading');

	var self = this;
	this.loading = true;
	this.spinAngle = 0;

	switch(this.fromClass) {
		case 'DHL':
			$(self.id+'-spinner').src = 'Images/Icons/spinner-DHL.png';
			break;
		case 'LaPoste':
			$(self.id+'-spinner').src = 'Images/Icons/spinner-LaPoste.png';
			break;
		case 'UPS':
			$(self.id+'-spinner').src = 'Images/Icons/spinner-UPS.png';
			break;
		case 'AusPost':
		case 'CanadaPost':
		case 'FedEx':
		case 'GLS':
		case 'HongkongPost':
		case 'JapanPost':
		case 'OnTrac':
		case 'PostNL':
			$(self.id+'-spinner').src = 'Images/Icons/spinner-White.png';
			break;
		default:
			$(self.id+'-spinner').src = 'Images/Icons/spinner.png';
			break;
	}

	self.spinTimer = setTimeout(function(){ continueLoad(self) },100);

}

function continueLoad (self) {
	var spinner = $(self.id+'-spinner');
	if (spinner) {
		spinner.style.webkitTransform = 'rotate('+self.spinAngle+'deg)';
		self.spinAngle += 30;
		self.spinTimer = setTimeout(function(){ continueLoad(self) },100);
	}
}

function stopLoad () {
	clearTimeout(this.spinTimer);
	this.loading = false;
}


// display the info and settings


function showInfo (view) {
	$('syncemail').value = sync.email;
	if (sync.email) $('syncpassword').value = getPassword('junecloud.com',sync.email);
	$('sortby').value = sortBy;
	checkNotifications();
	selectSortBy(false);
	setDonated(true);
	$('version').innerText = 'Delivery Status '+readableVersion+' ('+defsVersion+')';
	switchToView('back',view);
}


// add, edit, and save deliveries


function addDelivery () {
	var settings = [];
	settings.from = lastFrom = (widget.preferenceForKey('store')) ? 
		widget.preferenceForKey('store') : 'www.amazon.com';

	editingDelivery = new Delivery(settings);
	updateEditForm(editingDelivery.from);
	fillEditForm(editingDelivery,true);
	switchToView('back','edit');
}

function editDelivery (delivery) {

	var settings = [];
	settings.uuid = delivery.id;
	if (window.widget) {
		settings.from = delivery.from;
		settings.name = delivery.name;
		settings.no = delivery.no;
		settings.extra = delivery.extra;
		settings.date = (delivery.date) ? dateToString(delivery.date) : '';
		settings.htmlhash = delivery.htmlhash;
		settings.htmldate = delivery.htmldate;
		settings.displayed = delivery.displayed;
	}

	switch (settings.from) {
		case 'www.japanpost.jp/ems':
		case 'www.japanpost.jp/m10':
		case 'www.japanpost.jp/reg':
			settings.from = 'www.japanpost.jp/yupack';
			break;
		case 'www.poste.it/posta1':
		case 'www.poste.it/pacco1':
		case 'www.poste.it/maxi':
		case 'www.poste.it/pacco':
		case 'www.poste.it/ems':
			settings.from = 'www.poste.it';
			break;
	}

	editingDelivery = new Delivery(settings);
	if (settings.from != 'other') editingDelivery.fromEdited = true;
	updateEditForm(editingDelivery.from);
	fillEditForm(editingDelivery,false);
	switchToView('back','edit');

}

function editParent () {
	editDelivery(this.parent);
}

function editPassword (id) {
	var i = getIndex(id);
	if (i >= 0) editDelivery(deliveries[i]);
	$('password').focus();
}

function fillEditForm (delivery,isNew) {

	showServices(delivery.from,showAll);

	$('from').value = delivery.from;
	$('name').value = delivery.name;
	$('no').value = delivery.no;

	if (!isNew) {
		$('extra').value = delivery.extra;
		$('password').value = ($('extra').value) ? getPassword($('from').value,$('extra').value) : '';

		if (delivery.date) {
			setSelect('month',delivery.date.getMonth());
			setSelect('day',delivery.date.getDate());
			setSelect('year',delivery.date.getFullYear());
		} else {
			setSelect('month','');
			setSelect('day','');
			setSelect('year','');
		}
	}

	$('history').selectedIndex = 0;
	populateHistory();

}

function showServices (from,all) {

	while ($('from').hasChildNodes()) $('from').removeChild($('from').firstChild);
	if (favorites.length > 0) {
		$('from').appendChild(newObject('optgroup','from-favs'));
		$('from-favs').label = translate('Favorites');
	}
	for (var x in favorites) {
		$('from').appendChild(new Option(getFromName(favorites[x],true,true),favorites[x]));
	}
	if (all) {
		if ($('from').hasChildNodes()) {
			$('from').appendChild(document.createElement('hr'));
			$('from').appendChild(newObject('optgroup','from-all'));
			$('from-all').label = translate('All Services');
		}
		for (var x in services) {
			$('from').appendChild(new Option(getFromName(services[x],true,true),services[x]));
		}
		$('from').appendChild(document.createElement('hr'));
		$('from').appendChild(new Option(translate('Show favorites only'),'favs'));
	} else {
		if (favorites.indexOf(from) == -1) {
			$('from').appendChild(document.createElement('hr'));
			$('from').appendChild(new Option(getFromName(from,true,true),from));
		}
		$('from').appendChild(document.createElement('hr'));
		$('from').appendChild(new Option(translate('Show all'),'all'));
	}

}

function sortUseCount () {

	var useSorter = [];
	for (var key in useCount) {
		useSorter.push(key);
	}

	useSorter.sort(function(a,b){
		// If the values are equal, favorites should come first
		if (useCount[b] == useCount[a]) {
			aFavorite = (favorites.indexOf(a) == -1) ? 0 : 1;
			bFavorite = (favorites.indexOf(b) == -1) ? 0 : 1;
			return (bFavorite - aFavorite);
		}
		// Otherwise higher values should come first
		return (useCount[b] - useCount[a]);
	});
	
	var useSorted = [];
	for (var i in useSorter) {
		useSorted[useSorter[i]] = useCount[useSorter[i]];
	}
	useCount = useSorted;

}

function updateUseCount (from) {
	useCount[from] = (useCount[from]) ? useCount[from] + 1 : 1;
	if (window.widget) {
		sortUseCount();
		var useTemp = '';
		for (var key in useCount) useTemp += key+':'+useCount[key]+';';
		widget.setPreferenceForKey(useTemp,'usecount');
	}
}

function selectGuessFrom (event,value) {

	// Don't continue if the return or enter key was pressed
	if (event.keyCode == 13 && event.keyCode == 3) return;
	// Don't continue if the "from" was previously set (and it's not an "other" delivery)
	if (editingDelivery.fromEdited) return;

	var guessArray = guessFrom(value,false);
	if (guessArray) {

		var newFrom = false;
		// If there's only one guess, just set it
		if (guessArray.length == 1) {
			newFrom = guessArray[0];
		} else if (guessArray.indexOf(lastFrom) != -1) {
			newFrom = lastFrom;
		} else {

			// If any favorites are in the list, only consider those
			var favGuessArray = [];
			for (var i in guessArray) {
				if (favorites.indexOf(guessArray[i]) != -1) favGuessArray.push(guessArray[i]);
			}
			if (favGuessArray.length) guessArray = favGuessArray;

			// Get the most used match
			if (!newFrom) {
				for (var key in useCount) {
					if (guessArray.indexOf(key) != -1) {
						newFrom = key;
						break;
					}
				}
			}
			if (!newFrom) newFrom = guessArray[0];

		}
		if (newFrom) {
			showServices(newFrom,showAll);
			$('from').value = newFrom;
			selectFrom(newFrom,false);
		}

	}

}

function selectFrom (value,userSelected) {

	if (value == 'all') {

		showAll = true;
		if (window.widget) widget.setPreferenceForKey(true,'showall');
		showServices(editingDelivery.from,true);
		$('from').value = editingDelivery.from;

	} else if (value == 'favs') {

		showAll = false;
		if (window.widget) widget.setPreferenceForKey(false,'showall');
		showServices(editingDelivery.from,false);
		$('from').value = editingDelivery.from;
		
	} else {

		if (userSelected) editingDelivery.fromEdited = true;
		updateEditForm(value);

	}

}

function updateEditForm (from) {

	$('from-text').innerText = getFromName(from,true,true);
	$('delivery-info').innerText = '';

	editingDelivery.from = from;
	setService(editingDelivery,false,false);
	updateFavorite(from);

	if (!extraEdited || !$('extra').value) {
		$('extra').value = (widget.preferenceForKey(from+'-email')) ? 
			widget.preferenceForKey(from+'-email') : '';
		$('password').value = ($('extra').value) ? getPassword(from,$('extra').value) : '';	
		extraEdited = false;
	}

	editingDelivery.changedPassword = false;

	if (from == 'www.apple.com' || from == 'www.apple.com/zip' || from == 'www.apple.com/japan' || 
		from == 'www.apple.com/japanzip' || from == 'www.apple.com/hk') {

		showExtra(true,editingDelivery.passRequired,false);
		$('nolabel').innerText = translate('Order Number:');
		$('extralabel').innerText = translate('Email Address or Zip Code:');

	} else if (from == 'www.city-link.co.uk' || from == 'nolp.dhl.de' || from == 'www.postnl.nl' || from == 'www.yodel.co.uk') {

		showExtra(true,editingDelivery.passRequired,false);
		$('nolabel').innerText = translate('Tracking Number:');
		$('extralabel').innerText = translate('Shipping Zip Code:');

	} else if (from == 'other') {

		showExtra(true,false,true);
		$('nolabel').innerText = translate('Tracking Number:');
		$('extralabel').innerText = translate('Web Site:');
		$('datelabel').innerText = translate('Delivery Date:');

	} else if (editingDelivery.extraRequired == false) {

		showExtra(false,false,false);
		if (from == 'www.tnt.com' || from == 'www.tntexpress.com.au') {
			$('nolabel').innerText = translate('Consignment Number:');
		} else if (from == 'www.royalmail.com' || from == 'www.tnt.com/ref') {
			$('nolabel').innerText = translate('Reference Number:');
		} else $('nolabel').innerText = translate('Tracking Number:');

	} else {

		showExtra(true,editingDelivery.passRequired,false);
		$('extralabel').innerText = translate('Email Address:');
		$('nolabel').innerText = translate('Order Number:');

	}

	$('no').placeholder = (from == 'other') ? translate('Optional') : '';

}

function showExtra (extraVisible,passVisible,dateVisible) {
	$('extraField').style.display = (extraVisible) ? 'block' : 'none';
	$('passwordField').style.display = (passVisible) ? 'block' : 'none';
	$('dateField').style.display = (dateVisible) ? 'block' : 'none';
	if (!extraVisible) $('extra').value = '';
	if (!passVisible) $('password').value = '';
	$('extra').placeholder = (editingDelivery.extraRequired) ? '' : translate('Optional');
}

function editedExtra () {
	extraEdited = true;
	$('password').value = ($('extra').value) ? getPassword($('from').value,$('extra').value) : '';
}

function editedPassword () {
	editingDelivery.changedPassword = true;
}

function updateFavorite (from) {
	$('fav').className = (favorites.indexOf(from) != -1) ? 'favorite' : '';
}

function toggleFavorite () {

	var from = $('from').value;
	var index = favorites.indexOf(from);
	if (index == -1) {
		var newFavorites = [];
		favorites.push(from);
		for (var x in services) {
			if (favorites.indexOf(services[x]) != -1) newFavorites.push(services[x]);
		}
		favorites = newFavorites;
	} else favorites.splice(index,1);

	if (window.widget) widget.setPreferenceForKey(favorites.join(';'),'favorites');

	updateFavorite(from);
	showServices(from,showAll);
	sortUseCount();
	$('from').value = from;

}

function saveSettings (finish) {
	if (currentView == 'edit') {
		if (checkComplete(editingDelivery)) {
			// Important to call this first, so any size adjustments are made later
			if (finish) finishEditing();
			saveDelivery(editingDelivery);
		}
	} else {
		sortBy = parseInt($('sortby').value);
		localNotifications = parseInt($('notifications').value);
		// pushEnabled = $('push').checked;
		largePrint = $('size').checked;
		if (window.widget) {
			widget.setPreferenceForKey(sortBy,'sortby');
			widget.setPreferenceForKey(localNotifications,'localnotifications');
			// widget.setPreferenceForKey(pushEnabled,'usepush');
			widget.setPreferenceForKey(largePrint,'size');
		}
		if (finish) {
			// If the last sync failed, and they cleared the email field, log them out
			if (!sync.success && sync.email && !$('syncemail').value) logOut(false);
			finishEditing();
		}
	}
}

function selectSortBy (userSelected) {
	var i = $('sortby').selectedIndex;
	var thisOption = $('sortby').options[i];
	if (thisOption) $('sortby-text').innerText = thisOption.innerText;
	if (userSelected) {
		sortBy = parseInt($('sortby').value);
		sortDeliveries();
	}
}

function disableSort () {
	sortBy = 0;
	widget.setPreferenceForKey(0,'sortby');
}

function finishEditing () {
	switchToView('front','deliveries');
}

function checkComplete (delivery) {
	var result = false;
	var message = '';
	var missingFields = [];
	if ($('from').value != 'other') {
		if (!$('no').value) missingFields.push(getLabel('no'));
		if (delivery.extraRequired && !$('extra').value) missingFields.push(getLabel('extra'));
		if (delivery.passRequired && !$('password').value) missingFields.push(getLabel('password'));
	}
	switch (missingFields.length) {
		case 0:
			result = true;
			break;
		case 1:
			result = false;
			message = translateFormat("%@ is required.",
				missingFields[0]);
			break;
		case 2:
			result = false;
			message = translateFormat("%@ and %@ are required.",
				missingFields[0],missingFields[1]);
			break;
		default:
			result = false;
			message = translateFormat("%@, %@, and %@ are required.",
				missingFields[0],missingFields[1],missingFields[2]);
			break;
	}
	$('delivery-info').innerText = message;
	return result;
}

function getLabel (field) {
	var label = $(field+'label').innerText;
	return label.replace(/:$/i,'');
}

function saveDelivery (delivery) {

	if (!delivery.id) delivery.id = getUUID();
	if (window.widget) {

		var now = getUnixTime();
		$('no').value = trim($('no').value);
		$('extra').value = trim($('extra').value);

		widget.setPreferenceForKey($('name').value,delivery.id+'-itemname');
		widget.setPreferenceForKey($('from').value,delivery.id+'-store');
		widget.setPreferenceForKey($('from').value,'store');
		widget.setPreferenceForKey($('no').value,delivery.id+'-orderno');
		widget.setPreferenceForKey($('extra').value,delivery.id+'-email');
		widget.setPreferenceForKey($('extra').value,$('from').value+'-email');
		widget.setPreferenceForKey(now,delivery.id+'-modified');
		widget.setPreferenceForKey(null,delivery.id+'-lastupdated');

		if ($('from').value == 'other' && $('month').value) {

			var date = new Date();
			var month = $('month').value;
			var day = ($('day').value) ? $('day').value : 1;
			var year = ($('year').value) ? $('year').value : date.getFullYear();
			date = new Date(year,month,day,9,0,0,0);

			month = date.getMonth() + 1;
			month = (month < 10) ? '0'+month : month;
			day = date.getDate();			
			day = (day < 10) ? '0'+day : day;
			year = date.getFullYear();
			date = year+'-'+month+'-'+day;

			widget.setPreferenceForKey(date,delivery.id+'-date');
			widget.setPreferenceForKey(null,delivery.id+'-htmlhash');
			widget.setPreferenceForKey(null,delivery.id+'-htmldate');
			
		} else widget.setPreferenceForKey(null,delivery.id+'-date');

		if ($('password').value) {
			DeliveryStatus.setPassword($('from').value,$('extra').value,$('password').value);
			if (delivery.changedPassword) {
				var shouldUpdate = false;
				for (var i in deliveries) {	
					if (deliveries[i].id != delivery.id &&
						deliveries[i].from == $('from').value && 
						deliveries[i].extra == $('extra').value) {
						deliveries[i].password = $('password').value;
						deliveries[i].nextUpdate = 0;
						deliveries[i].backgroundUpdate = 0;
						shouldUpdate = true;
					}
				}
				if (shouldUpdate) updateDeliveries(0,true);
			}
			$('password').value = '';
		}

		updateHistory(delivery.id);
		extraEdited = false;

	}

	delivery = prepareDelivery(delivery.id,false);
	updateQueue.add(delivery);
	updateQueue.updateIfIdle();
	syncDelivery(delivery.id,'add',0);

}

function saveHTML (delivery) {
	if (window.widget) {
		widget.setPreferenceForKey(delivery.htmlhash,delivery.id+'-htmlhash');
		widget.setPreferenceForKey(delivery.htmldate,delivery.id+'-htmldate');
	}
}

function prepareDelivery (id,deleteIt) {

	var delivery;
	var i = getIndex(id);

	if (deleteIt) {
		if (i >= 0) {
			deliveries.splice(i,1);
			closeQueue.push($(id));
		}	
	} else {
		if (i >= 0) {
			delivery = loadDelivery(id,i);			
		} else {
			delivery = loadDelivery(id,-1);
			deliveries.unshift(delivery);
			if (delivery.unfrozen) displayItem(delivery.id,delivery.displayed,false);
			updateUseCount(delivery.from);
		}
	}
	saveDeliveries();
	return delivery;

}

function saveDeliveries () {
	var list = [];
	for (var i in deliveries) list[i] = deliveries[i].id;
	list = list.join(';');
	widget.setPreferenceForKey(list,'deliveries');
	updateStatusBoard();
}


// notifications


function checkNotifications () {

	localNotifications = (widget.preferenceForKey('localnotifications')) ? 
		parseInt(widget.preferenceForKey('localnotifications')) : notificationType.none;

	if (localNotifications == notificationType.none && widget.preferenceForKey('usegrowl')) {
		localNotifications = notificationType.growl;
		widget.setPreferenceForKey(localNotifications,'localnotifications');
		widget.setPreferenceForKey(null,'usegrowl');
	}

	var notificationCenterAvailable = (DeliveryStatus.notificationCenterAvailable()) ? true : false;
	if (localNotifications == notificationType.notificationCenter && !notificationCenterAvailable) localNotifications = notificationType.none;
	var growlAvailable = (DeliveryStatus.growlAvailable()) ? true : false;
	if (localNotifications == notificationType.growl && !growlAvailable) localNotifications = notificationType.none;

	var popup = $('notifications');
	while (popup.hasChildNodes()) popup.removeChild(popup.firstChild);
	popup.options[0] = new Option(translate('Off'),notificationType.none);
	var optCount = 1;
	if (notificationCenterAvailable) {
		popup.options[optCount] = new Option(translate('Notification Center'),notificationType.notificationCenter);
		optCount++;
	}
	if (growlAvailable) {
		popup.options[optCount] = new Option(translate('Growl'),notificationType.growl);
		optCount++;
	}
	$('notifications').value = localNotifications;
	if (optCount == 1) $('notificationsField').className = 'disabled';
	selectNotifications(false);

	// Don't change the push setting, just disable it, so it's not turned off unexpectedly
	/* pushEnabled = (widget.preferenceForKey('usepush')) ? true : false;
	$('push').checked = pushEnabled;
	if (syncEnabled()) {
		$('push').disabled = false;
		$('pushField').className = '';
	} else {
		$('push').disabled = true;
		$('pushField').className = 'disabled';
	} */

}

function selectNotifications (userSelected) {
	var i = $('notifications').selectedIndex;
	var thisOption = $('notifications').options[i];
	if (thisOption) $('notifications-text').innerText = thisOption.innerText;
	if (userSelected && parseInt($('notifications').value) == notificationType.notificationCenter) setNotifierPath();
}

function setNotifierPath () {
	notifierPath = appleScriptEscape(DeliveryStatus.notifierPath());
}

function activeUse () {
	// If Dashboard is open and the computer has been used in the past minute, it's active
	var result = false;
	if (dashboardActive) {
		var idleTime = DeliveryStatus.getIdleTime();
		if (idleTime < 60) result = true;
	}
	return result;
}

function checkForChanges (delivery) {

	var useNotificationCenter = (localNotifications == notificationType.notificationCenter && notifierPath) ? true : false;
	var useGrowl = (localNotifications == notificationType.growl && DeliveryStatus.growlAvailable()) ? true : false;

	if (delivery.success > 0) {

		var now = (new Date()).getTime();
		var yesterday = now - 86400000;
		var emptyStatus = [translate('Shipped!'),translate('Ship date unknown')];
		var hasError = (delivery.success < 2);
		var key = (hasError) ? delivery.id+'-error' : delivery.id+'-status';
		var newUpdates = [];
		var lastUpdates = (widget.preferenceForKey(key)) ? JSON.parse(widget.preferenceForKey(key)) : [];

		for (var x in delivery.items) {

			var item = delivery.items[x];

			// 1: status change
			// 2: delivered
			// 3: error
			// 4: new version

			var type = 1;
			if (hasError) {
				type = 3;
			} else if (item.status.match(/^complete$/i)) {
				type = 2;
			}

			var lastUpdate = lastUpdates[x];
			var lastArray = (lastUpdate) ? lastUpdate.split(';') : [];
			var lastStatus = (lastArray[1]) ? lastArray[1] : '';
			var lastDate = lastArray[2];
			var lastStatusDate = lastArray[3];
			var lastType = lastArray[4];

			var compareItem = item.title.replace(/[;]/g,'');
			var compareStatus = formatLine(item.shipText,item.shipDate,relativeDate.none,false,true).replace(/[:;,.]/g,'');
			if (delivery.from == 'other') compareStatus = delivery.htmldate;
			var compareDate = item.date;
			var compareStatusDate = item.statusDate;
			var compareType = type;

			var thisUpdate = [compareItem,compareStatus,compareDate,compareStatusDate,compareType].join(';');
			var realUpdate = thisUpdate; // Only needed for debugging

			var ratio = 0;
			var changed = false;

			// First check to see if this exact status was displayed for a different item before.
			// If it was we assume the items were just reordered, and don't show anything, just save the new status.

			if (lastUpdates.indexOf(thisUpdate) == -1) {

				// Ignore dates in the past and (essentially) empty status updates
				if (compareDate < yesterday && lastDate) compareDate = lastDate;
				// Once we start picking up the time, copy over the previous status if the date and time are exact
				// This would fix problems with DHL Express, PostNL, possibly others
				if (lastStatus && emptyStatus.indexOf(compareStatus) != -1) {
					compareStatus = lastStatus;
					compareStatusDate = lastStatusDate;
					compareType = lastType;
				}
				thisUpdate = [compareItem,compareStatus,compareDate,compareStatusDate,compareType].join(';');

				if (hasError) {

					var ratio = diffRatio(lastStatus,compareStatus);
					if (ratio < 0.72) changed = true; // Status changed significantly
					// if (changed) alert ('Error text changed ('+delivery.no+')');

				} else if (delivery.from == 'other') { // Other delivery

					if (compareStatus && compareStatus != lastStatus) changed = true;
					// if (changed) alert ('Other text changed ('+delivery.no+')');

				} else if (compareType == 2 && lastType != 2) { // Changed to delivered

					changed = true;
					// alert('Delivered status changed ('+delivery.no+')');

				} else if (compareDate && compareDate != lastDate) { // Ship or delivery date changed

					changed = true;
					// alert('Ship or delivery date changed ('+delivery.no+')');

				} else {
					var ratio = diffRatio(lastStatus,compareStatus);
					if (ratio < 1) {

						// Status changed significantly or the status date changed
						// Ignore 0.72 and above, display 0.72 and below, must display 0.62 and below
						if (!delivery.ignoreText && ratio < 0.72) {

							changed = true;
							// alert('Ratio is less than 0.72 ('+ratio+' for '+delivery.no+')');

						} else if (compareStatusDate && compareStatusDate != lastStatusDate) {

							changed = true;
							// alert('Status date changed ('+ratio+' for '+delivery.no+')');

						}

					}
				}

			} else {

				// if (lastUpdates.indexOf(thisUpdate) != x) alert('Item found in a different position ('+delivery.no+')');

			}

			if (changed) {

				// alert('Last updates: '+lastUpdates.join('\n'));
				// alert('This update: '+thisUpdate);

				// Attempt to set lastUpdated for deliveries that don't include the status date
				if (delivery.lastUpdated == 0) {
					delivery.lastUpdated = now;
				 } else if (item.statusDate == false) {
				 	if (now > delivery.lastUpdated) delivery.lastUpdated = now;
				}

				var inuse = activeUse();
				// if (inuse) alert('In use?');

				var title = removeHtmlEntities(item.title);
				var status = formatLine(item.shipText,item.shipDate,relativeDate.any,false,true)+' \n'+
					formatLine(item.deliverText,item.deliverDate,relativeDate.any,false,true);

				if (!inuse) {
					if (useNotificationCenter) {
						if (type <= 2) showNotification(title,status);
					} else if (useGrowl) {
						DeliveryStatus.sendGrowl(type,title,status,'Icon');
					}
					/* if (pushActive() && type <= 2) {

						// The limit for data is around 161 bytes
						// Display only fits around 150, 35 per line

						if (title.length > 33) title = title.substring(0,33)+'…';
						var charsLeft = 150 - title.length;
						if (status.length > charsLeft) status = status.substring(0,charsLeft)+'…';
						pushNotification('push',title+'\n'+status,delivery.id);

					} */
				}

			} else {

				if (thisUpdate != lastUpdate) alert('No notification! '+delivery.no+' ratio: '+ratio+
					'\nold: '+lastUpdate+'\nnew: '+realUpdate);

			}

			newUpdates.push(thisUpdate);
			if (item.statusDate > delivery.lastUpdated) delivery.lastUpdated = item.statusDate;

		}

		widget.setPreferenceForKey(delivery.lastUpdated,delivery.id	+'-lastupdated');
		widget.setPreferenceForKey(JSON.stringify(newUpdates),key);

	}

}

function diffRatio (oldText,newText) {
	var ratio = 0;
	if (oldText == newText) {
		ratio = 1;
	} else if (typeof oldText == 'string' && typeof newText == 'string') {
		var oldLines = difflib.stringAsLines(oldText.replace(/\s+/g,'\n'));
		var newLines = difflib.stringAsLines(newText.replace(/\s+/g,'\n'));
		var sm = new difflib.SequenceMatcher(oldLines,newLines);
		ratio = sm.quick_ratio();
	}
	return ratio;
}

function showNotification (title, message) {
	title = appleScriptEscape(title);
	message = appleScriptEscape(message);
	var thisCommand = widget.system("/usr/bin/osascript -e \"tell application \\\""+notifierPath+"\\\" to show notification \\\""+title+"\\\" with message \\\""+message+"\\\"\"",function(){});
	thisCommand.onreaderror = function(output){
		alert('Error sending notification: '+output);
	};
}

function pushNotification (cmd,data,id) {

	/* var pushData = 'cmd='+cmd+'&type=widget&version='+syncVersion+
		'&client='+encodeURIComponent(sync.client)+
		'&email='+encodeURIComponent(sync.email)+
		'&'+passwordOrCode()+
		'&data='+encodeURIComponent(data);
	if (id) pushData += '&id='+encodeURIComponent(id);
	var args = {method:'pushNotification',cmd:cmd,data:data,id:id};	

	alert('Sending notification: '+data);
	sync.loadPage('https://junecloud.com/sync/deliveries/push.php',false,pushData,args); */

}

function setStatusBoardPath () {
	statusBoardPath = (widget.preferenceForKey('status-board-path')) ? 
		widget.preferenceForKey('status-board-path') : false;
}

function updateStatusBoard () {
	if (statusBoardPath) {

		var output = '<table id="deliveries">';
		for (var i in deliveries) {

			var delivery = deliveries[i];
			var item = delivery.items[delivery.displayed];
			if (item) {

				var icon = item.icon;
				if (delivery.loading || (!icon && item.date == undefined)) {
					icon = 'loading';
				} else {
					var dayCount = getDaysApart(item.date);
					if (dayCount < 0 && !icon) icon = (delivery.from == 'other') ? 'checkmark' : 'transit';
				}

				output += '<tr>';
				output += '<td style="width: 20%; text-align: center;">';
				if (icon == 'checkmark') {
					output += '<div style="font-size:30pt;margin-bottom:-8pt;">✓</div>';
				} else if (icon == 'error') {
					output += '<div style="font-size:30pt;margin-bottom:-4pt;">!</div>';
				} else if (icon == 'transit') {
					output += '<div style="font-size:20pt;margin-bottom:-3pt;">—</div>';
				} else {
					output += (dayCount > 999) ? '999+' : dayCount;
					output += '<div style="font-size: 9pt; margin:8pt auto -8pt auto">';
					output += (dayCount == 1) ? translate('day') : translate('days');
					output += '</div>';
				}
				output += '</td>';
				output += '<td style="font-size: 11pt; line-height: 120%; text-transform: none">';
				output += '<div style="font-size:13pt">'+item.title+'</div>';
				output += formatLine(item.shipText,item.shipDate,relativeDate.any,false,true);
				output += '<br />';
				output += formatLine(item.deliverText,item.deliverDate,relativeDate.any,false,true);
				output += '</td>';
				output += '</tr>';

			}

		}
		output += '</table>';
		DeliveryStatus.writeString(output,statusBoardPath,'deliveries.html');

	}
}


// donations


function setDonated (getValue) {

	var value = false;
	if (getValue) {
		if (getDonated() + 1 >= installedVersion) value = true;
	} else {
		if ($('alreadydonated').checked) value = true;
	}
	if (value == true) {
		$('alreadydonated').checked = true;
		widget.setPreferenceForKey(installedVersion,'donated');
		$('donate-info').innerText = translate('Thank you for your donation! Your support allows us to keep making Delivery Status the best package tracking widget possible.');
	} else {
		$('alreadydonated').checked = false;
		widget.setPreferenceForKey(0,'donated');
		$('donate-info').innerText = translate('This widget is free, but it takes a lot of time to keep it working with so many different services. Please consider a small donation to help support Delivery Status!');
	}
	$('alreadydonatedlabel').innerText = translate('Check this box if you have donated.');

	displayAllItems();

}

function getDonated () {
	var donatedVersion = 0;
	if (window.widget) donatedVersion = widget.preferenceForKey('donated');
	return donatedVersion;
}

function openDonate () {
	openSite('http://junecloud.com/software/donate/');
}


// history


function populateHistory () {

	if (window.widget) {

		// var prefsVersion = widget.preferenceForKey('prefsversion');
		// if (prefsVersion < 5.0) widget.setPreferenceForKey(5.0,'prefsversion');

		// check for hidden historydays setting

		historyDays = (widget.preferenceForKey('historydays') > 0) ? widget.preferenceForKey('historydays') : 30;

		// populate the item history

		var history = (widget.preferenceForKey('history')) ? widget.preferenceForKey('history') : '';
		var historyArray = history.split(';');
		var newHistoryArray = [];

		var optCount = 1;
		var optSelected = 0;
		var popup = $('history');
		while (popup.hasChildNodes()) {
			popup.removeChild(popup.firstChild);
		}
		popup.options[0] = new Option('');

		for (var i in historyArray) {
			var id = historyArray[i];
			if (widget.preferenceForKey(id+'-store')) {

				var updated = widget.preferenceForKey(id+'-modified');
				if (!updated) {
					updated = getUnixTime();
					widget.setPreferenceForKey(updated,id+'-modified');
				}
				if (updated + (86400 * historyDays) > getUnixTime() || optCount <= 25) {

					newHistoryArray.push(id);
					var from = widget.preferenceForKey(id+'-store');
					var item = widget.preferenceForKey(id+'-orderno');
					if (id == editingDelivery.id) optSelected = optCount;

					if (widget.preferenceForKey(id+'-historytitle')) {
						item = widget.preferenceForKey(id+'-historytitle');
					} else if (widget.preferenceForKey(id+'-itemname')) {
						item = widget.preferenceForKey(id+'-itemname');
					}

					from = getFromName(from,true,false);
					popup.options[optCount] = new Option(limitText(from+': '+item,65),id);
					optCount++;

				} else removeDelivery(id);

			} else removeDelivery(id);
		}
		if (popup.options.length > 1) {
			popup.options[optCount] = new Option(translate('Clear History'),'Clear History');
			var newElement = document.createElement('hr');
			popup.insertBefore(newElement,popup.options[optCount]);
		}
		popup.options[optSelected].selected = true;
		setSelect('history',false);
		history = newHistoryArray.join(';');
		widget.setPreferenceForKey(history,'history');

	}

}

function limitText (string, length) {
	if (string.length > length) string = string.substr(0,length-1)+'…';
	return string;
}

function loadHistory (id) {
	if (id == 'Clear History') {

		$('history-text').innerText = '';
		var history = (widget.preferenceForKey('history')) ? widget.preferenceForKey('history') : '';
		var historyArray = history.split(';');
		var newHistory = [];
		for (var i in historyArray) {
			if (!removeDelivery(historyArray[i])) newHistory.push(historyArray[i]);
		}
		widget.setPreferenceForKey(newHistory.join(';'),'history');
		populateHistory();

	} else {

		setSelect('history',false);
		
		if (id) {
			if (!editingDelivery.id) {
				if (getIndex(id) >= 0) {
					editingDelivery.id = getUUID();
				} else editingDelivery.id = id;
			}
	
			var from = (widget.preferenceForKey(id+'-store')) ? 
				widget.preferenceForKey(id+'-store') : 'www.amazon.com';
	
			// Make sure the "from" menu includes the selected service
			if (!showAll) showServices(from,false);
	
			$('name').value = (widget.preferenceForKey(id+'-itemname')) ? 
				widget.preferenceForKey(id+'-itemname') : '';
			$('from').value = from;
			$('extra').value = (widget.preferenceForKey(id+'-email')) ? 
				widget.preferenceForKey(id+'-email') : '';
			$('no').value = (widget.preferenceForKey(id+'-orderno')) ? 
				widget.preferenceForKey(id+'-orderno') : '';
			if ($('extra').value) $('password').value = getPassword($('from').value,$('extra').value);
	
	
			var dateString = (widget.preferenceForKey(id+'-date')) ? 
				widget.preferenceForKey(id+'-date').toString().replace(/-/g,'/') : '';
	
			if (dateString) {
				var date = new Date(dateString);
				setSelect('month',date.getMonth());
				setSelect('day',date.getDate());
				setSelect('year',date.getFullYear());
			} else {
				setSelect('month','');
				setSelect('day','');
				setSelect('year','');
			}
	
			extraEdited = true;
			updateEditForm($('from').value);
		}

	}
}

function updateHistory (id) {
	if (window.widget && id) {

		var history = (widget.preferenceForKey('history')) ? widget.preferenceForKey('history') : '';
		var historyArray = history.split(';');

		var orderFound = false;
		for (var i in historyArray) {
			if (id == historyArray[i]) {
				orderFound = true;
				if (i > 0) {
					historyArray.splice(i,1);
					orderFound = false;
				}
				break;
			}
		}
		if (!orderFound) historyArray.unshift(id);
		history = historyArray.join(';');
		widget.setPreferenceForKey(history,'history');

	}
}

function removeDelivery (id) {
	var removed = false;
	if (id && getIndex(id) == -1) {
		widget.setPreferenceForKey(null,id+'-itemname');
		widget.setPreferenceForKey(null,id+'-store');
		widget.setPreferenceForKey(null,id+'-orderno');
		widget.setPreferenceForKey(null,id+'-email');
		widget.setPreferenceForKey(null,id+'-size');
		widget.setPreferenceForKey(null,id+'-displayed');
		widget.setPreferenceForKey(null,id+'-error');
		widget.setPreferenceForKey(null,id+'-status');
		widget.setPreferenceForKey(null,id+'-historytitle');
		widget.setPreferenceForKey(null,id+'-date');
		widget.setPreferenceForKey(null,id+'-htmlhash');
		widget.setPreferenceForKey(null,id+'-htmldate');
		widget.setPreferenceForKey(null,id+'-modified');
		widget.setPreferenceForKey(null,id+'-saved');
		widget.setPreferenceForKey(null,id+'-lastupdated');

		// No longer used as of 6.0, remove this in the future
		widget.setPreferenceForKey(null,id+'-html');
		// No longer used as of 5.5
		widget.setPreferenceForKey(null,id+'-item');
		widget.setPreferenceForKey(null,id+'-items');

		removed = true;
	}
	return removed;
}


// version checking


function getCurrentVersion () {

	var request = new XMLHttpRequest();
	request.open('GET','Info.plist',false);
	request.send();

	var nodes = request.responseXML.getElementsByTagName('dict')[0].childNodes;
	var nodeLength = nodes.length;
	for (var i = 0; i < nodeLength; i++) {
		if (nodes[i].nodeType == 1 && nodes[i].tagName.toLowerCase() == 'key') {
			if (nodes[i].firstChild.data == 'CFBundleShortVersionString') {
				readableVersion = nodes[i+2].firstChild.data;
			} else if (nodes[i].firstChild.data == 'CFBundleVersion') {
				var result = nodes[i+2].firstChild.data;
				result = result.replace(/([0-9]+)\.([0-9]+)\.([0-9]+)/,'$1.$2$3');
				installedVersion = currentVersion = parseFloat(result);				
			}
		} 
	} 

}

function checkVersion (days,skipDismissed) {

	var lastVersionCheck = (widget.preferenceForKey('lastversioncheck')) ? 
		widget.preferenceForKey('lastversioncheck') : 0;
	var dismissedUpdate = (widget.preferenceForKey('dismissedupdate')) ? 
		widget.preferenceForKey('dismissedupdate') : 0;
	var currentTime = (new Date()).getTime();

	if (skipDismissed || !dismissedUpdate || dismissedUpdate + (86400000 * dismissDays) < currentTime) {
		if (lastVersionCheck + (86400000 * days) < currentTime) {
			checkVersionNow();
		} else {
			currentVersion = (widget.preferenceForKey('currentversion')) ? 
				parseFloat(widget.preferenceForKey('currentversion')) : installedVersion;
			if (currentVersion > installedVersion) showUpdateBadge();
		}
	}

}

function checkVersionNow () {
	sync.loadPage('https://junecloud.com/software/mac/version.php',getVersion,'id='+appId,false);
}

function getVersion () {

	var currentTime = (new Date()).getTime();
	widget.setPreferenceForKey(currentTime,'lastversioncheck');

	if (this.status == 200 && this.responseXML) {
		for (var child = this.responseXML.firstChild; child != null; child = child.nextSibling) {
			if (child.nodeName == 'versionstatus') {
				var itemlist = child;
				for (var item = itemlist.firstChild; item != null; item = item.nextSibling) {
					if (item.nodeName == 'version') {
						currentVersion = parseFloat(item.getAttribute('value'));
						widget.setPreferenceForKey(currentVersion,'currentversion');
					} else if (item.nodeName == 'download') {
						downloadUrl = item.getAttribute('value');
					}
				}
				break;
			}
		}
	}

	if (currentVersion > installedVersion) {
		showUpdateBadge();
		if (localNotifications == notificationType.growl) DeliveryStatus.sendGrowl(4,'Delivery Status',
			translate('A new version of Delivery Status is available!'),'Icon');
	}

	this.reqComplete++;
	return;

}

function showUpdateBadge () {
	$('getupdate').href = downloadUrl;
	$('getupdate').innerHTML = translate('New version!');
	$('getupdate').title = translate('A new version of Delivery Status is available! Click here to download it.');
	$('updatebox').className = 'available';
}

function dismissUpdate () {
	var now = new Date();
	if (window.widget) widget.setPreferenceForKey(now.getTime(),'dismissedupdate');
	$('updatebox').className = '';
}


// cookie request functions


function loadCookiePage (url,method,postData,args) {

	var reqNo = this.reqCount;
	this.reqCount++;

	var request = {};
	request.abort = function(){};
	request.checkForData = checkForData;
	request.getTracker = getTracker;
	request.delivery = this;
	request.runCount = 0;
	request.id = this.id;
	request.args = (args) ? args : [];
	request.url = url;
	request.startTime = new Date();
	request.oncomplete = method;
	if (!postData) postData = null;

	this.req[reqNo] = request;

	var encoding = (this.encoding) ? this.encoding : null;
	var noCache = (this.noCache) ? true : false;
	var userAgent = (this.mobileUserAgent) ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B179 Safari/7534.48.3' : navigator.userAgent;
	request.resultId = DeliveryStatus.loadWebPage(url,postData,encoding,noCache,userAgent);
	if (!request.resultId) request.runCount = 100; // Fail immediately if there's no resultId
	setTimeout(function(){ request.checkForData() },300);

}

function checkForData () {

	var result;
	if (this.resultId && this.id) result = DeliveryStatus.getWebPageForId(this.resultId);

	// Get data or time out after 30 seconds (300ms x 100)
	if (!result && this.runCount >= 100) result = '503';
	if (result) {

		if (result.match(/^[0-9]+$/)) {
			this.responseText = '';
			this.status = parseInt(result,10);
			if (this.status = 503) this.oncomplete = connectFailed;
		} else {
			this.responseText = result;
			this.status = 200;
		}

		switch (this.oncomplete) {
			case connectFailed:
				var connectionDown = (secondsSince(this.startTime) < 60);
				this.delivery.connectFailed(connectionDown);
				break;
			case getAdobe:
				this.getAdobe = getAdobe;
				this.getAdobe();
				break;
			case sessionAmazon:
				this.sessionAmazon = sessionAmazon;
				this.sessionAmazon(); 
				break;
			case getAmazon:
				this.sessionAmazon = sessionAmazon;
				this.getAmazon = getAmazon;
				this.getAmazon(); 
				break;
			case getGoogle:
				this.getGoogle = getGoogle;
				this.getGoogle();
				break;
			case getTracker:
				this.getTracker();
				break;
		}

	} else {
		this.runCount++;
		var request = this;
		setTimeout(function(){ request.checkForData() },300);
	}

}


// syncing


function startSyncNow () {
	sync.force = true;
	startSync();
}

function changedSyncEmail () {
	if ($('cmd').value == 'login') $('syncpassword').value = 
		($('syncemail').value) ? getPassword('junecloud.com',$('syncemail').value) : '';
}

function setSync (cmd) {

	$('cmd').value = cmd;

	if (sync.success && sync.email) {
		$('login-type').innerText = translate('Syncing with Junecloud');
		$('login-info').innerText = translateFormat('You are currently signed in as %@',sync.email);
		selectTab('sync signedin');
	} else {
		if (cmd == 'register') {
			$('syncemail').value = '';
			$('syncpassword').value = '';
			$('syncconfirm').value = '';
			$('syncname').value = '';
			$('syncterms').checked = false;
			$('sync-info').innerText = translate('Sign in to your Junecloud account to sync with any Mac, iPhone, iPad, iPod touch, or web browser. Data will be synced securely through junecloud.com.');
			selectTab('sync register');
		} else selectTab('sync signin');
	}

}

function saveSync () {

	if (!$('syncemail').value) {
		$('sync-info').innerText = translate('Please enter your email address.');
	} else if (!$('syncpassword').value) {
		$('sync-info').innerText = translate('Please enter your password.');
	} else if ($('cmd').value == 'register' && $('syncpassword').value != $('syncconfirm').value) {
		$('sync-info').innerText = translate('Both password fields must match.');
	} else if ($('cmd').value == 'register' && !$('syncterms').checked) {
		$('sync-info').innerText = translate('You must agree to the Terms of Service to continue.');
	} else {

		sync.email = $('syncemail').value;
		sync.password = true;

		widget.setPreferenceForKey(sync.email,'syncemail');
		DeliveryStatus.setPassword('junecloud.com',sync.email,$('syncpassword').value);

		var syncData = 'cmd='+$('cmd').value+'&type=widget&version='+syncVersion+'&osversion='+macOSVersion()+
			'&client='+encodeURIComponent(sync.client)+
			'&updated='+encodeURIComponent(sync.updated)+
			'&now='+encodeURIComponent(getUnixTime())+
			'&email='+encodeURIComponent($('syncemail').value);

		if ($('cmd').value == 'register') {

			sync.first = 1;
			syncData += '&newpassword='+encodeURIComponent($('syncpassword').value)+
				'&confirmpass='+encodeURIComponent($('syncconfirm').value)+
				'&name='+encodeURIComponent($('syncname').value);
			if ($('syncterms').checked) syncData += '&terms=1';

		} else {

			sync.first = 2;
			syncData += '&password='+encodeURIComponent($('syncpassword').value);

		}

		showMessage(translate('Syncing with Junecloud…'));
		$('sync-info').innerHTML = translate('Syncing with Junecloud…');
		sync.loadPage('https://junecloud.com/sync/deliveries/xml.php',getSyncResult,syncData,false);

	}

}

function syncEnabled () {
	return (sync.email && sync.password) ? true : false;
}

function pushActive () {
	// TODO: remove
	return false;
	// return (pushEnabled && syncEnabled()) ? true : false;
}

function passwordOrCode () {
	return (sync.code) ? 'code='+encodeURIComponent(sync.code) : 
		'password='+encodeURIComponent(getPassword('junecloud.com',sync.email));
}

function timeForSync () {
	var result = false;
	if (syncEnabled()) {
		if (sync.force) {
			result = true;
			sync.force = false;
		} else if (sync.failures >= 5) {
			result = false;
		} else {
			var now = getUnixTime() - sync.offset;
			var inuse = activeUse();
			var syncInterval = (inuse) ? 300 : 1800;
			if (now > sync.updated + syncInterval) result = true;
		}
	}
	return result;
}

function syncDelivery (id,cmd,date) {
	if (syncEnabled()) {

		var modified = date;
		if (!modified && widget.preferenceForKey(id+'-modified')) modified = 
			parseFloat(widget.preferenceForKey(id+'-modified')) - sync.offset;

		var syncData = 'cmd='+cmd+'&type=widget&version='+syncVersion+'&osversion='+macOSVersion()+'&defs='+defsVersion+
			'&client='+encodeURIComponent(sync.client)+
			'&updated='+encodeURIComponent(sync.updated)+
			'&now='+encodeURIComponent(getUnixTime())+
			'&email='+encodeURIComponent(sync.email)+
			'&'+passwordOrCode()+
			'&uuid='+encodeURIComponent(id);
		if (modified) syncData += '&modified='+modified;

		if (cmd == 'add') {
			syncData += '&from='+encodeURIComponent(widget.preferenceForKey(id+'-store'))+
				'&name='+encodeURIComponent(widget.preferenceForKey(id+'-itemname'))+
				'&no='+encodeURIComponent(widget.preferenceForKey(id+'-orderno'))+
				'&extra='+encodeURIComponent(widget.preferenceForKey(id+'-email'));
			if (widget.preferenceForKey(id+'-date'))
				syncData += '&date='+encodeURIComponent(widget.preferenceForKey(id+'-date'));
		}

		showMessage(translate('Syncing with Junecloud…'));
		$('sync-info').innerHTML = translate('Syncing with Junecloud…');

		var args = {method:'syncDelivery',cmd:cmd,id:id,date:modified};
		sync.loadPage('https://junecloud.com/sync/deliveries/xml.php',getSyncResult,syncData,args);

	}
}

function appleScriptEscape (string) {
	if (typeof string != 'string') string = '';
	string = string.replace(/\\/g,'\\\\\\\\');
	string = string.replace(/\"/g,'\\\\\\"');
	string = string.replace(/\$/g,'\\$');
	string = string.replace(/\`/g,'\\`');
	return string.replace(/(\r\n|\r|\n)/g,'\n');
}

function queueDelivery (id,cmd,date) {
	var modified = date;
	if (!modified && widget.preferenceForKey(id+'-modified')) modified = 
		parseFloat(widget.preferenceForKey(id+'-modified')) - sync.offset;
	var item = {method:'syncDelivery',cmd:cmd,id:id,date:modified};
	syncQueue.push(item);
}

function addBackToQueue (item) {
	if (item) {
		for (i in syncQueue) {
			if (syncQueue[i].method == item.method && 
				syncQueue[i].id == item.id) {
				syncQueue.splice(i,1);
				break;	
			}
		}
		syncQueue.push(item);
	}
}

function removeFromQueue (id,olderThan) {
	for (var i in syncQueue) {
		if (syncQueue[i].id == id) {
			if (syncQueue[i].date < olderThan) {
				syncQueue.splice(i,1);
				return true;
			} else return false;
		}
	}
	return true;
}

function startSync () {

	var syncNow = false;
	var loggedIn = false;
	
	if (syncEnabled()) {
		if (syncQueue.length || timeForSync()) syncNow = true;
		loggedIn = true;
	} else {
		var currentTime = getUnixTime();		
		// If syncing is disabled, update once a week,
		// or once a day if there are errors
		if (currentTime >= defsUpdate + 604800) {
			syncNow = true;
		} else if (currentTime >= defsUpdate + 86400) {
			for (var i in deliveries) {
				if (deliveries[i].success < 2) {
					syncNow = true;
					break;
				}
			}
		}
	}

	sync.updateAfter = true;
	if (syncNow) {
		if (!continueSync()) {
			var syncData = 'type=widget&version='+syncVersion+'&osversion='+macOSVersion()+'&defs='+defsVersion;
			if (loggedIn) {
				syncData += '&cmd=get&client='+encodeURIComponent(sync.client)+
					'&updated='+encodeURIComponent(sync.updated)+
					'&now='+encodeURIComponent(getUnixTime())+
					'&email='+encodeURIComponent(sync.email)+
					'&'+passwordOrCode();
				showMessage(translate('Syncing with Junecloud…'));
				$('sync-info').innerHTML = translate('Syncing with Junecloud…');
			} else showMessage(translate('Updating service definitions…'));
			sync.loadPage('https://junecloud.com/sync/deliveries/xml.php',getSyncResult,syncData,false);
		}
	} else syncFinish();

}

function shouldContinue () {
	return (sync.success && syncQueue.length) ? true : false;
}

function continueSync () {
	var didContinue = false;
	if (shouldContinue()) {
		var item = syncQueue.shift();
		if (item.method == 'syncDelivery') {
			syncDelivery(item.id,item.cmd,item.date);
		} else if (item.method == 'pushNotification') {
			pushNotification(item.cmd,item.data,item.id);
		}
		didContinue = true;
	}
	return didContinue;
}

function searchArray (needle,haystack) {
	result = false;
	for (var i in haystack) {
		if (needle == haystack[i]) {
			result = true;
			break;
		}
	}
	return result;
}

function getSyncResult () {

	var success = false;
	var retry = false;
	var updateData;
	var updateSignature;
	var updateVersion;

	if (this.status == 200 && this.responseXML) {
		for (var child = this.responseXML.firstChild; child != null; child = child.nextSibling) {
			if (child.nodeName == 'result') {
				var items = child;
				for (var item = items.firstChild; item != null; item = item.nextSibling) {

					if (item.nodeName == 'client') {

						sync.client = item.getAttribute('value');
						if (window.widget) widget.setPreferenceForKey(sync.client,widget.identifier+'-syncclient');

					} else if (item.nodeName == 'code') {

						sync.code = item.getAttribute('value');
						// DeliveryStatus.setPassword('junecloud.com',appId,sync.code);

					} else if (item.nodeName == 'message') {

						var message = translate(item.getAttribute('value'));
						if (message) showMessage(message);
						$('sync-info').innerHTML = message.replace(/…$/,'.').replace(/・・・$/,'');

					} else if (item.nodeName == 'success') {

						if (item.getAttribute('value') == 'true') {
							success = true;
							if (sync.first == 2) {
								for (var i in deliveries) queueDelivery(deliveries[i].id,'add',0);
							}
						} else {
							if (this.args) addBackToQueue(this.args);
							if (item.getAttribute('retry') == 'true') {
								retry = true;
							} else if (!sync.code) {
								showInfo('sync signin');
								setSync('login');
							}
						}

					} else if (item.nodeName == 'updated') {

						sync.updated = parseInt(item.getAttribute('value'),10);
						if (window.widget) widget.setPreferenceForKey(sync.updated,'syncupdated');

					} else if (item.nodeName == 'offset') {

						sync.offset = parseFloat(item.getAttribute('value'));
						if (window.widget) widget.setPreferenceForKey(sync.offset,'syncoffset');

					} else if (item.nodeName == 'delivery') {

						var id = (item.getAttribute('uuid')) ? item.getAttribute('uuid') : getUUID();
						var updated = (item.getAttribute('updated')) ? item.getAttribute('updated') : 0;

						if (removeFromQueue(id,updated)) {

							var from = item.getAttribute('from');
							var name = item.getAttribute('name');
							var no = item.getAttribute('no');
							var extra = item.getAttribute('extra');
							var date = item.getAttribute('date');
							var deleted = (item.getAttribute('deleted') > 0) ? true : false;
							var service = false;

							if (deleted) {
								prepareDelivery(id,true);
							} else if (service = setService(false,from,no)) {
								if (window.widget) {
									var now = getUnixTime();
									widget.setPreferenceForKey(service.from,id+'-store');
									widget.setPreferenceForKey(name,id+'-itemname');	
									widget.setPreferenceForKey(no,id+'-orderno');
									widget.setPreferenceForKey(extra,id+'-email');
									widget.setPreferenceForKey(now,id+'-modified');
									if (from == 'other') widget.setPreferenceForKey(date,id+'-date');
								}
								updateHistory(id);
								prepareDelivery(id,false);
								sync.updateAfter = true;
							}

						}

					} else if (item.nodeName == 'updatedata') {

						updateData = item.textContent;
						updateSignature = item.getAttribute('signature');
						updateVersion = parseInt(item.getAttribute('version'));

					}
				}
				break;
			}
		}
		sync.failures = (!success && !retry) ? sync.failures + 1 : 0;
	}

	sync.success = success;
	sync.retry = retry;
	if (currentSide == 'front') animateQueues();

	var willContinue = false;
	if (sync.success) {
		if (currentSide == 'back' && currentView.split(' ')[0] == 'sync') setSync('login');
		sync.first = (sync.first == 1) ? 2 : 0;
	}
	if (updateData) {
		verifyUpdateData(updateData,updateSignature,updateVersion);
	} else {
		markDefsUpdated();
		syncFinish();
	}

}

function syncFail (item) {
	addBackToQueue(item);
	sync.success = false;
	syncFinish();
}

function syncFinish () {
	if (shouldContinue()) {
		continueSync();
	} else if (!sync.success && sync.retry) {
		// DeliveryStatus.deletePassword('junecloud.com',appId);
		sync.code = '';
		startSyncNow();
	} else {
		if (sync.updateAfter) {
			updateDeliveries(0,true);
			sync.updateAfter = false;
		} else showTime(false);
		if (window.widget && typeof JSON.stringify == 'function') {
			if (syncQueue.length) {
				widget.setPreferenceForKey(JSON.stringify(syncQueue),'syncqueue');
			} else widget.setPreferenceForKey(null,'syncqueue');
		}
	}
}

function logOut (tellServer) {
	// TODO: minor issue: sync client is added back when the server responds to the logout request.
	if (tellServer) {
		syncDelivery('','logout',0);
	} else $('sync-info').innerText = '';
	// DeliveryStatus.deletePassword('junecloud.com',appId);
	if (window.widget) {
		widget.setPreferenceForKey(null,'syncemail');
		widget.setPreferenceForKey(null,widget.identifier+'-syncclient');
		widget.setPreferenceForKey(null,'syncupdated');
	}
	sync.email = '';
	sync.password = false;
	sync.client = '';
	sync.code = '';
	sync.updated = 0;
	sync.success = false;
	sync.failures = 0;
	$('syncemail').value = '';
	$('syncpassword').value = '';
	setSync('login');
}

function verifyUpdateData ( updateData, updateSignature, updateVersion ) {

	if (DeliveryStatus.canVerifySignature()) {

		alert('Verifying service update with signature');
		if (DeliveryStatus.verifyString(updateData,updateSignature)) {
			saveUpdateData(updateData,updateVersion);
		} else alert('Update signature could not be verified!');
		syncFinish();

	} else {

		alert('Verifying with MD5');
		sync.loadPage('http://verify.junecloud.com/'+updateVersion,function(){
				if (DeliveryStatus.getMD5(updateData) == this.responseText) {
					saveUpdateData(updateData,updateVersion);
				} else alert('Update MD5 does not match!');
				syncFinish();
			},false,false);

	}

}

function saveUpdateData (updateData,updateVersion) {
	var defsPath = DeliveryStatus.saveDefinitions(updateData);
	if (defsPath) {
		alert('Installed service update '+updateVersion);
		markDefsUpdated();
		defsVersion = updateVersion;
		if (window.widget) {
			widget.setPreferenceForKey(defsVersion,'defs');
			widget.setPreferenceForKey(defsPath,'defspath');
		}
		if (document.getElementsByTagName('head')[0].removeChild($('definitions'))) {
			loadDefinitions('file://'+encodeURI(defsPath),false);
		}
	}
}

function markDefsUpdated () {
	defsUpdate = getUnixTime();
	if (window.widget) widget.setPreferenceForKey(defsUpdate,'defsupdate');
}

function loadDefinitions (src,firstLoad) {

	element = document.createElement('script'); 
	element.src = src + '?' + defsVersion;
	element.type = 'text/javascript';
	element.charset = 'utf-8';
	element.id = 'definitions';

	var loadAction;
	if (firstLoad) {
		loadAction = function(){ loadDeliveries(); };
	} else {
		loadAction = function(){
			for (var i in deliveries) deliveries[i].setUpdatableFunctions();
			updateDeliveries(2,true);
		};
	}
	element.onload = loadAction;

	document.getElementsByTagName('head')[0].appendChild(element);

}

function resetDefinitions () {
	DeliveryStatus.resetDefinitions();
	defsVersion = defsLocal;
	defsUpdate = 0;
	if (window.widget) {
		widget.setPreferenceForKey(null,'defs');
		widget.setPreferenceForKey(null,'defsupdate');
	}
}

// WebKit Version Detection
// http://trac.webkit.org/projects/webkit/wiki/DetectingWebKit

function webKitVersion () {
    var matches = RegExp(' AppleWebKit/([0-9.]+)').exec(navigator.userAgent);
    if (!matches || matches.length < 2) return null;
    var string = matches[1];
	// This will drop some numbers, but it's close enough. 530.19.2 becomes 530.19
    return parseFloat(string);
}

function macOSVersion () {
    var matches = RegExp("Mac OS X ([0-9_]+)").exec(navigator.userAgent);
    if (!matches || matches.length < 2) return '';
    return matches[1].split('_').join('.');
}