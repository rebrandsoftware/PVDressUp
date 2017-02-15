document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {console.log("[ADSALL]LOAD");});
document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function(event) {console.log("[ADSALL]LOAD_FAIL");});
document.addEventListener('admob.rewardvideo.events.OPEN', function(event) {console.log("[ADSALL]OPEN");});
document.addEventListener('admob.rewardvideo.events.CLOSE', function(event) {console.log("[ADSALL]CLOSE");});
document.addEventListener('admob.rewardvideo.events.EXIT_APP', function(event) {console.log("[ADSALL]EXITAPP");});
document.addEventListener('admob.rewardvideo.events.START', function(event) {console.log("[ADSALL]START");});


function AdObj(banner, image, video, imageOrVideo) {
	this.banner=banner;
	this.image=image;
	this.video=video;
	this.imageOrVideo=imageOrVideo;
}

var AdsAll = {
	initNetwork: function(network, callback) {
		//console.log("[AdsAll]initNetwork " + network);
		
		AdsAll.adNetwork = network;
		switch (network) {
			case "admob":
				AdsAll.adObj = new AdObj(AdsLocal.admobAdUnitIdBanner, AdsLocal.admobAdUnitIdImage, AdsLocal.admobAdUnitIdVideo, AdsLocal.admobAdUnitIdImageOrVideo);
				//console.log(JSON.stringify(AdsAll.adObj));
				break;
			
		}
		if (callback) {
			callback();
		}
	},
	showBanner: function() {
		//Toast.toastMiniLong("[AdsAll]showBanner " + AdsAll.adNetwork + " " + AdsAll.bTesting);
		switch(AdsAll.adNetwork) {
			case "admob":
				if(admob) {
					//console.log("admob exists!");
					//Toast.toastLong(AdsAll.adObj.banner);
					admob.banner.config({
					    id: AdsAll.adObj.banner,
					    isTesting: AdsAll.bTesting,
					    autoShow: true
					 });
					 //console.log("config complete");
					  admob.banner.prepare();
					  AdsAll.bShowedBanner = true;
					//console.log("done");
				}				  
				break;
			
		}
	},
	removeBanner: function() {
		//console.log("[AdsAll]removeBanner");
		switch(AdsAll.adNetwork) {
			case "admob":
			
				if(admob) {
					admob.banner.remove();
				}
				AdsAll.bShowedBanner = false;
				break;
			
		}
		
	},
	showInterstitial: function(callback) {
		//console.log("[AdsAll]showInterstitial");
		switch(AdsAll.adNetwork) {
			case "admob":
				if(admob) {
					admob.interstitial.show();
				}
				break;
			
		}
		if (callback) {
			callback();
		}
	},
	
	prepareInterstitialImage: function(autoShow) {
		//console.log("[AdsAll]prepareInterstitialImage");
		switch(AdsAll.adNetwork) {
			case "admob":
				if(admob) {
					admob.interstitial.config({
					    id: AdsAll.adObj.image,
					    isTesting: AdsAll.bTesting,
					    autoShow: autoShow
					 });
					  admob.interstitial.prepare();
				}
				break;
		}
	},
	prepareInterstitialImageOrVideo: function(autoShow) {
		//console.log("[AdsAll]prepareInterstitialImageOrVideo");
		Toast.toastMini("AdsAll.bTesting: " + AdsAll.bTesting);
		switch(AdsAll.adNetwork) {
			case "admob":
				if(admob) {
					admob.interstitial.config({
					    id: AdsAll.adObj.imageOrVideo,
					    isTesting: AdsAll.bTesting,
					    autoShow: autoShow
					 });
					  admob.interstitial.prepare();
				}
				break;
			
		}
	},
	
	prepareInterstitialVideo: function(autoShow) {
		//console.log("[AdsAll]prepareInterstitialVideo");
		Toast.toastMini("AdsAll.bTesting: " + AdsAll.bTesting);
		AdsAll.bInterstitialReady = false;
		switch(AdsAll.adNetwork) {
			case "admob":
				if(admob) {
					admob.interstitial.config({
					    id: AdsAll.adObj.video,
					    isTesting: AdsAll.bTesting,
					    autoShow: autoShow
					 });
					  admob.interstitial.prepare();
				}
				break;
			
		}
	},
	
    prepareRewardVideo: function(adUnitId, bTesting, bAutoShow, callback) {
	  	console.log("[ADS]prepareRewardVideo " + adUnitId + " testing: " + bTesting + " autoShow: " + bAutoShow);
	  		admob.rewardvideo.config({
	           id: adUnitId,
	           isTesting: bTesting,
	           autoShow: bAutoShow
	       });
	 
	       admob.rewardvideo.prepare();	
	       callback();	    		
	 
	  },
	  showRewardVideo: function(callback) {
		 console.log("[ADS]showRewardVideo");
		 
		 admob.rewardvideo.show();
		      	callback();	
		 
	  },
    
	initialize: function(callback) {
		//console.log("[AdsAll]initialize");
		this.bTesting = false;
		this.bShowedBanner = false;
		this.adObj=null;
		this.adNetwork="admob";
		this.bInterstitialReady=false;
		this.bInterstitialFail=false;
		this.rewardCallback=null;
		this.bWaitingForReward=false;
		this.rewardStarted=0;
		
		$('.btnPlayVideo').on('click', function() {
			console.log("clicked reward button");
        	AdsAll.prepareRewardVideo(AdsLocal.admobAdUnitIdRewardVideo, AdsAll.bTesting, true, function() {
        		console.log("after show reward video");
        		
        	});
        });
        
		if (callback) {
			callback();
		}
	}
};


