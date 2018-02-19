(function(d,w){
	function _(id) {return (d.getElementById(id));}
	function _name(name) {return (d.getElementsByName(name)[0]);}
	function _q(query) {return (d.querySelector(query));}
	function _query(query) {return (d.querySelectorAll(query));}
	function _class(className) {return (_query('.' + className)[0]);}
	function _addEvent(o, event, func) {return (!Boolean(w.addEventListener) ? o.attachEvent('on' + event, func) : o.addEventListener(event, func, false));}
	function changeClassName(o, className, remove) {o.className = o.className.split(' ' + className).join('');if (!remove) o.className += ' ' + className;}

	var _get = {
		Scroll: function() {return d.documentElement.scrollTop || d.body.scrollTop;},
		WindowHeight: function() {return w.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;},
		WindowWidth: function() {return w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;},
		offsetTop: function(o){ var elementX = 0; var elem = o; do{elementX += elem.offsetTop;}while(elem = elem.offsetParent); return elementX;},
	}

	var IOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if(IOS)
		document.body.className = "appleDevice";


	function setReviewFade(){		
		var height = _get.WindowHeight(),
			reviews = _query(".review-cont:not(.show)"),
			scroll = _get.Scroll();

		for (var k in reviews) {
			if(isNaN(k)) continue;
			if ((scroll + height * 0.9) >= reviews[k].offsetTop)
				changeClassName(reviews[k], "show");
		};
	}

	_addEvent(w, 'load', function(e) { // On Scroll
		setReviewFade();
	});
})(document, window);