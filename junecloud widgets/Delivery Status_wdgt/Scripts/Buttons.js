var dragging = false;
var dragObject;

function Buttons (parentId,className,buttons) {

	var self = this;
	var scrollBox = document.getElementById('scroll');

	this.parent = document.getElementById(parentId);
	this.object = newObject('div',parentId+'-buttons',className);
	this.parent.appendChild(this.object);

	for (var i = 0; i < buttons.length; i++) {
		this.object.appendChild(buttons[i]);
	}

	this.startDrag = function (e) {
		dragging = true;
		offset.x = 0;
		offset.y = (scrollBox.scrollTop + e.pageY) - self.parent.offsetTop;
		var top = self.parent.offsetTop;

		dragObject = self.parent.cloneNode(true);
		dragObject.className += ' dragging';
		dragObject.style.position = 'absolute';
		dragObject.style.left = '0';
		dragObject.style.top = top + 'px';
		dragObject.style.width = scrollBox.offsetWidth + 'px';
		dragObject.style.opacity = 0.8;
		dragObject.origin = getPosition(top,0);
		dragObject.position = dragObject.origin;
		dragObject.scrollMax = scrollBox.scrollHeight - scrollBox.offsetHeight;

		self.parent.style.opacity = 0;
		document.getElementById('deliveries').appendChild(dragObject);

		window.addEventListener('mousemove',self.moveDrag,true);
		window.addEventListener('mouseup',self.stopDrag,true);
	}
	
	this.moveDrag = function (e) {
		if (dragObject !== undefined) {

			if (dragObject.timer) clearTimeout(dragObject.timer);
			showScrollBar();

			var y = scrollBox.scrollTop + e.pageY;
			var top = y - offset.y;

			if (e.pageY < 52 && scrollBox.scrollTop > 0) {

				var adjustment = Math.ceil((52 - e.pageY) / 2);
				var newTop = scrollBox.scrollTop - adjustment;
				if (newTop < 0) newTop = 0;
				scrollArea.verticalScrollTo(newTop);
				dragObject.style.top = (top - adjustment) + 'px';
				dragObject.timer = setTimeout(self.moveDrag,100,e);
				
			} else if (window.innerHeight - e.pageY < 89 && 
				scrollBox.scrollTop < dragObject.scrollMax) {

				var adjustment = Math.ceil((89 - (window.innerHeight - e.pageY)) / 2);
				var newTop = scrollBox.scrollTop + adjustment;
				if (newTop > dragObject.scrollMax) newTop = dragObject.scrollMax;	
				scrollArea.verticalScrollTo(newTop);
				dragObject.style.top = (top + adjustment) + 'px';
				dragObject.timer = setTimeout(self.moveDrag,100,e);

			} else dragObject.style.top = top + 'px';

			var position = getPosition(y,dragObject.origin);
			var nextElement = null;
			if (position < deliveries.length) {
				nextElement = document.getElementById(deliveries[position].id);
			}
			document.getElementById('deliveries').insertBefore(self.parent,nextElement);
			dragObject.position = position;

		}
	}
	
	this.stopDrag = function (e) {
		if (dragObject !== undefined) {

			if (dragObject.timer) clearTimeout(dragObject.timer);

			var newDeliveries = [];
			var x = 0;
			for (var i = 0; i < deliveries.length + 1; i++) {
				if (i == dragObject.position) {
					newDeliveries.push(deliveries[dragObject.origin]);
					x++;
				}
				if (i != dragObject.origin && deliveries[i]) {
					newDeliveries.push(deliveries[i]);
					x++;
				}
			}
			deliveries = newDeliveries;
			saveDeliveries();

			self.parent.style.opacity = 1;
			if (dragObject) document.getElementById('deliveries').removeChild(dragObject);
			delete dragObject;
			
			window.removeEventListener('mousemove',self.moveDrag,true);
			window.removeEventListener('mouseup',self.stopDrag,true);

			if (sortBy) disableSort();

		}
		dragging = false;
	}

	var dragHandle = newObject('div',parentId+'-drag','drag');
	dragHandle.addEventListener('mousedown',this.startDrag,true);
	this.object.appendChild(dragHandle);

}

function getPosition (y,origin) {
	var position = Math.ceil(y/74);
	if (position <= origin) position--;
	if (position < 0) {
		position = 0;
	} else if (position > deliveries.length) {
		position = deliveries.length;
	}
	return position;
}
