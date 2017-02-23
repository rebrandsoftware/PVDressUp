var InAppAll = {
	getProducts: function(callback) {
		console.log("[InAppAll]getProducts ");
		console.log(InAppLocal.productIds);
		if (Device.platform === "iOS" || Device.platform === "Android") {
			inAppPurchase
			.getProducts(InAppLocal.productIds) 
			.then(function(products) {
				console.log(JSON.stringify(products));
				console.log("found " + products.length + " products");
				InAppAll.filterProducts(products, function(products) {
					InAppAll.writeProducts(products, function() {
						callback();
					});
				});
			})
			.catch(function (err) {
			    console.log(JSON.stringify(err));
			    Toast.toast(JSON.stringify(err));
			    callback();
			  });	
		} else {
			callback();
		}
	},
	buy: function(productId) {
		console.log("[InAppAll]buy " + productId);
		inAppPurchase
		  .buy(productId)
		  .then(function (data) {
		    console.log(JSON.stringify(data));
		    
		    InAppAll.processPurchase(productId, data, function() {
		    	InAppLocal.processPurchase(productId, function() {
		    		InAppAll.getProducts(function() {
		    			
		    		});
		    	});
		    });
		  })
		  .catch(function (err) {
		    console.log(JSON.stringify(err));
		    Toast.toast(JSON.stringify(err));
		  });
	},
	processPurchase: function(productId, data, callback) {
		console.log("[InAppAll]processPurchase " + productId);
		console.log(JSON.stringify(data));
		if (data) {
			data.productId = productId;
			InAppAll.savePurchase(data, function() {
				Toast.toast("Thank you for your purchase!");
				callback(productId);
			});
		} else {
			Toast.toast('Error: No data returned from app store');
		}
	},
	savePurchase: function(purchase, callback) {
		console.log("[InAppAll]savePurchase");
		app.store.addInAppPurchase(purchase, function() {
			callback();
		});
	},
	restorePurchases: function() {
		console.log("[InAppAll]restorePurchases");
		
		inAppPurchase
		  .restorePurchases()
		  .then(function (data) {
		  	console.log(JSON.stringify(data));
		    console.log("Found " + data.length + " purchases to restore");
		    
		    
		    /*
		      [{
		        transactionId: ...
		        productId: ...
		        state: ...
		        date: ...
		      }]
		    */
		    var bCheck = false;
		   	 if (Device.platform === "Android") {
		   		 console.log("Checking android purchase status");
		   		 bCheck = true;
		   	 }
		   	
		   	var l = data.length;
		   	var bCont = true;
		   	var obj;
		   	var iDone = 0;
		   	var productId;
		   	for (var i=0; i<l; i++) {
		   		obj = data[i];
		   		console.log(JSON.stringify(obj));
		   		if (bCheck === true) {
		   			console.log("State: " + obj.state);
		   			if (obj.state) {
		   				
			   			
			   			if (obj.state === 0) {
			   				bCont = true;
			   			} else {
			   				bCont = false;
			   			}
		   			} else {
		   				bCont = true;
		   			}
		   		}
		   		
		   		console.log("bCont: " + bCont);
		   		
		   		if (bCont === true) {
		   			iDone ++;
		   			console.log("done: " + iDone);
		   			productId = obj.productId;
		   			console.log("productId: " + productId);
		   			InAppAll.processPurchase(productId, obj, function(productIdPassback) {
		   				console.log("Processed: " + productIdPassback);
				    	InAppLocal.processPurchase(productIdPassback, function() {
				    		console.log("after processPurchase");
				    	});
				    });
		   		}
		   		
		   	}
		   	
		   	if (iDone > 0) {
		   		var s = "";
		   		if (iDone > 1) {
		   			s = "s";
		   		}
		   		Toast.toast("Restored " + iDone + " purchase" + s);
		   		InAppAll.getProducts(function() {
		   			
		   		});
		   	} else {
		   		Toast.toast("No purchases to restore");
		   	}
		   
		  })
		  .catch(function (err) {
		    console.log(JSON.stringify(err));
		    Toast.toast(JSON.stringify(err));
		  });
	},
	filterProducts: function(products, callback) {
		var iDone = 0;
		var l = products.length;
		var filtered=[];
		
		var checkProduct = function(product, iPassback, callback) {
			app.store.findInAppPurchaseByProductId(product.productId, function(ret) {
				callback(ret, iPassback);
			});
		};
		
		for (var i=0; i<l; i++) {
			checkProduct(products[i], i, function(ret, i2) {
				if (ret === null) {
					filtered.push(products[i2]);
				}
				iDone ++;
				if (iDone === l) {
					callback(filtered);
				}
			});
		}
		
		if (l === 0) {
			callback(filtered);
		}
		
	},
	writeProducts: function(products, callback) {
		console.log("[InAppAll]writeProducts " + products.length);
		var html = "<li data-role='list-divider' data-theme='" + app.currThemeLetters[1] + "'>Available Items</li>";
		var l = products.length;
		var written = 0;
		
		for (var i=0; i<l; i++) {
			console.log(JSON.stringify(products[i]));
			html += '<li id="' + products[i].productId + '"><a id="' + products[i].productId + '" href="#" class="inAppPurchase">' + products[i].price + ' - ' + products[i].title + '</a></li>';
		}
		
		if (l === 0) {
            html += "<li>No items found</li>";
            html += "<li id='-1' data-icon='refresh' data-theme='" + app.currThemeLetters[2] + "'><a id='-1'>Restore Purchases</a></li>";
       } else {
       		html += "<li id='-1' data-icon='refresh' data-theme='" + app.currThemeLetters[2] + "'><a id='-1'>Restore Purchases</a></li>";
       }

        InAppLocal.$productUL.html(html);
        InAppLocal.$productUL.listview("refresh");
        InAppLocal.$productUL.trigger("updatelayout");
	},
	isUpgraded: function(callback) {
		console.log("[InAppAll]isUpgraded");
		InAppLocal.isUpgraded(function(isUpgraded) {
			if (isUpgraded === true) {
				console.log("Fully Upgraded");
				callback(true);
			} else {
				InAppAll.isUpgradedWithTimeout(function(isUpgraded) {
					console.log("Timeout upgraded: " + isUpgraded);
					callback(isUpgraded);
				});
			}
		});
	},
	isUpgradedWithTimeout: function(callback) {
		console.log("[InAppAll]isUpgradedWithTimeout");
		var ts = getTimestamp();
		InAppAll.getUpgradeTimeout(function(exp) {
			console.log("if " + ts + " > " + exp);
			if (ts > exp) {
				//expired
				console.log("expired");
				callback(false);
			} else {
				callback(true);
				console.log("not expired");
			}			
		});

	},
	getUpgradeTimeout: function(callback) {
		console.log("[InAppAll]getUpgradeTimeout");
		Shell.getSetting("inappUpgradeTimeout", -1, function(setting) {
			console.log("setting: " + setting);
			callback(setting);
		});
	},
	setUpgradedWithTimeout: function(timeout, callback) {
		console.log("[InAppAll]setUpgradedWithTimeout " + timeout);
		Shell.saveSetting("inappUpgradeTimeout", timeout);
		if (callback) {
			callback();
		}
	},
	initialize: function() {
		console.log("[InAppAll]initialize");
		
		InAppLocal.$productUL.on('click', 'a', function() {
            console.log("[InAppAll]click");
            var id = $(this).attr("id");
            console.log("id: " + id);
            if (id === "-1") {
            	InAppAll.restorePurchases();	
            } else {
            	InAppAll.buy(id);
            }
        });
        
        InAppLocal.$inAppPage.on('pagebeforeshow', function() {
        	console.log('[InAppAll]pagebeforeshow');
        	InAppAll.getProducts(function() {
        		console.log("After getProducts");
        	});
        });
        
        $('.btnGoToStore').on('click', function() {
        	changePage("#inAppPurchase");
        });
		
	}
};

InAppAll.initialize();