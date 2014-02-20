var size = { width: 275, height: 134 };
var min  = { width: 215, height: 134 };
var max  = { width: 600, height: 134 };
var deliveriesMax = 134;
var offset = { x: 0, y: 0 };
var maximized = false;

var snapDist = 25;
var scrollBar;
var scrollArea;
var nowAnimating = false;

function savedSize () {
	var width = 275;
	var height = 134;
	if (window.widget) {
		if (widget.preferenceForKey('width')) width = widget.preferenceForKey('width');
		if (widget.preferenceForKey('height')) height = widget.preferenceForKey('height');
	}
	return { width:width, height:height };
}

function maxForDeliveries (height) {
	return height + 9 + 51;
}

function setMinMax (view) {
	deliveriesMax = height = maxForDeliveries(deliveries.length * 74);
	switch (view) {

		case 'deliveries':
			min.width  = 215;
			min.height = 134;
			if (height < min.height) {
				height = min.height;
			} else if (height > screen.height) {
				height = screen.height;
			}
			max.height = height;
			break;

		case 'edit':
			min.width  = 275;
			min.height = 390;
			max.height = (height > min.height) ? height : min.height;
			break;

		case 'general':
		case 'sync icloud':
		case 'sync signin':
		case 'sync register':
		case 'sync signedin':
		case 'donate':
			min.width  = 275;
			var lang = translate('xx');
			// Use $('sync').scrollHeight?
			if (lang == 'de' || lang == 'en' || lang == 'sv') {
				min.height = (view == 'sync register') ? 430 : 370;
			} else min.height = (view == 'sync register') ? 450 : 410;
			max.height = (height > min.height) ? height : min.height;
			break;

	}
}

function startResize (e) {
	offset.x = window.innerWidth - e.pageX;
	offset.y = window.innerHeight - e.pageY;
	document.addEventListener('mousemove', doResize, true);
	document.addEventListener('mouseup', stopResize, true);
}

function stopResize () {
	document.removeEventListener('mousemove', doResize, true);
	document.removeEventListener('mouseup', stopResize, true); 
	saveSize(size);
}

function doResize (e) {
	var scrollbars = (currentSide == 'front') ? true : false;
	setSize(e.pageX+offset.x,e.pageY+offset.y,scrollbars,false);
	if (scrollbars) showScrollBar();
}

function setSize (width,height,scrollbars,animating) {
	var className = (largePrint) ? 'large' : '';
	if (!animating) {
		if (height < min.height + snapDist) {
			height = min.height;
		} else if (height > max.height) {
			height = max.height;
		}
		if (width < min.width + snapDist) {
			width = min.width;
		} else if (width > max.width) {
			width = max.width;
		}
		if (height < deliveriesMax) className += ' scrolling';
	} else {
		className += ' animating';
	}
	$('front').className = className;
	
	window.resizeTo(width,height);
	size.width = width;
	size.height = height;
	if (!animating && scrollArea) scrollArea.refresh();
}

function setMaximized (size) {
	maximized = (currentSide == 'front' && size.height >= max.height) ? true : false;
}

function saveSize (size) {
	if (window.widget) {
		widget.setPreferenceForKey(size.width,'width');
		widget.setPreferenceForKey(size.height,'height');
	}
	setMaximized(size);
}

function rectHandler (rectAnimation,currentRect,startingRect,finishingRect) {
	setSize(currentRect.right,currentRect.bottom,true,true);
}


// changing views


function switchToView (side,view) {
	if (nowAnimating) {
		// If the current transition isn't done, wait for it
		setTimeout(function(){switchToView(side,view)},1000);
	} else {
		nowAnimating = true;
		nextSide = side;
		nextView = view;
		setMinMax(nextView);
		if (currentSide == 'front') {
			scrollArea.blur();
			adjustSize();
		} else flipView();
	}
}

function adjustSize (forceExpand) {

	nowAnimating = true;
	var newSize = { width: size.width, height: size.height };
	if (currentSide != 'front') newSize = savedSize();

	if (min.width > newSize.width) {
		newSize.width = min.width;
	} else if (max.width < newSize.width) {
		newSize.width = max.width;
	}
	if (min.height > newSize.height) {
		newSize.height = min.height;
	} else if (max.height < newSize.height || forceExpand) {
		newSize.height = max.height;
	}
	if (forceExpand) saveSize(newSize);

	if (newSize.width != size.width || newSize.height != size.height) {
		var startingRect = new AppleRect(0,0,size.width,size.height);
		var finishingRect = new AppleRect(0,0,newSize.width,newSize.height);	
		var animation = new AppleRectAnimation(startingRect,finishingRect,rectHandler);
		var animator = new AppleAnimator(300,13);
		animator.addAnimation(animation);
		if (currentSide == 'front' && nextSide != 'front') {
			animator.oncomplete = flipView;
		} else animator.oncomplete = completeSwitch;
		animator.start();
	} else if (currentSide == 'front' && nextSide != 'front') {
		flipView();
	} else completeSwitch();

}

function flipView () {

	if (currentSide != nextSide) {
		var transition = (nextSide == 'front') ? 'ToFront' : 'ToBack';
		if (window.widget) widget.prepareForTransition(transition);
	}

	$(currentSide).style.display = 'none';
	if (nextSide == 'back') $('back').className = nextView;
	$(nextSide).style.display = 'block';
	if (nextSide == 'back' && nextView == 'edit' && !$('no').value) $('name').focus();

	setTimeout(function(){
			if (window.widget) widget.performTransition()
			if (currentSide == 'front' && nextSide != 'front') {
				completeSwitch();
			} else setTimeout(adjustSize,750);	
		},0);

}

function completeSwitch () {

	if (nextSide == 'front') {
		setSize(size.width,size.height,true,false);
		scrollArea.focus();
		animateQueues();
		showScrollBar();
	} else $('back').className = nextView;

	currentSide = nextSide;
	currentView = nextView;

	if (!currentSide) {
		currentSide = 'front';
		currentView = 'deliveries';
	}

	nowAnimating = false;

}

function selectTab (tab) {
	if (currentView == 'general') saveSettings(false);
	if (tab == 'general') checkNotifications();
	setMinMax(tab);
	if (size.height < min.height) {
		nextSide = 'back';
		nextView = tab;
		adjustSize();
	} else {
		$('back').className = tab;
		// currentSide = 'back';
		currentView = tab;
	}
}