/*
http://stackoverflow.com/questions/985272/jquery-selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
*/
(function($) {
	$.fn.selText = function() {
	    var obj = this[0];
	    if ($.browser.msie) {
	        var range = document.body.createTextRange();
	        range.moveToElementText(obj);
	        range.select();
	    } else if ($.browser.mozilla || $.browser.opera) {
	        var selection = obj.ownerDocument.defaultView.getSelection();
	        var range = obj.ownerDocument.createRange();
	        range.selectNodeContents(obj);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    } else if ($.browser.safari) {
	        var selection = obj.ownerDocument.defaultView.getSelection();
	        selection.setBaseAndExtent(obj, 0, obj, 1);
	    }
	    return this;
	}

})(jQuery);
