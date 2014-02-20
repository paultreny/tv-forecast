var fireStatus = 0;
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
	openMenu.title = translate("Click here to select an application that will open after the firewall is enabled. It will not open when you turn off the firewall.");
	openMenu.options[0].innerText = translate("None");
	openMenu.options[1].innerText = translate("Sharing Preferences");
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

function updateStatus (completionHandler) {
	if (window.widget) {

		var completeOutput = "";
		var thisCommand = widget.system("/usr/bin/osascript FirewallCheck.scpt",function(){
			fireStatus = parseInt(completeOutput);
			$("icon").className = (fireStatus >= 1) ? "on" : "off";
			if (completionHandler) completionHandler();
		});
		thisCommand.onreadoutput = function(thisOutput){
			completeOutput += thisOutput;
		};

	} else {
		$("icon").className = "off";
		fireStatus = 0;
	}
}

function getClick () {
	if (!clickCount) setTimeout(toggleFirewall,500);
	clickCount++;
}

function toggleFirewall () {
	if (clickCount > 1) {
		launchApp();
	} else if (window.widget && !switchBusy) {
		switchBusy = true;
		var completeOutput = "";
		var thisCommand = widget.system("/usr/bin/osascript FirewallSwitch.scpt",function(){
			var result = parseInt(completeOutput);
			if (result == 1) {
				switchFinished(1);
			} else if (result == 2) {
				widget.system("/usr/bin/osascript FirewallAuthenticate.scpt",doNothing);
				widget.openApplication("com.apple.SystemPreferences");
				switchFinished(1);
			} else {
				doError("check");
				switchFinished(0);
				widget.openApplication("com.apple.SystemPreferences");
			}
		});
		thisCommand.onreadoutput = function(thisOutput){
			completeOutput += thisOutput;
		};
	}
	clickCount = 0;
}

function doError (errorString) {
	var stringsPath = translate("en.lproj");
	widget.system("/usr/bin/osascript FirewallError.scpt "+errorString+" "+stringsPath,doNothing);
}

function switchFinished (result) {
	updateStatus(function(){
		switchBusy = false;
		if (result == 1 && fireStatus == 1) launchApp();
	});
}

function launchApp () {
	if (openafter.value == "1") {
		widget.openApplication("com.apple.SystemPreferences");
		widget.system("/usr/bin/osascript OpenSharing.scpt",doNothing);
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