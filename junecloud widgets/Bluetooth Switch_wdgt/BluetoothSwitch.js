var blueStatus = 0;
var switchBusy = false;
var clickCount = 0;
var infoButton;
var doneButton;

function $(id) {
	return document.getElementById(id);
}

function setup () {
	createButtons();
	updateStatus();

	if (window.widget) {
		widget.ondragend = function() {
			infoButton.remove();
			doneButton.remove();
			createButtons();
		}
		widget.onshow = updateStatus;
		var openSaved = (widget.preferenceForKey(widget.identifier+"openafter")) ? widget.preferenceForKey(widget.identifier+"openafter") : "0";
		if (openSaved) openafter.options[openSaved].selected = true;		
	}

	$("openafterlabel").innerHTML = "Open:";
	var openMenu = $("openafter");
	openMenu.title = translate("Click here to select an application that will open after Bluetooth is enabled. It will not open when you turn off Bluetooth.");
	openMenu.options[0].innerText = translate("None");
	openMenu.options[1].innerText = translate("Bluetooth File Exchange");
	openMenu.options[2].innerText = translate("Bluetooth Preferences");
}

function createButtons () {
	infoButton = new AppleInfoButton($("infoButton"),$("front"),"white","white",showPrefs);
	doneButton = new AppleGlassButton($("doneButton"),translate("Done"),hidePrefs);
}

function translate (key) {
	try {
		var ret = translation[key];
		if (ret === undefined) ret = key;
		return ret;
	} catch (ex) { }
	return key;
}

function updateStatus () {
	if (window.widget) {
		blueStatus = -1;
		if (BluetoothSwitch) blueStatus = BluetoothSwitch.getBluetooth();
		displayStatus();
		return blueStatus;
	} else {
		displayStatus();
		return 0;
	}
}

function displayStatus () {
	$("icon").className = (blueStatus == 1) ? "on" : "off";
}

function getClick () {
	if (!clickCount) setTimeout(toggleBluetooth,500);
	clickCount++;
}

function toggleBluetooth () {
	if (clickCount > 1) {
		launchApp();
	} else if (window.widget && !switchBusy) {
		switchBusy = true;
		if (BluetoothSwitch) {
			var newStatus = (blueStatus) ? false : true;
			blueStatus = BluetoothSwitch.setBluetooth(newStatus);
			displayStatus();			
			if (blueStatus < 0) doError("check");
			switchBusy = false;
			if (blueStatus == 1) launchApp();
		}
	}
	clickCount = 0;
}

function doError (errorString) {
	var stringsPath = translate("en.lproj");
	widget.openApplication("com.apple.SystemPreferences");
	widget.system("/usr/bin/osascript BluetoothError.scpt "+errorString+" "+stringsPath,doNothing);
}

function launchApp () {
	if (openafter.value == "1") {
		widget.openApplication("com.apple.BluetoothFileExchange");
	} else if (openafter.value == "2") {
		widget.openApplication("com.apple.SystemPreferences");
		widget.system("/usr/bin/osascript -e 'tell application \"System Preferences\" to set current pane to pane \"Bluetooth\"'",doNothing);
	}
}

function doNothing () {}

function openSite (url) {
	var result = true;
	if (window.widget) {
		widget.openURL(url);
		result = false;
	}
	return result;
}

// hide and show preferences

function showPrefs () {
	if (window.widget) widget.prepareForTransition("ToBack"); // freeze the widget
	$("front").style.display = "none";
	$("back").style.display = "block";
	if (window.widget) {
		setTimeout("widget.performTransition()",0); // flip the widget over
		widget.setCloseBoxOffset(8,8);
	}
}

function hidePrefs () {
	if (window.widget) widget.setPreferenceForKey(openafter.value,widget.identifier+"openafter"); // save preferences
	if (window.widget) widget.prepareForTransition("ToFront"); // freeze the widget
	$("back").style.display = "none";
	$("front").style.display = "block";
	if (window.widget) {	
		setTimeout("widget.performTransition()",0); // flip back
		widget.setCloseBoxOffset(73,10);
	}
}