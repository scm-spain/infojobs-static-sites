(function (d,w) {
	
	
	
	//--------------------------------------------------------------------------
	function _(id) {
		return (d.getElementById(id));
	}

	function _name(name) {
		return (d.getElementsByName(name)[0]);
	}

	function _q(query) {
		return (d.querySelector(query));
	}

	function _query(query) {
		return (d.querySelectorAll(query));
	}

	function _class(className) {
		return (_query('.' + className)[0]);
	}

	function _addEvent(o, event, func) {
		return (!Boolean(w.addEventListener) ? o.attachEvent('on' + event, func) : o.addEventListener(event, func, false));
	}

	var _get = {
		Scroll: function() {
			return d.documentElement.scrollTop || d.body.scrollTop;
		},
		WindowHeight: function() {
			return w.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
		},
		WindowWidth: function() {
			return w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
		},
		offsetTop: function(o){ var elementX = 0; var elem = o; do{elementX += elem.offsetTop;}while(elem = elem.offsetParent); return elementX;},
	}

	var SCROLL_TIME = 500,
		SCROLL_STEPS = 40,
		SCROLL_OSCILATION = 0.1;

	function scrollHref(elem) {
		while (elem.tagName != 'BODY' && elem.className.indexOf('scroll') == -1)
			elem = elem.parentNode;

		var id = elem.href.split('#')[1];
		scrollToElement(id != '' ? _('_' + id) : d.body);
	}

	var STE_step,
		STE_steps,
		STE_scroll,
		STE_initial_scroll,
		STE_times = [],
		STE_margin_top = 0; //90; // Height of header

	function scrollToElement(toElement) {
		var toPosition = toElement.offsetTop - STE_margin_top,
			time;

		STE_scroll = _get.Scroll();
		STE_initial_scroll = _get.Scroll();
		STE_steps = (toPosition - STE_scroll) / SCROLL_STEPS;
		STE_step = 0;

		while (time = STE_times.pop())
		clearTimeout(time);

		for (var i = 1; i < (SCROLL_STEPS + 1); i++)
		STE_times.push(setTimeout(function() {
			scrollNextStep()
		}, i * SCROLL_TIME / SCROLL_STEPS));

		w.scrollTo(0, STE_scroll);
	}




	function scrollNextStep() {
		var temporalStep = (STE_step % Math.floor(SCROLL_STEPS / 2)) - Math.floor(SCROLL_STEPS / 4),
			oscilation = (Math.floor(SCROLL_STEPS / 2) > STE_step ? temporalStep : -temporalStep) * SCROLL_OSCILATION;

		STE_scroll += STE_steps + (STE_steps * (oscilation));

		w.scrollTo(0, STE_scroll);

		STE_step++;

		if (SCROLL_STEPS <= STE_step) w.scrollTo(0, STE_initial_scroll + (STE_steps * SCROLL_STEPS));
	}

	function setHeaderFixed() {
		var height = _get.WindowHeight(),
			width = _get.WindowWidth(),
			scroll = _get.Scroll(),
			fix = (height - 40) > scroll,
			SE = ['_movil', '_inscribete', '_candidaturas', '_curriculum', '_opiniones'],
			nexus = _q(".slider1 .col-l img"),
			position = 0,
			slider = 0;

		// Cambia el color del nav
		changeClassName(_("nav-selection"), "dark", (scroll + height / 2) < _(SE[1]).offsetTop - STE_margin_top);
		changeClassName(_("nav-selection"), "hide", (scroll + height / 2 + 50) < _(SE[4]).offsetTop - STE_margin_top);

		for (var k in SE) {
			if (scroll >= _(SE[k]).offsetTop - STE_margin_top) position++;
			if ((scroll - height * 0.7 ) >= _(SE[k]).offsetTop - STE_margin_top) slider++;
		};

		// Canbia la imagen del nexus
		// nexus.src = nexus.src.replace(/[0-9]\.png/, (width > 640 && slider > 0 && slider < 4 ? slider : 1) + ".png");

		for (var i = 1; i <= SE.length; i++) { // menu elements
			changeClassName(_class('item' + i), 'current', i != position);
		};

		document.body.className =
			"menu" + position +
			" slidern" + slider;
	}

	function setSilderNexus(){
		var height = _get.WindowHeight(),
			nexus = _query(".slider .col-l"),
			scroll = _get.Scroll();

		for(var i in nexus)
			if(!isNaN(i))
				nexus[i].style.top = (scroll - ((Number(i) + 1) * height)) + "px";
	}

	function setSliderTextTransition(){
		var height = _get.WindowHeight(),
			texts = _query(".slider .col-r"),
			scroll = _get.Scroll(),
			range = 0.2;

		for (var k in texts) {
			if(isNaN(k)) continue;
			var container = texts[k].parentNode.parentNode;
			var cPos = (container.offsetTop - scroll) / height;

			var position = texts[k].offsetTop + (texts[k].offsetHeight / 2);
			var fScroll = (scroll + height * 0.5);
			var pS = Math.abs((position - fScroll) / height);
			var op = pS > range ? 1 - (pS - range) / (0.5 - range) : 1;

			var fixed = !(_q('.menu1') || _q('.menu4'));

			texts[k].style.opacity = op;
			texts[k].style.top = (fixed ? -cPos * 28 : 0) + "%";
		};
	}

	function setReviewFade(){		
		var height = _get.WindowHeight(),
			reviews = _query(".reviews article:not(.show)"),
			scroll = _get.Scroll();

		for (var k in reviews) {
			if(isNaN(k)) continue;
			if ((scroll + height * 0.9) >= reviews[k].offsetTop)
				changeClassName(reviews[k], "show");
		};
	}

	function changeClassName(o, className, remove) {
		o.className = o.className.split(' ' + className).join('');
		if (!remove) o.className += ' ' + className;
	}

	// Listeners ---------------------------------------------------------------

	_addEvent(w, 'scroll', function(e) { // On Scroll
		setHeaderFixed();
		setSilderNexus();
		setSliderTextTransition();
		setReviewFade();
	});
	_addEvent(w, 'resize', function(e) { // On Resize
		setHeaderFixed();
		setSilderNexus();
		setSliderTextTransition();
	});
	_addEvent(w, 'load', function(e) { // On Load
		var aLinks = ['movil','inscribete','candidaturas','curriculum'];
		for( var i in aLinks ) {
			if(isNaN(i)) continue;
			_(aLinks[i]).addEventListener('click', function(e){
				e.preventDefault();
				scrollHref(this);
			});
		}
	});

})(document, window);
