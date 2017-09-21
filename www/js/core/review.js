Review = {
	askForReview: function(alwaysShow) {
        //console.log('ask for review');
        var os;
        var askForReview;
        var reviewVersion;
        var s;
        var l;
        var ret;
        var parse;
        var url;
        var that = this;
        Shell.getSetting('reviewUse' + Globals.appReviewVersion, '0', function(setting) {
            //console.log('reviewUse: ' + setting);
            ret = parseInt(setting);
            //console.log('ret=' + ret);
            if (alwaysShow === true) {
                ret = Review.actionItemsBeforeShow;
            }
            if (ret >= Review.actionItemsBeforeShow) {
                //they have stored at lease three passwors so see if we should ask about reviewing
                //console.log('getting askForReview');
                Shell.getSetting('askForReview' + Globals.appReviewVersion, 'remind', function(setting) {
                    askForReview = setting;
                    //console.log('ask for review: ' + askForReview);
                    //}
                    if (alwaysShow === true) {
                        askForReview = 'remind';
                    }
                    switch (askForReview) {
                        case 'remind':
                            Social.reviewDialog(false);
                            break;
                        case 'never':
                            //ignore it forever
                            Shell.saveSetting('askForReview' + Globals.appReviewVersion, 'never');
                            break;
                        case 'reviewed':
                            //get setting, check if it matches version, ask if it has been updated
                            Shell.getSetting('reviewVersion', '0.0', function(setting) {
                                //s = settings[0];
                                reviewVersion = setting;
                                if (reviewVersion != Globals.appVersion) {
                                    Shell.saveSetting('askForReview' + Globals.appReviewVersion, 'remind');
                                    Shell.saveSetting('reviewUse' + Globals.appReviewVersion, '1');
                                }
                            });
                            break;
                    }
                });
            }
        });
    },
    launchReview: function() {
        Shell.saveSetting("askForReview" + Globals.appReviewVersion, "reviewed");
        Shell.saveSetting("reviewVersion", Globals.appVersion);
        Social.launchReview();
    },
    launchFeedback: function() {
        Shell.saveSetting('askForReview' + Globals.appReviewVersion, 'reviewed');
        Shell.saveSetting('reviewVersion', Globals.appVersion);
        Social.feedbackDialog();
    },
    incrementActionItems: function(callback, toIncrement) {
        //console.log("incrementActionItems");
        var s;
        var l;
        var ret;
        if (toIncrement === undefined) {
        	toIncrement = 1;
        }
        app.getSetting("reviewUse" + Globals.appReviewVersion, "0", function(setting) {
            //console.log("settings callback review");
            //console.log(setting);
            s = setting;
            //console.log("Got setting '" + s + "'");
            ret = parseInt(s, 10);
            //console.log("ret=" + ret);
            ret = ret + toIncrement;
            app.saveSetting("reviewUse" + Globals.appReviewVersion, ret, function() {
            	//console.log(callback);
                if (callback) {
                    callback();
                }
            });
            //console.log("saved setting reviewGamesPlayed = " + ret);
        });
    },
	initialize: function() {
		this.actionItemsBeforeShow = 20;
	}
};

Review.initialize();
