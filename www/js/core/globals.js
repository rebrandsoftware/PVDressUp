//Global Variables and Arrays
var Globals = {
    initialize: function(callback) {
        //console.log("[GLOBALS] Initialize");
        this.allLogs = [];
        this.bDebug = true;
        this.bDebugFakes=false;
        this.bNoIndexedDB = false;
        this.bNoLocalStorage = false;
        this.deleteIndexedDb = false;
        this.deleteLocalStorage = true;
        this.showedStorageError = false;
        this.deleteWebSQL = false;
        this.usingIndexedDb = false;
        this.usingLocalStorage = false;
        this.sStorageType = "Unknown";
        this.appName = "PartyVote: Dress Up";
        this.appNameNoSpaces="PVDressUp";
        this.appId = 37;
        this.appVersion = "1.0.2";
        this.bMini = true;
        this.bMiniDefault = "small";
        this.cloudUserSpecific = "";
        this.lastImport = 0;
        this.fakePhoto = "";
        this.androidKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+Jqq8DTHsbzSd8dtPtXAbyxQfM5tO2wgJ2TBw6bT1CMEd2qIHevKvaA9vcZ7MVSvgigOIlRK/7Xc3/IpPaaTqfhh44Z8z0GQZSoxEE40p7KOFiZYDllZSW+2mP/9jKZubH0mzj/t60HDdgQCoC5toO9eltXHvXQEQwlycq1AvvpU9ebtwG2qy8ddQDBuU96FkKe7v4nRYXJuoTdWl/VB3VDbNXQ8ZCHMakl70/5zw+IkSn/HJGp2HLGQk/z8j7XjRnglYVrLETGZpkBK4P1nRfDZkVvob/EJSbc3XBk4i9k+ow++9MkJFqaigCbkue0le+H8/l/1ikXHQ//Jnt4IwIDAQAB";
        this.socialRateURL = "http://www.rebrandsoftware.com/rate.asp?soft_id=[APP_ID]&os=[OS]&appstore=True";
        this.appStoreURL = "https://itunes.apple.com/us/app/partyvote-dress-up/id1206092256?ls=1&mt=8";
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