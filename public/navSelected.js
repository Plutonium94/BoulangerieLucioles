
function navSelected() {
	var pathName = window.location.pathname.substring(1);
	var query = '.w3-navbar li a[href="'+pathName+'"]';
	var li = document.querySelector(query).parentNode;
	li.className += " w3-orange";
}

window.onload = function(evt) {
	window.setTimeout(navSelected, 1200);
	//navSelected();
}