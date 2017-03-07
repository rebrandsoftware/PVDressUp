// Call onDeviceReady when PhoneGap is loa ded.
//
// At this point, the document has loaded but phonegap-1.0.0.js has not.
// When PhoneGap is loaded and talking with the native device,
// it will call the event `deviceready`.
// 
Device.initialize(function(success) {
    if (Device.platform === "Browser") {
        onDeviceReady();
    } else {
        document.addEventListener("deviceready", onDeviceReady, false);
        //console.log("PhoneGap is loaded and it is now safe to make calls PhoneGap methods   "); 
    }
});

function onDeviceReady() {
    //console.log("[Device Ready]");

    Device.initialize(function(success) {
		/*
		if (Device.platform == "iOS") {
			    StatusBar.overlaysWebView(false);
                StatusBar.hide();
                
		}
		*/
		
        if (Device.platform == "Android") {
            document.addEventListener("backbutton", backKeyDown, true);
            document.addEventListener("menubutton", menuKeyDown, false);
        }
        
        

        //console.log($(window).width());
        if ($(window).width() >= 380) {
            Globals.bMiniDefault = "big";
        } else {
            Globals.bMiniDefault = "small";
        }

        //Now this is one on readyToConvert();
        // app.checkConvertOldWebSQL(function(success) {
        // //console.log("[Convert Old WebSQL] " + success);
        // app.checkConvertOldPhotos(function(success) {
        // //console.log("[Convert Old DB Photos] " + success);
        // app.checkConvertOldLocalStorage(function(success) {
        // //console.log("[Convert Old LocalStorage] " + success);
        // });
        // }); 
        // });

        if (Device.platform === "WinPhone") {
            //make all footers fixed
            app.removeAllFixedFooters();
            $('#clickToShare').hide();
            document.addEventListener("backbutton", backKeyDown, true);
            //$('#addPlayerContact').hide(); //WinPhone Contacts doesn't work properly SG v 1.4.5
        }

        if (Device.platform === "WinPhone" || Device.platform == "Browser") {
            $('#clickToShare').hide();
        }
        
        //app.initializeData();
        
        
	
    });

}

function backKeyDown() {
	//Toast.toast("Back key down " + $.mobile.activePage);
    //console.log($.mobile.activePage);
    if ($.mobile.activePage.attr("id") === "home") {
        //console.log("Home page, so exit app");
        navigator.app.exitApp();
    } else {
        var $el = $('.android-back', $.mobile.activePage);
        $el[0].click();
    }
    
    //navigator.app.exitApp(); // To exit the app!

    //find the android-back button for the current page
    //simulate a click

    // if (app.backButtonLocked === false) {
    // parent.history.back();
    // return false;
    // }
    // else {
    // Toast.toastMini("The back button is currently disabled to avoid accidental data loss");
    // }
}

function menuKeyDown() {
    //navigator.app.exitApp(); // To exit the app!
    if (app.menuButtonLocked === false) {
        changePage("#edit");
    } else {
        Toast.toastMini("The menu button is currently disabled to avoid accidental data loss");
    }

}