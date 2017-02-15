var InOut = {
    doExport: function(aTypes, bForWifi, callback) {
        //console.log("[InOut]doExport");
        InOut.prepExport(aTypes, function(exportItems) {
            //console.log("exportItems:");
            //console.log(exportItems);
            InOut.escape(exportItems, function(escapedItems) {
                //console.log("escapedItems:");
                //console.log(escapedItems);
                InOut.outputExport(escapedItems, function(exportString) {
                    //console.log("exportString:");
                    //console.log(exportString);
                    InOut.xmlWrap(exportString, "None", bForWifi, function(xmlString) {
                        //console.log("xmlString:");
                        //console.log(xmlString);
                        callback(xmlString);
                    });
                });
            });
        });
    },
    setAllExportItems: function(callback) {
    	var doGetSettingObj = function(i, s, callback) {
    		app.store.getSettingObj(s.settingName, function(settingObj) {
    			callback(i, settingObj);
    		});
    	};
    	
        //console.log("[InOut]setAllExportItems");
        app.store.findAllExercises(function(exercises) {
            InOut.allExercises = exercises;
            app.store.findAllExercisesDone(function(exercisesDone) {
                InOut.allExercisesDone = exercisesDone;
                app.store.findAllGroups(function(groups) {
                    InOut.allGroups = groups;
                    app.store.findAllRecipes(function(recipes) {
                        InOut.allRecipes = recipes;
                        app.store.findAllStats(function(stats) {
                            InOut.allStats = stats;
                            app.store.findAllFoods(function(foods) {
                                InOut.allFoods = foods;
                                app.store.findAllPortions(function(portions) {
                                    InOut.allPortions = portions;
                                    app.store.findAllFoodsEaten(function(foodsEaten) {
                                        InOut.allFoodsEaten = foodsEaten;
                                        app.store.findAllCalorieDays(function(calorieDays) {
                                            InOut.allCalorieDays = calorieDays;
                                            app.store.findAllExerciseDays(function(exerciseDays) {
                                                InOut.allExerciseDays = exerciseDays;
                                                app.store.findAllAwards(function(awards) {
                                                    InOut.allAwards = awards;
                                                    app.store.findAllAwardsEarned(function(awardsEarned) {
                                                        InOut.allAwardsEarned = awardsEarned;
                                                        app.store.findStatsPersonal(function(statsPersonal) {
                                                            InOut.statsPersonal = statsPersonal;
                                                            app.store.findAllGoals(function(goals) {
                                                            	InOut.allGoals = goals;
	                                                            app.store.findAllSettings(function(settings) {
	                                                            	var a = [];
	                                                                var l = settings.length;
	                                                                var s;
	                                                                var iDone=0;
	                                                                for (var i = 0; i < l; i++) {
	                                                                	s = settings[i];
	                                                                	if (CloudLocal.cloudSettings.indexOf(s.settingName) >= 0) {
	                                                                    	if (CloudLocal.acceptOlderSettings.indexOf(s.settingName) >= 0) {
	                                                                    		doGetSettingObj(i, s, function(iPassBack, settingObj) {
	                                                                    			console.log(iPassBack);
	                                                                    			console.log(settingObj);
	                                                                    			if (!settingObj) {
												                        				a.push(settings[iPassBack]);
												                        			} else {
												                        				var existing = new Date(settingObj.settingValue);
												                        				var updating = new Date(settings[iPassBack].settingValue);
												                        				console.log("existing: ");
												                        				console.log(existing);
												                        				console.log("updating: ");
												                        				console.log(updating);
												                        				if (existing > updating) {
												                        					console.log("found older, saving");
												                        					a.push(settings[iPassBack]);
												                        				} else {
												                        					console.log("found newer, not saving");
												                        					
												                        				}
												                        			}
												                        			iDone ++;
											                        				if (iDone === l) {
											                        					InOut.allSettings = a;
	                                                            						callback();
											                        				}
	                                                                    		});
	                                                                    		
												                        		
	                                                                    	} else {
	                                                                    		a.push(s);	
	                                                                    		iDone++;
	                                                                    		if (iDone === l) {
										                        					InOut.allSettings = a;
                                                            						callback();
										                        				}
	                                                                    	}
	                                                                    } else {
	                                                                    	iDone++;
                                                                    		if (iDone === l) {
									                        					InOut.allSettings = a;
                                                        						callback();
									                        				}
	                                                                    }
	                                                                }
                                                               	});
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });


    },
    prepExport: function(aTypes, callback) {
        //console.log("[InOut]prepExport");
        var ret = [];
        var i;
        var l;
        var a;
        var aSettings;

        if (aTypes.length === 0) {
            aTypes = ["Exercise", "ExerciseDone", "Group", "GroupMembers", "Recipe", "Stats", "Food", "Portion", "FoodEaten", "CalorieDay", "ExerciseDay", "Award", "AwardEarned", "StatsPersonal", "Settings", "Goal"];
        }


        InOut.setAllExportItems(function() {
            //console.log("aTypes:");
            //console.log(aTypes);

            if (aTypes.indexOf("Exercise") > -1) {
                //console.log("doing exercise");
                a = InOut.allExercises;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Exercise";
                    ret.push(a[i]);
                }

                aSettings = ["calorieGoalEx", "sawTapMessageEx"];
                a = InOut.allSettings;
                l = a.length;
                for (i = 0; i < l; i++) {
                    //console.log("settingName: " + a[i].settingName);
                    //console.log("indexof: " + aSettings.indexOf(a[i].settingName));
                    if (aSettings.indexOf(a[i].settingName) > -1) {
                        //console.log("foundsetting " + a[i].settingName);
                        a[i].exportType = "Setting";
                        ret.push(a[i]);
                    }
                }

            }
            if (aTypes.indexOf("ExerciseDone") > -1) {
                a = InOut.allExercisesDone;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "ExerciseDone";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("Group") > -1) {
                a = InOut.allGroups;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Group";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("Recipe") > -1) {
                a = InOut.allRecipes;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Recipe";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("Stats") > -1) {
                a = InOut.allStats;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Stats";
                    ret.push(a[i]);
                }

                aSettings = ["weightGoalmetric", "weightGoalstandard", "weightCurrmetric", "weightCurrstandard", "weightStartmetric", "weightStartstandard", "sawTapMessageWeight", "measure", "lastArm", "lastChest", "lastHips", "lastMeasure", "lastNeck", "lastThigh", "lastWaist", "lastWeight"];
                a = InOut.allSettings;
                l = a.length;
                for (i = 0; i < l; i++) {
                    if (aSettings.indexOf(a[i].settingName) > -1) {
                        a[i].exportType = "Setting";
                        ret.push(a[i]);
                    }
                }

            }
            if (aTypes.indexOf("Food") > -1) {
                a = InOut.allFoods;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Food";
                    ret.push(a[i]);
                }

                aSettings = ["calorieGoal", "sawTapMessage"];
                a = InOut.allSettings;
                l = a.length;
                for (i = 0; i < l; i++) {
                    if (aSettings.indexOf(a[i].settingName) > -1) {
                        a[i].exportType = "Setting";
                        ret.push(a[i]);
                    }
                }
            }
            if (aTypes.indexOf("Portion") > -1) {
                a = InOut.allPortions;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Portion";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("FoodEaten") > -1) {
                a = InOut.allFoodsEaten;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "FoodEaten";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("CalorieDay") > -1) {
                a = InOut.allCalorieDays;
                l = a.length;
                for (i = 0; i < l; i++) {
                    a[i].exportType = "CalorieDay";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("ExerciseDay") > -1) {
                //console.log("exerciseDays");
                a = InOut.allExerciseDays;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "ExerciseDay";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("Award") > -1) {
                a = InOut.allAwards;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Award";
                    ret.push(a[i]);
                }
            }
            if (aTypes.indexOf("AwardEarned") > -1) {
                a = InOut.allAwardsEarned;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "AwardEarned";
                    ret.push(a[i]);
                }
            }
            
            if (aTypes.indexOf("Goal") > -1) {
                a = InOut.allGoals;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Goal";
                    ret.push(a[i]);
                }
            }

            if (aTypes.indexOf("StatsPersonal") > -1) {
                if (InOut.statsPersonal) {
                    InOut.statsPersonal.exportType = "StatsPersonal";
                    ret.push(InOut.statsPersonal);
                }
            }

            if (aTypes.indexOf("Setting") > -1) {
                a = InOut.allSettings;
                l = a.length;
                //console.log(l);
                for (i = 0; i < l; i++) {
                    a[i].exportType = "Setting";
                    ret.push(a[i]);
                }
            }
            //console.log("ret");
            //console.log(ret);
            callback(ret);
        });
    },
    outputExport: function(items, callback) {
        //console.log("[InOut]outputExport");
        var l = 0;
        var i;
        var p;
        var itemString = "";
        var outputString = "";
        var item;
        l = items.length;
        for (i = 0; i < l; i++) {
            p = items[i];
            itemString = "";
            for (var property in p) {
                if (p.hasOwnProperty(property)) {
                    // do stuff
                    item = p[property];
                    //console.log(item);
                    //console.log(typeof item);
                    if (typeof item === "object") {
                        item = JSON.stringify(item);
                    }
                    itemString += property + "=" + item + "@";
                }
            }
            itemString = itemString.replace(/@$/, "") + ";";
            outputString += itemString;
            if (i === (l - 1)) {
                callback(outputString);
            }
        }
        if (l === 0) {
            callback("");
        }
    },
    doImport: function(importText, callback) {
        //console.log("[APP]doImport");
        InOut.xmlUnwrap(importText, function(data) {
            //console.log("unwrapped: ");
            //console.log(data);
            InOut.extractImport(data, function(importItems) {
                //console.log("importItems");
                //console.log(importItems);
                InOut.importItems(importItems, function(success) {
                    //console.log("import complete");
                    InOut.finishImport(function() {
                    	                    callback();
                    });
                });
            });
        });
    },
    finishImport: function(callback) {
    	app.reloadAll(function() {
    		callback();
    	});
    },
    extractImport: function(importText, callback) {
        //console.log("extract import");
        //console.log("should not be unescaped yet");


        var processItem = function(item, callback) {
            //console.log("processitem");
            //console.log(item);

            var processMembers = function(members) {
                //console.log("processMembers");
                var l = members.length;
                var ret = [];
                var m;
                for (var i = 0; i < l; i++) {
                    m = new GroupMember(parseInt(members[i].foodId, 10), parseInt(members[i].portionId, 10), members[i].amount, parseInt(members[i].calories, 10));
                    ret.push(m);
                }
                //console.log("processed:");
                //console.log(ret);
                return ret;
            };

            //var ret=[];
            var obj = null;
            if (item.indexOf("@") > 0) {
                var a = item.split("@");
                var b;

                var obj2 = null;
                //var members;
                var l = a.length;
                var objType = "";

                b = a[a.length - 1].split("=");
                objType = b[1];
                //console.log("objType: " + objType);
                //console.log(objType);
                //aTypes = ["Exercise", "ExerciseDone", "Group", "Recipe", "Stats", "Food", "Portion", 
                //"FoodEaten", "CalorieDay", "ExerciseDay", "Award", "AwardEarned", "StatsPersonal"];			

                switch (objType) {
                    case "Exercise":
                        obj = new Exercise();
                        break;
                    case "ExerciseDone":
                        obj = new ExerciseDone();
                        break;
                    case "Group":
                        obj = new Group();
                        break;
                    case "Recipe":
                        obj = new Recipe();
                        break;
                    case "Stats":
                        obj = new Stats();
                        break;
                    case "Food":
                        obj = new Food();
                        break;
                    case "Portion":
                        obj = new Portion();
                        break;
                    case "FoodEaten":
                        obj = new FoodEaten();
                        break;
                    case "CalorieDay":
                        obj = new CalorieDay();
                        break;
                    case "ExerciseDay":
                        obj = new ExerciseDay();
                        break;
                    case "Goal":
                    	obj = new Goal();
                    	break;
                    case "AwardEarned":
                        obj = new AwardEarned();
                        break;
                    case "StatsPersonal":
                        obj = new StatsPersonal();
                        break;
                    case "Setting":
                        obj = new Setting();
                        break;
                }

                obj["objectType"] = objType;

                //console.log("obj:");
                //console.log(obj);
                var stringObjs = [];
                var dateObjs = [];
                var intObjs = ["id", "goalId", "goalValue", "goalMax", "goalProgress", "weight", "exerciseId", "foodId", "portionId", "mets", "calories", "kCal", "caloriesBurned", "durationMinutes", "timeStamp", "arm", "bmi", "chest", "fatLossCals", "hips", "neck", "sustainCals", "thigh", "waist", "cm", "ft", "inches", "itemTypeId", "awardId", "earnedId"];
                var floatObjs = ["bodyFat", "bmr", "bodyWeight"];
                var boolObjs = ["renamed", "hidden"];
                var objObjs = ["members"];
                var blankNotNull = ["id"];

                if (obj) {
                    for (var i = 0; i < l - 1; i++) {
                        b = a[i].split("=");

                        b[1] = InOut.unescape(b[1]); //Unescape here
                        //console.log(b);


                        if (b[1] !== null && b[1] !== "null") {


                            if (dateObjs.indexOf(b[0]) >= 0) {
                                b[1] = new Date(b[1]);
                            }

                            if (intObjs.indexOf(b[0]) >= 0) {
                                if (isNumber(b[1])) {
                                    b[1] = parseInt(b[1], 10);
                                } else {
                                    b[1] = null;
                                }
                            }

                            if (stringObjs.indexOf(b[0]) >= 0) {
                                //console.log("toString");
                                b[1] = b[1].toString();
                            }

                            if (floatObjs.indexOf(b[0]) >= 0) {
                                b[1] = parseFloat(b[1]);
                                //console.log(b[1]);
                            }

                            if (boolObjs.indexOf(b[0]) >= 0) {
                                b[1] = stringToBoolean(b[1]);
                            }

                            if (blankNotNull.indexOf(b[0]) >= 0) {
                                if (b[1] === null) {
                                    b[1] = "";
                                }
                            }

                            if (objObjs.indexOf(b[0]) >= 0) {
                                //console.log("convert obj");
                                //console.log(b[1]);
                                b[1] = JSON.parse(b[1]);
                                //console.log(b[1]);
                                obj2 = processMembers(b[1]);
                            }

                        } else {
                            b[1] = null;
                        }

                        if (b[1] === "[]") {
                            b[1] = [];
                        }

                        obj[b[0]] = b[1];

                    }

                    i = 0;
                    for (i in obj) {
                        if (obj[i] === undefined) {
                            delete obj[i];
                            //console.log("deleted");
                        }
                    }
                }
            }
            //console.log(obj);
            callback(obj);

        };

        var d = importText.split(";");

        var importItems = [];
        var iDone = 0;
        //console.log(d);
        //console.log("length: " + d.length);
        d.clean('');
        d.clean('\n');
        d.clean('\t');
        var l = d.length;

        for (var i = 0; i < l; i++) {
            processItem(d[i], function(item) {
                iDone++;
                if (item) {
                    importItems.push(item);
                }
                if (iDone === l) {
                    //console.log("importItems");
                    callback(importItems);
                }
            });
        }
    },
    importItems: function(items, callback) {
        var l = items.length;
        var obj;
        var objType;
        var iDone = 0;
        var iNew = 0;
        var iOld = 0;
        var iDupes = 0;
        var iUpdated = 0;
        var iErrors = 0;
        var strErr = "";
        var sStatus = "";

        var progress = function() {

            iDone++;
            //console.log("progress " + iDone + " / " + l);
            if (iDone === l) {
                //console.log("callback final");
                sStatus = "Import Status: Parsed " + iDone + " items - " + iNew + " new, " + iUpdated + " updated, " + iOld + " older items skipped, " + iDupes + " duplicates, " + iErrors + " errors. " + strErr;
                var $el = $('#importStatus');
                $el.html("<p><b>" + sStatus + "</b></p>");
                Toast.toastMiniLong(sStatus);
                //console.log(sStatus);
                //console.log("localStorage length: " + localStorage.length);
                callback();
            }
        };

        var doError = function(objType, errorMsg, callback) {
            //console.log(errorMsg);
            iErrors++;
            if (strErr === "") {
                strErr = "Errors: ";
            }
            strErr += errorMsg + ",";
            callback();
        };

        var findById = function(obj, objType, callback) {
            console.log("findById " + objType);
            var bError = false;
            var errMsg = "";
            if (objType === "ExerciseDay" || objType === "CalorieDay" || objType === "Stats") {
                if (obj.sqlDate === null || obj.sqlDate === undefined) {
                    bError = true;
                    errMsg = "SQLDate ID missing from " + JSON.stringify(obj);
                }
            } else if (objType === "StatsPersonal") {
                //do nothing
            } else if (objType === "AwardEarned") {
            	if (obj.earnedId === null || obj.earnedId === undefined) {
                    bError = true;
                    errMsg = "EarnedID missing from " + JSON.stringify(obj);
                }
            } else if (objType === "Setting") {
                if (obj.settingName === null || obj.settingName === undefined) {
                    bError = true;
                    errMsg = "SettingName missing from " + JSON.stringify(obj);
                }
            } else {
                if (obj.id === null || obj.id === undefined) {
                    bError = true;
                    errMsg = "ID missing from " + JSON.stringify(obj);
                }
            }

            if (bError === false) {


                switch (objType) {
                	case "Goal":
                		app.store.findGoalById(obj.id, function(existing) {
                			callback(obj, existing);
                		});
                		break;
                    case "Exercise":
                        app.store.findExerciseById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "ExerciseDone":
                        app.store.findExerciseDoneById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Group":
                        app.store.findGroupById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Recipe":
                        app.store.findRecipeById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Stats":
                        app.store.findStatsById(obj.sqlDate, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Food":
                        app.store.findFoodById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Portion":
                        app.store.findPortionById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "FoodEaten":
                        app.store.findFoodEatenById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "CalorieDay":
                        app.store.findCalorieDayBySQLDate(obj.sqlDate, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "ExerciseDay":
                        app.store.findExerciseDayBySQLDate(obj.sqlDate, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                        //case "Awards":
                        //	obj = new Award();
                        //	break;
                    case "AwardEarned":
                        app.store.findAwardEarnedById(obj.id, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "StatsPersonal":
                        app.store.findStatsPersonal(function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    case "Setting":
                        app.store.findSettingByName(obj.settingName, function(existing) {
                            callback(obj, existing);
                        });
                        break;
                    default:
                        doError(objType, "Unknown data type: " + objType, function() {
                            callback(obj, null);
                        });
                        break;
                }
            } else {
                doError(objType, errMsg, function() {
                    callback(obj, null);
                });
            }
        };

        var addObj = function(obj, objType) {
			var cloudType;
            switch (objType) {
            	case "Goal":
            		cloudType = "Goals";
                    app.store.addGoal(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "Exercise":
                	cloudType = "Exercises";
                    app.store.addExercise(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "ExerciseDone":
                	cloudType = "ExercisesDone";
                    app.store.addExerciseDone(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "Group":
                	cloudType = "Groups";
                    app.store.addGroup(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "Recipe":
                	cloudType = "Recipes";
                    app.store.addRecipe(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "Stats":
                	cloudType = "Stats"
                    app.store.addStats(obj, function() {
                        CloudAll.updateIndex(obj.sqlDate, cloudType);
                        progress();
                    });
                    break;
                case "Food":
                	cloudType = "Foods";
                    app.store.addFood(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "Portion":
                	cloudType = "Portions";
                    app.store.addPortion(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "FoodEaten":
                	cloudType = "FoodsEaten";
                    app.store.addFoodEaten(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "CalorieDay":
                	cloudType = "CalorieDays";
                    app.store.addCalorieDay(obj, function() {
                        CloudAll.updateIndex(obj.sqlDate, cloudType);
                        progress();
                    });
                    break;
                case "ExerciseDay":
                	cloudType = "ExerciseDays";
                    app.store.addExerciseDay(obj, function() {
                        CloudAll.updateIndex(obj.sqlDate, cloudType);
                        progress();
                    });
                    break;
                    //case "Awards":
                    //	obj = new Award();
                    //	break;
                case "AwardEarned":
                	cloudType = "AwardsEarned";
                    app.store.addAwardEarned(obj, function() {
                        CloudAll.updateIndex(obj.id, cloudType);
                        progress();
                    });
                    break;
                case "StatsPersonal":
                	cloudType = "StatsPersonal";
                    app.store.addStatsPersonal(obj, function() {
                        CloudAll.updateIndex(obj.sqlDate, cloudType);
                        progress();
                    });
                    break;
                case "Setting":
                	cloudType = "Settings";
                    app.store.addSetting(obj, function() {
                        CloudAll.updateIndex(obj.settingName, cloudType);
                        progress();
                    });
                    break;
                default:
                    doError(objType, "Unknown object type: " + objType, function() {
                        progress();
                    });

                    break;
            }
        };


        for (var i = 0; i < l; i++) {
            obj = items[i];
            objType = obj.objectType;
            delete obj.objectType;
            //console.log("deleted objectType:");
            //console.log(obj);
            if (obj) {
                findById(obj, objType, function(obj, existing) {
                    if (existing) {
                        //console.log("object exists");

                        if (obj.timeStamp && existing.timeStamp) {
                            //console.log("compare timestamps");
                            if (obj.timeStamp > existing.timeStamp) {
                                if (iUpdated < 10) {
                                    //console.log(obj);
                                    //console.log(existing);
                                    //console.log("object different, overwrite");
                                }

                                iUpdated++;
                                addObj(obj, objType);
                            } else if (obj.timeStamp === existing.timeStamp) {
                                iDupes++;
                                progress();
                            } else {
                                if (iOld < 10) {
                                    //console.log(obj);
                                    //console.log(existing);
                                    //console.log("object older, skipping");
                                }
                                iOld++;
                                progress();
                            }
                        } else {
                            //console.log("compare objects");
                            if (deepEqual(obj, existing)) {
                                // if (iDupes < 10) {
                                // //console.log(obj);
                                // //console.log(existing);
                                // //console.log("Duplicates");
                                // }
                                iDupes++;
                                progress();
                            } else {
                                if (iUpdated < 10) {
                                    //console.log(obj);
                                    //console.log(existing);
                                    //console.log("object different, no timestamp, overwrite");
                                }

                                iUpdated++;
                                addObj(obj, objType);
                            }
                        }

                    } else {
                        iNew++;
                        if (iNew < 10) {
                            //console.log(obj);
                            //console.log("new object");						
                        }

                        addObj(obj, objType);
                    }
                });
            } else {
                progress();
            }
        }
    },
    xmlWrap: function(s, sEncoding, bForWifi, callback) {
        //console.log("[InOut]xmlWrap");
        var sRet;
        InOut.delListGet(function(delList) {
            sRet = "<?xml ?><dataversion>1.0</dataversion><dataencoding>" + sEncoding + "</dataencoding>";
            if (bForWifi === true) {
                sRet += "<deleted>" + delList + "</deleted>";
            }
            sRet += "<data>" + s + "</data>";
            callback(sRet);
        });
    },
    xmlUnwrap: function(importText, callback) {
        var sVers;
        var sData;
        var sDeleted;
        var sRet = "";
        var sEnc = "";
        if (importText.indexOf("<?xml ?>") >= 0) {
            //console.log(importText);
            sVers = extractXMLTag(importText, "dataversion");
            sEnc = extractXMLTag(importText, "dataencoding");
            sData = extractXMLTag(importText, "data");
            sDeleted = extractXMLTag(importText, "deleted");
            //console.log("Vers: " + sVers);
            //console.log("Enc: " + sEnc);
            //console.log("Deleted: " + sDeleted);
            if (sVers == "1.0") {

                if (sEnc == "Base64") {
                    //console.log("before decode");
                    sRet = MyBase64.decode(sData);
                    //console.log("after decode");
                } else {
                    //console.log("no decode");
                    sRet = sData;
                }
            }
        } else {
            //console.log("no xml");
            sRet = importText;
        }
        //console.log("deleted: " + deleted);
        if (sDeleted) {


            if ((sDeleted.length > 0) && (sVers == "1.0")) {
                //console.log("comparing del list");
                InOut.delListComp(sDeleted, function(success) {
                    //console.log("unwrapped1");
                    callback(sRet);
                });
            } else {
                //console.log("unwrapped2");
                callback(sRet);
            }
        } else {
            callback(sRet);
        }
    },
    escape: function(exportItems, callback) {
        //console.log("[InOut]escape");
        var l = 0;
        var escapedItems = [];
        var p;
        var i;
        var esc = ["@", "=", ";"];

        var doEsc = function(text) {
            //console.log("doEsc:");
            //console.log(text);
            if (typeof(text) === "string") {
                var i;
                var l = esc.length;
                var re;
                for (i = 0; i < l; i++) {
                    re = new RegExp(esc[i], 'g');
                    text = text.replace(re, '###' + esc[i].charCodeAt(0) + "###");
                }
            }
            return text;
        };

        l = exportItems.length;
        for (i = 0; i < l; i++) {
            p = exportItems[i];

            for (var property in p) {
                if (p.hasOwnProperty(property)) {
                    // do stuff
                    p[property] = doEsc(p[property]);
                }
            }

            escapedItems.push(p);
            if (i === (l - 1)) {
                callback(escapedItems);
            }
        }
        if (l === 0) {
            callback([]);
        }
    },
    unescape: function(text) {
        var esc = [];
        esc.push("@");
        esc.push("=");
        esc.push(";");
        var l = esc.length;
        var re;
        var i;
        if (text) {
            for (i = 0; i < l; i++) {
                re = new RegExp("###" + esc[i].charCodeAt(0) + "###", 'g');
                text = text.replace(re, esc[i]);
            }
        }

        return text;
    },
    delListAdd: function(objType, id, callback) {
        //console.log("DelListAdd");
        var a = [];
        var c = [];
        var i;
        var l;
        var b;
        var ts;
        id = objType + "^" + id;
        InOut.delListGet(function(delList) {
            if (delList.indexOf("|") >= 0) {
                a = delList.split("|");
            }
            l = a.length;
            b = true;
            for (i = 0; i < l; i++) {
                c = [];
                if (a[i].indexOf(',') >= 0) {
                    c = a[i].split(",");
                } else {
                    c.push(a[i]);
                    c.push("0");
                }

                if (c[0] == id) {
                    //console.log("Already have id: " + c[0]);
                    b = false;
                    break;
                }
            }
            if (b === true) {
                ts = getTimeStamp();
                //console.log("Adding new ID: " + id);
                delList = delList + id + "," + ts + "|";
                Shell.saveSetting("delList", delList);
            }

            if (callback !== undefined) {
                callback(true);
            }
        });
    },

    delListCheck: function(objType, id, callback) {
        //console.log("DelListCheck");
        var a = [];
        var c = [];
        var i;
        var l;
        var b;
        id = objType + "^" + id;
        b = false;
        InOut.delListGet(function(delList) {
            if (delList.indexOf("|") >= 0) {
                a = delList.split("|");
            }
            l = a.length;
            for (i = 0; i < l; i++) {
                c = [];
                if (a[i].indexOf(",") >= 0) {
                    c = a[i].split(",");
                } else {
                    c.push(a[i]);
                    c.pugh("0");
                }
                if (c[0] == id) {
                    b = true;
                    break;
                }
            }

            callback(b);
        });
    },

    delListRemove: function(objType, id, callback) {
        //console.log("delListRemove: " + remove);
        InOut.delListGet(function(delList) {
            var a = delList.split("|");
            var c = [];
            var l = a.length;
            var aRet = [];
            var delListNew = "";
            id = objType + "^" + id;
            for (var i = 0; i < l; i++) {
                c = [];
                if (a[i].indexOf(",") >= 0) {
                    c = a[i].split(",");
                } else {
                    c.push(a[i]);
                    c.push("0");
                }
                if (c[0] != id) {
                    //console.log("Keep: " + a[i]);
                    aRet.push(a[i]);
                } else {
                    //console.log("drop: " + a[i]);
                }
            }
            l = aRet.length;
            for (var j = 0; j < l; j++) {
                delListNew = aRet[j] + "|";
            }
            InOut.delListSave(delListNew, function(success) {
                callback(true);
            });
        });
    },
    delListGet: function(callback) {
        //console.log("delListGet");
        Shell.getSetting("delList", "", function(setting) {
            //console.log("Found Del List: " + setting);
            callback(setting);
        });
    },

    delListSave: function(delList, callback) {
        //console.log("delListSave");
        Shell.saveSetting("delList", delList);
        callback(true);
    },

    delListComp: function(sDeleted, callback) {
        //console.log("delListComp");
        //console.log(sDeleted);
        var older;
        var newer;
        var a = [];
        var c = [];
        var idsToDelete = [];
        var b;
        var i;
        var j;
        var l1;
        var l2;
        if (sDeleted !== "") {
            InOut.delListGet(function(delList) {
                older = delList.split("|");
                newer = sDeleted.split("|");
                //console.log("older");
                //console.log(older);
                //console.log("newer");
                //console.log(newer);
                if (newer) {
                    l1 = newer.length - 1;
                } else {
                    l1 = 0;
                }
                if (older) {
                    l2 = older.length - 1;
                } else {
                    l2 = 0;
                }
                //console.log("l1: "+ l1);
                //console.log("l2: "+ l2);
                for (i = 0; i < l1; i++) {
                    //console.log(i);
                    a = [];
                    if (newer[i].indexOf(",") >= 0) {
                        a = newer[i].split(",");
                    } else {
                        a.push(newer[i]);
                        a.push("0");
                    }
                    b = true;
                    for (j = 0; j < l2; j++) {
                        c = [];
                        if (older[j].indexOf(",") >= 0) {
                            c = older[j].split(",");
                        } else {
                            c.push(newer[i]);
                            c.push("0");
                        }
                        //console.log("a");
                        //console.log(a);
                        //console.log("c");
                        //console.log(c);
                        if ((a[0] !== "") && (a[0] !== undefined)) {
                            if (a[0] == c[0]) {
                                //console.log("found existing: " + newer[i]);
                                b = false;
                                break;
                            }
                        }
                    }

                    if (b === true) {
                        //console.log("Found new: " + newer[i]);
                        a = newer[i].split(",");
                        //console.log("Delete: " + a[0]);
                        if (a[0].indexOf("^") > -1) {
                            //console.log("delete push");
                            idsToDelete.push(a[0]);
                        }
                    }
                }
                l1 = idsToDelete.length;

                //console.log("idsToDelete");
                //console.log(idsToDelete);
                var idType = "";
                var idNum = 0;
                var a;
                var ts = getTimestamp();
                for (i = 0; i < l1; i++) {
                    //console.log("deleting " + idsToDelete[i]);
                    a = idsToDelete[i].split("^");
                    idType = a[0];


                    switch (idType) {
                        case "Food":
                            idNum = parseInt(a[1], 10);
                            app.store.deleteFoodById(idNum, function() {

                            });
                            break;
                        case "FoodEaten":
                            idNum = parseInt(a[1], 10);
                            app.store.deleteFoodEatenByIdForever(idNum, function() {
                                app.lastFoodEatenAdded = ts;
                            });
                            break;
                        case "Portion":
                            idNum = parseInt(a[1], 10);
                            app.store.deletePortionById(idNum, function() {

                            });
                            break;
                        case "Stats":
                            idNum = a[1];
                            app.store.deleteStatsBySQLDateForever(idNum, function() {

                            });
                            break;
                        case "Setting":
                            idNum = a[1];
                            app.store.deleteSettingByNameForever(idNum, function() {

                            });
                            break;
                        case "ExerciseDone":
                            idNum = parseInt(a[1], 10);
                            app.store.deleteExerciseDoneByIdForever(idNum, function() {

                            });
                            break;
                    }


                    if (i == l1 - 1) {
                        //console.log("deleted " + idsToDelete[i]);
                        callback();
                    }

                }

                if (l1 === 0) {
                    //console.log("nothing to delete");
                    callback();
                }

            });
        }
    },
    initialize: function() {
        this.allExercises = [];
        this.allExercisesDone = [];
        this.allGroups = [];
        this.allRecipes = [];
        this.allStats = [];
        this.allFoods = [];
        this.allPortions = [];
        this.allFoodEaten = [];
        this.allCalorieDays = [];
        this.allExerciseDays = [];
        this.allAwards = [];
        this.allAwardsEarned = [];
        this.allSettings = [];
        this.statsPersonal = null;
        this.allGoals=[];
    }
};

InOut.initialize();