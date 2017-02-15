//Global Variables and Arrays
var Globals = {
    initialize: function(callback) {
        //console.log("[GLOBALS] Initialize");
        this.allLogs = [];
        this.bDebug = false;
        this.bDebugFakes=false;
        this.bNoIndexedDB = false;
        this.bNoLocalStorage = false;
        this.deleteIndexedDb = false;
        this.deleteLocalStorage = false;
        this.showedStorageError = false;
        this.deleteWebSQL = false;
        this.usingIndexedDb = false;
        this.usingLocalStorage = false;
        this.sStorageType = "Unknown";
        this.appName = "PartyVote: Dress Up";
        this.appNameNoSpaces="PVDressUp";
        this.appId = 37;
        this.appVersion = "1.0.0";
        this.bMini = true;
        this.bMiniDefault = "small";
        this.cloudUserSpecific = "";
        this.lastImport = 0;
        this.fakePhoto = "";
        this.androidKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsDCTJtAk26Jd0g1vuonGPF4ceq/1bBaIQmIKJNgHFlVH9ZauGaIdGLOsQtnhoY0GR5UU7kcmybCiwiFss8m1HRfETaqN7sbssD0+vJzJzC8JkwQHJwoEN6IfV3unPi4YUVHbC1lF6Fy4E2bOvcc9NrIhpmxdL0nduzsIzT/Hkb3EJgdoPf9NvmXiegCHkvbnZKn5nInjdiMLHcUUuZMLjdssgZhPm5VoRGGSVTpOXhLgjOyVSfBnurZY1aSZ/GFOP/aIgTd36eFr1lG1os3Odk3W46v5gRAjRyTZ0gK18LGK/4wuzP8yDSBKE/whUmXrw/FUErKvMh8b4i6wKTGjzwIDAQAB";
        this.socialRateURL = "http://www.rebrandsoftware.com/rate.asp?soft_id=[APP_ID]&os=[OS]&appstore=True";
        this.appStoreURL = "https://itunes.apple.com/us/app/scoregeek/id648921280?ls=1&mt=8";
        this.socialTweetURL = "http://www.rebrandsoftware.com/tweet.asp?id=[APP_ID]";
        this.socialFollowURL = "http://www.rebrandsoftware.com/follow.asp";
        this.socialLikeURL = "http://www.rebrandsoftware.com/like.asp?id=[APP_ID]";
        this.socialFriendURL = "http://www.rebrandsoftware.com/friend.asp";
        this.socialHomepageURL = "http://www.rebrandsoftware.com/app.asp?id=[APP_ID]";
        this.socialSupportURL = "http://www.rebrandsoftware.com/supportCommunity.asp";
        this.tweetText = "I'm using this free app, PartyVote: Dress Up, to see who has the best dress up costume! http://bit.ly/pvdressup";
        this.socialFriendID = "651718699";
        this.socialLikeID = "371664333208588";
        this.socialTwitterID = "MikeKGibson";
        this.globalSeed = 1000;
        this.mUsername = '';
        this.dbLocalStorageActive = false;
        this.dbIndexedDBActive = false;
        this.mHistoryDisplay = null;

        if (callback) {
            callback(true);
        }
    }
};

Globals.initialize();