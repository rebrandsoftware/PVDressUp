var Toast = {
    toast: function(msg, bMini, bLong, textAlign, bLonger, $elAttached) {
    	if (msg !== "") {
	        var duration = 400;
	        var delay = 1500;
	        var display = "inline-block";
	        var opacity = 1.00;
	        var position = "fixed";
	        var padding = "7px";
	        var width = "270px";
	        var left = ($(window).width() - 284) / 2;
	        var top = $(window).height() / 4;
	        var backgroundColor="#FFFFCC";
	        var tag="h3";
	        
	        if (bLong === true) {
	            duration = 800;
	            delay = 3000;
	        }
	        if (bLonger === true) {
	            duration = 1600;
	            delay = 6000;
	        }
	        
	        if (bMini === true) {
	            tag = "small";
	            padding = "4px";
	            left = ($(window).width() - 284) / 16;
	           	top = ($(window).height() - 100);
	        }
	        
	        if ($elAttached !== undefined) {
	            
	           	//top = ($($elAttached).top);
	           	//console.log(top);
	        }
	        
	        
	        
	        if (textAlign === undefined) {
	            textAlign = "center";
	        }
	        
	        
	       
	        $("<div class='ui-loader ui-overlay-shadow ui-body-c ui-corner-all'><" + tag + ">" + msg + "</" + tag + "></div>")
	            .css({
	                display: display,
	                opacity: opacity,
	                position: position,
	                padding: padding,
	                width: width,
	                left: left,
	                top: top,
	                "text-align": textAlign,
	                "background-color": backgroundColor
	            })
	            .appendTo($.mobile.pageContainer).delay(delay)
	            .fadeOut(duration, function() {
	                $(this).remove();
	            });
	   
	    }
	   
    },

    toastLeft: function(msg) {
        Toast.toast(msg, false, false, "left");
    },

    toastMini: function(msg) {
        Toast.toast(msg, true, false);
    },

    toastMiniLong: function(msg) {
        Toast.toast(msg, true, true);
    },

    toastMiniLonger: function(msg) {
        Toast.toast(msg, true, true, true);
    },

    toastLong: function(msg) {
        Toast.toast(msg, false, true);
    },
    
    toastMiddle: function(msg, $el) {
    	Toast.toast(msg, true, false, "center", false, $el);
    }
    	

};