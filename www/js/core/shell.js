$.mobile.defaultPageTransition   = 'none';
$.mobile.defaultDialogTransition = 'none';
$.mobile.buttonMarkup.hoverDelay = 0;

function Setting(settingName, settingValue, user, timeStamp) {
    this.settingName = settingName;
    this.settingValue = settingValue;
    this.user = user;
    this.timeStamp = timeStamp;
}

var Shell = {
    saveSetting: function(name, value, callback) {
        app.store.saveSetting(name, value, function() {
            if (CloudLocal.cloudSettings.indexOf(name) > -1) {
                CloudAll.updateIndex(name, "Setting");
            }
            if (callback !== undefined) {
                callback();
            }
        });
    },
    getSetting: function(name, sDefault, callback) {
        var s;
        var l;
        var ret;
        //console.log("name: " + name);
        app.store.getSetting(name, sDefault, function(setting) {
            //console.log("value: " + setting);
            if (callback) {
            	callback(setting);	
            } else {
            	return setting;
            }
        });
    },
    initialize: function(callback) {
        $('#popupSocial').on('click', function() {
            //console.log("Popup Social");
            Popup.socialDialog();
        });

        $('#creditsButton').on('click', function() {
            changePage('#credits');
        });

        $('#credits').on("pagebeforeshow", function() {
            var $el = $('#creditsTitle');
            $el.html(Globals.appName + " v" + Globals.appVersion);
        });

        if (callback) {
            callback();
        }
    }, 
    loadingShow: function(text, textonly, method, callback) {
        console.log("[LoadingShow] " + text);
        if (text !== "") {
            $.mobile.loading('show', {
                text: text,
                textonly: textonly,
                textVisible: true,
                theme: 'a',
                html: ""
            });
        }
        setTimeout(method, 100, callback);
    },
};

Shell.initialize();