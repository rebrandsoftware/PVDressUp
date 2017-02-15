
        //main
        /*jshint -W083 */
// if (typeof console  != "undefined") 
    // if (typeof console.log != 'undefined')
        // console.olog = console.log;
    // else
        // console.olog = function() {};
// 
// console.log = function(message) {
    // console.olog(message);
    // $('#debugDiv').append('<p>' + message + '</p>');
// };
// console.error = console.debug = console.info =  console.log;

       
$(document).delegate(".ui-page", "pagebeforeshow", function () {
	console.log("delegate " + app.currBackgroundColor);
    $(this).css('background', app.currBackgroundColor);
    if (app.myContest) {
        var url = app.myContest.backgroundImage;
	    if (url !== "" && url !== undefined) {
	    	$(this).css('background-image', "url(" + url + ")");	
	    }	
    }
    
    // if (AdsAll.rewardCallback !== null) {
    	// //console.log("doing callback");
    	// //console.log(AdsAll.rewardCallback);
    	// AdsAll.rewardCallback();
    // }
});
       
       // Dynamically changes the theme of all UI elements on all pages,
// also pages not yet rendered (enhanced) by jQuery Mobile.
$.mobile.changeGlobalTheme = function(oldTheme, newTheme)
{
    
console.log("oldTheme: " + oldTheme);
console.log("newTheme: " + newTheme);
    // Updates the theme for all elements that match the
    // CSS selector with the specified theme class.
    function setTheme(cssSelector, themeClass, newTheme)
    {
    	console.log("setTheme");
    	$(cssSelector).each(function() {
    		var theme = $(this).attr('data-theme');
    		//console.log("if " + theme + " === " + oldTheme);
    		if (theme === oldTheme) {
    			console.log('remove: ' + themeClass + "-" + oldTheme);
    			console.log('addddd: ' + themeClass + "-" + newTheme);
    			$(this).removeClass(themeClass + "-" + oldTheme)
            	.addClass(themeClass + "-" + newTheme)
            	.attr("data-theme", newTheme)
            	.buttonMarkup({theme: newTheme})
            	.trigger("create");
            	//console.log($(this));
            	
    		}
    	});
    }
    
    function setTheme2(cssSelector, themeClass, newTheme)
    {
    	//console.log("setTheme2");
    	$(cssSelector).each(function() {
    		var theme = $(this).attr('data-theme');
    		//console.log("if " + theme + " === " + oldTheme);
    		if (theme === oldTheme) {
    			console.log('remove: ' + themeClass + "-" + oldTheme);
    			console.log('addddd: ' + themeClass + "-" + newTheme);
    			$(this).removeClass(themeClass + "-" + oldTheme)
            	.addClass(themeClass + "-" + newTheme)
            	.attr("data-theme", newTheme)
            	.trigger("create");
            	//console.log($(this));
            	
    		}
    	});
    }

    // Add more selectors/theme classes as needed.
    setTheme(".ui-mobile-viewport", "ui-overlay", newTheme);
    setTheme2("[data-role='header']", "ui-bar", newTheme);
    setTheme2("[data-role='footer']", "ui-bar", newTheme);
    //setTheme3("[data-role='page']");
    setTheme("[data-role='listview'] > li", "ui-bar", newTheme);
    setTheme("[data-role='list-divider'] > li", "ui-bar", newTheme);
    setTheme("[data-role='button']", "ui-btn", newTheme);
    setTheme(".ui-btn", "ui-btn-up", newTheme);
    setTheme(".ui-btn", "ui-btn-hover", newTheme);
    setTheme(":input[type=submit]", "ui-btn", newTheme);
    setTheme(":input[type=submit]", "ui-btn-up", newTheme);
    setTheme(":input[type=submit]", "ui-btn-hover", newTheme);
    
};
 
         var app = {
         	newContest: function() {
         		app.editingContest = false;	
         		//console.log("app.newContest");
         		app.store.deleteAllContestEntries(function() {
         			app.store.deleteAllVotes(function() {
         				app.store.deleteContestForever(function() {
         					app.store.deleteAllCategories(function() {
         						app.store.deleteIndices(function() {
	         						app.initializeVars(function() {
		         						changePage("#contest");
		         					});	
	         					});
         					});
         				});
         			});
         		});
         	},
         	photoFromCamera: function(source) {
            	//console.log("[APP]photoFromCamera");
            	var width = $(window).width();
				var height = $(window).height();
				
				
				
				//if (width > height) {
				//	Toast.toastLong("Photos should be in portrait mode.  Please rotate your device.");
				//} else {
					var saveToPhotoAlbum;
					if (app.myContest.savePhotos === true) {
                        saveToPhotoAlbum = true;
                    } else {
						saveToPhotoAlbum = false;
                    }
					
	                // if (source !== 1) {
	                    // saveToPhotoAlbum = false;
	                // }
	                //if (Device.platform != "Browser") {
	                if (Device.platform != "Browser") {
	                    //event.preventDefault();
	                    //event.stopPropagation();
	                    if (Device.platform === "FirefoxOSXXX") {
	                        //console.log("using pick");
	                        var pick = new MozActivity({
	                            name: "pick",
	                            data: {
	                                type: ["image/png"]
	                            }
	                        });
	                        //var myPhoto = pick;
	                        //On successful pick, display image in the checkin dialog
	                        pick.onsuccess = function() {
	                            //console.log("picSuccess");
	                            var res = pick.result;
	                            //console.log("res");
	                            //console.log(res);
	                            //console.log(res.blob);
	                            //Create object url for picked image
	                            //var photoURL = window.URL.createObjectURL(res.blob);
	                            //console.log("photoURL");
	                            //console.log(photoURL);
	                            app.sessionPicSuccess(res.blob);
	                        };
	                        pick.onerror = function() {
	                            //console.log(this.error);
	                        };
	                    } else {
	                    	var winWidth = $(window).width();
	                    	var winHeight = $(window).height();
	                    	//console.log("winWidth: " + winWidth);
					        if (width > height) {
					           width = winHeight;
					           height = winWidth;
					        } else {
					        	width = winWidth;
					        	height = winHeight;
					        }
					        //Toast.toast("saveToPhotoAlbum: " + saveToPhotoAlbum);
	                        navigator.camera.getPicture(app.photoSuccess, app.photoFail, {
	                            quality: 50,
	                            //targetWidth: width,
	                            //targetHeight: height,
	                            destinationType: Camera.DestinationType.FILE_URI,
	                            sourceType: source,
	                            saveToPhotoAlbum: saveToPhotoAlbum,
	                            allowEdit: false,
	                            correctOrientation: true
	                        });
	                    }
	                } else {
	                    Toast.toast("This feature is only available on mobile.");
	                    if (Globals.bDebug === true) {
	                    	app.photoSuccess(Globals.fakePhoto);
	                    }
	                }
                //}
            },
            photoSuccess: function(imageURI) {
            	//console.log("[APP]photoSuccess " + imageURI);
            	var fileName = Globals.appNameNoSpaces + "_photo_" + getTimestamp() + ".jpg";
                FileIO.makeFilePersistent(imageURI, fileName, function(partialURI) {
                    //console.log("Partial URI: " + partialURI);
                    app.lastPhoto = partialURI;
                    app.photoUpdate(partialURI);
                });
            },
            photoDelete: function(callback) {
            	//console.log("[APP]photoDelete");
            	var l = app.allPhotos.length;
            	var p;
            	var iDone=0;
            	for (var i=0; i<l; i++) {
            		p = app.allPhotos[i];
            		app.deletePhotoById(p.id, function() {
            			iDone ++;
            			if (iDone === l) {
            	            callback();			
            			}
            		});
            	}
            },
            photoUpdate: function(imageURI, callback) {
                //console.log("[photoUpdate] " + imageURI);
                var $elImg = $('#imgTakePhoto');
                var $elA = $('#aTakePhoto');
                var $elDiv = $('#photoContainer');
                
                $elDiv.empty();
                $elImg.attr("data-imageURI", imageURI);
                FileIO.getFileURI(imageURI, function(fullPath) {
                    //console.log("Got full path: " + fullPath);
                    $elDiv.append('<img src="' + fullPath + '" id="imgTakePhoto" height="320" width="240" style="" alt="">');
                    $elImg = $('#imgTakePhoto');
                    $elImg.nailthumb({
                        width: 320,
                        height: 240,
                        method: 'resize'
                    });
                   
                    $elDiv.show();
                    
                });
            },
           
            //there was an error, message contains its cause
            photoFail: function(message) {
                //console.log("failed " + message);
                //tempGamePic=null;
            },
            
            
            
            
            photoFromCamera2: function(source) {
            	//console.log("[APP]photoFromCamera2 " + source);
            	var width = $(window).width();
				var height = $(window).height();
				
				
				
				//if (width > height) {
				//	Toast.toastLong("Photos should be in portrait mode.  Please rotate your device.");
				//} else {
					var saveToPhotoAlbum;
					if (app.myContest.saveVoterPhotos === true) {
                        saveToPhotoAlbum = true;
                    } else {
						saveToPhotoAlbum = false;
                    }
					
	                if (source !== 1) {
	                    saveToPhotoAlbum = false;
	                }
	                //if (Device.platform != "Browser") {
	                if (Device.platform != "Browser") {
	                    //event.preventDefault();
	                    //event.stopPropagation();
	                    if (Device.platform === "FirefoxOSXXX") {
	                        //console.log("using pick");
	                        var pick = new MozActivity({
	                            name: "pick",
	                            data: {
	                                type: ["image/png"]
	                            }
	                        });
	                        //var myPhoto = pick;
	                        //On successful pick, display image in the checkin dialog
	                        pick.onsuccess = function() {
	                            //console.log("picSuccess");
	                            var res = pick.result;
	                            //console.log("res");
	                            //console.log(res);
	                            //console.log(res.blob);
	                            //Create object url for picked image
	                            //var photoURL = window.URL.createObjectURL(res.blob);
	                            //console.log("photoURL");
	                            //console.log(photoURL);
	                            app.sessionPicSuccess(res.blob);
	                        };
	                        pick.onerror = function() {
	                            //console.log(this.error);
	                        };
	                    } else {
	                    	var winWidth = $(window).width();
	                    	var winHeight = $(window).height();
	                    	//console.log("winWidth: " + winWidth);
					        if (width > height) {
					           width = winHeight;
					           height = winWidth;
					        } else {
					        	width = winWidth;
					        	height = winHeight;
					        }
					        //Toast.toast("W: " + width + " H: " + height);
	                        navigator.camera.getPicture(app.photoSuccess2, app.photoFail2, {
	                            quality: 90,
	                            targetWidth: width,
	                            targetHeight: height,
	                            destinationType: Camera.DestinationType.FILE_URI,
	                            sourceType: source,
	                            saveToPhotoAlbum: saveToPhotoAlbum,
	                            allowEdit: false,
	                            correctOrientation: true
	                        });
	                    }
	                } else {
	                    Toast.toast("This feature is only available on mobile.");
	                    if (Globals.bDebug === true) {
	                    	app.photoSuccess(Globals.fakePhoto);
	                    }
	                }
                //}
            },
            photoSuccess2: function(imageURI) {
            	//console.log("[APP]photoSuccess2 " + imageURI);
            	var fileName = Globals.appNameNoSpaces + "_photo_" + getTimestamp() + ".jpg";
                FileIO.makeFilePersistent(imageURI, fileName, function(partialURI) {
                    //console.log("Partial URI: " + partialURI);
                    app.lastVoterPhoto = partialURI;
                    app.photoUpdate2(partialURI);
                });
            },
            
            photoUpdate2: function(imageURI, callback) {
                //console.log("[photoUpdate2] " + imageURI);
                var $elImg = $('#imgVoterPhoto');
                var $elDiv = $('#photoContainer2');
                
                $elDiv.empty();
                FileIO.getFileURI(imageURI, function(fullPath) {
                	
                    //console.log("Got full path: " + fullPath);
                    $elDiv.append('<center.<img src="' + fullPath + '" id="imgVoterPhoto" height="160" width="160" style="" alt=""></center>');
                    $elImg = $('#imgVoterPhoto');
                    $elImg.nailthumb({
                        width: 160,
                        height: 160,
                        method: 'resize'
                    });
                    $elDiv.show();
                    
                });
            },
           
            //there was an error, message contains its cause
            photoFail2: function(message) {
                //console.log("failed " + message);
                //console.log("Failed because: " + message);
                //tempGamePic=null;
            },
            
            
            
            
            
            
            changeButtonColors: function() {
            	var style = $('#selStyle').val();
	                	var colors;
	                	console.log("change: " + style);
	                	switch (style) {
	                		case "Princess Pink":
	                			colors = ["#e96ad6", "#ea2362", "#c9acc8", "#ff4f87", "#993d62"];
	                			break;
	                		case "Elegant Blue":
	                			colors = ["#9ccdda", "#11fdfe", "#08679f", "#486ea2", "#ffafc6"];
	                			break;
	                		case "Superhero":
	                			colors = ["#ff2e21", "#00dcfb", "#fef661", "#1432de", "#008c75"];
	                			break;
	                		case "CRAZY":
	                			colors = ["#fe41f5", "#ffc443", "#369af7", "#00ff52", "#cd2dab"];
	                			break;
	                	}
	                	
	                	$('#btnColor1').css('background', colors[0]).button().button("refresh");
	                	$('#btnColor2').css('background', colors[1]).button().button("refresh");
	                	$('#btnColor3').css('background', colors[2]).button().button("refresh");
	                	$('#btnColor4').css('background', colors[3]).button().button("refresh");
	                	$('#btnColor5').css('background', colors[4]).button().button("refresh");
            },
            showBannerDelay: function() {
            	if (AdsAll.bShowedBanner === false) {
            		InAppAll.isUpgraded(function(upgraded) {
            			if (upgraded === false) {
            				setTimeout(AdsAll.showBanner, 3000);
            			}
            		});
            	}
            },
            changeStyle: function(style, callback) {
            	//console.log("changeStyle: " + style);
            	var oldThemes=app.currThemeLetters;
            	//console.log("oldThemes:");
            	//console.log(oldThemes);
            	var bg="#f9f9f9";
            	
            	var currTheme = app.currTheme;
            	
            	switch (currTheme) {
            		case "Default":
            			bg = "#ffffff";
            			break;
            		case "Princess Pink":
            			bg = "#ffffff";
            			break;
            		case "Elegant Blue":
            			bg = "#00d7ff";
            			break;
            		case "Superhero":
            			bg = "#ffffff";
            			break;
            		case "CRAZY":
            			bg = "#72e160";
            			break;
            		
            	}
            	
            	switch (style) {
            		case "Default":
            			app.currThemeLetters=["a", "b", "c", "d", "e"];
            			break;
            		case "Princess Pink":
            			app.currThemeLetters=["f", "g", "h", "i", "j"];
            			break;
            		case "Elegant Blue":
            			app.currThemeLetters=["k", "l", "m", "n", "o"];
            			break;
            		case "Superhero":
            			app.currThemeLetters=["p", "q", "r", "s", "t"];
            			break;
            		case "CRAZY":
            			app.currThemeLetters=["u", "v", "w", "x", "y"];
            			break;

            	}
            	$.mobile.changeGlobalTheme(oldThemes[0], app.currThemeLetters[0]);
    			$.mobile.changeGlobalTheme(oldThemes[1], app.currThemeLetters[1]);
    			$.mobile.changeGlobalTheme(oldThemes[2], app.currThemeLetters[2]);
    			$.mobile.changeGlobalTheme(oldThemes[3], app.currThemeLetters[3]);
    			$.mobile.changeGlobalTheme(oldThemes[4], app.currThemeLetters[4]);
            	app.currTheme = style;
            	app.currBackgroundColor = bg;
            	
				if (callback) {
					callback();
				}            
            },
            addCategories: function(categories, callback) {
            	var l = categories.length;
            	var iDone = 0;
            	for (var i=0; i<l; i++) {
            		app.store.addCategory(categories[i], function() {
            			
            			iDone ++;
            			if (iDone === l) {
            				app.categoriesChanged = getTimestamp();
            				app.loadAllCategories(function() {
            					callback();            					
            				});
            			}
            		});
            	}
            },
            loadContest: function(callback) {
            	//console.log("loadContest");
            	app.store.findContest(function(contest) {
            		if (contest === undefined) {
            			contest = null;
            		}
            		app.myContest = contest;
            		if (contest !== null) {
            			app.currTheme = contest.style;	
            		} else {
            			app.currTheme = "Princess Pink";
            		}
            		callback();
            	});
            },
            voteById: function() {
            	var id = getTimestamp();
            	var $voterName = $('#txtVoterName');
            	var entryId = app.selectedEntryId;
            	var name = "";
            	var photo = "";
            	var category = app.currCategory;
            	var bCont = true;
            	
            	if (app.myContest.voteRequireName === true) {
            		name = $voterName.val();
            		if (name === "") {
            			Toast.toast("Please enter your name to vote");
            			$voterName.focus();
            			bCont = false;
            		} else {
            			app.lastVoterName = name;
            		}
            	}
            	
            	if (app.myContest.voteRequirePhoto === true) {
            		photo = app.lastVoterPhoto;
            		if (photo === null) {
            			Toast.toast("Please take a photo to vote");
            			bCont = false;
            		}
            	}
            	
            	if (bCont === true) {
            	
	            	var myVote = new Vote(id, entryId, name, photo, category);
	            	myVote.entryId = entryId;
	            	//console.log(myVote);
	            	app.store.addVote(myVote, function() {
	            		app.store.findContestEntryById(entryId, function(myEntry) {
	            			myEntry.votes++;
	            			app.store.addContestEntry(myEntry, function() {
	            				var ts = getTimestamp();
	            				//app.entriesChanged = ts;
	            				//app.entriesWritten = -1;
	            				app.votesChanged = ts;
		                		app.votesSinceHome.push(app.currCategory);
		                		Toast.toast("Thank you for voting for " + app.myContest.categories[category].name + "!");
		                		var l = app.myContest.categories.length;
		                		if (l === 1 || app.votesSinceHome.length >= l) {
		                			changePage("#home");
		                		} else {
		                			changePage("#category");
		                		}
	            			});
	            		});
	            		
	            	});
            	}
            },
            loadFakeVotes: function(callback) {
            	if (Globals.bDebugFakes === true) {
	            	var fakeVotes=[];
	            	var v;
	            	var ts=getTimeStamp;
	            	ts ++;
	            	v = new Vote(ts, 0, "Mike", "", "Best Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 0, "Bob", "", "Best Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Frannie", "", "Best Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Tiffany", "", "Best Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Amber", "", "Best Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Thiessen", "", "Best Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Jen", "", "Best Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 0, "James", "", "Best Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 0, "Eloise", "", "Best Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 4, "Tiffany", "", "Best Costume");
	            	v.entry = app.allEntries[4];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Mike", "", "Best Group Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 0, "Bob", "", "Best Group Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Tiffany", "", "Best Group Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 2, "Amber", "", "Best Group Costume");
	            	v.entry = app.allEntries[2];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 3, "Thiessen", "", "Best Group Costume");
	            	v.entry = app.allEntries[3];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 3, "Jen", "", "Best Group Costume");
	            	v.entry = app.allEntries[3];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "James", "", "Best Group Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 0, "Eloise", "", "Best Group Costume");
	            	v.entry = app.allEntries[0];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Tiffany", "", "Best Group Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
	            	v = new Vote(ts, 1, "Tiffany", "", "Best Group Costume");
	            	v.entry = app.allEntries[1];
	            	fakeVotes.push(v);
	            	ts ++;
				} else {
					callback([]);
				}
            },
            addEntriesToVotes: function(votes, callback) {
            	var addEntry = function(vote, iPassback, callback) {
            		var e = app.allEntries;
            		var l = e.length;
            		for (var i=0; i<l; i++) {
            			if (vote.entryId === e[i].id) {
            				vote.entry = e[i];
            				break;
            			}
            		}
            		callback(vote, iPassback);
            	};
            	var iDone = 0;
            	var l = votes.length;
            	for (var i=0; i<l; i++) {
            		if (votes[i].entry === undefined) {
            			addEntry(votes[i], i, function(newVote, iPassedBack) {
	            			votes[iPassedBack] = newVote;
	            			iDone ++;
	            			if (iDone === l) {
	            				callback(votes);
	            			}
	            		});
            		} else {
            			iDone ++;
            			if (iDone === l) {
            				callback(votes);
            			}
            		}
            		
            	}
            	if (l === 0) {
            		callback(votes);
            	}
            	
            },
            loadAllVotes: function(callback) {
                if (app.votesChanged >= app.votesLoaded) {
                	//console.log("changed");
                	var getPhoto = function(i, image, callback) {
            			//console.log("getPhoto " + i + " " + image);
	            		FileIO.getFileURI(image, function(imageURI) {
	            			//console.log("got photo " + imageURI);
	            			callback(i, imageURI);
	            		});
	            	};
                	
                	app.loadAllEntries(function() {
	                	app.store.findAllVotes(function(allVotes) {
	                		//console.log(allVotes);
	                    	//app.loadFakeVotes(function(fakeVotes) {
	                    		// if (Globals.bDebugFakes === true) {
	                    			// allVotes.concat(fakeVotes);	
	                    		// }
	                    		app.addEntriesToVotes(allVotes, function(newVotes) {
	                    			//console.log(newVotes);
	                    			app.votesLoaded = getTimestamp();
			                        app.allVotes = newVotes;
			                        
			                        
			                        var iDone = 0;
			                        var l = newVotes.length;
			                        for (var i=0; i<l; i++) {
			                        	getPhoto(i, newVotes[i].photo, function(iPassBack, imageURI) {
			                        		//console.log("after getPhoto " + iPassBack);
			                        		newVotes[iPassBack].photo = imageURI;
			                        		iDone ++;
			                        		if (iDone === l) {
			                        			//console.log("done");
			                        			app.allVotes = newVotes;
			                        			callback();
			                        		}
			                        	});
			                        }
			                        
			                        if (l === 0) {
			                        	app.allVotes = [];
			                        	callback();
			                        }
			                          
	                    		});                  		
	                    	//});
	
	                    });
                    });
                } else {
                    //console.log("already loaded");
                    callback();
                }
            },
            loadFakeEntries: function(callback) {
            	if (Globals.bDebugFakes === true) {
            		var fakeEntries=[];
	            	var e;
	            	e = new ContestEntry(0, "img/Nintendo.jpg", "Nintendo Family", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(1, "img/Joker.jpg", "The Joker and Catwoman", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(2, "img/EvilClowns.jpg", "Evil Clowns", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(3, "img/Dracula.jpg", "Dracula", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(4, "img/Devil.jpg", "The Devil", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(5, "img/Creep.jpg", "Creep", "", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(6, "img/Fake07.JPG", "Tree", "Please vote for me", false);
	            	fakeEntries.push(e);
	            	e = new ContestEntry(7, "img/Fake08.JPG", "Eloise", "Please vote for me instead", false);
	            	fakeEntries.push(e);
	            	callback(fakeEntries);
            	} else {
            		callback([]);
            	}
            },
            submitCategory: function() {
            	//console.log("submitcategory");
            	var $elCat = $('#txtCategoryAdd');
            	var c = new Category($elCat.val());
            	var bFound = false;
            	var l = app.tempContest.categories.length;
            	if (c.name !== "") {
            		
            	
            	for (var i=0; i<l; i++) {
            		//console.log("if " + app.tempContest.categories[i].name + " === " + c.name);
            		if (app.tempContest.categories[i].name === c.name) {
            			bFound = true;
            		}
            	}
            	//console.log("bFound: " + bFound);
            	if (bFound === false) {
            		if (app.tempContest.categories.count === 12) {
            			Toast.toast("Each contest can have a maximum of 12 categories");
            		} else {
            			app.tempContest.categories.push(c);	
            			Toast.toastMini("Added " + c.name);
            		}
            	} else {
            		Toast.toast("That category already exists");
            	}
            	$elCat.val("");
            	//$elCat.focus();
            	} else {
            		Toast.toast("Please enter a category name first");
            	}
            	app.writeContestCategories();
            	
            },
            submitContest: function() {
            	//console.log('submitContest');
            	var bOK = true;
	                	app.tempContest.name = $('#txtContestName').val();
	                	app.tempContest.style = $('#selStyle').val();
	                	app.tempContest.backgroundImage = $('#txtBackgroundImage').val();
	                	if ($('#chkEntryName').is(":checked")) {
	                        app.tempContest.entryAllowNames = true;
	                    } else {
							app.tempContest.entryAllowNames = false;
	                    }
	                    if ($('#chkEntryCaption').is(":checked")) {
	                        app.tempContest.entryAllowCaptions = true;
	                    } else {
							app.tempContest.entryAllowCaptions = false;
	                    }
	                	if ($('#chkVoterName').is(":checked")) {
	                        app.tempContest.voteRequireName = true;
	                    } else {
							app.tempContest.voteRequireName = false;
	                    }
	                    
	                    if ($('#chkVoterPhoto').is(":checked")) {
	                        app.tempContest.voteRequirePhoto = true;
	                    } else {
							app.tempContest.voteRequirePhoto = false;
	                    }
	                    
	                    if ($('#chkSavePhotos').is(":checked")) {
	                        app.tempContest.savePhotos = true;
	                    } else {
							app.tempContest.savePhotos = false;
	                    }
	                    
	                    if ($('#chkSaveVoterPhotos').is(":checked")) {
	                        app.tempContest.saveVoterPhotos = true;
	                    } else {
							app.tempContest.saveVoterPhotos = false;
	                    }
	                    
	                    
	                    
	                    if ($('#chkPassword').is(":checked")) {
	                    	//console.log("checked");
	                        app.tempContest.isPasswordProtected = true;
	                        var pass = $('#pass1').val();
	                        var pass2 = $('#pass2').val();
	                        if (pass === pass2) {
	                        	//woohoo!
	                        	
	                        	if (pass === "") {
	                        		Toast.toast("Please enter a password");
	                        		bOK = false;
	                        	} else {
	                        		app.tempContest.password = pass;
	                        	}
	                        } else {
	                        	Toast.toast("Passwords do not match");
	                        	$("#pass1").focus();
	                        	bOK = false;
	                        }
	                    } else {
							app.tempContest.isPasswordProtected = false;
	                    }
	                    
	                    if (app.tempContest.name === "") {
	                    	bOK = false;
	                    	Toast.toast("Please enter a contest name");
	                    	$('#txtContestName').focus();
	                    }
	                    
	                    if (app.tempContest.categories.length === 0) {
	                    	bOK = false;
	                    	Toast.toast("Please enter at least one category");
	                    	$('#txtCategoryAdd').focus();
	                    }
	                    
	                    if (bOK === true) {
	                    	app.myContest = app.tempContest;
	                    	app.addCategories(app.myContest.categories, function() {
	                    		
	                    		if (app.editingContest === false) {
	                    			
	                    			app.store.deleteAllContestEntries(function() {
	                    				app.entriesChanged=0;
	                    				app.entriesLoaded=-1;
	                    				app.entriesWritten=-1;
	                    			});
	                    			app.store.deleteAllVotes(function() {
	                    				app.votesChanged=0;
	                    				app.votesLoaded=-1;
	                    			});
	                    		}
	                    		
		                    	app.store.addContest(app.myContest, function() {
		                    		var ts = getTimestamp();
		                    		app.entriesChanged=ts;
	                    			app.votesChanged=ts;
	                    			app.categoriesChanged = ts;
	                    			app.currTheme = app.myContest.style;
		                    		app.changeStyle(app.myContest.style);
		                    		if (app.myContest === null) {
		                    			Toast.toast("Contest created!");	
		                    		} else {
		                    			Toast.toast("Contest saved!");
		                    		}
		                    		//$('#btnResults').show();
		                    		changePage("#home");
	                    		});
	                    	});
	                    }
            },
            submitEntry: function() {
            	//console.log("submit");
            			var photo = app.lastPhoto;
            			//console.log(photo);
	                	var caption=$('#txtPhotoCaption').val();
	                	var name = $("#txtPhotoName").val();
	                	var bCont = true;
	                	var fakeEntry=null;
	                	
	                	if (caption === undefined) {
	                		caption = "";
	                	}
	                	
	                	if (name === undefined) {
	                		name = "";
	                	}
	                	
	                	name = makeLongWordsWrap(name);
	                	caption = makeLongWordsWrap(caption);
	                	
	                	app.loadFakeEntries(function(fakeEntries) {
	                			
	                	
	                	
		                	if (photo === null) {
		                		if (Globals.bDebugFakes === true) {
		                			fakeEntry = fakeEntries[app.allEntries.length];
		                		} else {
		                			bCont = false;
		                			Toast.toast("You must add a photo first");
		                		}
		                		
		                		
		                		
		                	}
		                	
		                	
		                	
		                	if (bCont === true) {
		                		var id = getTimestamp();
		                		var myContestEntry = new ContestEntry(id, photo, name, caption, false);
		                		//console.log(fakeEntry);
		                		if (fakeEntry !== null) {
		                			myContestEntry = fakeEntry;
		                		}
		                		//console.log("about to add entry");
		                		//console.log(JSON.stringify(myContestEntry));
		                		app.store.addContestEntry(myContestEntry, function() {
		                			//console.log("after add entry");
		                			app.entriesChanged = getTimestamp();
		                			app.loadAllEntries(function() {
		                				//console.log("after loadAllEntries");
		                				Social.addActionable(1);
		                				Toast.toast("Thank you for entering the contest!");
		                				changePage("#home");
		                			});
		                		});
		                		
		                	}
	                	
	                	});
            },
            loadAllEntries: function(callback) {
            	//console.log("loadAllEntries");
            	if (app.entriesChanged >= app.entriesLoaded) {
            		//console.log("changed");
            		var getPhoto = function(i, image, callback) {
            			//console.log("getPhoto " + i + " " + image);
	            		FileIO.getFileURI(image, function(imageURI) {
	            			//console.log("got photo " + imageURI);
	            			callback(i, imageURI);
	            		});
	            	};
	            	
	            	var getPhotoBase64 = function(i, imageURI, callback) {
	            		FileIO.getB64FromFileURI(imageURI, function(b64) {
	            			callback(i, b64);
	            		});
	            	};
            		
            		var iDone = 0;
            		//console.log("before find all entries");
                    app.store.findAllContestEntries(function(allContestEntries) {
                    	//console.log('after find all entries');
                    	//app.loadFakeEntries(function(fakeEntries) {
                    		//allEntries = fakeEntries;
                    		var l = allContestEntries.length;
                    		//console.log("allContestEntries.length: " + l);
	                    	var photo;
	                    	var contestEntry;
	                    	for (var i=0; i<l; i++) {
	                    		
	                    		contestEntry = allContestEntries[i];
	                    		//console.log("contestEntry " + i);
	                    		//console.log(JSON.stringify(contestEntry));
	                    		photo = contestEntry.photo;
	                    		//console.log("photo: " + photo);
	                    		getPhoto(i, photo, function(i2, imageURI) {
		                    	 	getPhotoBase64(i2, imageURI, function(i3, b64) {
		                    	 		
		                    	 	
		                    			//console.log("called back " + i2 + " " + imageURI);
		                    			allContestEntries[i3].photo = imageURI;
		                    			allContestEntries[i3].b64 = b64;
		                    			iDone++;
		                    			if (iDone === l) {
		                    				//console.log("callback");
		                    				app.entriesLoaded = getTimestamp();
					                        app.allEntries = allContestEntries;
					                        callback();
					                    }
					                });
	                    		});
	                    	}
	                    	
	                    	if (l === 0) {
	                    		//console.log("none found");
	                    		//console.log("none found");
	                    		app.allEntries=[];
	                    		callback();
	                    	}

                    	});                    	
                    //});
                } else {
                    //console.log("already loaded");
                    callback();
                }
            },
            loadAllCategories: function(callback) {
                if (app.categoriesChanged >= app.categoriesLoaded) {
                    app.store.findAllCategories(function(allCategories) {
                        app.categoriesLoaded = getTimestamp();
                        app.allCategories = allCategories;
                        callback();
                    });
                } else {
                    //console.log("already loaded");
                    callback();
                }
            },
            writeEntry: function(callback) {
            	//console.log("writeEntry");
            	var e = app.currEntry;
            	if (e === null) {
            		//console.log("e === null");
            		var id = getTimestamp();
            		e = new ContestEntry(id, "", "", "", false);
            	}	
            	//console.log("photocontainer");
        		var $photoContainer = $('#photoContainer');
        		//console.log("divEntryName");
            	var $divEntryName = $('#divEntryName');
            	//console.log("txtPhotoName");
            	var $txtPhotoName = $('#txtPhotoName');
            	//console.log("txtPhotoCaption");
            	var $txtPhotoCaption = $('#txtPhotoCaption');	
            	//console.log("checking e photo");
            	//console.log(e.id);
        		//console.log(e.photo);
        		//console.log(e.name);
        		//console.log(e.caption);
        		//console.log(e.hidden);
        		
            	if (e.photo === "" || e.photo === undefined) {
            		$photoContainer.hide();
            		//console.log("photo is empty");
            	} else {
            		//console.log("beforephotoupdate");
            		app.photoUpdate(e.photo);
            		//console.log("afterphotoupdate");
            	}
            	
            	
            	if (app.myContest.entryAllowNames === true || app.myContest.entryAllowCaptions === true) {
            		//console.log("show");
            		$divEntryName.show();
            		if (app.myContest.entryAllowNames === true) {
            			$txtPhotoName.val(e.name);
            		}
            		if (app.myContest.entryAllowCaptions === true) {
            			$txtPhotoCaption.val(e.caption);
            		}
            	} else {
            		//console.log("hide");
            		$divEntryName.hide();
            		$txtPhotoName.val("");
            		$txtPhotoCaption.val("");
            	}
            	//console.log("the end");
            },
            writeVoteCategories: function() {
            	var c = app.myContest.categories;
            	var l = c.length;
            	var $ul = $('#lvVoteCategories');
            	var dataTheme="";
            	var html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>Categories</li>";
            	for (var i=0; i<l; i++) {
            		if (app.votesSinceHome.indexOf(i) >= 0) {
            			dataTheme = "data-theme='" + app.currThemeLetters[1] + "' ";
            		} else {
            			dataTheme = "";
            		}
            		html += "<li id='" + i + "' " + dataTheme + "><a id='" + i + "'>" + c[i].name + "</a></li>";
            	}
            	if (l === 0) {
                    html += "<li>Add one or more categories above</li>";
               } else {
               		html += "<li id='-1' data-icon='home' data-theme='" + app.currThemeLetters[2] + "'><a id='-1'>Finish Voting</a></li>";
               }

                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");
            },
            writeContestCategories: function() {
            	var c = app.tempContest.categories;
            	var l = c.length;
            	var $ul = $('#lvContestCategories');
            	var html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>Voting Categories</li>";
            	for (var i=0; i<l; i++) {
            		html += "<li id='" + i + "'><a href='#'>" + c[i].name + "</a><a class='delCategory' id='" + i + "'></a></li>";
            	}
            	if (l === 0) {
                    html += "<li>No categories found for this contest</li>";
                }

                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");
            },
            findEntryById: function(entryId) {
            	//console.log(entryId);
            	var e = app.allEntries;
            	var l = e.length;
            	var ret=null;
            	for (var i=0; i<l; i++) {
            		//console.log(e[i]);
            		if (e[i].id === entryId) {
            				ret = e[i];
            				break;
            		}
            	}
            	return ret;
            },
            tallyResultsDelay: function(callback) {
                var text;
                text = "Tallying Votes";
                Shell.loadingShow(text, true, app.tallyResults, callback);
            },
            
            tallyResults: function(callback) {
            	var v = app.allVotes;
            	//console.log(v);
            	var category=-1;
            	var prevcategory = -2;
            	var result;
            	var categoryResults = null;
            	var allCategoryResults = [];
            	var allResultsForThisCategory=[];
            	var entryId;
            	var catSort=0;
            	
            	
            	var tallyVote = function(entry) {
            		var l = allResultsForThisCategory.length;
            		var bFound = false;
            		//go through any results already stored
            		for (var i=0; i<l; i++) {
            			if (allResultsForThisCategory[i].entry.id === entry.id) {
            				//if it exists, increment the votes
            				bFound = true;
            				allResultsForThisCategory[i].votes++;
            			}
            		}
            		//Otherwise, create a new result with one vote
            		if (bFound === false) {
            			result = new Results(entry, 1);
            			allResultsForThisCategory.push(result);
            		}
            	};
            	
            	v.sort(dynamicSort("category"));
            	//sort all the votes by category
            	var l = v.length;
            	var j;
            	var m;
            	var catName;
            	for (var i=0; i<l; i++) {
            		//check the category of this vote
            		category = v[i].category;
            		if (category !== prevcategory) {
            			//if it's a new category, store the current category results
            			prevcategory = category;
            			
            			if (categoryResults !== null) {
            				categoryResults.results = allResultsForThisCategory;
            				categoryResults.results.sort(dynamicSort("-votes"));
            				allCategoryResults.push(categoryResults);
            			}
            			allResultsForThisCategory = [];
            			
            			m = app.myContest.categories.length;
            			catSort = m;
            			catName = app.allCategories[category].name;
            			//console.log(app.myContest.categories);
            			for (j=0; j<m; j++) {
            				//console.log("if " + app.myContest.categories[j].name + " === " + catName);
            				if (app.myContest.categories[j].name === catName) {
            					catSort = j;
            					break;
            				}
            			}
            			
            			categoryResults = new CategoryResults(app.allCategories[category], catSort);
            			//console.log(categoryResults);
            		}
            		
            		tallyVote(v[i].entry);
            		
            	}
            	
            	//handle the last category since the loop ends before it's stored
            	
            	if (categoryResults !== null) {
    				categoryResults.results = allResultsForThisCategory;
    				categoryResults.results.sort(dynamicSort("-votes"));
    				allCategoryResults.push(categoryResults);
    			}
    			//console.log(allCategoryResults);
            	app.allCategoryResults = allCategoryResults;
            	callback();
            },
            writeResults: function(callback) {
            	var r = app.allCategoryResults;
            	//console.log(r);
            	r.sort(dynamicSort("sort"));
            	var l = r.length;
            	var $ul;
            	var $div;
            	var $category;
            	var header="";
            	var placeCounter=0;
            	var prevVotes=-1;
            	var prevPlace="";
				var resultCount = 3;
            	var html = "";
            	var catResults;
            	var result;
            	var j;
            	var m;
            	var entry;
            	var placeText = "";
            	var shareText = "";
            	var nameText="";
            	var votes=0;
            	var votesText = "";
            	var tieText = "";
            	var written=0;
            	
            	for (var i=0; i<l; i++) {
            		//for each category
            		$ul = $('#lvResults' + i);
            		$div = $('#resultsCategory' + i);
            		$category = $('#resultsTitle' + i);
            		catResults = r[i];
            		//console.log(catResults);
            		placeCounter = 0;
            		written = 0;
            		prevVotes = -1;
            		html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>" + catResults.category.name + "</li>";
            		m = catResults.results.length;
            		
            		for (j=0; j<m; j++) {
            			result = catResults.results[j];
            			entry = result.entry;
            			votes = result.votes;
            			
            			//console.log("if " + votes + " !== " + prevVotes);
            			
            			if (votes !== prevVotes) {
            				placeCounter ++;
            				tieText = "";
            			} else {
            				tieText = " - Tie!";
            			}
            			prevVotes = votes;
            			placeText = getPlaceText(placeCounter);
            			
            			
            			if (entry.name !== "") {
            				nameText = "<br><span class='desc'>" + entry.name + "</span>";
            			} else {
            				nameText = "";
            			}
            			
            			
            			
            			if (entry !== null) {
            				shareText = "";
            				if (entry.name !== "") {
            					if (tieText !== "") {
            						shareText += entry.name + " tied for ";            						
            					} else {
            						shareText += entry.name + " won ";
            					}

            				}
            				shareText += placeText + " in " + catResults.category.name + "!";
            				
            				if (votes !== 1) {
            					votesText = "votes";
            				} else {
            					votesText = "vote";
            				}
            				
		            		html += "<li id='" + i + "|" + j + "'><a href='#'><img src='" + entry.photo + "'><b>" + placeText + tieText + "</b><br><span class='desc'>" + votes + " " + votesText + nameText + "</a><a href='#' data-imgData='" + entry.b64 + "' data-shareText='" + shareText + "' class='shareResults'></a></li>";
	            			written ++;
	            			if (j === 0) {
	            				app.drawWinnerImage(i, entry, catResults.category.name, app.myContest.name);	
	            			}
	            		}
            			if (written >= resultCount) {
            				break;
            			}
            		}
            		
            		if (catResults.results.length > resultCount) {
            			html += "<li id='" + catResults.category.name + "'><a href='#' id='" + catResults.category.name + "' data-theme='c' class='moreResults'>Show more</a></li>";
            		}
            		
            		
            			//console.log("writing html");
            			$ul.html(html);
                		$ul.listview("refresh");
                		$ul.trigger("updatelayout");
                		$div.show();
                		$category.html(catResults.category.name);
					
            		
            	}
            	
					//console.log("l: " + l);
					if (l === 0) {
                    	$('#noResultsYet').show();
                   	}
                
                
                // for (i=0; i<l; i++) {
                	// catResults = r[i];
                	// m = catResults.results.length;
//                 	
            			// result = catResults.results[0];
            			// entry = result.entry;
//             			
//             		
                // }
            },
            writeResultsMore: function(name) {
            	var r = app.allCategoryResults;
            	//console.log(r);
            	var l = r.length;
            	var catResults;
            	for (var i=0; i<l; i++) {
            		if (r[i].category.name === name) {
            			catResults = r[i];
            			break;
            		}
            	}
            	
            	var header="";
            	var placeCounter=0;
            	var prevVotes=-1;
            	var prevPlace="";
				var resultCount = 3;
            	var html = "";
            	var result;
            	var j;
            	var m;
            	var entry;
            	var placeText = "";
            	var shareText = "";
            	var nameText="";
            	var votes=0;
            	var votesText = "";
            	var tieText = "";
            		
			      placeCounter = 0;
            		//html = '<ul id="lvResultsPopup" data-role="listview" data-inset="true" data-divider-theme="' + app.currThemeLetters[1] + '" data-split-icon="action" class="resultsLV">';
            		html += "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>" + catResults.category.name + "</li>";
            		m = catResults.results.length;
            		
            		for (j=0; j<m; j++) {
            			result = catResults.results[j];
            			entry = result.entry;
            			votes = result.votes;
            			
            			if (votes !== prevVotes) {
            				placeCounter ++;
            				tieText = "";
            			} else {
            				tieText = " - Tie!";
            			}
            			prevVotes = votes;
            			placeText = getPlaceText(placeCounter);
            			
            			
            			if (entry.name !== "") {
            				nameText = "<br><span class='desc'>" + entry.name + "</span>";
            			} else {
            				nameText = "";
            			}
            			
            			
            			
            			if (entry !== null) {
            				shareText = "";
            				if (entry.name !== "") {
            					if (tieText !== "") {
            						shareText += entry.name + " tied for ";            						
            					} else {
            						shareText += entry.name + " won ";
            					}
            				}
            				shareText += placeText + " in " + catResults.category.name + "!";
            				
            				if (votes !== 1) {
            					votesText = "votes";
            				} else {
            					votesText = "vote";
            				}
            				
		            		html += "<li id='" + i + "|" + j + "'><a href='#'><img src='" + entry.photo + "'><b>" + placeText + tieText + "</b><br><span class='desc'>" + votes + " " + votesText + nameText + "</a><a href='#' data-imgData='" + entry.photo + "' data-shareText='" + shareText + "' class='shareResults'></a></li>";
	            		}
            			
            		}
            		
            		
            		html += "</ul>";
            		app.popupHTML = html;
            		
            		changePage('#promptMoreResults', {
	                            transition: 'pop',
	                            role: 'dialog'
	                        });
                
            },
            drawWinnerImage: function(contestCount, contestEntry, categoryName, contestName) {
            	//console.log("[APP]drawWinnerImage " + contestCount);
            	var img1 = contestEntry.photo;
            	var img2 = "img/awards/Award1.png";
            	var caption = "1st place in " + categoryName;
            	
            	if (img1 !== "" && img2 !== "") {
            		var $aResults = $("#aResults" + contestCount);
                    var $btnResultsShare = $('#btnResultsShare' + contestCount);
                    var $myCanvas = $('#resultsCanvas' + contestCount);
                    var $myCanvasLowRes = $('#resultsCanvasLowRes' + contestCount);
                    var c = document.getElementById("resultsCanvas" + contestCount);
                    var cLowRes = document.getElementById("resultsCanvasLowRes" + contestCount);
                    var ctx = c.getContext("2d");
                    var ctxLowRes = cLowRes.getContext("2d");
                    var imageObj1 = new Image();
                    var imageObj2 = new Image();
					var winWidth = $(window).width();
					var margin = winWidth / 5;
					var winMax;
					var imgMaxWidth=1200;
					
					$myCanvas.hide();
		            $myCanvasLowRes.hide();
		            
					
					winWidth = winWidth - margin;
					
					if (winWidth > imgMaxWidth) {
						winMax = imgMaxWidth;
					} else {
						winMax = winWidth;
					}
					
					var $elImg = $('#resultsImage' + contestCount);
					
                    imageObj1.src = img1;
                    imageObj1.onload = function() {
                    		//console.log("imageObj1 onLoad");
                    	   var origWidth = imageObj1.width;
                    	   var origHeight = imageObj1.height;
                           var tWidth = imageObj1.width;
                           var tHeight = imageObj1.height;
                           
                           while (tWidth > winMax) {
                           	tWidth = tWidth * .90;
                           	tHeight = tHeight * .90;
                           }
                           
                           tWidth = Math.round(tWidth);
                           tHeight = Math.round(tHeight);
                           
                           $myCanvas.attr("width", origWidth);
                           $myCanvas.attr("height", origHeight);
                           
                           $myCanvasLowRes.attr("width", tWidth);
                           $myCanvasLowRes.attr("height", tHeight);
                           
                           
                           
                           
                    	
                        ctx.drawImage(imageObj1, 0, 0, origWidth, origHeight);
                        ctxLowRes.drawImage(imageObj1, 0, 0, tWidth, tHeight);
                        imageObj2.src = img2;
                        imageObj2.onload = function() {
                        	function getFont(w, fontSize, fontBase) {
							    var ratio = fontSize / fontBase;   // calc ratio
							    var size = w * ratio;   // get font size based on current width
							    return (size|0) + 'px sans-serif'; // set font
							}
							
							function getLineWidth(w, fontSize, fontBase) {
							    var ratio = fontSize / fontBase;   // calc ratio
							    var size = w * ratio;   // get font size based on current width
							    //console.log(size);
							    size = Math.round(size / 6);
							    //console.log(size);
							    return size; // set font
							}
							
							function drawIt(myctx, width, height, callback) {
								var square;
								var fraction = 3;
								var fontBase = 250;
								var fontSizeBig=10;
								var fontSizeSmall=4;
								var center = Math.round(width / 2);
	                        	if (width < height) {
	                        		square = Math.round(width / fraction); 
	                        	} else {
	                        		square = Math.round(height / fraction);
	                        	}
	                        	var top = height - square;
	                        	myctx.globalAlpha = 1.00;
						        myctx.drawImage(imageObj2, 0, top, square, square);
						        
						        
								var text = caption;
						        myctx.font=getFont(width, fontSizeBig, fontBase);
						        myctx.textAlign="left"; 
						        myctx.strokeStyle = 'black';
							    myctx.lineWidth = getLineWidth(width, fontSizeBig, fontBase);
							    var x = square;
							    var y = height - Math.round(square/2);
							    myctx.strokeText(text, x, y);
							    myctx.fillStyle = 'white';
						        myctx.fillText(text, x, y);
								myctx.textAlign="right";
								myctx.font=getFont(width, fontSizeSmall, fontBase);
								myctx.lineWidth = getLineWidth(width, fontSizeSmall, fontBase);
								x = width;
								y = height - 5;
								text = "Created with PartyVote: Dress Up  ";
								myctx.strokeText(text, x, y);
						        myctx.fillText(text, x, y);
						        callback();
							}
							
							drawIt(ctx, origWidth, origHeight, function() {
								drawIt(ctxLowRes, tWidth, tHeight, function() {
									var img = c.toDataURL("image/png");
									var imgLowRes = cLowRes.toDataURL("image/png");
									$elImg.attr("width", tWidth);
                           			$elImg.attr("height", tHeight);
		                            $elImg.attr("src", imgLowRes);
		                            $btnResultsShare.attr("data-imgData", img);
		                            $aResults.attr("title", caption);
		                            $btnResultsShare.attr("data-imgCaption", caption);
		                           	
								});
							});
							
                        };
                    };
                }
        
            },
            writeManageVotes: function() {
            	var v = app.allVotes;
            	//console.log(v);
            	var l = v.length;
            	var $ul = $('#lvManageVotes');
            	var html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>Votes</li>";
            	var entry;
            	var d;
            	for (var i=0; i<l; i++) {
            		entry = v[i].entry;
            		if (entry !== null) {
            			d = new Date(v[i].id).toMysqlFormat();
	            		html += "<li id='" + v[i].id + "'><a href='#'><img src='" + entry.photo + "'><span class='desc'>Entry: " + entry.name + " / Voter: " + v[i].name + "<BR>Category: " + app.allCategories[v[i].category].name + "<BR>Date: " + d + "</span></a><a class='delVote' id='" + v[i].id + "'></a></li>";
            		}
            	}
            	if (l === 0) {
                    html += "<li>No votes found</li>";
                }

                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");
            },
            writeManageEntries: function() {
            	var e = app.allEntries;
            	//console.log(e);
            	var l = e.length;
            	var $ul = $('#lvManageEntries');
            	var html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>Entries</li>";
            	var entry;
            	var d;
            	for (var i=0; i<l; i++) {
            		entry = e[i];
            		if (entry !== null) {
            			if (entry.hidden !== true) {
            				html += "<li id='" + entry.id + "'><a href='#'><img src='" + entry.photo + "'><span class='desc'>Name: " + entry.name + " / Votes: " + entry.votes + "</span></a><a class='delEntry' id='" + entry.id + "'></a></li>";	
            			}
            		}
            	}
            	if (l === 0) {
                    html += "<li>No entries found</li>";
                }

                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");
            },
            writeEntries: function(callback) {
            	if (app.entriesChanged > app.entriesWritten) {
            		app.entriesWritten = getTimestamp();
	            	
	            	var $el = $('#galleryContainer');
	                $el.empty();
	                $el.hide();
	                var $elHidden = $('#galleryContainerHidden');
	                $elHidden.empty();
	                $elHidden.hide();
	                var $elNone = $('#divGalleryNoneFound');
	                $elNone.hide();
	                var entries = app.allEntries;
	                var e;
	                var imgSrc;
	                var imgName;
	                var imgCaption;
	                var toAppend = "";
	                var iWrote = 0;
	                var l=entries.length;
	                var i;
	                var d;
	                var rel;
	                
	                var width = $(window).width();
	        		var height = $(window).height();
	        		var colMax = 180;
	        		var cols = Math.floor(width / colMax);
	        		var colsDone=0;
	        		
	        		var css1;
	        		var css2;
	        		//console.log("currTheme: " + app.currTheme);
	        		switch (app.currTheme) {
	        			
	        			case "Halloween":
	        				css1 = "headWhite";
	        				css2 = "descWhite";
	        				break;
	        			default:
	        				css1 = "head";
	        				css2 = "desc";
	        				
	        		}
	        		
	                //console.log("cols: " + cols);
	
						if (l > 1) {
	                        rel = ' data-rel="gallery"';
	                    } else {
	                        rel = '';
	                    }
					
	                if (l === 0) {
	                    $elNone.show();
	                } else {
	                    var $elImg;
	                    for (i = 0; i < l; i++) {
	                        //console.log();
	                        e = entries[i];
							if (e.hidden !== true){
		                        
		                        imgSrc = e.photo;
		                        imgName = e.name;
		                        imgCaption = e.caption;
		                        if (imgCaption === undefined || imgCaption === "undefined") {
		                        	imgCaption = "";
		                        }
		                        if (imgName !== "") {
		                        	imgName = "<span class='" + css1 + "'>" + imgName + "</span>";
		                        }
		                        if (imgCaption !== "") {
		                        	imgCaption = "<span class='" + css2 + "'>" + imgCaption + "</span>";
		                        }
		                        if (imgName !== "" && imgCaption !== "") {
		                        	imgCaption = "<BR>" + imgCaption;
		                        }
		                        
		                        //console.log(i + ": " + imgSrc);
		                        if (imgSrc !== "" && imgSrc !== null && imgSrc !== undefined && imgSrc !== "undefined") {
		                        	if (toAppend === "") {
		                        		toAppend += "<table style='width:100%;table-layout:fixed' cellpadding='1'><tbody>";
		                        	}
		                        	if (colsDone === 0) {
		                        		toAppend += "<tr>";
		                        	}
		                        	toAppend += "<td align='center' valign='top' data-theme='a'>";
		
		                            toAppend += '<a href="#" id="' + i + '" class="votePhoto" title="entry' + i + '"><img class="entryImage" src="' + imgSrc + '" id="imgEntry' + (i + 1) + '" style="" alt="" width="1" height="1"></a>';
		                            toAppend += imgName;
		                            toAppend += imgCaption;
		                        	//toAppend += "<input type='button' value='Vote' class='voteButton' id='voteButton" + i + "' />";
		                        	toAppend += "</td>";
		                        	colsDone ++;
		                        	//console.log("if " + colsDone + " === " + cols);
		                        	if (colsDone === cols) {
		                        		colsDone = 0;
		                        		toAppend += "</tr>";
		                        	}
		                        }
		                        
		                        if (i === l-1) {
		                        	if (toAppend !== "") {
			                        	if (colsDone !== 0) {
			                        		toAppend += "</tr>";
			                        	}
			                        	toAppend += "</tbody></table>";
			                        }
		                        }
		                        
		                        iWrote++;
		                   }
	                    }
	                    if (iWrote > 0) {
	                    	//console.log(toAppend);
	                    	$el.append(toAppend);
	                        $el.show();
	                    } else {
	                    	$elNone.show();
	                    }
	                    //$el.enhanceWithin();
	
	                    
		                    for (i = 0; i < l; i++) {
		                    	$elImg = $('#imgEntry' + (i + 1));
		                        $elImg.nailthumb({
		                            width: 160,
		                            height: 160,
		                            method: 'resize'
		                        });
		
		                    }
		                }
		                
	                
	                //$(".gallery-swipebox").swipebox();
	                    
	                    $('.votePhoto').on('click', function() {
	                	
	                	var id = parseInt($(this).attr("id"), 10);
	                	app.selectedEntryId = id;
	                	//console.log("id: " + id);
	                	changePage('#promptForVoteConfirm', {
	                        transition: 'pop',
	                        role: 'dialog'
	                    });
                   
                	});
                }
                    
	            if (callback) {
                	callback();	            	
	            }


            },
            initializeData: function(callback) {
            	app.loadContest(function(contest) {
            		//app.loadAllEntries(function(entries) {
            			//app.loadAllVotes(function(votes) {
            				//app.loadAllCategories(function(categories) {
            					callback();
            				//});	
            			//});
            		//});
            	});
            	
            },
            initializeVars: function(callback) {
            	this.lastPhoto=null;
            	this.myContest = null;
                this.tempContest = null;
                this.allVotes = [];
                this.votesChanged = 0;
                this.votesLoaded = -1;
                this.allEntries = [];
                this.entriesChanged = 0;
                this.entriesLoaded = -1;
                this.entriesWritten = -1;
                this.allCategories = [];
                this.categoriesChanged = 0;
                this.categoriesLoaded = -1;
                this.selectedEntryId=-1;
                this.currEntry = null;
                this.currCategory=0;
                this.editingContest = false;
                this.votesSinceHome = [];
                this.lastPhoto=null;
                this.lastVoterPhoto=null;
                this.lastVoterName="";
                this.passDest="#settings";
                this.allCategoryResults = [];
                
                callback();
            },
            initializeTheme: function(callback) {
            	this.currTheme="Princess Pink";
                this.currThemeLetters=["a", "b", "c", "d", "e"];
                this.currThemeBackground=0;
                this.currBackgroundColor="#ffffff";
                callback();
            },
        	initialize: function(callback) {
                //console.log("[APP]initialize");
                app.initializeVars(function() {
                app.initializeTheme(function() {	
	                Device.initialize(function(success) {
		        	    Globals.usingLocalStorage = true;
		                if (Globals.bDebug === true) {
		                    //console.log('[STORAGE] >> LocalStorage');
		                    Globals.sStorageType = "LocalStorage";
		                }
		                this.store = new LocalStore(
		                    function storeCreated(success) {
		                        //console.log("localstore created");
		                        app.store = success;
		                        app.initializeData(function(success) {
		                            //console.log("Data initialized"); 
		                        });
		                    
		                    },
		                    function LocalStoreError(errorMessage) {
		                        //console.log('Error: ' + errorMessage);
		                    }
		                );
	                });
	                
	               
	                
	                $('.resultsShare').on('click', function() {
	                	//console.log($(this));
	                	var imgData = $(this).attr("data-imgData");
	                	var imgCaption = $(this).attr("data-imgCaption");
	                	//console.log("imgCaption");
	                	//console.log(imgCaption);
	                	Social.tweet(imgCaption, imgData);
	                });
	                
	                $('#cancelPassword').on('click', function() {
	                	changePage("#home");
	                });
	                
	                $('#btnBackToHomeFromResults').on('click', function() {
            			InAppAll.isUpgraded(function(upgraded) {
	                		//console.log("upgraded: " + upgraded);
	                		if (upgraded === false) {
	                			if (app.myContest.categories.length > 0 && app.allVotes.length > 0) {
	                				AdsAll.showInterstitial();		
	                			}
	                			
		                	} 
		                	
		                	if (app.myContest.categories.length > 0 && app.allVotes.length > 0) {
		                		Social.addActionable(5);
		                	}
		                	changePage('#home');
	                	});
            	                	
	                });
	                
	                $('#btnResults').on('click', function() {
	                	if (app.myContest) {
	                		if (app.myContest.isPasswordProtected === true) {
	                			app.passDest = "#results";
	                			$('#txtPassword').val("");
	                			changePage('#promptForPassword', {
		                            transition: 'pop',
		                            role: 'dialog'
		                        });
	                		} else {
	                			
	                			app.loadAllCategories(function() {
			                		app.loadAllEntries(function() {
				                		app.loadAllVotes(function() {
					                		app.tallyResultsDelay(function() {
						                		changePage("#results");
						                	});
					                	});
			                		});
			                	});
	                			
	                		
	                		}
	                	} else {
	                		Toast.toast("Please configure the contest first");
	                		changePage("#contest");
	                	}
	                });
	                
	                $('.backToHome').on('click', function() {
	                	changePage("#home");
	                });
	                
	                $('.backToSettings').on('click', function() {
	                	changePage("#settings");
	                });
	                
	                $('#btnNewContest').on('click', function() {
	                	changePage('#promptForNewContest', {
	                        transition: 'pop',
	                        role: 'dialog'
	                    });
	                });
	                
	                $('#deleteCurrentContest').on('click', function() {
	                	app.newContest();
	                });
	                
	                $('#deleteVoteById').on('click', function() {
	                	var voteId = app.currDelVoteId;
	                	app.store.deleteVoteByIdForever(voteId, function() {
	                		var ts = getTimestamp();
	                		app.votesChanged = ts;
	                		changePage('#viewVotes');
	                	});
	                });
	                
	                $('#deleteEntryById').on('click', function() {
	                	var entryId = app.currDelEntryId;
	                	app.store.deleteContestEntryById(entryId, function() {
	                		app.store.deleteVotesByEntryId(entryId, function() {
	                			var ts = getTimestamp();
		                		app.entriesChanged = ts;
		                		changePage('#viewEntries');
	                		});
	                	});
	                });
	                
	                $('#voteById').on('click', function() {
	                	
	                	app.voteById();
	                });
	                
	                $('#btnTakeAPicture').on('click', function() {
	                	app.photoFromCamera(1, true);
	                });
	                
	                $('#btnTakeAPicture2').on('click', function() {
	                	app.photoFromCamera2(1, true);
	                });
	                
	                $(document).on('pagebeforecreate',function(){       
					    app.changeStyle(app.currTheme);
					});
					
					$('#promptMoreResults').on('pagebeforeshow', function() {
						var $ul = $('#lvResultsMore');
						$ul.html(app.popupHTML);
						$ul.listview("refresh");
                		$ul.trigger("updatelayout");
					});
	                
	                $('#results').on('pagebeforeshow', function() {
	                	$('.canvasContainer').hide();
	                	$('#noResultsYet').hide();
	                	for (var i=0; i<12; i++) {
	                		$('#resultsCategory' + i).hide();
	                		
	                	}
		
	            		app.writeResults(function() {
	            			$.mobile.loading('hide');
	            		});
	            		
	            		InAppAll.isUpgraded(function(upgraded) {
	                		if (upgraded === false) {
		                		AdsAll.prepareInterstitialImage(false);
		                	}
	                	});
				                	
	                });
	                
	                $('#viewVotes').on('pagebeforeshow', function() {
	                	app.loadAllCategories(function() {
	                		
	                	
		                	app.loadAllVotes(function() {
		                		app.loadAllEntries(function() {
		                		
		               				app.writeManageVotes();
		                		});
		                	});
	                	});
	                });
	                
	                $('#viewEntries').on('pagebeforeshow', function() {
	                	app.loadAllEntries(function() {
	                		
	                		
	                				                		app.writeManageEntries();
	                		
	                	});
	                });
	                
	                $('#categories').on('pagebeforeshow', function() {
	                	app.writeVoteCategories();
	                });
	                
	                $('#btnTestBanner').on('click', function() {
	                	AdsAll.showBanner();
	                });
	                
	                $('#btnTestRemoveInApp').on('click', function() {
	                	app.store.deleteAllInAppPurchases(function() {
	                		//console.log("Deleted all in app purchases");
	                	});
	                });
	                
	                
	                $('#home').on('pagebeforeshow', function() {
	                	//console.log("pagebeforeshow");
	                	
	                	
	                	
	                	app.lastPhoto = null;
	                	app.lastVoterPhoto = null;
	                	app.lastVoterName = "";
	                	var $elInfo = $('#info');
	                	var $elButtons = $('#buttons');
	                	var $elResults = $('#resultsButtons');
	                	app.votesSinceHome = [];
	                	
	                	//console.log(app.myContest);
	                	
	                	if (app.myContest === null) {
	                		$elInfo.show();
	                		$elButtons.hide();
	                		$elResults.hide();
	                	} else {
	                		var $elContestName = $('#contestName');
	                		//var $elContestVotes = $('#contestVotes');
	                		$elContestName.html(app.myContest.name);
	                		//$elContestVotes.html(app.allVotes.length + " votes");
	                		$elInfo.hide();
	                		$elResults.show();
	                		$elButtons.show();
	                	}
	                	
	                	
	                	
	                });
	                
	                $('#frmContestSettings1').on('submit', function() {
	                	app.submitContest();
	                });
	                
	                $('#contest').on('pagebeforeshow', function() {
	                	//$('#contestSubmitButton').closest('.ui-btn').hide();
	                	
	                	var c = app.myContest;
	                	if (c !== null) {
	                		
	                		var id = c.id;
	                		var name = c.name;
	                		var style = c.style;
	                		var entryAllowNames = c.entryAllowNames;
	                		var entryAllowCaptions = c.entryAllowCaptions;
	                		var voteShowScore = c.voteShowScore;
	                		var voteRequireName = c.voteRequireName;
	                		var voteRequirePhoto = c.voteRequirePhoto;
	                		var voteAllowComments = c.voteAllowComments;
	                		var categories = c.categories;
	                		var isOnline = c.isOnline;
	                		var isPasswordProtected = c.isPasswordProtected;
	                		var password = c.password;
	                		var savePhotos = c.savePhotos;
	                		var saveVoterPhotos = c.saveVoterPhotos;
	                		var backgroundImage = c.backgroundImage;
	                		                              //id, onlineId, name, style, entryAllowNames, entryAllowCaptions, voteShowScore, voteRequireName, voteRequirePhoto, voteAllowComments, categories, isOnline, isPasswordProtected, password
	                		app.tempContest = new Contest(id, "", name, style, entryAllowNames, entryAllowCaptions, voteShowScore, voteRequireName, voteRequirePhoto, voteAllowComments, categories, isOnline, isPasswordProtected, password, savePhotos, saveVoterPhotos, backgroundImage);
	                	} else {
	                		var category = new Category("Best Costume");
	                		app.tempContest = new Contest(getTimestamp(), "", "", "Princess Pink", true, false, false, false, false, true, [category], false, false, "", false, "");
	                	}
	                	
	                	c = app.tempContest;
	                	
	                	$('#txtContestName').val(c.name);
	                	var $el = $('#selStyle');
	                	$el.selectmenu();
	                	$el.val(c.style);
	                	$el.selectmenu("refresh", true);
	                	
	                	if (c.entryAllowNames === true) {
	                		$('#chkEntryName').attr('checked', true).checkboxradio("refresh");
	                	} else {
	                		$('#chkEntryName').attr('checked', false).checkboxradio("refresh");
	                	}
	                	
	                	if (c.entryAllowCaptions === true) {
	                		$('#chkEntryCaption').attr('checked', true).checkboxradio("refresh");
	                	} else {
	                		$('#chkEntryCaption').attr('checked', false).checkboxradio("refresh");
	                	}
	                	
	                	if (c.voteRequireName === true) {
	                		$('#chkVoterName').attr('checked', true).checkboxradio("refresh");
	                	} else {
	                		$('#chkVoterName').attr('checked', false).checkboxradio("refresh");
	                	}
	                	
	                	if (c.voteRequirePhoto === true) {
	                		$('#chkVoterPhoto').attr('checked', true).checkboxradio("refresh");
	                	} else {
	                		$('#chkVoterPhoto').attr('checked', false).checkboxradio("refresh");
	                	}
	                	
	                	if (c.savePhotos === true) {
	                		$('#chkSavePhotos').attr('checked', true).checkboxradio("refresh");
	                	} else {
	                		$('#chkSavePhotos').attr('checked', false).checkboxradio("refresh");
	                	}
	                	
	                	if (c.saveVoterPhotos === true) {
	                		$('#chkSaveVoterPhotos').attr('checked', true).checkboxradio("refresh");
	                		$('#divSaveVoterPhotos').show();
	                	} else {
	                		$('#chkSaveVoterPhotos').attr('checked', false).checkboxradio("refresh");
	                		$('#divSaveVoterPhotos').hide();
	                	}
	                	
	                	if (c.isPasswordProtected === true) {
	                		$('#chkPassword').attr('checked', true).checkboxradio("refresh");
	                		$('#pass1').val(c.password);
	                		$('#pass2').val(c.password);
	                		$('#passbox').show();
	                	} else {
	                		$('#chkPassword').attr('checked', false).checkboxradio("refresh");
	                		$('#pass1').val("");
	                		$('#pass2').val("");
	                		$('#passbox').hide();
	                	}
	                	
	                	if (c.backgroundImage !== "" && c.backgroundImage !== undefined) {
	                		$('#txtBackgroundImage').val(c.backgroundImage);
	                	}
	                	
	                	var cats = [];
	                	cats.push("Best Costume");
	                    cats.push("Best Group Costume");
	                    cats.push("Funniest Costume");
	                    cats.push("Girliest Costume");
	                    cats.push("Laziest Costume");
	                    cats.push("Most Original Costume");
	                    cats.push("Most Creative Costume");
	                    cats.push("Manliest Costume");
	                    cats.push("Scariest Costume");
	                    cats.push("Silliest Costume");
	                	var l = app.allCategories.length;
	                	var optionList = "";
	                	for (var i=0; i<l; i++) {
	                		if (cats.indexOf(app.allCategories[i].name) === -1) {
	                			cats.push(app.allCategories[i].name);
	                		}
	                	}
	                	var $elCats = $('#selCatAdd');
	                	$elCats.selectmenu();
	                	l = cats.length;
	                	for (i=0; i<l; i++) {
	                		optionList += "<option value='" + cats[i] + "'>" + cats[i] + "</option>";
	                	}
	                	$elCats.html(optionList).selectmenu('refresh', true);
	                	app.changeButtonColors();
	                	app.writeContestCategories();
	                	
	                });
	                
	                $('#promptForDeleteVote').on('pagebeforeshow', function() {
	                	var $name = $('#deleteVoteName');
	                	var $imageContainer = $('#deleteVoteImageContainer');
	                	var v = app.allVotes;
		            	var vote = null;
		            	var id = app.currDelVoteId;
		            	
		            	var entry;
		            	var d;
		            	var name;
		            	
		            	var l = v.length;
		            	for (var i=0; i<l; i++) {
		            		if (v[i].id === id) {
		            			vote = v[i];
		            			break;
		            		}
		            	}
		            	
		            	if (vote !== null) {
		            		
		            	
			            	entry = vote.entry;
		            		if (entry !== null) {
		            			d = new Date(vote.id).toMysqlFormat();
			            		name = "Entry: " + entry.name + " / Voter: " + vote.name + "<BR>Category: " + app.allCategories[vote.category].name + "<BR>Date: " + d;
		            			$name.html(name);
			            		$imageContainer.empty();
			                    //console.log("Got full path: " + fullPath);
			                    $imageContainer.append('<center><img src="' + entry.photo + '" id="imgVoteDeleteConfirm" height="320" width="320" style="" alt=""></center>');
			                    var $elImg = $('#imgVoteDeleteConfirm');
			                    $elImg.nailthumb({
			                        width: 320,
			                        height: 320,
			                        method: 'resize'
			                    });
			                    $elImg.show();
		            		}
			            	
		            	}
	                });
	                
	                $('#promptForDeleteEntry').on('pagebeforeshow', function() {
	                	var $name = $('#deleteEntryName');
	                	var $imageContainer = $('#deleteEntryImageContainer');
	                	var e = app.allEntries;
		            	var entry=null;
		            	var name;
		            	var id = app.currDelEntryId;
		            	
		            	var l = e.length;
		            	for (var i=0; i<l; i++) {
		            		if (e[i].id === id) {
		            			entry = e[i];
		            			break;
		            		}
		            	}
		            	
		            	//console.log("currDelEntryId: " + app.currDelEntryId);
		            	//console.log(entry);
		            	if (entry !== null) {
	            			name = entry.name + "<BR>Votes: " + entry.votes;
	            			$name.html(name);
		            		$imageContainer.empty();
		                    //console.log("Got full path: " + fullPath);
		                    $imageContainer.append('<center><img src="' + entry.photo + '" id="imgEntryDeleteConfirm" height="320" width="320" style="" alt=""></center>');
		                    var $elImg = $('#imgEntryDeleteConfirm');
		                    $elImg.nailthumb({
		                        width: 320,
		                        height: 320,
		                        method: 'resize'
		                    });
		                    $elImg.show();
	            		}
		            	
		            	
	                });
	                
	                $('#promptForVoteConfirm').on('pagebeforeshow', function() {
	                	var $name = $('#voteConfirmName');
	                	var $caption = $('#voteConfirmCaption');
	                	var $imageContainer = $('#voteConfirmImageContainer');
	                	var $imageContainer2 = $('#photoContainer2');
	                	var $voterName = $('#txtVoterName');
	                	var $divVoterName = $('#divVoterName');
	                	var $divVoterPhoto = $('#divVoterPhoto');
	                
	                	var entry = app.allEntries[app.selectedEntryId];
	                	app.selectedEntryId = entry.id;
	                	//console.log(entry);
	                	
	                	if (entry.name !== "") {
	                		$name.html(entry.name);
	                		$name.show();
	                	} else {
	                		$name.hide();
	                	}
	                	
	                	if (entry.caption !== "") {
	                		$caption.html(app.myContest.categories[app.currCategory].name);
	                		$caption.show();
	                	} else {
	                		$caption.hide();
	                	}
	                	
	                	if (app.myContest.voteRequireName === true) {
	                		$divVoterName.show();
	                		$voterName.val(app.lastVoterName);
	                	} else {
	                		$divVoterName.hide();
	                		$voterName.val("");
	                	}
	                	
	                	if (app.myContest.voteRequirePhoto === true) {
	                		$divVoterPhoto.show();
	                		$imageContainer2.empty();
		                    //console.log("Got full path: " + fullPath);
		                    if (app.lastVoterPhoto) {
		                    	$imageContainer2.append('<center><img src="' + app.lastVoterPhoto + '" id="imgVoterPhoto" height="160" width="160" style="" alt=""></center>');
			                    var $elImg2 = $('#imgVoterPhoto');
			                    $elImg2.nailthumb({
			                        width: 160,
			                        height: 160,
			                        method: 'resize'
			                    });
			                    $elImg2.show();
		                    }
		                    
	                		
	                	} else {
	                		$divVoterPhoto.hide();
	                		app.lastVoterPhoto = null;
	                	}
	                	
	                	
	                	$imageContainer.empty();
	                    //console.log("Got full path: " + fullPath);
	                    $imageContainer.append('<center><img src="' + entry.photo + '" id="imgVoteConfirm" height="320" width="320" style="" alt=""></center>');
	                    var $elImg = $('#imgVoteConfirm');
	                    $elImg.nailthumb({
	                        width: 320,
	                        height: 320,
	                        method: 'resize'
	                    });
	                    $elImg.show();
	                    
	                });
	                
	                $('.resultsLV').on('click', 'a', function(e) {
	                	e.stopImmediatePropagation();
	                    var myClass = $(this).attr("class");
	                    var myID = $(this).attr("id");
	                    var shareText = $(this).attr("data-shareText");
	                    var imgData = $(this).attr("data-imgData");
	                    var myType = "";
	                    if (myClass.indexOf('shareResults') >= 0) {
	                        myType = "shareResults";
	                    } else if (myClass.indexOf('moreResults') >= 0) {
	                    	myType = 'moreResults';
	                    } else {
	                        myType = "";
	                    }
	
	                    if (myType === "shareResults") {
	                    	Social.tweet(shareText, imgData);
	                    } else if (myType === "moreResults") {
	                    	app.writeResultsMore(myID);	
	                    }
	                });
	                
	                $('.resultsLV').on('click', 'li', function(e) {
	                	//console.log("click");
	                	e.stopImmediatePropagation();
	                    var myClass = $(this).attr("class");
	                    var myID = $(this).attr("id");
	                    var myType = "";
	                    if (myClass.indexOf('moreResults') >= 0) {
	                    	myType = 'moreResults';
	                    } else {
	                        myType = "";
	                    }
	
	                    if (myType === "moreResults") {
	                    	app.writeResultsMore(myID);	
	                    }
	                });
	              
	                $('#lvVoteCategories').on('click', 'a', function() {
	                    //console.log("click");
	                    var id = parseInt($(this).attr("id"), 10);
	                    if (id >= 0) {
	                    	                    app.currCategory = id;
	                    changePage('#vote');	
	                    } else {
	                    	changePage("#home");
	                    }
	                });
	                
	                $('#lvManageVotes').on('click', 'a', function(e) {
	                    e.stopImmediatePropagation();
	                    var myClass = $(this).attr("class");
	                    var id = $(this).attr("id");
	                    var myType = "";
	                    if (myClass.indexOf('delVote') >= 0) {
	                        myType = "delVote";
	                    } else {
	                        myType = "";
	                    }
	
	                    if (myType === "delVote") {
	                        app.currDelVoteId = parseInt(id, 10);
	                        changePage('#promptForDeleteVote', {
	                            transition: 'pop',
	                            role: 'dialog'
	                        });
	                    }
	                });
	                
	                $('#lvManageEntries').on('click', 'a', function(e) {
	                    e.stopImmediatePropagation();
	                    var myClass = $(this).attr("class");
	                    var id = $(this).attr("id");
	                    //console.log(id);
	                    var myType = "";
	                    if (myClass.indexOf('delEntry') >= 0) {
	                        myType = "delEntry";
	                    } else {
	                        myType = "";
	                    }
	
	                    if (myType === "delEntry") {
	                        app.currDelEntryId = parseInt(id, 10);
	                        changePage('#promptForDeleteEntry', {
	                            transition: 'pop',
	                            role: 'dialog'
	                        });
	                    }
	                });
	                
	                
	                $('#btnSaveContest').on('click', function() {
	                	app.submitContest();
	                    
	                });
	                
	                $('#lvContestCategories').on('click', 'a', function(e) {
	                    e.stopImmediatePropagation();
	                    var myClass = $(this).attr("class");
	                    var myId = parseInt($(this).attr("id"), 10);
	                    var myType = "";
	                    if (myClass.indexOf('delCategory') >= 0) {
	                        myType = "delCategory";
	                    } else {
	                        myType = "";
	                    }
	
	                    if (myType === "delCategory") {
	                        var l = app.tempContest.categories.length;
	                        if (myId < l) {
	                        	app.tempContest.categories.splice(myId, 1);
	                        }
	
	                        app.writeContestCategories();
	                    }
	                });
	                
	                $('#btnEditContest').on('click', function() {
	                	app.editingContest = true;
	                	changePage("#contest");
	                });
	                
	                $('#btnSaveEntry').on('click', function() {
	                	$('#frmTakePhoto').submit();
	                	
	                });
	                
	                $(".entrySubmit").on('keyup', function(e) {
	                	// //console.log(e.keyCode);
	                	 if (e.keyCode === 13) {
	                		 $('#frmTakePhoto').submit();	                		
	                	 }

	                });
	                
	                $(".contestSubmit").on('keyup', function(e) {
	                	//console.log(e.keyCode);
	                	if (e.keyCode === 13) {
	                		app.submitContest();	                		
	                	}

	                });
	                
	                $('#btnEnter').on('click', function() {
	                	//console.log('click');
	                	var id = getTimestamp();
	                	//console.log(id);
	                	app.currEntry = new ContestEntry(id, "", "", "", 0, false);
	                	//console.log('after currentry');
	                	changePage("#enter");
	                	//console.log('after changepage');
	                });
	                
	                $('#enterPassword').on('click', function() {
	                	if (app.myContest) {
	                		//console.log(app.myContest);
	                		if (app.myContest.isPasswordProtected === true) {
	                			var pass1 = app.myContest.password;
	                			var pass2 = $('#txtPassword').val();
	                			//console.log("pass1:" + pass1);
	                			//console.log("pass2:" + pass2);
	                			if (pass1 === pass2) {
	                				
	                				
	                				if (app.passDest === "#results") {
	                					app.loadAllCategories(function() {
					                		app.loadAllEntries(function() {
						                		app.loadAllVotes(function() {
							                		app.tallyResultsDelay(function() {
								                		changePage("#results");
								                	});
							                	});
					                		});
					                	});
	                				} else {
	                					changePage(app.passDest);
	                				}
	                				
	                			} else {
	                				Toast.toastLong('Incorrect password.  If you forget your password you can delete and reinstall the app, but the current contest will be lost.');
	                			}
	                		}
	                	}
	                });
	                
	                
	                $('#btnSettings').on('click', function() {
	                	//console.log("click");
	                	if (app.myContest) {
	                		//console.log("exists");
	                		if (app.myContest.isPasswordProtected === true) {
	                			//console.log("PWprot");
	                			app.passDest = "#settings";
	                			$('#txtPassword').val("");
	                			changePage('#promptForPassword', {
		                            transition: 'pop',
		                            role: 'dialog'
		                        });
	                		} else {
	                			changePage("#settings");
	                		}
	                	} else {
	                		changePage("#contest");
	                	}
	                });
	                
	                $('#category').on('pagebeforeshow', function() {
	                	app.writeVoteCategories();
	                });
	                
	                $('#settings').on('pageshow', function() {
	                	Social.askForReview(false, false, false, function(bShowedDialog) {
	                		//console.log(bShowedDialog);
	                	});
	                });
	                
	                $('#enter').on('pagebeforeshow', function() {
	                	//console.log("pagebeforeshow");
	                	if (app.myContest === null) {
	                		//console.log("go to setup");
	                		changePage("#setup");
	                	} else {
	                		//console.log("not null");
	                		var c = app.myContest;
	                		//alert ("got c");
	                		$('#txtPhotoName').val("");
	                		$('#txtPhotoCaption').val("");
	                		if (c.entryAllowNames === true) {
	                			$('#divEntryName').show();
	                		} else {
	                			$('#divEntryName').hide();
	                		}
	                		if (c.entryAllowCaptions === true) {
	                			$('#divEntryCaption').show();
	                		} else {
	                			$('#divEntryCaption').hide();
	                		}
	                		//console.log("about to write entry");
	                		app.writeEntry();
	                	}
	                });
	                
	                $('#vote').on('pagebeforeshow', function() {
						app.loadAllEntries(function() {
							app.writeEntries(function() {
								var $elCaption = $('#voteCaption');
								$elCaption.html(app.myContest.categories[app.currCategory].name);
							});
						});
	                });
	                
	                $('#selStyle').on('change', function() {
	                	
	                	app.changeButtonColors();
	                });
	                
	                $('#chkPassword').on('change', function() {
	                	if ($(this).is(":checked")) {
	                        $('#passbox').show();
	                    } else {
							$('#passbox').hide();
	                    }
	                });
	                
	                $('#chkVoterPhoto').on('change', function() {
	                	if ($(this).is(":checked")) {
	                        $('#divSaveVoterPhotos').show();
	                    } else {
							$('#divSaveVoterPhotos').hide();
	                    }
	                });
	                
	                $('#selCatAdd').on('change', function() {
	                	$('#txtCategoryAdd').val($('#selCatAdd').val());
	                });
	                
	                $('#btnAddCategory').on('click', function() {
	                	app.submitCategory();
	                });
	                
	                $('#deleteDatabase').on('click', function() {
	                    var $el = $('#reallyDeleteDatabase');
	                    if ($el.val() === "DELETE") {
	                        app.deleteEntireDatabase(function(success) {
	                            if (success === true) {
	                                Toast.toast("Deleted Database. Please exit and restart the app.");
	                                changePage("#deleteddatabase");
	                            }
	                        });
	                    } else {
	                        Toast.toast("Type DELETE in all caps to continue");
	                    }
	                });
	                
	                $('#btnVote').on('click', function() {
	                	if (app.myContest !== null) {
	                		if (app.myContest.categories.length > 1) {
	                			changePage("#category");
	                		} else {
	                			app.currVoteCategory=0;
	                			changePage("#vote");
	                			
	                		}
	                	} else {
	                		changePage("#contest");	
	                	}
	                });
	            });
            	});    
        	}
        	
        };
        app.initialize();



		/*
        var jshintVariablesToAvoidUndefinedErrors;
        var $;
        var stripFileURI;
        var bytesToSize;
        var getFileExtFromB64;
        var chartToImageStr;
        var Toast;
        var Popup;
        var Device;
        var Globals;
        var Game;
        var isNumber;
        var playAudio;
        var Setting;
        var CloudHist;
        var CloudBlob;
        var dynamicSort;
        var MozActivity;
        var Camera;
        var alertDebug;
        var getTimestamp;
        var FileIO;
        var CloudLocal;
        var downloadImage;
        var Internet;
        var Social;
        var changePage;
        var dynamicSortMultiple;
        var SavedItem;
        var CloudAll;
        var LocalStore;
        var WebSqlStore;
        var toTitleCase;
        var parseXml;
        var xml2json;
        var humaneDate;
        var jQuery;
        var escape;
        var Cloud;
        var myIndexedDb;
        var webSQLStore;
        var getTimeStamp;
        var randomIntFromInterval;
        var myIndexedDB;
        var Shell;
        var fixDate;
        var getDateFormatForDateBox;
        var isNumeric;
        var Vote;
        var ContestEntry;
        var Category;
        var Results;
        var CategoryResults;
        var Contest;
        var getPlaceText;
        var AdsAll;
        var InAppAll;
        */