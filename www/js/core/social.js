function Feedback(program, version, os, email, rating, message) {
    this.program = program;
    this.version = version;
    this.os = os;
    this.email = email;
    this.rating = rating;
    this.message = message;
    this.pass = "aoadsnasoasdnaslaiashsanasns";
}

var Social = {
    launchFeedback: function() {
    	Social.setReviewStatus('feedback');
    	Social.setReviewVersion(Globals.appVersion);
        Social.feedbackDialog();
    },
    
    feedbackDialog: function() {
        //console.log("FEEDBACK DIALOG");
		if ($.mobile.sdCurrentDialog) {
        		$.mobile.sdCurrentDialog.close();
        	}
        var feedback = "Send Feedback";
        var optionalEmail = "Optional Email";
        var yourMessage = "Your Message";
        var feedbackEmail = "If you provide an email address we will respond as soon as possible.";
        var send = "Send";
        //console.log("Review document delegate");

        $('<div>').simpledialog2({
            mode: 'blank',
            headerText: feedback,
            headerClose: true,
            top: 25,
            blankContent: '<div class="ui-simpledialog-withpadding"><input name="txtEmail" id="txtEmail" data-i18n="[placeholder]global2.optionalEmail" placeholder="' + optionalEmail + '" value="" type="text">' +
                '<select data-native-menu="false" name="rating" id="select-rating-1">' +
                '<option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>' +
                '<option value="4">&#9733;&#9733;&#9733;&#9733;</option>' +
                '<option value="3">&#9733;&#9733;&#9733;</option>' +
                '<option value="2">&#9733;&#9733;</option>' +
                '<option value="1">&#9733;</option>' +
                '</select>' +
                '<textarea id="textareaMessage" data-i18n="[placeholder]global2.message" placeholder="' + yourMessage + '"></textarea>' +
                '<label data-i18n="label.feedbackEmail">' + feedbackEmail + '</label>' +
                '<a data-role="button" data-i18n="nav.send" data-i18n-target=".ui-btn-text" data-theme="b" data-icon="mail" id="btnSendFeedback">' +
                send +
                '</a></div>'
        });

        $('#btnSendFeedback').on('click', function(e) {
            //console.log("Send Feedback");
            var $txtEmail = $('#txtEmail');
            var $selectRating = $('#select-rating-1');
            var $textareaMessage = $('#textareaMessage');
            var myFeedback = new Feedback(Globals.appNameNoSpaces, Globals.appVersion, Device.platform, $txtEmail.val(), $selectRating.val(), $textareaMessage.val());

            //console.log(myFeedback.program);
            //console.log(myFeedback.version);
            //console.log(myFeedback.os);
            //console.log(myFeedback.email);
            //console.log(myFeedback.rating);
            //console.log(myFeedback.message);
            //console.log(myFeedback.pass);

            var feedbackURL = "http://www.rebrandsoftware.com/sendFeedback.asp";
            if ($textareaMessage.val() !== "") {
                Internet.getURLSource(feedbackURL, myFeedback, true, function(success) {
                    //console.log(success);
                    if (success[1] === "Success") {
                        $(document).trigger('simpledialog', {
                            'method': 'close'
                        });
                        Toast.toast('Thank you!');
                    } else {
                        Toast.toast('Network error: please try again later or use Social > Support to contact us');
                    }

                });
            } else {
                Toast.toast('Please enter some feedback first');
            }

        });
    },
	enjoyingDialog: function(updated, feedback) {
		//console.log("ENJOYING DIALOG");
		if ($.mobile.sdCurrentDialog) {
        		$.mobile.sdCurrentDialog.close();
        	}
        var sText = "Are you enjoying this app?";
        var title = "";
        
        
        if (updated === true ) {
        	sText = "Are you enjoying this update? If so, consider supporting it by updating your rating for this version.";
        	
        	$('<div>').simpledialog2({
                mode: 'button',
                headerText: title,
                headerClose: true,
                buttonPrompt: sText,
                top: 25,
                buttons: {
                    "Yes, I love it!": {
                        id: 'promptForRate',
                        click: function() {
                        	Social.setReviewStatus("reviewed");
                            Social.askForReviewDialog();
                        },
                        icon: "check",
                        theme: "d"
                    },
                    "I'm not sure, ask me later": {
                        id: 'promptRemindMe',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("remind");
                            Social.setActionables(0);
                            
                        },
                        icon: "clock",
                        theme: "b"
                    },
                    "Please don't ask again": {
                        id: 'promptNoThanks',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("never");
                        },
                        icon: "forbidden",
                        theme: "e"
                    }
                }
            });
        	
        } else if (feedback === true) {
        	sText = "Have we improved your experience with this update?";
        
        	$('<div>').simpledialog2({
                mode: 'button',
                headerText: title,
                headerClose: true,
                buttonPrompt: sText,
                top: 25,
                buttons: {
                    "Yes, it's much better!": {
                        id: 'promptForRate',
                        click: function() {
                        	Social.setReviewStatus("reviewed");
                            Social.askForReviewDialog();
                        },
                        icon: "check",
                        theme: "d"
                    },
                    "No, I still need help": {
                        id: 'promptForFeedback',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("feedback");
                            Social.setReviewVersion(Globals.appVersion);
                            Social.feedbackDialog();
                        },
                        icon: "comment",
                        theme: "c"
                    },
                    "I'm not sure, ask me later": {
                        id: 'promptRemindMe',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("remind");
                            Social.setActionables(0);
                            
                        },
                        icon: "clock",
                        theme: "b"
                    },
                    "Please don't ask again": {
                        id: 'promptNoThanks',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("never");
                        },
                        icon: "forbidden",
                        theme: "e"
                    }
                }
            });
        } else {
        	$('<div>').simpledialog2({
                mode: 'button',
                headerText: title,
                headerClose: true,
                buttonPrompt: sText,
                top: 25,
                buttons: {
                    "Yes, I love it!": {
                        id: 'promptForRate',
                        click: function() {
                        	Social.setReviewStatus("reviewed");
                            Social.askForReviewDialog();
                        },
                        icon: "check",
                        theme: "d"
                    },
                    "No, I'm having trouble": {
                        id: 'promptForFeedback',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("feedback");
                            Social.setReviewVersion(Globals.appVersion);
                            Social.feedbackDialog();
                        },
                        icon: "comment",
                        theme: "c"
                    },
                    "I'm not sure, ask me later": {
                        id: 'promptRemindMe',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("remind");
                            Social.setActionables(0);
                            
                        },
                        icon: "clock",
                        theme: "b"
                    },
                    "Please don't ask again": {
                        id: 'promptNoThanks',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save 
                            Social.setReviewStatus("never");
                        },
                        icon: "forbidden",
                        theme: "e"
                    }
                }
            });
        }
        
       
            

           
	},
	
    // reviewDialog: function(updated, feedback) {
        // //console.log("REVIEW DIALOG");
        // var revText;
        // var feedbackText;
        // var reviewVersion;
        // Shell.getSetting("reviewVersion", Globals.appVersion, function(setting) {
// 
            // //console.log("reviewVersion: " + reviewVersion);
            // if (setting != Globals.appVersion) {
                // updated = true;
            // } else {
                // updated = false;
            // }
// 
            // //console.log("updated: " + updated);
// 
            // if (updated === false) {
                // revText = "Love this app? Please help with a 5 star review!";
            // } else {
                // revText = "Still love this app? You can help with a 5 star review for each version.";
            // }
// 
            // feedbackText = "Having trouble? Send feedback and we can help!";
// 
            // revText = revText + "<BR><BR>" + feedbackText;
// 
            // var rate = "Rate";
// 
            // //console.log("Review document delegate");
// 
            // $('<div>').simpledialog2({
                // mode: 'button',
                // headerText: rate,
                // headerClose: true,
                // buttonPrompt: revText,
                // top: 25,
                // buttons: {
                    // 'Rate 5 Stars': {
                        // id: 'promptRateNow',
                        // click: function() {
                            // //$('#buttonoutput').text('OK');
                            // //Launch the URL
                            // //save setting
                            // //console.log("Rate 5 Clicked");
                            // Shell.saveSetting("askForReview", "reviewed");
                            // Shell.saveSetting("reviewVersion", Globals.appVersion);
                            // Social.launchReview();
                        // },
                        // icon: "star",
                        // theme: "d"
                    // },
                    // 'Send Feedback': {
                        // id: 'promptFeedback',
                        // click: function() {
                            // //$('#buttonoutput').text('Cancel');
                            // //save setting
                            // Shell.saveSetting('askForReview', 'reviewed');
                            // Shell.saveSetting('reviewVersion', Globals.appVersion);
                            // Social.feedbackDialog();
                        // },
                        // icon: "comment",
                        // theme: "c"
                    // },
                    // 'Remind me later': {
                        // id: 'promptRemindMe',
                        // click: function() {
                            // //$('#buttonoutput').text('Cancel');
                            // //save setting
                            // Shell.saveSetting("askForReview", "remind");
                            // Shell.saveSetting("reviewUse", "0");
                        // },
                        // icon: "clock",
                        // theme: "b"
                    // },
                    // 'No, thank you': {
                        // id: 'promptNoThanks',
                        // click: function() {
                            // //$('#buttonoutput').text('Cancel');
                            // //save setting
                            // Shell.saveSetting("askForReview", "never");
                        // },
                        // icon: "forbidden",
                        // theme: "e"
                    // }
                // }
            // });
// 
            // //var rate5Stars = i18n.t('global2.rate5Stars'); //"Rate 5 Stars"
            // // var remindMe = i18n.t('social.remindMe'); //"Remind me later"
            // // var noThanks = i18n.t('social.noThanks'); //"No, thank you"
            // // var feedback = i18n.t('global2.sendFeedback'); //"Send Feedback"
            // //         
            // // var $elRate5Stars = $('#promptRateNow .ui-btn-text');
            // // var $elRemindMe = $('#promptRemindMe .ui-btn-text');
            // // var $elNoThanks = $('#promptNoThanks .ui-btn-text');
            // // var $elFeedback = $('#promptFeedback .ui-btn-text');
            // //         
            // // $elRate5Stars.text(rate5Stars);
            // // $elFeedback.text(feedback);
            // // $elRemindMe.text(remindMe);
            // // $elNoThanks.text(noThanks);
        // });
    // },
	
    launchURL: function(url, forceInApp) {
        //console.log(url);
        url = url.replace(/ /g, "%20");
        
        if (Device.platform === "FirefoxOS") {
            //console.log("using activity");
            var openURL = new MozActivity({
                name: "view",
                data: {
                    type: "url", // Possibly text/html in future versions
                    url: url
                }
            });
            openURL.onsuccess = function() {
                //console.log("a URL has been opened: " + url);
            };

            openURL.onerror = function() {
                //console.log(this.error);
            };
        } else {
            var ref = window.open(url, '_blank', 'location=yes');
            if (Globals.bDebug === true) {
                //ref.addEventListener('loadstart', function(event) { alertDebug('start: ' + event.url); });
                //ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
                ref.addEventListener('loaderror', function(event) {
                    alertDebug('error: ' + event.message);
                });
                //ref.addEventListener('exit', function(event) { alert(event.type); });
                //console.log(ref);   
            }
        }
    },

    launchSupport: function() {
        var url = Globals.socialSupportURL;
        Social.launchURL(url);
    },

    follow: function() {
        //console.log("follow");
        var url = Globals.socialFollowURL;
        //console.log("URL: " + url);
        if (Device.platform === "iOS" || Device.platform === "Android") {
            if (Device.platform === "iOS") {
                appAvailability.check('twitter://', function() {
                    // availability is either true or false

                    window.open('twitter://user?screen_name=' + Globals.socialTwitterID, '_system', 'location=no');

                }, function() {
                    Social.launchURL(url);
                });
            } else {
                appAvailability.check('com.twitter.android', function() {
                    //console.log("follow availability: " + availability);
                    window.open('twitter://user?screen_name=' + Globals.socialTwitterID, '_system', 'location=no');

                }, function() {
                    Social.launchURL(url);
                });
            }
        } else {
            Social.launchURL(url);
        }
    },

    launchLike: function() {
        //console.log("launchLike");
        var url;
        url = Globals.socialLikeURL;
        url = url.replace(/\[APP_ID\]/g, Globals.appId);
        //Social.launchURL(url);
        //console.log(url);
        if (Device.platform === "iOS" || Device.platform === "Android") {
            if (Device.platform === "iOS") {
                appAvailability.check('fb://', function() {
                    window.open('fb://profile/' + Globals.socialLikeID, '_system', 'location=no');

                }, function() {
                    Social.launchURL(url);
                });
            } else {
                appAvailability.check('com.facebook.katana', function() {
                    window.open('fb://profile/' + Globals.socialLikeID, '_system', 'location=no');


                }, function() {
                    Social.launchURL(url);
                });
            }
        } else {
            Social.launchURL(url);
        }
    },

    launchReview: function() {
        //console.log("[SOCIAL] launchReview");
        var url;
        url = Globals.socialRateURL;
        url = url.replace(/\[OS\]/g, Device.platform);
        url = url.replace(/\[APP_ID\]/g, Globals.appId);
        if (Device.platform === "iOS") {
            url = Globals.appStoreURL;
        }
        Social.launchURL(url);
    },

    friend: function() {
        var url = Globals.socialFriendURL;
        if (Device.platform === "iOS" || Device.platform === "Android") {
            if (Device.platform === "iOS") {
                appAvailability.check('fb://', function() {
                    window.open('fb://profile/' + Globals.socialFriendID, '_system', 'location=no');

                }, function() {
                    Social.launchURL(url);
                });
            } else {
                appAvailability.check('com.facebook.katana', function() {
                    window.open('fb://profile/' + Globals.socialFriendID, '_system', 'location=no');

                }, function() {
                    Social.launchURL(url);

                });
            }
        } else {
            Social.launchURL(url);
        }
    },

	tweetDoNotUse: function(tweetText, picture) {
		
		//console.log(picture.substring(0, 40));
		//console.log("picture length: " + picture.length);
		// this is the complete list of currently supported params you can pass to the plugin (all optional)
		var options = {
		  message: tweetText, // not supported on some apps (Facebook, Instagram)
		  //subject: 'the subject', // fi. for email
		  files: [picture], // an array of filenames either locally or remotely
		  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		};
		
		var onSuccess = function(result) {
		  //console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		  //console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
		};
		
		var onError = function(msg) {
		  //console.log("Sharing failed with message: " + msg);
		};
		
		window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
	},
    tweet: function(tweetText, picture) {
        //console.log('tweetText: ' + tweetText);
        
        //console.log('picture: ' + picture.length);
        var tweetTextL = tweetText.toLowerCase();
        if (tweetTextL.indexOf("#AppName") === -1) {
            if (tweetText.length + 11 <= 140) {
                tweetText += " #PartyVote";
                if (tweetText.length + 16 <= 140) {
	                tweetText += " #CostumeContest";
	            }
            }
        }

        //console.log(tweetText);
        //console.log(picture);
        if (Device.platform === "Android" || Device.platform === "iOS") {
        	var options;
        	
        	var onSuccess = function(result) {
			  //console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			  //console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			};
			
			var onError = function(msg) {
			  //console.log("Sharing failed with message: " + msg);
			};
        	
            if (picture !== undefined && picture !== null) {
                options = {
				  message: tweetText, // not supported on some apps (Facebook, Instagram)
				  //subject: 'the subject', // fi. for email
				  files: [picture], // an array of filenames either locally or remotely
				  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
				};
				
				
				
				
            } else {
                options = {
				  message: tweetText, // not supported on some apps (Facebook, Instagram)
				  //subject: 'the subject', // fi. for email
				  //files: [picture], // an array of filenames either locally or remotely
				  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
				};
            }
            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
            //} else if (Device.platform === "FirefoxOS" && picture !== undefined && picture !== null) {
            // var a = picture.split(";base64,");
            // var b = a[0].split(":");
            // var contentType = b[1];
            // var b64Data = a[1];
            // var sliceSize = 512;
            //console.log("content: " + contentType);
            //console.log("data: " + b64Data);
            //var pictureData = b64toBlob(b64Data, contentType, sliceSize);
            //console.log(picture);
            // var pictureData = FileIO.getBlobFromBase64(picture);
            // var sharing = new MozActivity({
            // name: "share",
            // data: {
            // type: "image/*", // Possibly text/html in future versions,
            // number: 1,
            // blobs: [pictureData],
            // filenames: ["sharedphoto.png"]
            // }
            // });

            // sharing.onsuccess = function() {
            // //console.log("Share Success");
            // };
            //     
            // sharing.onerror = function() {
            // //console.log(this.error);
            // };
        } else {
            var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText);
            Social.launchURL(url);
        }
    },
    reviewDialog: function(updated) {
        console.log("REVIEW DIALOG");
        var revText;
        var feedbackText;
        var reviewVersion;
        Shell.getSetting("reviewVersion", Globals.appVersion, function(setting) {

            //console.log("reviewVersion: " + reviewVersion);
            if (setting != Globals.appVersion) {
                updated = true;
            } else {
                updated = false;
            }

            //console.log("updated: " + updated);

            if (updated === false) {
                revText = "Please take a moment to leave a short review.";
            } else {
                revText = "Please take a moment to review this version.";
            }

            feedbackText = "Having trouble? Send feedback and we can help!";

            revText = revText + "<BR><BR>" + feedbackText;

            var rate = "Enjoying PV: Dress Up?";

            //console.log("Review document delegate");

            $('<div>').simpledialog2({
                mode: 'button',
                headerText: rate,
                headerClose: true,
                buttonPrompt: revText,
                top: 25,
                buttons: {
                    'Rate App': {
                        id: 'promptRateNow',
                        click: function() {
                            //$('#buttonoutput').text('OK');
                            //Launch the URL
                            //save setting
                            //console.log("Rate 5 Clicked");
                            Shell.saveSetting("askForReview" + Globals.appReviewVersion, "reviewed");
                            Shell.saveSetting("reviewVersion", Globals.appVersion);
                            Social.launchReview();
                        },
                        icon: "star",
                        theme: "d"
                    },
                    'Send Feedback': {
                        id: 'promptFeedback',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save setting
                            Shell.saveSetting('askForReview' + Globals.appReviewVersion, 'reviewed');
                            Shell.saveSetting('reviewVersion', Globals.appVersion);
                            Social.feedbackDialog();
                        },
                        icon: "comment",
                        theme: "c"
                    },
                    'Remind me later': {
                        id: 'promptRemindMe',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save setting
                            Shell.saveSetting("askForReview" + Globals.appReviewVersion, "remind");
                            Shell.saveSetting("reviewUse" + Globals.appReviewVersion, "0");
                        },
                        icon: "clock",
                        theme: "b"
                    },
                    'No, thank you': {
                        id: 'promptNoThanks',
                        click: function() {
                            //$('#buttonoutput').text('Cancel');
                            //save setting
                            Shell.saveSetting("askForReview" + Globals.appReviewVersion, "never");
                        },
                        icon: "forbidden",
                        theme: "e"
                    }
                }
            });

            //var rate5Stars = i18n.t('global2.rate5Stars'); //"Rate 5 Stars"
            // var remindMe = i18n.t('social.remindMe'); //"Remind me later"
            // var noThanks = i18n.t('social.noThanks'); //"No, thank you"
            // var feedback = i18n.t('global2.sendFeedback'); //"Send Feedback"
            //         
            // var $elRate5Stars = $('#promptRateNow .ui-btn-text');
            // var $elRemindMe = $('#promptRemindMe .ui-btn-text');
            // var $elNoThanks = $('#promptNoThanks .ui-btn-text');
            // var $elFeedback = $('#promptFeedback .ui-btn-text');
            //         
            // $elRate5Stars.text(rate5Stars);
            // $elFeedback.text(feedback);
            // $elRemindMe.text(remindMe);
            // $elNoThanks.text(noThanks);
        });
    },
    initialize: function() {
    	this.actionables = 45;
    	$('#popupSocial').on('click', function() {
            //console.log("Popup Social");
            Popup.socialDialog();
        });
    }
};

Social.initialize();
