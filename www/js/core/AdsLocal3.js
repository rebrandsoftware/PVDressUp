document.addEventListener('admob.rewardvideo.events.REWARD', function(event) {
	console.log("[ADSALL]REWARD");
	InAppLocal.giveReward("pvdu1", function() {
			  		//console.log("Reward given");
			  	});	
});


var AdsLocal = {
	initialize: function(callback) {
		//console.log("[adsLocal]initialize " + Device.platform);
		switch (Device.platform) {
			case "iOS":
					this.admobAdUnitIdBanner="ca-app-pub-1135739188249379/6279610008";
					this.admobAdUnitIdVideo="ca-app-pub-1135739188249379/1709809605";
					this.admobAdUnitIdImage="ca-app-pub-1135739188249379/9233076406";
					this.admobAdUnitIdImageOrVideo="ca-app-pub-1135739188249379/7756343204";
					this.admobAdUnitIdRewardVideo="ca-app-pub-1135739188249379/3186542802";
				break;
			case "Android":
					this.admobAdUnitIdBanner="ca-app-pub-1135739188249379/5082078400";
					this.admobAdUnitIdVideo="ca-app-pub-1135739188249379/8035544801";
					this.admobAdUnitIdImage="ca-app-pub-1135739188249379/6558811602";
					this.admobAdUnitIdImageOrVideo="ca-app-pub-1135739188249379/9512278001";
					this.admobAdUnitIdRewardVideo="ca-app-pub-1135739188249379/3465744406";
				break;
		}
		if (callback) {
			callback();
		}
	}
};




