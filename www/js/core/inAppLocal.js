//WARNING: DO NOT FORGET 
//THAT THE ANDROID APP ID 
//MUST BE ENTERED INTO THE
//FILE CALLED MANIFEST.JSON


var InAppLocal = {
	initialize: function() {
		//console.log("[InAppLocal]initialize");
		this.productIds = ['pvdu1'];
		this.upgradeId = this.productIds[0];
		this.$productUL = $('#productUL');
		this.$inAppPage = $('#inAppPurchase');
		this.bIsUpgraded=false;
	},
	processPurchase: function(productId, callback) {
		//console.log("[InAppLocal]processPurchase: " + productId);
		Social.addActionable(15);
		
		var pvdu1 = function(callback) {
			//console.log("doing pvdu1");
			AdsAll.removeBanner();
			callback();
		};
		
		switch(productId) {
			case 'pvdu1': 
				pvdu1(function() {
					callback();
				});
				break;
			default:
				callback();
		}
		
	},
	giveReward: function(productId, callback) {
		//console.log("[InAppLocal]giveReward " + productId);
		var pvdu1 = function(callback) {
			//console.log("giving reward pvdu1");
			var ts = getTimestamp();
			var rewardHours = 1;
			var rewardTime = rewardHours * 60 * 60 * 1000;
			//3 hours = 60 * 3 * 1000
			//hours = 60 minutes * hours * ms
			ts += rewardTime;
			InAppAll.setUpgradedWithTimeout(ts, function() {
				AdsAll.removeBanner();
				//var d = new Date(ts);
				//Toast.toastMiniLong("Thank you! Ads will be removed after the video!");
				callback();
			});
		};
		
		switch(productId) {
			case 'pvdu1': 
				pvdu1(function() {
					callback();
				});
				break;
			default:
				callback();
		}
	},
	isUpgraded: function(callback) {
		//console.log("[InAppLocal]isUpgraded");
		if (InAppLocal.bIsUpgraded === false) {
			app.store.findInAppPurchaseByProductId(InAppLocal.upgradeId, function(myInAppPurchase) {
				if (myInAppPurchase !== null) {
					InAppLocal.bIsUpgraded = true;
					//console.log("true");
					callback(true);
				} else {
					//console.log("false");
					callback(false);
				}
			});
		} else {
			//console.log("true");
			callback(true);
		}
	}
};

InAppLocal.initialize();
