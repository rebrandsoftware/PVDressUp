var Popup = {
	awardDetailsDialog: function(name, html) {
		console.log(name);
		console.log(html);
        var bForce = false;
        var iWidth = 280;
        var winWidth = $(window).width();
        //console.log("winWidth: " + winWidth);
        if (winWidth < 500) {
            bForce = false;
            iWidth = 280;
        } else {
            bForce = false;
            iWidth = winWidth - (winWidth / 5);
        }

        $('<div>').simpledialog2({
            mode: 'blank',
            headerText: name,
            headerClose: true,
            top: 75,
            width: iWidth,
            fullScreen: false,
            fullScreenForce: bForce,
            blankContentAdopt: true,
            blankContent: html
        });
    },
    socialDialog: function() {
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: "Social Options",
            headerClose: true,
            top: 75,
            buttons: {
                'Rate App': {
                    id: 'socialRate',
                    click: function() {
                    	if ($.mobile.sdCurrentDialog) {
        		$(document).trigger('simpledialog', {'method':'close'});
        	}
                        Review.askForReview(true);
                    },
                    icon: "heart",
                    theme: "d"
                },
                'Send Feedback': {
                    id: 'socialFeedback',
                    click: function() {
                    	$(document).trigger('simpledialog', {'method':'close'});
                        Social.launchFeedback();
                    },
                    icon: "comment",
                    theme: "d"
                },
                'Share': {
                    id: 'socialTweet',
                    click: function() {
                        Social.tweet(Globals.tweetText);
                    },
                    icon: "forward",
                    theme: "d"
                },
                'Follow': {
                    id: 'socialFollow',
                    click: function() {
                        Social.follow();
                    },
                    icon: "user",
                    theme: "d"
                },
                'Friend': {
                    id: 'socialFriend',
                    click: function() {
                        Social.friend();
                    },
                    icon: "user",
                    theme: "d"
                },
                'Like on Facebook': {
                    id: 'socialLike',
                    click: function() {
                        Social.launchLike();
                    },
                    icon: "check",
                    theme: "d"
                },
                'Support': {
                    id: 'socialSupport',
                    click: function() {
                        var url = Globals.socialSupportURL;
                        Social.launchURL(url);
                    },
                    icon: "info",
                    theme: "d"
                }
            }
        });
    }
};