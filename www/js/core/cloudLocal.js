var CloudLocal = {
    createQueueMessage: function(indexItem, callback) {
    	//console.log("[CloudAll]createQueueMessage");
    	//console.log(indexItem);
        var delIndex = function(itemId, itemType) {
            CloudAll.deleteIndex(itemId, itemType, function() {});
        };
        var getMembers = function(members) {
            var l = members.length;
            var s = "";
            for (var i = 0; i < l; i++) {
                s += members[i].foodId + ";" + members[i].portionId + ";" + members[i].amount + ";" + members[i].calories;
                if (i < l - 1) {
                    s += "^";
                }
            }
            return s;
        };

        var nnull = function(s) {
            if (s) {
                return s;
            } else {
                return "";
            }
        };

        if (indexItem) {
            if (indexItem.id) {
                var a = indexItem.id.split("|");
                var itemType = a[0];
                var itemId = a[1];
                var dataId;
                var msg;
                var memberstring = "";
                //console.log("itemType: " + itemType);
                //console.log("itemId: " + itemId);

                switch (itemType) {
                    case "Exercise":
                        app.store.findExerciseById(itemId, function(ret) {
                            if (ret) {
                                //console.log(ret);
                                if (ret.source === "Online") {
                                    //(id, onlineId, name, desc, mets, source, hidden)
                                    var newName = "";
                                	if (ret.renamed === true) {
                                		newName = CloudAll.encode(ret.name);
                                	}
                                    msg = "AddExerciseOnline" + "|" + ret.onlineId + "|" + ret.hidden + "|" + newName;

                                } else {
                                    //(id, onlineId, name, desc, mets, source, hidden)
                                    msg = "AddExercise" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + CloudAll.encode(ret.desc) + "|" + ret.mets + "|" + ret.source + "|" + ret.hidden;

                                }
                                dataId = "ex" + ret.id;
                            } else {
                                msg = "DelExercise" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "ExerciseDone":
                        app.store.findExerciseDoneById(itemId, function(ret) {
                            if (ret) {
                                //(id, exerciseId, durationMinutes, caloriesBurned, date, sqlDate, timeStamp)
                                msg = "AddExerciseDone" + "|" + ret.id + "|" + ret.exerciseId + "|" + ret.durationMinutes + "|" + ret.caloriesBurned + "|" + CloudAll.encode(ret.date) + "|" + ret.sqlDate;
                                dataId = "exdn" + ret.id;
                            } else {
                                msg = "DelExerciseDone" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Food":
                        app.store.findFoodById(itemId, function(ret) {
                            if (ret) {
                                //console.log(ret);
                                //(id, usdaId, name, group, portions, kCal, source, hidden, timeStamp, itemType)
                                if (ret.source === "USDA") {
                                	var newName = "";
                                	if (ret.renamed === true) {
                                		newName = CloudAll.encode(ret.name);
                                	}
                                    msg = "AddFoodUSDA" + "|" + ret.usdaId + "|" + ret.hidden + "|" + newName;
                                    dataId = "fd" + ret.id;
                                } else {
                                    msg = "AddFood" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + ret.group + "|" + ret.kCal + "|" + ret.itemType + "|" + ret.hidden;
                                    dataId = "fd" + ret.id;
                                }
                            } else {
                                msg = "DelFood" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "FoodEaten":
                        app.store.findFoodEatenById(itemId, function(ret) {
                            if (ret) {
                                //(id, foodId, date, sqlDate, portionId, amount, calories, timeStamp, itemType)
                                msg = "AddFoodEaten" + "|" + ret.id + "|" + ret.foodId + "|" + CloudAll.encode(ret.date) + "|" + ret.sqlDate + "|" + ret.portionId + "|" + ret.amount + "|" + ret.calories + "|" + ret.itemType;
                                dataId = "fde" + ret.id;
                            } else {
                                msg = "DelFoodEaten" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Goal":
                        app.store.findGoalById(itemId, function(ret) {
                            if (ret) {
                                //Goal(id, desc, goalId, goalValue, goalMax, goalProgress, dateCreated, timeStamp) {
                                msg = "AddGoal" + "|" + ret.id + "|" + CloudAll.encode(ret.desc) + "|" + ret.goalId + "|" + ret.goalValue + "|" + ret.goalMax + "|" + ret.goalProgress + "|" + CloudAll.encode(ret.dateCreated);
                                dataId = "go" + ret.id;
                            } else {
                                msg = "DelGoal" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Group":
                        app.store.findGroupById(itemId, function(ret) {
                        	//console.log("findGroupById Results: ");
                        	//console.log(ret);
                            if (ret) {
                                //(id, name, timeStamp, members, hidden)
                                memberstring = getMembers(ret.members);
                                msg = "AddGroup" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + CloudAll.encode(memberstring) + "|" + ret.hidden;
                                //console.log(msg);
                                dataId = "gr" + ret.id;
                            } else {
                                msg = "DelGroup" + "|" + itemId;
                                //console.log(msg);
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Portion":
                        app.store.findPortionById(itemId, function(ret) {
                            if (ret) {
                                //(id, foodId, amount, measure, weight, absCalories, hidden, timeStamp)
                                //console.log("CHECK THIS FOR RET.AMOUNT");
                                //console.log(ret);
                                msg = "AddPortion" + "|" + ret.id + "|" + ret.foodId + "|" + ret.amount + "|" + CloudAll.encode(ret.measure) + "|" + ret.weight + "|" + ret.absCalories + "|" + ret.hidden;
                                dataId = "pr" + ret.id;
                            } else {
                                msg = "DelPortion" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "PortionUpdate":
                        app.store.findPortionUpdateById(itemId, function(ret) {
                        	//console.log(ret);
                            if (ret) {
                                //(id, foodId, amount, measure, weight, absCalories, hidden, timeStamp)
                                //console.log("CHECK THIS FOR RET.AMOUNT");
                                //console.log(ret);
                                msg = "AddPortionUpdate" + "|" + ret.foodId + "|" + ret.portionId;
                                dataId = "pu" + ret.foodId;
                            } else {
                                msg = "DelPortionUpdate" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Recipe":
                        app.store.findRecipeById(itemId, function(ret) {
                            if (ret) {
                                //(id, name, servings, servingSize, timeStamp, members, hidden)
                                memberstring = getMembers(ret.members);
                                msg = "AddRecipe" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + ret.servings + "|" + CloudAll.encode(ret.servingSize) + "|" + CloudAll.encode(memberstring) + "|" + ret.hidden;
                                dataId = "re" + ret.id;
                            } else {
                                msg = "DelRecipe" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Stats":
                        app.store.findStatsById(itemId, function(ret) {
                            if (ret) {
                                //(sqlDate,	 weight, arm, chest, hips, neck, thigh, waist, bmi, bodyFat, bodyFatSource, sustainCals, fatLossCals, bmr, measure, timeStamp, pctGoal)
                                msg = "AddStats" + "|" + ret.sqlDate + "|" + nnull(ret.bodyWeight) + "|" + nnull(ret.arm) + "|" + nnull(ret.chest) + "|" + nnull(ret.hips) + "|" + nnull(ret.neck) + "|" + nnull(ret.thigh) + "|" + nnull(ret.waist) + "|" + nnull(ret.bmi) + "|" + nnull(ret.bodyFat) + "|" + nnull(ret.bodyFatSource) + "|" + nnull(ret.sustainCals) + "|" + nnull(ret.fatLossCals) + "|" + nnull(ret.bmr) + "|" + ret.measure + "|" + ret.pctGoal;
                                dataId = "st" + ret.sqlDate;
                            } else {
                                msg = "DelStats" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Setting":
                        app.store.findSettingByName(itemId, function(ret) {
                            if (ret) {
                                //(sqlDate,	 weight, arm, chest, hips, neck, thigh, waist, bmi, bodyFat, bodyFatSource, sustainCals, fatLossCals, bmr, measure, timeStamp)
                                msg = "AddSetting" + "|" + ret.settingName + "|" + nnull(ret.settingValue);
                                dataId = "se" + ret.settingName;
                            } else {
                                msg = "DelSetting" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "AwardEarned":
                    	//console.log("AwardEarned");
                    	//console.log(itemId);
                        app.store.findAwardEarnedById(itemId, function(ret) {
                            if (ret) {
                                //(earnedId, awardId, awardValue, dateEarned)
                                msg = "AddAwardEarned" + "|" + ret.earnedId + "|" + ret.awardId + "|" + ret.awardValue + "|" + CloudAll.encode(ret.dateEarned);
                                dataId = "ae" + ret.earnedId;
                            } else {
                                msg = "DelAwardEarned" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "Goal":
                        app.store.findGoalById(itemId, function(ret) {
                            if (ret) {
                                //(id, desc, goalId, goalValue, goalMax, goalProgress, dateCreated, timeStamp)
                                msg = "AddGoal" + "|" + ret.id + "|" + CloudAll.encode(ret.desc) + "|" + ret.goalId + "|" + ret.goalValue + "|" + ret.goalMax + "|" + ret.goalProgress + "|" + CloudAll.encode(ret.dateCreated) + "|" + ret.timestamp;
                                dataId = "go" + ret.itemId;
                            } else {
                                msg = "DelGoal" + "|" + itemId;
                                delIndex(itemId, itemType);
                            }
                        });
                        break;
                    case "StatsPersonal":
                        //(age, sex, active, cm, ft, inches, measure, timeStamp)
                        app.findStatsPersonal(function(ret) {
                            //console.log(ret);
                            msg = "AddStatsPersonal" + "|" + nnull(ret.age) + "|" + nnull(ret.sex) + "|" + nnull(ret.active) + "|" + nnull(ret.cm) + "|" + nnull(ret.ft) + "|" + nnull(ret.inches) + "|" + ret.measure;
                            dataId = "sp";
                        });
                        break;
                    default:
                    	var sAlert = "Unidentified Cloud Item Type: " + itemType;
                    	alert(sAlert);
                    	//console.log(sAlert);
                }
                //console.log("msg: " + msg);
                //console.log("dataId: " + dataId);
                callback(msg, dataId);
            } else {
                callback("", "");
            }
        } else {
            callback("", "");
        }
    },
    createIndex: function(callback) {
        var trimBySource = function(a, sourceToTrim) {
            //console.log("[CloudLocal]createIndex.trimBySource " + sourceToTrim);
            var l = a.length;
            for (var i = 0; i < l; i++) {
                //console.log("if " + a[i].source + " === " + sourceToTrim);
                if (a[i].source === sourceToTrim) {
                    //console.log("spliced");
                    a.splice(i, 1);
                    i--;
                    l--;
                }
            }
            //console.log("return");
            //console.log(a);
            return a;
        };

        var makeIndex = function(itemType, a, objectId, callback) {
            //console.log("makeIndex " + itemType + " " + objectId);
            var l = a.length;
            var iDone = 0;

            for (var i = 0; i < l; i++) {
                switch (objectId) {
                    case "statsPersonal":
                        //console.log("found");
                        CloudAll.updateIndex("statsPersonal", itemType, function() {
                            //console.log("updated index");
                            iDone++;
                            if (iDone === l) {
                                callback();
                            }
                        });
                        break;
                    case "id":
                        CloudAll.updateIndex(a[i].id, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                    case "earnedId":
                        CloudAll.updateIndex(a[i].earnedId, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                    case "foodId":
                        CloudAll.updateIndex(a[i].foodId, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                    case "sqlDate":
                        CloudAll.updateIndex(a[i].sqlDate, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                    case "name":
                        CloudAll.updateIndex(a[i].name, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                    case "settingName":
                        CloudAll.updateIndex(a[i].settingName, itemType, function() {
                            iDone++;
                            if (iDone === l) {
                                //console.log("callback from makeIndex");
                                callback();
                            }
                        }, true);
                        break;
                }
            }

            if (l === 0) {
                callback();
            }
        };
        //exercise, exerciseDone, statItem, statsPersonal, group, groupMemeber, recipe, stats, food, portion, foodEaten, calorieDay, exerciseDay
        //app.store.findAllCalorieDays(function(calorieDays) {
        //makeIndex("CalorieDays", calorieDays, "sqlDate", function() {
        app.store.findAllExercises(function(exercises) {
            //exercises = trimBySource(exercises, "Online");
            makeIndex("Exercise", exercises, "id", function() {
                //app.store.findAllExerciseDays(function(exerciseDays) {
                //makeIndex("ExerciseDays", exerciseDays, "sqlDate", function() {
                app.store.findAllExercisesDone(function(exercisesDone) {
                    makeIndex("ExerciseDone", exercisesDone, "id", function() {
                        app.store.findAllFoods(function(foods) {
                            makeIndex("Food", foods, "id", function() {
                                app.store.findAllFoodsEaten(function(foodsEaten) {
                                    makeIndex("FoodEaten", foodsEaten, "id", function() {
                                        app.store.findAllGoals(function(goals) {
                                            makeIndex("Goal", goals, "id", function() {
	                                        app.store.findAllGroups(function(groups) {
	                                            makeIndex("Group", groups, "id", function() {
	                                                app.store.findAllPortions(function(portions) {
	                                                    portions = trimBySource(portions, "USDA");
	                                                    makeIndex("Portion", portions, "id", function() {
	                                                        app.store.findAllRecipes(function(recipes) {
	                                                            makeIndex("Recipe", recipes, "id", function() {
	                                                                //app.store.findAllAwardsEarned(function(awardsEarned) {
	                                                                	//makeIndex("AwardEarned", awardsEarned, "earnedId", function() {
			                                                                app.store.findAllStats(function(stats) {
			                                                                    makeIndex("Stats", stats, "sqlDate", function() {
	
																					app.store.findAllPortionUpdates(function(portionUpdates) {
																						//console.log(portionUpdates);
			                                                                    	makeIndex("PortionUpdate", portionUpdates, "foodId", function() {
	
			                                                                        app.store.findAllSettings(function(settings) {
			                                                                            var keep = [];
			                                                                            var l = settings.length;
			                                                                            for (var i = 0; i < l; i++) {
			                                                                                if (CloudLocal.cloudSettings.indexOf(settings[i].settingName) > -1) {
			                                                                                    keep.push(settings[i]);
			                                                                                }
			                                                                            }
			                                                                            //console.log("keep:");
			                                                                            //console.log(keep);
			                                                                            makeIndex("Setting", keep, "settingName", function() {
			                                                                                app.store.findStatsPersonal(function(statsPersonal) {
			                                                                                    //console.log("statsPersonal");
			                                                                                    //console.log(statsPersonal);
			                                                                                    if (statsPersonal) {
			                                                                                        makeIndex("StatsPersonal", [statsPersonal], "statsPersonal", function() {
			                                                                                            //console.log("Final callback from create index");
			                                                                                            callback();
			                                                                                        });
			                                                                                    } else {
			                                                                                        callback();
			                                                                                    }
			                                                                                });
			                                                                            });
			                                                                        });
			                                                                        });
			                                                                        });
			                                                                    });
			                                                                });
			                                                            //});
			                                                    	//});
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
       	});
        //});
        //});
        //});
    },
    parseGet: function(myCloud, callback) {
        //console.log("Parsing Cloud Get");
        //console.log(myCloud);
        //console.log("Cloud ID Remote: " + myCloud.cloudIdRemote);
        //Shell.saveSetting("debugLastCloud", myCloud, function() {

        //console.log("Cloud Data: " + myCloud.cloudData);
        var dNow = getTimestamp();
        var id;
        var food;
        var portions;
        var i;
        var l;
        var iDone;
        var parseComplete = function() {
            //console.log("parseComplete");
            Globals.lastImport = dNow;
            //app.resetHistoryDelay();
            var activePage = $.mobile.activePage.attr("id");
            
            if (activePage === "food") {
            	//console.log("Active page = food");
            	//console.log("if " + app.lastFoodEatenAdded + " > " + app.lastFoodEatenLoaded);
            	if (app.lastFoodEatenAdded > app.lastFoodEatenLoaded) {
            		//console.log("needs loading");
            		app.writeFoodEatenToPage("Food", app.currDate, function() {
            			
            		});
            	}
            }
            
            if (activePage === "exercise") {
            	if (app.lastExerciseDoneAdded > app.lastExerciseDoneLoaded) {
            		app.writeExercisesDoneToPage(app.currDate, function() {
            			
            		});
            	}
            }
            
            if (activePage === "measurements") {
            	if (app.statsChanged >= app.statsLoaded) {
            		app.writeStatsToPage(app.currDateMeasure, function() {

                    });
            	}
            }
            
            callback();
        };

        var nnull = function(s) {
            if (s === null) {
                return "";
            } else {
                return s;
            }
        };

        //console.log(myCloud);
        if (myCloud.pushClient == CloudAll.pushClient) {
            //console.log("SKIP: Same client");
            callback(false, myCloud);
        } else {

            //console.log(myCloud.cloudData);
            if (myCloud.cloudData !== undefined) {

                if (dNow - CloudAll.lastMini > 1500) {
                    CloudAll.lastMini = dNow;
                    Shell.getSetting("chkCloudActivity", "true", function(setting) {
                        if (setting === "true") {
                            if (CloudAll.cloudsDownloaded > 0) {
                                Toast.toastMini("Downloading cloud data (" + CloudAll.cloudsDownloaded + " pieces)");
                            } else {
                                Toast.toastMini("Downloading cloud data");
                            }

                        }
                    });

                }
                //console.log("PROCESS: " + myCloud.cloudData);
                var a = myCloud.cloudData.split("|");
                //console.log("CloudType: " + a[0]);

				var getPortionUpdate = function(a, callback) {
					var foodId = parseInt(a[1]);
					var portionId = parseInt(a[2]);
					var obj = new PortionUpdate(foodId, portionId);
					callback(obj);
				};

                var getExercise = function(a, callback) {
                    //msg = "AddExercise" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + CloudAll.encode(ret.desc) + "|" + ret.mets;
                    //Exercise (id, onlineId, name, desc, mets, source, hidden)
                    var bHidden = false;
                    var id = parseInt(a[1], 10);
                    var onlineId = "";
                    var name = CloudAll.decode(a[2]);
                    var desc = CloudAll.decode(a[3]);
                    var mets = parseInt(a[4], 10);
                    var source = "User";
                    if (a.length > 5) {
                    	if (a[5] === "true") {
                    		//console.log("hidden exercise");
                    		bHidden = true;
                    	}
                    }
                    var hidden = bHidden;
                    var obj = new Exercise(id, onlineId, name, desc, mets, source, hidden);
                    callback(obj);
                };

                var getExerciseOnline = function(a, callback) {
                    //msg = "AddExerciseOnline" + "|" + ret.onlineId;
                    app.findExerciseOnlineById(a[1], function(obj) {
						if (a.length > 2) {
							if (a[2] === "true") {
								//console.log("hiding online exercise");
								obj.hidden = true;
							}
						}
						
						if (a.length > 3) {
							if (a[3] !== "") {
								var newName = CloudAll.decode(a[3]);
								//console.log("renaming online exercise  to " + newName);
								obj.name = newName;
							}
						}
						
                        callback(obj);
                    });
                };

                var getExerciseDone = function(a, callback) {
                    //msg = "AddExerciseDone" + "|" + ret.id + "|" + ret.exerciseId + "|" + ret.durationMinutes + "|" + ret.caloriesBurned + "|" + ret.date + "|" + ret.sqlDate;
                    //ExerciseDone (id, exerciseId, durationMinutes, caloriesBurned, date, sqlDate, timeStamp)
                    var id = parseInt(a[1]);
                    var exerciseId = parseInt(a[2]);
                    var durationMinutes = parseInt(a[3]);
                    var caloriesBurned = parseInt(a[4]);
                    var d = new Date(CloudAll.decode(a[5]));
                    var sqlDate = a[6];
                    var timeStamp = getTimestamp(d);
                    var obj = new ExerciseDone(id, exerciseId, durationMinutes, caloriesBurned, d, sqlDate, timeStamp);
                    callback(obj);
                };

                var getFoodUSDA = function(a, callback) {
                    //msg = "AddFoodUSDA" + "|" + ret.usdaId;
                    //console.log("getFoodUSDA");
                    //console.log(a);
                    app.findFoodOnlineById(a[1], function(obj) {
                    	if (a.length > 2) {
                    		if (a[2] === "true") {
                    			//console.log("hidding USDA food");
                    			obj.hidden = true;
                    		}
                    	}
                    	if (a.length > 3) {
                    		if (a[3] !== "") {
                    			var newName = CloudAll.decode(a[3]);
                    			//console.log("renaming usda food to " + newName);
                    			obj.name = newName;
                    		}
                    	}
                        callback(obj);
                    });
                };

                var getFood = function(a, callback) {
                    //msg = "AddFood" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + ret.group + "|" + ret.kCal + "|" + ret.itemType;	
                    //Food(id, usdaId, name, group, portions, kCal, source, hidden, timeStamp, itemType)
                    var bHidden=false;
                    
                    var id = parseInt(a[1], 10);
                    var usdaId = "";
                    var name = CloudAll.decode(a[2]);
                    var group = a[3];
                    var portions = [];
                    var kCal = parseInt(a[4], 10);
                    var source = "User";
                    var timeStamp = getTimestamp();
                    var itemType = a[5];
                    if (a.length > 6) {
                    	if (a[6] === "true") {
                    		bHidden = true;
                    		//console.log("hidden food");
                    	}
                    }
                    var hidden = bHidden;
                    var obj = new Food(id, usdaId, name, group, portions, kCal, source, hidden, timeStamp, itemType);
                    callback(obj);
                };

                var getFoodEaten = function(a, callback) {
                    //msg = "AddFoodEaten" + "|" + ret.id + "|" + ret.foodId + "|" + ret.date + "|" + ret.sqlDate + "|" + ret.portionId + "|" + ret.amount + "|" + ret.calories + "|" + ret.itemType;
                    //FoodEaten(id, foodId, date, sqlDate, portionId, amount, calories, timeStamp, itemType)
                    var id = parseInt(a[1], 10);
                    var foodId = parseInt(a[2], 10);
                    var d = new Date(CloudAll.decode(a[3]));
                    var sqlDate = a[4];
                    var portionId = parseInt(a[5], 10);
                    var amount = parseInt(a[6], 10);
                    var calories = parseInt(a[7], 10);
                    var timeStamp = getTimestamp(d);
                    var itemType = a[8];
                    var obj = new FoodEaten(id, foodId, d, sqlDate, portionId, amount, calories, timeStamp, itemType);
                    callback(obj);
                };

                var getGroupMembers = function(a) {
                    var members = [];
                    var ar1 = a.split("^");
                    //console.log("memberarray:");
                    //console.log(ar1);
                    var ar2;
                    var foodId;
                    var portionId;
                    var amount;
                    var calories;
                    var member;
                    var l = ar1.length;
                    for (var i = 0; i < l; i++) {
                        ar2 = ar1[i].split(";");
                        foodId = parseInt(ar2[0], 10);
                        portionId = parseInt(ar2[1], 10);
                        amount = parseFloat(ar2[2], 10).toFixed(2);
                        calories = parseInt(ar2[3], 10);
                        member = new GroupMember(foodId, portionId, amount, calories);
                        members.push(member);
                    }
                    //console.log("members:");
                    //console.log(members);
                    return members;
                };

                var getGoal = function(a, callback) {
                	//(id, desc, goalId, goalValue, goalMax, goalProgress, dateCreated, timeStamp)
                    //msg = "AddGoal" + "|" + ret.id + "|" + CloudAll.encode(ret.desc) + "|" + ret.goalId + "|" + ret.goalValue + "|" + ret.goalMax + "|" + ret.goalProgress  + "|" + CloudAll.encode(ret.dateCreated) + "|" + ret.timestamp;
                    var id = parseInt(a[1], 10);
                    var desc = CloudAll.decode(a[2]);
                    var goalId = parseInt(a[3], 10);
                    var goalValue = parseInt(a[4], 10);
                    var goalMax = parseInt(a[5], 10);
                    var goalProgress = parseInt(a[6], 10);
                    var dateCreated = new Date(CloudAll.decode(a[7]));
                    var timeStamp = getTimestamp(dateCreated);
                    var obj = new Goal(id, desc, goalId, goalValue, goalMax, goalProgress, dateCreated, timeStamp);
                    callback(obj);
                };

                var getAwardEarned = function(a, callback) {
                    //(earnedId, awardId, awardValue, dateEarned)
                    //msg = "AddAwardEarned" + "|" + ret.earnedId + "|" + ret.awardId + "|" + ret.awardValue + "|" + CloudAll.encode(ret.dateEarned);
                    var earnedId = parseInt(a[1], 10);
                    var awardId = parseInt(a[2], 10);
                    var awardValue = parseInt(a[3], 10);
                    var dateEarned = new Date(CloudAll.decode(a[4]));
                    var obj = new AwardEarned(earnedId, awardId, awardValue, dateEarned);
                    callback(obj);
                };

                var getGroup = function(a, callback) {
                    //msg = "AddGroup" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + CloudAll.encode(memberstring);
                    //Group (id, name, timeStamp, hidden)
                    var id = parseInt(a[1], 10);
                    var name = CloudAll.decode(a[2]);
                    var timeStamp = getTimestamp();
                    var bHidden = false;
                    if (a.length > 4) {
                    	if (a[4] === "true") {
                    		//console.log("hidden group");
                    		bHidden = true;
                    	}
                    }
                    var hidden = bHidden;
                    var obj = new Group(id, name, timeStamp, hidden);
                    obj.members = getGroupMembers(CloudAll.decode(a[3]));
                    callback(obj);
                };

                var getPortion = function(a, callback) {
                    //msg = "AddPortion" + "|" + ret.id + "|" + ret.foodId + "|" + ret.amount + "|" + ret.measure + "|" + ret.weight + "|" + ret.absCalories;
                    //Portion(id, foodId, amount, measure, weight, absCalories, source, hidden, timeStamp)
                    var id = parseInt(a[1], 10);
                    var foodId = parseInt(a[2], 10);
                    var amount = a[3];
                    if (isNumber(amount)) {
                        amount = parseInt(amount, 10);
                    }
                    var measure = CloudAll.decode(a[4]);
                    var weight = parseInt(a[5], 10);
                    var absCalories = parseInt(a[6], 10);
                    var bHidden = false;
                    if (a.length > 7) {
                    	if (a[7] === "true") {
                    		//console.log("hidden portion");
                    		bHidden = true;
                    	}
                    }
                    var source = "User";
                    var hidden = bHidden;
                    var timeStamp = getTimestamp();
                    
                    if (hidden === true) {
                    	CloudLocal.delPortions.push(id);
                    }
                    
                    var obj = new Portion(id, foodId, amount, measure, weight, absCalories, source, hidden, timeStamp);
                    callback(obj);
                };

                var getRecipe = function(a, callback) {
                    //msg = "AddRecipe" + "|" + ret.id + "|" + CloudAll.encode(ret.name) + "|" + ret.servings + "|" + CloudAll.encode(ret.servingSize) + "|" + CloudAll.encode(memberString);
                    //Recipe (id, name, servings, servingSize, timeStamp, hidden)
                    var id = parseInt(a[1], 10);
                    var name = CloudAll.decode(a[2]);
                    var servings = parseInt(a[3], 10);
                    var servingSize = CloudAll.decode(a[4]);
                    var timeStamp = getTimestamp();
                    var bHidden = false;
                    if (a.length > 6) {
                    	if (a[6] === "true") {
                    		bHidden = true;
                    		//console.log("hidden recipe");
                    	}
                    }
                    var hidden = bHidden;
                    var obj = new Recipe(id, name, servings, servingSize, timeStamp, hidden);
                    obj.members = getGroupMembers(CloudAll.decode(a[5]));
                    callback(obj);
                };

                var getSetting = function(a, callback) {
                    //console.log("getSetting");
                    //console.log(a);
                    var settingName = CloudAll.decode(a[1]);
                    var settingValue = CloudAll.decode(a[2]);
                    var user = Globals.mUsername;
                    var obj = new Setting(settingName, settingValue, user);
                    callback(obj);
                };

                var getStats = function(a, callback) {
                    //console.log("getStats");
                    //console.log(a);
                    //msg = "AddStats" + "|" + ret.sqlDate + "|" + ret.weight + "|" + ret.arm + "|" + ret.chest + "|" + ret.hips + "|" + ret.neck + "|" + ret.thigh + "|" + ret.waist + "|" + ret.bmi + "|" + ret.bodyFat + "|" + ret.bodyFatSource + "|" + ret.sustainCals + "|" + ret.fatLossCals + "|" + ret.bmr + "|" + ret.measure;
                    //Stats(sqlDate, date, weight, arm, chest, hips, neck, thigh, waist, bmi, 
                    //bodyFat, bodyFatSource, sustainCals, fatLossCals, bmr, measure, timeStamp)
                    var sqlDate = a[1];
                    var bodyWeight = parseFloat(a[2]);
                    var arm = parseInt(a[3]);
                    var chest = parseInt(a[4]);
                    var hips = parseInt(a[5]);
                    var neck = parseInt(a[6]);
                    var thigh = parseInt(a[7]);
                    var waist = parseInt(a[8]);
                    var bmi = parseInt(a[9]);
                    var bodyFat = parseInt(a[10]);
                    var bodyFatSource = parseInt(a[11]);
                    var sustainCals = parseInt(a[12]);
                    var fatLossCals = parseInt(a[13]);
                    var bmr = parseInt(a[14]);
                    var measure = a[15];
                    var timeStamp = parseInt(a[16]);
                    var date = new Date(sqlDate);
                    var iPct;
                    if (a.length > 16) {
                        iPct = parseInt(a[17]);
                    } else {
                        iPct = 0;
                    }
                    var obj = new Stats(sqlDate, date, bodyWeight, arm, chest, hips, neck, thigh, waist, bmi, bodyFat, bodyFatSource, sustainCals, fatLossCals, bmr, measure, timeStamp, iPct);
                    callback(obj);
                };

                var getStatsPersonal = function(a, callback) {
                    //msg = "AddStatsPersonal" + "|" + ret.age + "|" + ret.sex + "|" + ret.active + "|" + ret.cm + "|" + ret.ft + "|" + ret.inches + "|" + ret.measure;
                    //StatsPersonal (age, sex, active, cm, ft, inches, measure, timeStamp)
                    var age = parseInt(a[1], 10);
                    var sex = a[2];
                    var active = a[3];
                    var cm = parseInt(a[4], 10);
                    var ft = parseInt(a[5], 10);
                    var inches = parseInt(a[6], 10);
                    var measure = a[7];
                    var timeStamp = getTimestamp();
                    var obj = new StatsPersonal(age, sex, active, cm, ft, inches, measure, timeStamp);
                    callback(obj);
                };

                //console.log(a[0]);
                switch (a[0]) {
                    case "AddExercise":
                        getExercise(a, function(obj) {
                            app.store.addExercise(obj, function() {
                            	app.lastExerciseDoneAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddExerciseOnline":
                        getExerciseOnline(a, function(obj) {
                            app.store.addExercise(obj, function() {
                            	app.lastExerciseDoneAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddExerciseDone":
                        getExerciseDone(a, function(obj) {
                            app.updateExerciseDay(obj, "+", function() {
                                app.store.addExerciseDone(obj, function() {
                                	app.lastExerciseDoneAdded=getTimestamp();
                                    parseComplete();
                                });
                            }, null, true);
                        });
                        break;
                    case "AddFoodUSDA":
                        getFoodUSDA(a, function(obj) {
                            if (obj) {
                                food = obj;
                                portions = obj.portions;
                                food.portions = [];
                                app.store.addFood(food, function() {
                                    //console.log("after add food");
                                    l = portions.length;
                                    iDone = 0;
                                    for (i = 0; i < l; i++) {
                                        app.store.addPortion(portions[i], function() {
                                            //console.log("after add portion");
                                            iDone++;
                                            if (iDone >= l) {
                                            	app.lastFoodEatenAdded=getTimestamp();
                                                parseComplete();
                                            }
                                        });
                                    }
                                });
                            } else {
                                parseComplete();
                            }

                        });
                        break;
                    case "AddFood":
                        getFood(a, function(obj) {
                            app.store.addFood(obj, function() {
                            	app.lastFoodEatenAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddFoodEaten":
                        getFoodEaten(a, function(obj) {
                            app.updateCalorieDay(obj, "+", function() {
                                app.store.addFoodEaten(obj, function() {
                                	app.lastFoodEatenAdded=getTimestamp();
                                    parseComplete();
                                });
                            }, null, true);
                        });
                        break;
                    case "AddGoal":
                        getGoal(a, function(obj) {
                            app.store.addGoal(obj, function() {
                                parseComplete();
                            });
                        });
                        break;
                    case "AddGroup":
                        getGroup(a, function(obj) {
                            app.store.addGroup(obj, function() {
                            	app.lastFoodEatenAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddPortion":
                        getPortion(a, function(obj) {
                            app.store.addPortion(obj, function() {
                            	app.lastFoodEatenAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddPortionUpdate":
                        getPortionUpdate(a, function(obj) {
                            app.store.addPortionUpdate(obj, function() {
                            	app.store.findFoodById(obj.foodId, function(food) {
                            		if (food) {
                            			food.lastPortionId = obj.portionId;
                            			app.store.addFood(food, function() {
                            				app.lastFoodEatenAdded=getTimestamp();
                            				parseComplete();
                            			});
                            		} else {
                            			CloudLocal.aPortionUpdateIds.push(obj.foodId);
                            			CloudLocal.aPortionUpdates.push(obj);
                            			parseComplete();		
                            		}
                            	});
                            });
                        });
                        break;
                    case "AddRecipe":
                        getRecipe(a, function(obj) {
                            app.store.addRecipe(obj, function() {
                            	app.lastFoodEatenAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddAwardEarned":
                        getAwardEarned(a, function(obj) {
                            app.store.addAwardEarned(obj, function() {
                                parseComplete();
                            });
                        });
                        break;
                    case "AddSetting":
                        getSetting(a, function(obj) {
                        	//console.log(obj);
                        	if (CloudLocal.acceptOlderSettings.indexOf(obj.settingName) > -1) {
                        		Shell.getSetting(obj.settingName, "", function(setting) {
                        			if (setting === "") {
                        				app.store.addSetting(obj, function() {
			                                parseComplete();
			                            });	
                        			} else {
                        				var existing = new Date(setting.settingValue);
                        				var updating = new Date(obj.settingValue);
                        				//console.log("existing: ");
                        				//console.log(existing);
                        				//console.log("updating: ");
                        				//console.log(updating);
                        				if (existing > updating) {
                        					//console.log("found older, saving");
                        					app.store.addSetting(obj, function() {
				                                parseComplete();
				                            });	
                        				} else {
                        					//console.log("found newer, not saving");
                        					parseComplete();
                        				}
                        			}
                        		});
                        	} else {
                        		app.store.addSetting(obj, function() {
	                                parseComplete();
	                            });	
                        	}
                        });
                        break;
                    case "AddStats":
                        getStats(a, function(obj) {
                            app.store.addStats(obj, function() {
                            	app.lastStatAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "AddStatsPersonal":
                        getStatsPersonal(a, function(obj) {
                            app.store.addStatsPersonal(obj, function() {
                            	app.lastStatAdded=getTimestamp();
                                parseComplete();
                            });
                        });
                        break;
                    case "DelExercise":
                        id = parseInt(a[1]);
                        app.store.deleteExerciseById(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelExerciseDone":
                        id = parseInt(a[1]);
                        app.store.findExerciseDoneById(id, function(exerciseDone) {
                            app.updateExerciseDay(exerciseDone, "-", function() {
                                app.store.deleteExerciseDoneByIdForever(id, function() {
                                	app.lastExerciseDoneAdded=getTimestamp();
                                    parseComplete();
                                });
                            });
                        });
                        break;
                    case "DelFood":
                        id = parseInt(a[1]);
                        app.store.deleteFoodById(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelFoodEaten":
                        id = parseInt(a[1]);
                        app.store.findFoodEatenById(id, function(foodEaten) {
                            app.updateCalorieDay(foodEaten, "-", function() {
                                app.store.deleteFoodEatenByIdForever(id, function() {
                                	app.lastFoodEatenAdded=getTimestamp();
                                    parseComplete();
                                });
                            });
                        });
                        break;
                    case "DelGoal":
                        id = parseInt(a[1]);
                        app.store.deleteGoalByIdForever(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelGroup":
                        id = parseInt(a[1]);
                        app.store.deleteGroupById(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelPortion":
                        id = parseInt(a[1]);
                        app.store.deletePortionById(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelPortionUpdate":
                        id = parseInt(a[1]);
                        app.store.deletePortionUpdateByIdForever(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelRecipe":
                        id = parseInt(a[1]);
                        app.store.deleteRecipeById(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelStats":
                        id = parseInt(a[1]);
                        app.store.deleteStatsById(id, function() {
                        	app.lastStatAdded=getTimestamp();
                            parseComplete();
                        });
                        break;
                    case "DelSetting":
                        id = CloudAll.decode(a[1]);
                        app.store.deleteSettingByNameForever(id, function() {
                            parseComplete();
                        });
                        break;
                    case "DelStatsPersonal":
                        id = parseInt(a[1]);
                        app.store.deleteStatsPersonalById(id, function() {
                        	app.lastStatAdded=getTimestamp();
                            parseComplete();
                        });
                        break;

                    default:
                        //console.log("Could not find cloud data type " + a[0]);
                        callback(true, myCloud);
                }


            }
        }
    },

    initialize: function(callback) {
    	this.acceptOlderSettings = ["anniversaryCalories", "anniversaryExercise", "nextWeekly", "nextMonthly", "nextYearly"];
        this.cloudSettings = ["foodShare", "calorieGoalMargin", "exerciseGoalMargin", "calorieGoalType", "anniversaryCalories", "anniversaryExercise", "initAwards", "nextWeekly", "nextMonthly", "nextYearly", "calorieGoalEx", "sawTapMessageEx", "calorieGoal", "sawTapMessage", "weightGoalmetric", "weightGoalstandard", "weightCurrmetric", "weightCurrstandard", "weightStartmetric", "weightStartstandard", "sawTapMessageWeight", "measure", "lastArm", "lastChest", "lastHips", "lastMeasure", "lastNeck", "lastThigh", "lastWaist", "lastWeight"];
		this.delPortions = [];
		this.aPortionUpdateIds=[];
		this.aPortionUpdates=[];
        //console.log("[CloudLocal] Initialized");
    }
};

CloudLocal.initialize();