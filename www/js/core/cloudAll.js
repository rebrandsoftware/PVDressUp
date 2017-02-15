/*
 * New Cloud

CloudLocal.createIndex(callback)
Every object has a timestamp in an index generated the first time cloud sync is turned on

CloudAll.loadIndex()
Creates an index in memory from the stored index, faster than loading from store every time

CloudAll.index[]
The index holds a unique id (object type | object id), username and timestamp

CloudAll.updateIndex(itemId, itemType, callback)
Whenever the object is updated or deleted, the timestamp is adjusted to the current time
Add or updates the memory and stored indices

GetSetting("indexLastSync")
CloudAll.indexLastSync
Each cloud account has a "last sync" timestamp associated with it’s cloud username

CloudAll.getSyncItems(callback)
CloudAll.itemsToSync[]
CloudAll.totalSyncItems
CloudAll.completedSyncItems

if itemsToSync is not empty or totalSyncItems <> completedSyncItems then abort

To find items to sync, sort by timestamp, work backwards until an item with a lesser timestamp is found
Sets itemsToSync[], an array containing items to push to the server
Set CloudAll.totalSyncItems to the number of array items
Set CloudAll.completedSyncItems to 0

CloudAll.itemsToSync[]
CloudAll.checkIndex(itemId, itemType, callback)
CloudLocal.createQueueMessage(indexItem)
For each item in the index array, get the queue message

CloudAll.push (appId, username, password, callback)
	CloudAll.findNext(modified to search the index of itemsToSync)
CloudAll.deleteIndex
If the item exists, create a cloud object and push it to the server
If the item does not exist, push a delete message and remove the index entry
Also remove the entry from the memory index

CloudAll.updateIndex (forceTimeStamp)
After an item is synced, it’s timestamp becomes that Last Sync timestamp for that cloud account so it won’t be synced again until it is modified
 * 
 */
function Cloud(cloudId, user, appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {
    this.cloudId = cloudId;
    this.appId = Globals.appId;
    this.cloudData = cloudData;
    this.cloudIdRemote = cloudIdRemote;
    this.cloudIdLocal = cloudIdLocal;
    this.username = escape(username);
    this.password = escape(password);
    this.cloudHasBlob = cloudHasBlob;
    this.cloudIsBlob = cloudIsBlob;
    this.cloudDataId = cloudDataId;
    this.pushClient = CloudAll.pushClient;
    this.dataPart = dataPart;
    this.dataTotal = dataTotal;
}

function CloudIndex(id, username, timestamp) {
    this.id = id;
    this.username = username;
    this.timestamp = timestamp;
}

function CloudBlob(id, data, user, localId) {
    this.id = id;
    this.data = data;
    this.user = user;
    this.localId = localId;
}

function CloudHist(cloudId, cloudUsername) {
    //cloudId format: "cloudHistPush" + Globals.mUsername + cloudUsername + cloudHist.cloudId
    //cloudId format: "cloudHistGet" + Globals.mUsername + cloudUsername + cloudHist.cloudIdRemote
    this.cloudId = cloudId;
    this.cloudUsername = cloudUsername;
    this.username = Globals.mUsername;
}

var CloudAll = {
	autoRefresh: function(b, callback) {
		//console.log("[CloudAll]autoRefresh " + b);
		var ts = getTimestamp();
		if ((b === true || b === undefined) && ((ts - CloudAll.autoRefreshed) >= CloudAll.autoRefreshDelay)) {
			//console.log(">Start");
			if (CloudAll.isReady === true) {
				//console.log(">Refreshing");
				CloudAll.autoRefreshTimeout = setTimeout(CloudAll.autoRefresh, CloudAll.autoRefreshDelay);
				CloudAll.autoRefreshed = getTimestamp();
				CloudAll.ready(function() {
					if (callback) {
						callback();
					}	
				});
			} else {
				//console.log(">NoCloud");
				clearTimeout(CloudAll.autoRefresh);
				if (callback) {
					callback();
				}
			}
		} else if (b === true || b === undefined && ((ts - CloudAll.autoRefreshed) < CloudAll.autoRefreshDelay)) {
			//console.log(">Already Running");
			if (callback) {
				callback();
			}
		} else {
			//console.log(">Stopping");
			CloudAll.autoRefreshing = false;
			clearTimeout(CloudAll.autoRefresh);
			if (callback) {
				callback();
			}
		}
	},
    loadIndex: function(callback) {
        var username = CloudAll.username;

        //console.log("[CloudAll]loadIndex " + username);
        if (username !== "") {
            app.store.findAllCloudIndex(function(allIndex) {
                //console.log("allIndex:");
                //console.log(allIndex);
                var l = allIndex.length;
                var index = [];
                for (var i = 0; i < l; i++) {
                    if (allIndex[i].username === username) {
                        //console.log("usernames equal");
                        index.push(allIndex[i]);
                    }
                }

                index = index.sort(dynamicSort("-timestamp"));
                CloudAll.index = index;

                //console.log("Done, calling back");
                Shell.getSetting("indexLastUpdate", 0, function(setting) {
                    //console.log("indexLastUpdate: " + setting);
                    CloudAll.indexLastUpdate = setting;
                    Shell.getSetting("indexLastSync", 0, function(setting) {
                        //console.log("indexLastSync: " + setting);
                        CloudAll.indexLastSync = setting;
                        CloudAll.indexLoaded = true;
                        callback();
                    });

                });
            });
        } else {
            callback();
        }
    },

    checkIndex: function(itemId, itemType, callback) {
        //console.log("[CloudAll]checkIndex " + itemId + itemType);
        var newId = itemType + "|" + itemId;
        var index = CloudAll.index;
        //console.log(index);
        var l = index.length;
        var ret = null;
        for (var i = 0; i < l; i++) {
            //console.log("if " + index[i].id + " === " + newId);
            if (index[i].id === newId) {
                ret = index[i];
                //console.log("got index");
                break;
            }
        }
        //console.log(ret);	
        callback(ret);
    },



    findIndexId: function(newId) {
        //console.log("[CloudAll]findIndexId " + newId);
        var index = CloudAll.index;
        var l = index.length;
        var foundItemId = -1;
        for (var i = 0; i < l; i++) {
            //console.log("if " + index[i].id + " === " + newId);
            if (index[i].id === newId) {
                foundItemId = i;
                break;
            }
        }
        //console.log("Found: " + foundItemId);
        return foundItemId;
    },

    deleteIndex: function(itemId, itemType, callback) {
        //console.log("[CloudAll]deleteIndex " + itemId + " " + itemType);
        var newId = itemType + "|" + itemId;
        var foundItemId = -1;
        foundItemId = CloudAll.findIndexId(newId);
		//console.log("foundItemId: " + foundItemId);
        if (foundItemId >= 0) {
            CloudAll.index.splice(foundItemId, 1);
            //console.log("NEWLEN: " + CloudAll.index.length);
        }

        app.store.deleteCloudIndexById(newId, function() {
            callback();
        });
    },

    updateIndex: function(itemId, itemType, callback, bNoDupeCheck, forceTimeStamp) {
    	//console.log("[CloudAll]updateIndex " + itemId + " " + itemType);
        var username = CloudAll.username;
        //var index = CloudAll.index;
        if (username !== "") {


            var timeStamp;
            if (forceTimeStamp === undefined) {
                timeStamp = getTimestamp();
            } else {
                timeStamp = forceTimeStamp;
            }
            var newId = itemType + "|" + itemId;
            var myIndex = new CloudIndex(newId, username, timeStamp);
            var foundItemId = -1;
            if (bNoDupeCheck === undefined) {
                bNoDupeCheck = false;
            }

            if (bNoDupeCheck === false) {
                foundItemId = CloudAll.findIndexId(newId);
            }
            if (foundItemId === -1) {
                //the item doesn't exist in memory, add it
                CloudAll.index.push(myIndex);
                //console.log("added to index");
            } else {
                if (timeStamp > CloudAll.indexLastSync) {
                	//console.log("timestamp is greater, moving to the end");
                	//the item exists in memory, update it and move it to the end of the index because it has the newest timestamp
                
                	CloudAll.index.splice(foundItemId, 1);
                	CloudAll.index.push(myIndex);	
                } else {
                	//console.log("timestamp <= so simply updating");
                	CloudAll.index[foundItemId].timestamp = timeStamp;
                }
            }

            //also save it to storage for later
            app.store.addCloudIndex(myIndex, function() {
                //increment the last update counter to match this item's timestamp
                Shell.saveSetting("indexLastUpdate", timeStamp, function() {
                    CloudAll.indexLastUpdate = timeStamp;
                    CloudAll.startPushDelay(function() {
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
        } else {
            if (callback) {
                callback();
            }
        }
    },

    getSyncItems: function(callback) {
        //console.log("[CloudAll]getSyncItems");
        //newest items are at the end
        //work backwards, adding only items greater than the last update
        
        var lastSync = CloudAll.indexLastSync;
        var index = CloudAll.index;
        //console.log(index);
        index.sort(dynamicSort("timestamp"));
        var l = index.length;
        //console.log("Index Length: " + l);
        var syncItems = [];
        var ts;
        var timeStamp = getTimestamp();

        for (var i = l - 1; i >= 0; i--) {
            ts = index[i].timestamp;
            //console.log(i + " if " + ts + " >= " + lastSync);
            if (ts >= lastSync) {
                syncItems.push(index[i]);
                //console.log("pushed");
            } else {
                //console.log("break");
                break;
            }
        }
        CloudAll.indexLastSync = timeStamp;
        Shell.saveSetting("indexLastSync", timeStamp, function() {
            CloudAll.itemsAdded += syncItems.length;
	        //console.log("items added: " + CloudAll.itemsAdded);
	        CloudAll.itemsToSync = syncItems;
	        //console.log(CloudAll.itemsToSync);
	        //console.log(CloudAll.itemsToSync.length);
	        callback();
        });
    },

    findNextCloud: function(username, cloudUsername, callback) {
        //console.log("[CloudAll]findNextCloud un:" + username + " cun:" + cloudUsername);

        var settingString = CloudAll.getSettingString("Get", username, cloudUsername);
        Shell.getSetting(settingString, 0, function(setting) {
            //console.log("setting: " + setting);
            var cloudRet = new CloudHist(setting, cloudUsername);
            callback(cloudRet);
        });
    },

    findNext: function(username, cloudUsername, cloudType, callback) {

        var tryToPush = function(itemsToSync, callback) {
            if (itemsToSync.length > 0) {
                //console.log("there are already items, so get one");
                var obj = CloudAll.itemsToSync.pop(0);
                processItem(obj, function(cloud) {
                    callback(cloud);
                });
            } else {
                callback(null);
            }
        };

        //console.log("[CloudAll]findNext un: " + username + " cun: " + cloudUsername + " ct:" + cloudType);
        var processItem = function(obj, callback) {
            //console.log("[CloudAll]findNext.processItem");
            CloudLocal.createQueueMessage(obj, function(message, dataId) {
                //console.log("message: " + message);
                //cloudId, user, appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal
                var cloud = new Cloud(obj.id, "", 0, 0, obj.id, message, "", "", false, dataId, false, false, 1, 1);
                //console.log(cloud);
                callback(cloud);
            });
        };

        //console.log("APP findnext cloud: " + cloudType + username + cloudUsername);
        if (cloudType === "get") {
            //console.log("cloudType get");
            CloudAll.findNextCloud(username, cloudUsername, function(cloud) {
                //console.log("Found ");
                //console.log(cloud);
                //Toast.toast(cloud.cloudId + " / " + cloud.cloudIdLocal + "/" + cloud.cloudIdRemote);

                callback(cloud);
            });
        } else if (cloudType === "push") {
            //console.log("cloudType push");
            tryToPush(CloudAll.itemsToSync, function(ret) {
                if (ret) {
                    //processed item and got cloud
                    callback(ret);
                } else {
                    CloudAll.getSyncItems(function() {
                        tryToPush(CloudAll.itemsToSync, function(ret) {
                            callback(ret);
                        });
                    });
                }
            });
        }
    },

    get: function(appId, username, password, callback) {
        //console.log('[CloudAll]Get');
        //console.log("appId: " + appId);
        //console.log("u: " + username);
        //console.log("p: " + password);
        CloudAll.lastCloudActivity = getTimestamp();
        CloudAll.findNext(Globals.mUsername, username, "get", function(cloudHist) {
            //console.log("Next Cloud to Get:");
            //console.log(cloudHist);
            var cloudIdRemote;
            var l;
            cloudIdRemote = cloudHist.cloudId;
            //console.log("Last cloud id remote: " + cloudIdRemote);
            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
            var myCloud = new Cloud(0, '', Globals.appId, cloudIdRemote, 0, '', username, password, null, '', 0, 0, 0, 1, 1);
            //console.log('GET REQUEST:');
            //console.log(myCloud);

            var url = "https://rebrandcloud.secure.omnis.com/cloud/get.2.0.asp";
            //console.log(url + "?" + serialize(myCloud));

            Internet.getURLSource(url, myCloud, false, function(data) {
                if (data) {
                    //console.log('CloudGet done');
                    //console.log(data);
                    l = data.length;

                    for (var i = 0; i < l; i++) {
                        //console.log(data[i].cloudData);
                        if (data[i].cloudData != 'undefined') {
                            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
                            var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, data[i].cloudIdRemote, 0, unescape(data[i].cloudData), username, password, 'decode', '', data[i].cloudHasBlob, 0, 1, 1);

                            myCloud.pushClient = data[i].pushClient;
                            //console.log('GOT CLOUD');
                            //console.log(myCloud);
                            callback(true, myCloud, i, l - 1);
                        } else {
                            //console.log("undefined?");
                            callback(false, null, i, l - 1);
                        }
                    }
                    if (l <= 0) {
                        //console.log("no length");
                        callback(false, null, 0, 0);
                    }
                } else {

                    callback(false, null, 0, 0);
                }
            });
        });
    },

    getBlob: function(myCloud, callback) {
        //console.log('[CloudAll]getBlob');
        var clouds = [];

        var url = 'https://rebrandcloud.secure.omnis.com/cloud/getBlob.asp';
        //console.log(url + "?" + serialize(myCloud));
        Internet.getURLSource(url, myCloud, false, function(data) {
            if (data) {
                //console.log('CloudGetBlob done' + data.length);
                //console.log(data);
                // 
                for (var i = 0; i < data.length; i++) {
                    // //console.log(data[i].cloudData);
                    if (data[i].cloudData != 'undefined') {
                        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
                        var newCloud = new Cloud(0, Globals.mUsername, Globals.appId, data[i].cloudIdRemote, 0, unescape(data[i].cloudData), myCloud.username, myCloud.password, 'decode', '', 0, -1, 1, 1);
                        newCloud.pushClient = 0;
                        //console.log(myCloud);
                        clouds.push(newCloud);
                    }
                }
            }
            callback(true, clouds);
        });

    },

    login: function(appId, username, password, callback) {
    	CloudAll.lastCloudActivity = getTimestamp();
        //console.log("[CloudAll]login");
        //console.log("Cloud login");
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
        var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, 0, 0, '', username, password, null, '', 0, 0, 1, 1);
        var online = Internet.isOnline();
        
        if (online) {
            //console.log('Navigator online');
            if (Internet.hostReachable()) {
                //console.log('Host reachable, begin cloud');
                //console.log('sending');
                //console.log(myCloud);
                Internet.getURLSource('https://rebrandcloud.secure.omnis.com/cloud/login.asp', myCloud, false, function(data) {
                    if (data) {
                        if (data.cloudData !== undefined) {
                            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {
                            var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, 0, 0, unescape(data.cloudData), username, password, 'decode', '', 0, 0, 1, 1);
                            callback(true, myCloud);
                        }
                    }
                });

            } else {
                Toast.toast("Cloud Host Unreachable"); //"Please connect to the internet first"
                callback(false, null);
            }
        } else {
            Toast.toast("Please connect to the internet first"); //Please connect to the internet first
            callback(false, null);
        }
    },

    parseLogin: function(myCloud, callback) {
        //console.log('[CloudAll]parseLogin');
        //console.log(myCloud);
        //console.log('Cloud ID: ' + myCloud.cloudIdLocal);
        //console.log('Cloud Data: ' + myCloud.cloudData);
        if (myCloud !== null) {
            switch (myCloud.cloudData) {
                case 'success':
                    Shell.saveSetting('cloudUsername' + Globals.cloudUserSpecific, myCloud.username);
                    Shell.saveSetting('cloudPassword' + Globals.cloudUserSpecific, myCloud.password);
                    CloudAll.username = myCloud.username;
                    CloudAll.password = myCloud.password;
                    $('#saveCloudLogin').text("Sign Out"); //"Sign Out"

                    Toast.toast("Cloud storage active!"); //"Cloud storage active!"
                    callback(true);
                    break;
                case 'fail':
                    CloudAll.username = "";
                    CloudAll.password = "";
                    Toast.toast("Incorrect username or password"); //"Incorrect username or password"
                    callback(false);
                    break;
                case undefined:
                    CloudAll.username = "";
                    CloudAll.password = "";
                    Toast.toast("Login error"); //"Incorrect username or password"
                    callback(false);
                    break;
            }
        } else {
            callback(false);
        }

    },

    parsePush: function(myCloud, callback) {
        //console.log("[CloudAll]parsePush: " + myCloud.cloudData);
        //console.log(myCloud);
        CloudAll.completedSyncItems++;
        switch (myCloud.cloudData) {
            case 'success':
                //update the index of this item 
                //CloudAll.updateIndex

                var cloudId = myCloud.cloudId;
                cloudId = cloudId.replace("%7C", "|");
                var a = cloudId.split("|");
                var itemType = a[0];
                var itemId = a[1];
                CloudAll.updateIndex(itemId, itemType, function() {
                    //console.log("updated index");
                    //Shell.saveSetting("indexLastSync", CloudAll.indexStartSync, function() {
                    //    CloudAll.indexLastSync = CloudAll.indexStartSync;
                        callback(true, myCloud);
                    //});
                }, false, 0);

                break;
            default:
                callback(false, myCloud);
                break;
        }

    },

    processBlob: function(myCloud, callback) {
        //console.log('cloudProcessBlob');
        var cloudIdLocal = myCloud.cloudId;
        //console.log("Cloud ID Local: " + cloudIdLocal);

        //find blob from local id
        app.store.findBlobById(cloudIdLocal, function(blob) {
            if (blob !== null) {
                //console.log("blob part found");
                var myBlob = blob.data;
                //console.log(myBlob);
                //split blob into chunks
                //var re = new RegExp("[\s\S]{1," + cloudBlobLength + "}", "g");
                //4096 = success
                //6144 = success
                //8192 = fail
                var parts = myBlob.match(/[\s\S]{1,4096}/g) || [];
                //console.log(parts[0].length);
                //console.log("Blob split to " + parts.length + "parts");
                callback(parts);
            } else {
                //console.log("No blob parts found");
                callback([]);
            }
        });
    },

    encode: function(data) {
        data = data.replace(/\|/g, "@@BAR@@");
        data = data.replace(/\^/g, "@@CAR@@");
        data = data.replace(/\"/g, "@@QUO@@");
        data = data.replace(/(?:\r\n|\r|\n)/g, ' ');
        return data;
    },

    decode: function(data) {
        data = data.replace(/@@BAR@@/g, "|");
        data = data.replace(/@@CAR@@/g, "^");
        data = data.replace(/@@QUO@@/g, '"');
        return data;
    },

    processBlobIntoParts: function(myCloudData, callback) {
        //console.log('cloudProcessBlobIntoParts');


        //find blob from local id
        if (myCloudData) {
            //console.log("blob part found");

            //console.log(myBlob);
            //split blob into chunks
            //var re = new RegExp("[\s\S]{1," + cloudBlobLength + "}", "g");
            //4096 = success
            //6144 = success
            //8192 = fail
            var parts = myCloudData.match(/[\s\S]{1,4096}/g) || [];
            //console.log(parts[0].length);
            //console.log("Blob split to " + parts.length + "parts");
            callback(parts);
        } else {
            //console.log("No blob parts found");
            callback([]);
        }

    },

    clearLogin: function(callback) {
        //console.log("[CloudAll]clearLogin");
        CloudAll.lastCloudActivity = 0;
        Shell.saveSetting('cloudUsername' + Globals.cloudUserSpecific, '');
        Shell.saveSetting('cloudPassword' + Globals.cloudUserSpecific, '');
        if (callback) {
            callback();
        }
    },

    queueBlobPart: function(cloudData, cloudIdRemote, cloudPartId, cloudIdLocal, maxParts, callback) {
        app.store.saveCloudQueueBlob(cloudData, cloudIdRemote, cloudPartId, cloudIdLocal, maxParts, function() {
            callback();
        });
    },

    push: function(appId, username, password, callback) {
    	CloudAll.lastCloudActivity = getTimestamp();
        //console.log("[CloudAll]push");
        //var a;
        //var ddd;
        //var lastCloudIdLocal;
        //console.log("lastCloudIdLocal username: " + cloudUsername);

        CloudAll.findNext(Globals.mUsername, username, "push", function(c, pct) {

            //console.log("next cloud:");
            //console.log(c);
            var getInternet = function(cloudURL, myCloud, i, l, callback) {
                //console.log(cloudURL);
                Internet.getURLSource(cloudURL, myCloud, false, function(data) {
                    callback(data, i, l);
                });
            };

            var getB64 = function(obj, callback) {
                //console.log("getB64");
                //console.log(obj);
                var a;
                var fileURI;
                var delim = "|";
                if (obj.cloudData.indexOf("AddPlayerPhoto") > -1 || obj.cloudData.indexOf("AddGamePhoto") > -1) {
                    //console.log("Player or Game photo");
                    if (Device.platform === "iOS" || Device.platform === "Android" || Device.platform === "WinPhone") {
                        if (obj.cloudData.indexOf("|") > -1) {
                            a = obj.cloudData.split("|");
                            delim = "|";

                        } else if (obj.cloudData.indexOf("%7C") > -1) {
                            a = obj.cloudData.split("%7C");
                            delim = "%7C";
                        }
                        //console.log("a:");
                        //console.log(a);
                        //console.log(delim);
                        fileURI = a[2];
                        //console.log("fileURI: " + fileURI);
                        if (fileURI.indexOf("file:///" > -1) || fileURI.charAt(0) === "/") {
                            //console.log("it's the proper format");
                            if (fileURI.indexOf("ScoreGeekDLs") === 0) {
                                FileIO.getFileURI(fileURI, function(fileURI) {
                                    //console.log("Got new file URI: " + fileURI);
                                    FileIO.getB64FromFileURI(fileURI, function(b64) {
                                        //console.log("Got b64:");
                                        //console.log(b64);
                                        obj.cloudData = a[0] + delim + a[1] + delim + b64;
                                        //console.log("Cloud Data After b64: ");
                                        //console.log(obj);
                                        callback(obj);
                                    });
                                });
                            } else {
                                //console.log("trying to use ScoreGeekDLs uri");
                                callback(obj);
                            }
                        } else {
                            //console.log("wrong format");
                            callback(obj);
                        }

                    } else {
                        //console.log("wrong device");
                        callback(obj);
                    }
                } else {
                    //console.log("Not a photo blob");
                    callback(obj);
                }
            };

            //window.localStorage.getItem("allLogs", function(item) {
            //console.log(item);
            //});
            //console.log("Found next cloud ");
            //console.log(c);
            if (c) {
                //console.log("cloud not null");
                //console.log("PUSHING:");
                //console.log(c);
                var cloudURL;
                var cloudHasBlob;
                var sToast = "";
                //var l = clouds.length;
                //console.log('clouds found: ' + l);
                //for (var i = 0; i < l; i++) {
                //c = clouds[i];

                cloudHasBlob = c.cloudHasBlob;
                //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)

                var myCloud = new Cloud(c.cloudId, Globals.mUsername, Globals.appId, c.cloudIdRemote, c.cloudId, c.cloudData, username, password, 'encode', c.cloudDataId, c.cloudHasBlob, c.cloudIsBlob, c.dataPart, c.dataTotal);
                //console.log("myCloud");
                //console.log(myCloud);

                if (c.cloudIsBlob == -1 || c.cloudIsBlob == "-1") {

                    //ddd = getDots(iDots);

                    sToast = "Uploading Photo (" + pct + " pieces)";
                    //console.log(sToast);

                    cloudURL = 'https://rebrandCloud.secure.omnis.com/cloud/pushBlob.asp';
                    //console.log("pushing blob");
                } else {

                    //ddd = getDots(iDots);

                    sToast = "Uploading Data";
                    //console.log(sToast);

                    cloudURL = 'https://rebrandcloud.secure.omnis.com/cloud/push.asp';
                }

                getB64(myCloud, function(myCloud) {
                    //console.log("cloud after getb64");
                    CloudAll.processBlobIntoParts(myCloud.cloudData, function(parts) {
                    	CloudAll.itemsSent ++;
                    	//console.log("itemsSent: " + CloudAll.itemsSent);
                        var l = parts.length;
                        for (var i = 0; i < l; i++) {
                            myCloud.cloudData = parts[i];
                            myCloud.dataPart = i;
                            myCloud.dataTotal = l;
                            getInternet(cloudURL, myCloud, i, l, function(data, i, l) {
                                if (data) {
                                    //console.log(data);
                                    var myCloud = new Cloud(data.cloudIdLocal, Globals.mUsername, Globals.appId, data.cloudIdRemote, data.cloudIdLocal, unescape(data.cloudData), username, password, 'decode', '', data.cloudHasBlob, 0, 1, 1);
                                    //console.log(myCloud);
                                    if (myCloud.cloudData == "success") {
                                        if (c.cloudIsBlob == -1 || c.cloudIsBlob == "-1") {
                                            CloudAll.deleteById(myCloud, function() {
                                                //console.log("deleted part " + myCloud.cloudId);
                                            });
                                        }

                                        var dNow = getTimestamp();
                                        if (dNow - CloudAll.lastMini > 1500) {
                                            CloudAll.lastMini = dNow;
                                            Shell.getSetting("chkCloudActivity", "true", function(setting) {
                                                if (setting === "true") {
                                                    Toast.toastMini(sToast);
                                                }
                                            });
                                        }
                                        if (i === l - 1) {


                                            callback(true, myCloud);
                                        }
                                    } else {
                                        if (i === l - 1) {
                                            //console.log("NO SUCCESS");
                                            //console.log(myCloud);
                                            callback(false, null);
                                        }
                                    }
                                } else {
                                	//console.log("NO DATA");
                                	//console.log(myCloud);
                                    if (i === l - 1) {


                                        //console.log("no data");
                                        callback(false, null);
                                    }
                                }
                            });

                        }
                    });
                });

            } else {
                //console.log("C WAS NULL, Not pushing");
                callback(false, null);
            }
            //}
        });
    },

    start: function(bGet, bPush) {
        //console.log("[CloudAll]start bGet: " + bGet + " bPush: " + bPush);
        
        var d = getTimestamp();
        //console.log("CloudStart " + (d - CloudAll.last));
        CloudAll.last = d;
        //CloudAll.abort = false;

        clearTimeout(CloudAll.timeout);
        if (CloudAll.active === false && CloudAll.abort === false) {
        	CloudAll.lastCloudActivity = d;
            CloudAll.active = true;
            CloudAll.resetTimeout = setTimeout(CloudAll.resetQueue, CloudAll.queueResetTime);
            //console.log("------CLOUD START: Get=" + bGet + ", Push=" + bPush);
            if (bGet === true && bPush === true) {

                CloudAll.startGet(function(getSuccess, repeat) {
                    //console.log("CALLBACK FROM CLOUDSTARTGET: " + getSuccess);
                    if (repeat === true) {
                        if (CloudAll.abort === false) {
                            //there is more data on the cloud, get it
                            //console.log("getting more cloud data");
                            clearTimeout(CloudAll.resetTimeout);
                            CloudAll.active = false;
                            //console.log("setTimeout3");
                            CloudAll.timeout = setTimeout(CloudAll.start(true, true), 300);
                        } else {
                            //console.log("Not repeating");
                        }
                    } else {
                        //console.log("try to push instead");
                        //console.log(JSON.stringify(localStorage).length);
                        CloudAll.startPush(function(pushSuccess) {
                            clearTimeout(CloudAll.resetTimeout);
                            //console.log("CALLBACK FROM CLOUDSTARTPUSH: " + pushSuccess);
                            CloudAll.active = false;
                            if (pushSuccess === true) {
                                //console.log('setTimeout4');
                                CloudAll.timeout = setTimeout(CloudAll.start(false, pushSuccess), 300);
                            }
                        });
                    }
                });
            } else if (bPush === true) {
                //console.log("push");
                CloudAll.startPush(function(pushSuccess) {
                    clearTimeout(CloudAll.resetTimeout);
                    //console.log("CALLBACK FROM CLOUDSTARTPUSH2: " + pushSuccess);
                    CloudAll.active = false;
                    if (pushSuccess === true) {
                        //console.log('setTimeout5');
                        clearTimeout(CloudAll.timeout);
                        CloudAll.timeout = setTimeout(CloudAll.start(false, pushSuccess), 300);
                    }
                });
            }
        } else {
            //console.log("Cloud Already Active, Skipping");
        }

    },

    startPushDelay: function(callback) {
        clearTimeout(CloudAll.pushTimeout);
        CloudAll.pushTimeout = setTimeout(CloudAll.startPush, CloudAll.pushDelay);
        callback();
    },
    startPush: function(callback) {
        //console.log("[CloudAll]startPush");
        var i;
        var l;
        var part;
        var cloudIdRemote = 0;
        var cloudIdLocal = 0;

        if (callback) {
            //do nothing
        } else {
            //console.log("set callback to empty function");
            callback = function() {};
        }

        Shell.getSetting('cloudUsername' + Globals.cloudUserSpecific, '', function(setting) {
            //console.log(setting);
            CloudAll.username = setting;
            if (CloudAll.username !== '') {
                Shell.getSetting('cloudPassword' + Globals.cloudUserSpecific, '', function(setting) {
                    //console.log(setting);
                    CloudAll.password = setting;
                    if (CloudAll.password !== '') {
                        //console.log("pass not blank");
                        var online = Internet.isOnline();

                        if (online) {
                            //console.log("online");
                            if (Internet.hostReachable()) {
                                //console.log("reachable");
                                CloudAll.push(Globals.appId, CloudAll.username, CloudAll.password, function(success, myCloud) {
                                    //console.log("PUSH SUCCESS: " + success);
                                    //console.log(myCloud);
                                    if (success === true) {
                                        cloudIdRemote = myCloud.cloudIdRemote;
                                        cloudIdLocal = myCloud.cloudIdLocal;
                                        CloudAll.parsePush(myCloud, function(success) {
                                            if (success === true) {
                                                //console.log("Saving cloud history");
                                                //CloudAll.saveHist(myCloud.cloudId, Globals.mUsername, CloudAll.username, "push", function() {
                                                if (myCloud.cloudHasBlob == -1 || myCloud.cloudHasBlob == '-1') {
                                                    CloudAll.processBlob(myCloud, function(blobParts) {
                                                        // 
                                                        l = blobParts.length;
                                                        //console.log("blob parts: " + l);
                                                        for (i = 0; i < l; i++) {
                                                            part = blobParts[i];
                                                            //console.log(part);
                                                            CloudAll.queueBlobPart(part, cloudIdRemote, i, cloudIdLocal, blobParts.length, function() {
                                                                //console.log("Queued");
                                                            });
                                                        }
                                                        if (l <= 0) {
                                                            callback(false);
                                                        } else {
                                                            callback(true);
                                                        }
                                                    });
                                                } else {
                                                    //console.log("Saved History");
                                                    callback(true);
                                                }
                                                //});
                                            } else {
                                                //console.log("NOT saving cloud history");
                                                callback(false);
                                            }
                                        });
                                    } else {
                                        //console.log("NOT successful push");
                                        callback(false);
                                    }
                                });
                            } else {
                                //console.log("NOT host reachable");
                                callback(false);
                            }
                        } else {
                            //console.log("NOT online");
                            callback(false);
                        }
                    } else {
                        //console.log("NOT password");
                        callback(false);
                    }
                });
            } else {
                //console.log("NOT username");
                callback(false);
            }
        });
    },

    startGet: function(callback) {
        //console.log("[CloudAll]startGet");
        var i;
        var l;
        var repeat = null;
        var cloudBlob;
        var parseIt;

        parseIt = function(i2, l2, cloudGetSuccess2, repeat2, cloudNumber2, cloudMax2, cloudBlob2, callback2) {
            CloudLocal.parseGet(cloudBlob2, function(afterParseSuccess, afterParse) {
                if (afterParseSuccess === true) {
                    // 
                    if (i2 === l2 - 1) {
                        //console.log("if " + cloudNumber2 + " >= " + cloudMax2);
                        if (cloudNumber2 >= cloudMax2) {
                            callback(cloudGetSuccess2, repeat2);
                        }
                    }
                    // 
                } else {
                    //console.log("Blob parse failed");
                    if (i2 === l2 - 1) {
                        //console.log("if " + cloudNumber2 + " >= " + cloudMax2);
                        if (cloudNumber2 >= cloudMax2) {
                            callback(cloudGetSuccess2, repeat2);
                        }
                    }
                }
            });
        };

        Shell.getSetting('cloudUsername' + Globals.cloudUserSpecific, '', function(setting) {
            CloudAll.username = setting;
            if (CloudAll.username !== '') {
                Shell.getSetting('cloudPassword' + Globals.cloudUserSpecific, '', function(setting) {
                    CloudAll.password = setting;
                    if (CloudAll.password !== '') {
                    	CloudAll.lastCloudActivity = getTimestamp();
                        var online = Internet.isOnline();
                        if (online) {
                            if (Internet.hostReachable()) {
                                CloudAll.get(Globals.appId, CloudAll.username, CloudAll.password, function(cloudGetSuccess, myCloud, cloudNumber, cloudMax) {
                                    //This is being called multiple times and causing multiple callbacks
                                    //console.log("CloudGetCallback num: " + cloudNumber + " max: " + cloudMax);
                                    //console.log("Get");
                                    CloudAll.cloudsDownloaded++;
                                    // //console.log("CloudNumber: " + cloudNumber);
                                    // //console.log("cloudMax: " + cloudMax);
                                    // //console.log("CloudAll.cloudLimit: " + CloudAll.cloudLimit);
                                    cloudNumber = parseInt(cloudNumber, 10);
                                    //console.log("if " + cloudNumber + " === " + cloudMax + " && (" + cloudMax + " === " + (CloudAll.cloudLimit - 1) + ")");
                                    if (cloudNumber === cloudMax && (cloudMax === CloudAll.cloudLimit - 1)) {
                                        //console.log("Setting repeat to true");
                                        repeat = true;
                                    } else {
                                        repeat = false;
                                        if (cloudMax < CloudAll.cloudLimit - 1) {
                                            CloudAll.cloudsDownloaded = 0;
                                        }
                                    }

                                    //console.log("cloudGetSuccess: " + cloudGetSuccess);
                                    if (cloudGetSuccess === true) {
                                        //CloudAll.findHist(myCloud.cloudIdRemote, Globals.mUsername, CloudAll.username, "get", function(hist) {
                                        var hist = null;
                                        if (hist === null) {
                                            CloudLocal.parseGet(myCloud, function(parseSuccess) {

                                                CloudAll.saveHist(myCloud.cloudIdRemote, Globals.mUsername, CloudAll.username, "get", function() {
                                                    //console.log(myCloud);
                                                    if (parseSuccess === true) {
                                                        if (myCloud.cloudHasBlob == "-1") {
                                                            //console.log("BLOB");
                                                            CloudAll.getBlob(myCloud, function(success, blobs) {
                                                                if (success === true) {
                                                                    l = blobs.length;
                                                                    for (i = 0; i < l; i++) {
                                                                        cloudBlob = blobs[i];

                                                                        parseIt(i, l, cloudGetSuccess, repeat, cloudNumber, cloudMax, cloudBlob, callback);

                                                                    }
                                                                    if (l <= 0) {
                                                                        //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                        if (cloudNumber >= cloudMax) {
                                                                            callback(cloudGetSuccess, repeat);
                                                                        }
                                                                    }
                                                                } else {
                                                                    //console.log("blob success was false");
                                                                    //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                    if (cloudNumber >= cloudMax) {
                                                                        callback(cloudGetSuccess, repeat);
                                                                    }
                                                                }
                                                            });
                                                        } else {
                                                            //console.log("no blob so finished");
                                                            //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                            if (cloudNumber >= cloudMax) {
                                                                callback(cloudGetSuccess, repeat);
                                                            }
                                                        }
                                                    } else {
                                                        //console.log("parse success failed");
                                                        //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                        if (cloudNumber >= cloudMax) {
                                                            callback(cloudGetSuccess, repeat);
                                                        }
                                                    }
                                                });
                                            });
                                        } else {
                                            //console.log("Already Processed this cloud");
                                            //console.log("if " + cloudNumber + " >= " + cloudMax);
                                            if (cloudNumber >= cloudMax) {
                                                callback(false, repeat);
                                            }
                                        }
                                        //});
                                    } else {
                                        //console.log("CloudGetSuccess = false");
                                        //console.log("if " + cloudNumber + " >= " + cloudMax);
                                        if (cloudNumber >= cloudMax) {
                                            callback(false, repeat);
                                        }
                                    }
                                });
                            } else {
                                //console.log("get NOT HOSTONLINE");
                                callback(false, false);
                            }
                        } else {
                            //console.log("get NOT ONLINE");
                            callback(false, false);
                        }
                    } else {
                        //console.log("get NOT PASSWORD");
                        CloudAll.lastCloudActivity = 0;
                        callback(false, false);
                    }
                });
            } else {
            	CloudAll.lastCloudActivity = 0;
                //console.log("Get NOT USERNAME");
                callback(false, false);
            }
        });
    },

    ready: function(callback) {
    	//console.log("[CloudAll]ready");
        //console.log(this);
        //console.log(this.store);
        if (app.store !== undefined) {
            //console.log("store is ready");
            if (CloudAll.isReady === false) {
                CloudAll.pushClient = getTimestamp();
                //console.log('PUSH CLIENT: ' + CloudAll.pushClient);
                CloudAll.isReady = true;
                //console.log("Cloud is ready");
            }
            //console.log("SetTimeout1");
            CloudAll.timeout = setTimeout(CloudAll.start(true, true), 300);
            callback();
        }
    },

    resetQueue: function(callback) {
        //console.log("[CloudAll]resetQueue");
        //console.log("Resetting Cloud Active State to False");
        clearTimeout(CloudAll.timeout);
        clearTimeout(CloudAll.resetTimeout);
        CloudAll.active = false;
        //console.log("setTimeout2");
        CloudAll.timeout = setTimeout(CloudAll.start(true, true), 300);
    },

    // findHist: function(cloudId, username, cloudUsername, histType, callback) {
    // var ret = null;
    // Shell.getSetting("cloudHist" + histType + username + cloudUsername, "", function(setting) {
    // if (setting.indexOf(cloudIdLocalOrRemote + ",") > 0) {
    // ret = new CloudHist(cloudId, cloudUsername);
    // }
    // if (callback) {
    // callback(ret);
    // } else {
    // return ret;
    // }
    // });
    // },

    saveHist: function(cloudId, username, cloudUsername, histType, callback) {
        //console.log("[CloudAll]saveHist ht:" + histType + " un:" + username + " cun:" + cloudUsername);
        var settingString = CloudAll.getSettingString(histType, username, cloudUsername);
        // Shell.getSetting("cloudHist" + histType + username + cloudUsername, "", function(setting) {
        // if (setting.indexOf(cloudIdLocalOrRemote + ",") === 0) {
        // setting += cloudId + ",";
        // Shell.saveSetting("cloudHist" + histType + username + cloudUsername, setting, function() {
        //     				
        // });
        // }
        // });
        Shell.getSetting(settingString, 0, function(setting) {
            //console.log("lastCloudGet: " + setting);
            //console.log("newwCloudGet: " + cloudId);
            if (cloudId > setting) {
                Shell.saveSetting(settingString, cloudId, function() {
                    //console.log("saved");
                    callback();
                });
            } else {
                //console.log("discarded");
                callback();
            }
        });
    },

    getSettingString: function(histType, username, cloudUsername) {
        //console.log("[CloudAll]getSettingString");
        var settingString = "lastCloud" + histType.toLowerCase() + username + cloudUsername;
        //console.log("settingString: " + settingString);
        return settingString;
    },

    deleteById: function(myCloud, callback) {
        //console.log("[CloudAll]deleteById");
        //console.log("cloudDeleteById");
        app.store.deleteCloudById(myCloud, function() {
            callback();
        });
    },

    deleteBlobById: function(myCloudBlobId, callback) {
        //console.log("cloudDeleteById");
        app.store.deleteCloudBlobById(myCloudBlobId, function() {
            callback();
        });
    },



    // findHist: function(cloudIdLocalOrRemote, username, cloudUsername, histType, callback) {
    // //console.log("cloudFindHist");
    // app.store.findCloudHist(cloudIdLocalOrRemote, username, cloudUsername, histType, function(hist) {
    // callback(hist);
    // });
    // },

    // findHistNoCallback: function(cloudIdLocalOrRemote, username, cloudUsername, histType) {
    // //console.log("cloudFindHist");
    // var hist = app.store.findCloudHist(cloudIdLocalOrRemote, username, cloudUsername, histType);
    // return hist;
    // },

    initialize: function(callback) {
        //console.log("[Cloud] Initialized");
        this.lastCloudActivity=0;
        this.itemsAdded=0;
        this.itemsSent=0;
        this.active = false;
        this.timeout = null;
        this.resetTimeout = null;
        this.pushTimeout = null;
        this.pushDelay = 3000;
        this.lastMini = 0;
        this.isReady = false;
        this.username = "";
        this.password = "";
        this.pushClient = 0;
        this.cloudLimit = 50;
        this.cloudsDownloaded = 0;
        this.abort = false;
        this.last = 0;
        this.cloudQueue = 0;
        this.indexLoaded = false;
        this.indexCount = 0;
        this.index = [];
        this.indexLastUpdate = 0;
        this.indexLastSync = 0;
        this.totalSyncItems = 0;
        this.completedSyncItems = 0;
        this.itemsToSync = [];
        this.queueResetTime = (60 * 1000) * 5; //every five minutes
        this.autoRefreshed=0;
        this.autoRefreshTimeout=null;
        this.autoRefreshDelay= (60 * 1000) * 2; //every two minutes
    }
};

CloudAll.initialize();