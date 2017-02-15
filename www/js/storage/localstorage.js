//Storage
var lsGet = function(key) {
    var ret = window.localStorage.getItem(key);
    // if (ret) {
    // ret = LZString.decompress(ret);
    // }
    return ret;
};

var lsSet = function(key, value) {
    try {
        // if (value) {
        // value = LZString.compress(value);
        // }
        window.localStorage.setItem(key, value);
        return true;
    } catch (err) {
        //Toast.toast("Could not save data: storage full.");
        CloudAll.abort = true;
        if (Globals.showedStorageError === false) {
            Popup.lsErrorDialog();
        } else {
            Toast.toastLong("Error: No storage available.");
        }
        return false;
    }
};

var lsRemove = function(key, index) {
    window.localStorage.removeItem(key);
    if (index !== undefined) {
        lsRemoveFromIndex("index" + index, key);
    }
    return true;
};

var lsRemoveFromIndex = function(index, key) {
    var s = lsGet("Index" + index);
    if (s !== null && s !== undefined) {
        s = s.replace("," + key + ",", ",");
        lsSet("Index" + index, s);
    }
    return true;
};

var lsGetObj = function(key) {
    var ret = window.localStorage.getItem(key);
    //console.log(ret);
    if (ret) {
        //ret = LZString.decompress(ret);
        //console.log(ret);    
    }

    return JSON.parse(ret);
};

var lsSetObj = function(key, value, index) {
    var obj = null;
    try {
        obj = JSON.stringify(value);
        //console.log(obj);
        // if (obj) {
        // obj = LZString.compress(obj);
        // //console.log(obj);
        // }
        window.localStorage.setItem(key, obj);
        if (index !== undefined) {
            lsSetIndex(index, key);
        }
        return true;
    } catch (err) {
        //Toast.toast("Could not save data: storage full.");
        CloudAll.abort = true;
        if (Globals.showedStorageError === false) {
            Toast.toast(err.message);
            //console.log("ERROR: " + err.message);
            //console.log(obj);
            //console.log(key);
            //console.log(value);
            //console.log(index);
        } else {
            Toast.toastLong("Error: No storage available.");
        }
        return false;
    }

};

var lsSetIndex = function(index, key) {
    var s = lsGet("Index" + index);
    if (s !== null && s !== undefined) {
        s = s.replace("," + key + ",", ",");
        s += "," + key + ",";
        s = s.replace(",,", ",");
    } else {
        s = "," + key + ",";
    }
    lsSet("Index" + index, s);
    return true;
};

var lsGetIndex = function(index) {
    var s = lsGet("Index" + index);
    //console.log("GetIndex: " + s);
    var a = [];
    if (s !== null && s !== undefined) {
        a = s.split(",");
        //console.log(a);
        a.clean();
    } else {
        //console.log("s === " + s);
    }
    return a;
};

var lsGetAllIndexItems = function(index) {
    //console.log(index);
    var indexKeys = lsGetIndex(index);
    //console.log(indexKeys);
    var l = indexKeys.length;
    var o;
    var objects = [];
    for (var i = 0; i < l; i++) {
        o = lsGetObj(indexKeys[i]);
        if (o !== null && o !== undefined) {
            objects.push(o);
        }
    }
    return objects;
};

var lsGetAutoInc = function(index) {
    var s = lsGetObj("autoInc" + index);
    if (s === undefined || s === null) {
        s = new Setting("autoInc" + index, 0, "");
        lsSetObj("autoInc" + index, s);
    } else {
        s.settingValue++;
        lsSetObj("autoInc" + index, s);
    }
    return s.settingValue;
};

var lsSetAutoInc = function(index, myValue) {
    //console.log("Forcing auto inc: " + index + value);
    var s = new Setting("autoInc" + index, myValue, "");
    var i = lsGetAutoInc(index);
    //console.log("Existing autoinc: " + i);
    //console.log("Incoming autoinc: " + value);
    if (myValue > i) {
        //console.log("Incoming > so setting autoInc");
        lsSetObj("autoInc" + index, s);
    }

};

//Storage
var LocalStore = function(successCallback, errorCallback) {
    "use strict";
    this.initializeStorage = function(successCallback, errorCallback) {
        //console.log("Initialize");
        //console.log("bDebug: " + bDebug);
        if (Globals.bDebug === false) {
            Globals.deleteLocalStorage = false;
        }

        if (window.localStorage !== undefined) {
            //console.log("LocalStorage is ACTIVE");
            // Yes! localStorage and sessionStorage support!
            if (Globals.deleteLocalStorage === true) {
                //console.log("Clearing all storage");
                //window.localStorage.clear();
                var r = confirm("Delete all LocalStorage?");
                if (r === true) {
                    window.localStorage.clear();
                } else {
                    //console.log("Cancelled");
                }
            }
            //console.log("Success callback: ");
            successCallback(this);
        } else {
            // Sorry! No web storage support..
            //console.log("LocalStorage is ....INACTIVE");
            errorCallback("No web storage support");
        }
    };

    this.getAutoInc = function(index, callback) {
        var ret = lsGetAutoInc(index);
        callback(ret);
    };

    this.forceAutoInc = function(index, value) {
        lsSetAutoInc(index, value);
    };

    this.addSetting = function(mySetting, callback) {
        var ret = lsSetObj("setting" + mySetting.settingName, mySetting, "Settings");
        if (callback) {
            callback();
        }
    };

	

    this.addCloudIndex = function(myCloudIndex, callback) {
        //console.log("AddCloudIndex");
        var ret = lsSetObj("cloudIndex" + myCloudIndex.id, myCloudIndex, "CloudIndex");
        callback(ret);
    };

    this.addContest = function(myContest, callback) {
        var ret = lsSetObj("contest", myContest, "Contest");
        callback(ret);
    };
    
    this.addCategory = function(myCategory, callback) {
        var ret = lsSetObj("category" + myCategory.name, myCategory, "Categories");
        callback(ret);
    };

	this.addContestEntry = function(myContestEntry, callback) {
		//alertDebug("store.addContestEntry");
		//alertDebug(JSON.stringify(myContestEntry));
		myContestEntry.b64 = undefined;
		var ret = lsSetObj("contestEntry" + myContestEntry.id, myContestEntry, "ContestEntries");
        callback(ret);
    };

    this.addVote = function(myVote, callback) {
        var ret = lsSetObj("vote" + myVote.id, myVote, "Votes");
        callback(ret);
    };

    this.deleteContestEntryById = function(contestEntryId, callback) {
        var e = lsGetObj("contestEntry" + contestEntryId);
        var ret = true;
        if (e !== null) {
            e.hidden = true;
            ret = lsSetObj("contestEntry" + contestEntryId, e, "ContestEntries");
        }
        if (callback) {
        	callback();
        }
    };
    
    this.deleteAllContestEntries = function(callback) {
    	var contestEntries = [];
    	var iDone = 0;
    	contestEntries = lsGetAllIndexItems("ContestEntries");
    	var l = contestEntries.length;
    	for (var i=0; i<l; i++) {
    		app.store.deleteContestEntryByIdForever(contestEntries[i].id, function() {
    			iDone ++;
    			if (iDone === l) {
    				callback();
    			}
    		});
    	}
    	if (l === 0) {
    		callback();
    	}
    };
    
    this.deleteAllCategories = function(callback) {
    	var categories= [];
    	var iDone = 0;
    	categories = lsGetAllIndexItems("Categories");
    	var l = categories.length;
    	for (var i=0; i<l; i++) {
    		app.store.deleteCategoryByNameForever(categories[i].name, function() {
    			iDone ++;
    			if (iDone === l) {
    				callback();
    			}
    		});
    	}
    	if (l === 0) {
    		callback();
    	}
    };
    
    this.deleteContestEntryByIdForever = function(contestEntryId, callback) {
    	lsRemove("contestEntry" + contestEntryId, "ContestEntries");
        callback(true);
    };
    
    this.deleteContestForever = function(callback) {
    	lsRemove("contest", "Contest");
        callback(true);
    };

	this.findContest = function(callback) {
        var contests = [];
        var contest = null;
        contests = lsGetAllIndexItems("Contest");
        if (contests.length > 0) {
        	contest = contests[0];
        }
        
        if (callback) {
        	callback(contest);	
        } else {
        	return callback;
        }
    };
    
    this.findAllContestEntries = function(callback) {
    	//alertDebug("findAllContestEntries");
        var contestEntries = [];
        contestEntries = lsGetAllIndexItems("ContestEntries");
        callback(contestEntries);
    };
    
    this.deleteIndices = function(callback) {
    	window.localStorage.removeItem("IndexCategories");
    	window.localStorage.removeItem("IndexContest");
    	window.localStorage.removeItem("IndexContestEntries");
    	window.localStorage.removeItem("IndexVotes");
    	callback();
    };
    
    this.deleteAllVotes = function(callback) {
    	var votes = [];
    	var iDone = 0;
    	votes = lsGetAllIndexItems("Votes");
    	var l = votes.length;
    	for (var i=0; i<l; i++) {
    		app.store.deleteVoteByIdForever(votes[i].id, function() {
    			iDone ++;
    			if (iDone === l) {
    				callback();
    			}
    		});
    	}
    	if (l === 0) {
    		callback();
    	}
    };
    
    this.deleteVotesByEntryId = function(entryId, callback) {
    	var votes = [];
    	var iDone = 0;
    	votes = lsGetAllIndexItems("Votes");
    	var l = votes.length;
    	for (var i=0; i<l; i++) {
    		if (votes[i].entryId === entryId) {
    			 app.store.deleteVoteByIdForever(votes[i].id, function() {
	    			iDone ++;
	    			if (iDone === l) {
	    				callback();
	    			}
	    		});	
    		} else { 
    			iDone ++;
    			if (iDone === l) {
    				callback();
    			}
    		}
    	}
    	if (l === 0) {
    		callback();
    	}
    };
    
    this.deleteVoteByIdForever = function(voteId, callback) {
    	lsRemove("vote" + voteId, "Votes");
        callback(true);
    };

    
    this.findAllVotes = function(callback) {
        var votes = [];
        votes = lsGetAllIndexItems("Votes");
        callback(votes);
    };
    
        
    this.deleteCategoryByNameForever = function(name, callback) {
    	lsRemove("category" + name, "Categories");
        callback(true);
    };

    
    this.findAllCategories = function(callback) {
        var categories = [];
        categories = lsGetAllIndexItems("Categories");
        callback(categories);
    };
    
    this.deleteSettingByNameForever = function(settingName, callback) {

        lsRemove("setting" + settingName, "Settings");

        callback(true);
    };

    this.findAllCloudIndex = function(callback) {
        var index = [];
        index = lsGetAllIndexItems("CloudIndex");
        callback(index);
    };

    this.findAllCloudHistGet = function(callback) {
        var hists = [];
        hists = lsGetAllIndexItems("CloudHistGet");
        callback(hists);
    };

    this.findAllCloudHistPush = function(callback) {
        var hists = [];
        hists = lsGetAllIndexItems("CloudHistPush");
        callback(hists);
    };

    this.findAllCloudBlobs = function(callback) {
        var blobs = [];
        blobs = lsGetAllIndexItems("CloudBlob");
        callback(blobs);
    };

    this.findAllCloudBlob = function(callback) {
        var blobs = [];
        blobs = lsGetAllIndexItems("CloudBlob");
        callback(blobs);
    };

    this.findAllCloudQueue = function(callback) {
        //console.log("localStorage.findAllCloudQueue");
        var clouds = [];
        clouds = lsGetAllIndexItems("CloudQueue");
        callback(clouds);
    };

    this.findAllSettings = function(callback) {

        var settings = [];
        settings = lsGetAllIndexItems("Settings");
        callback(settings);
    };




    this.findAllCloudQueue = function(callback) {
        var cloudQueue = [];
        cloudQueue = lsGetAllIndexItems("CloudQueue");
        callback(cloudQueue);
    };

    this.findAllCloudBlob = function(callback) {
        var cloudBlob = [];
        cloudBlob = lsGetAllIndexItems("CloudBlob");
        callback(cloudBlob);
    };

    this.findAllCloudHistGet = function(callback) {
        var cloudHistGet = [];
        cloudHistGet = lsGetAllIndexItems("CloudHistGet");
        callback(cloudHistGet);
    };

    this.findAllCloudHistPush = function(callback) {
        var cloudHistPush = [];
        cloudHistPush = lsGetAllIndexItems("CloudHistPush");
        callback(cloudHistPush);
    };

    this.saveCloudQueue = function(cloudData, cloudDataId, cloudIdRemote, cloudBlob, callback) {
        //console.log("Save Cloud Queue");
        var id = lsGetAutoInc("CloudQueue");
        //console.log(cloudData);
        //console.log("new id: " + id);
        //console.log("saveCloudQueue user: " + Globals.mUsername);
        if (cloudDataId === undefined || cloudDataId == "undefined" || cloudDataId === null) {
            cloudDataId = "";
        }
        if (cloudBlob === undefined || cloudBlob == "undefined" || cloudBlob === null) {
            cloudBlob = "";
        }
        if (cloudIdRemote === undefined || cloudIdRemote == "undefined" || cloudIdRemote === null) {
            cloudIdRemote = 0;
        }
        var cloudHasBlob;
        if (cloudBlob === "" || cloudBlob === false || cloudBlob === undefined) {
            //console.log("No BLOB: " + cloudBlob);
            cloudHasBlob = 0;
        } else {
            cloudHasBlob = -1;
        }
        //console.log("CLOUDHASBLOB: " + cloudHasBlob);
        var cloudIsBlob = 0;
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob) {
        var c = new Cloud(id, Globals.mUsername, Globals.appId, cloudIdRemote, id, cloudData, "", "", false, cloudDataId, cloudHasBlob, cloudIsBlob, 1, 1);
        //console.log("Queueing:");
        //console.log(c);
        lsSetObj("cloud" + id, c, "CloudQueue");
        //console.log("after set obj");
        if (callback) {
            //console.log("calling back");
            callback(id);
        } else {
            //console.log("callback null");
        }
        //console.log("WTF?");

    };

    this.saveCloudQueueBlob = function(cloudData, cloudIdRemote, cloudPieceId, cloudIdLocal, maxParts, callback) {
        //console.log("Save Cloud Queue Blob ");
        //console.log("Remote: " + cloudIdRemote + " Local: " + cloudIdLocal + " cloudPieceId: " + cloudPieceId + " maxParts: " + maxParts);
        var id = lsGetAutoInc("CloudQueue");
        //console.log("New Cloud ID: " + id);
        var cloudHasBlob = 0;
        var cloudIsBlob = -1;
        //var cloudPlusOne = cloudPieceId + 1;
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {

        var c = new Cloud(id, Globals.mUsername, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, "", "", false, "", cloudHasBlob, cloudIsBlob, cloudPieceId, maxParts);
        //console.log("Queue From Blob:");
        //console.log(c);
        lsSetObj("cloud" + id, c, "CloudQueue");

        // if (cloudPlusOne == maxParts) {
        // this.deleteCloudBlobById(cloudIdLocal, function() {
        // //console.log("Deleted Blob");
        // callback();
        // });
        // } else {
        //console.log("Queued blob part");
        callback();
        //}
    };

    this.saveCloudBlob = function(blobLocalId, blobData, callback) {
        //console.log("Save Cloud Blob");
        if (blobData !== undefined) {
            var id = "cloudBlob" + blobLocalId;
            var c = new CloudBlob(id, blobData, Globals.mUsername, blobLocalId);
            //console.log(c);
            lsSetObj(id, c, "CloudBlob");
        }
        callback();
    };

   

    this.deleteCloudById = function(myCloud, callback) {
        //console.log("Delete cloud by id");
        //console.log(myCloud);
        if (myCloud.cloudId !== undefined) {
            //console.log('deleteCloudById: cloud' + myCloud.cloudId);
            lsRemove("cloud" + myCloud.cloudId, "CloudQueue");
        }
        callback();
    };

    this.deleteCloudIndexById = function(indexId, callback) {
        //console.log("Delete cloud index by id");
        //console.log(indexId);
        if (indexId !== undefined) {
            //console.log('deleteCloudById: cloud' + myCloud.cloudId);
            lsRemove("cloudIndex" + indexId, "CloudIndex");
        }
        callback();
    };

    this.deleteCloudBlobById = function(cloudBlobId, callback) {
        //console.log("Delete cloud blob by id " + cloudBlobId);
        if (cloudBlobId !== undefined) {
            //console.log('deleteCloudBlobById: ' + cloudBlobId);
            lsRemove(cloudBlobId, "CloudBlob");
        }
        callback();
    };

	this.findContestEntryById = function(entryId, callback) {
        var id = "contestEntry" + entryId;
        var myContestEntry = lsGetObj(id);
        callback(myContestEntry);
    };

    this.findBlobById = function(localId, callback) {
        //console.log("Find blob by localId: " + localId);
        // var blobs;
        // var myBlob=null;
        // blobs=lsGetAllIndexItems("CloudBlob");
        // for (var i=0;i<blobs.length;i++){
        // if (blobs[i].localId == localId) {
        // myBlob = blobs[i];
        // break;
        // }
        // }
        // callback(myBlob);
        var id = "cloudBlob" + localId;
        var myBlob = lsGetObj(id);
        //console.log("found:");
        //console.log(myBlob);
        callback(myBlob);
    };

    this.findSettingByName = function(settingName, callback) {
        var setting = lsGetObj("setting" + settingName);
        //console.log("found:");
        //console.log(exerciseDone);
        callback(setting);
    };

    this.saveSetting = function(settingName, settingValue, callback) {
        //console.log("savsetting: " + settingName + " " + settingValue);
        var ts = getTimestamp();
        var s = new Setting(settingName, settingValue, Globals.mUsername, ts);
        lsSetObj("setting" + settingName, s, "Settings");
        if (callback !== undefined) {
            callback();
        }
    };

    this.getSetting = function(settingName, settingDefault, callback) {
        //console.log("[LS]getsetting: " + settingName);
        var s = lsGetObj("setting" + settingName);
        var ret;
        if (s !== null && s !== undefined) {
            //console.log("Value: " + s.settingValue);
            callback(s.settingValue);
        } else {
            //console.log("Default: " + settingDefault);
            callback(settingDefault);
        }
    };

	this.getSettingObj = function(settingName, callback) {
        //console.log("[LS]getsettingObj: " + settingName);
        var s = lsGetObj("setting" + settingName);
        if (s) {
        	callback(s);
        } else {
        	callback(null);
        }
    };
    
    this.addInAppPurchase = function(myInAppPurchase, callback) {
    	var ret = lsSetObj("inAppPurchase" + myInAppPurchase.transactionId, myInAppPurchase, "InAppPurchases");
        callback(ret);
    };
    
    this.findAllInAppPurchases = function(callback) {
        var iap = [];
        iap = lsGetAllIndexItems("InAppPurchases");
        callback(iap);
    };
    
    this.findInAppPurchaseByTransactionId = function(transactionId, callback) {
        var id = "inAppPurchase" + transactionId;
        var myInAppPurchase = lsGetObj(id);
        callback(myInAppPurchase);
    };
    
    this.findInAppPurchaseByProductId = function(productId, callback) {
    	var iap = [];
    	iap = lsGetAllIndexItems("InAppPurchases");
    	var l = iap.length;
    	var ret = null;
    	for (var i=0; i<l; i++) {
    		if (iap[i].productId === productId) {
    			ret = iap[i];
    			break;
    		}
    	}  
    	callback(ret);
    };
    
    this.deleteAllInAppPurchases = function(callback) {
    	var iap = [];
    	var iDone = 0;
    	iap = lsGetAllIndexItems("InAppPurchases");
    	var l = iap.length;
    	for (var i=0; i<l; i++) {
    		app.store.deleteInAppPurchaseByIdForever(iap[i].transactionId, function() {
    			iDone ++;
    			if (iDone === l) {
    				callback();
    			}
    		});
    	}
    	if (l === 0) {
    		callback();
    	}
    };
    
    this.deleteInAppPurchaseByIdForever = function(transactionId, callback) {
    	lsRemove("inAppPurchase" + transactionId, "InAppPurchases");
        callback(true);
    };

    this.initializeStorage(successCallback, errorCallback);

};