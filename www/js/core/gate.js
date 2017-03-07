document.addEventListener('pause', 
	function() {
		console.log("[CORDOVA]PAUSE");
		Alert('Can I do this before it pauses?');
	}
);

document.addEventListener('resume', 
	function() {
		console.log("[CORDOVA]RESUME");
		Alert('Is this after it resumes?');
	}
);

var Gate = {
	set: function() {
 		var nums = [];
 		var num;
 		var min = 2;
 		var max = 6;
 		var count = 4;
 		var answer=0;
 		for (var i=0; i<count; i++) {
 			num = randomIntFromInterval(min,max);
 			nums.push(num);
 			answer += num;
 		}
 		Gate.answer = answer;
 		Gate.write(nums);
 	},
 	write: function(nums) {
 		console.log(nums);
 		var $el = $('#gateQuestion');
 		var $elAnswer = $('#txtGateAnswer');
 		var question = "To continue enter the sum of ";
 		var l = nums.length;
 		for (var i=0; i<l; i++) {
 			question += numberToText(nums[i]);
 			if (i < l - 1) {
 				question += " + ";
 			}
 		}
 		//console.log(question);
 		$el.html(question);
 		$elAnswer.val('');
 		$elAnswer.focus();
 		
 	},
 	submit: function() {
 		var answer = $('#txtGateAnswer').val();
 		//console.log("is " + answer + " === " + Gate.answer);
 		var wrongAnswer = function() {
 			Toast.toast("Sorry, please try a different question");
 			Gate.set();
 		};
 		
 		var rightAnswer = function() {
 			//Toast.toast("Thank you!");
 			Gate.setPassed(true);
 			if (Gate.continueFunc !== null) {
 				Gate.continueFunc();
 			} else if (Gate.continuePage !== null) {
 				var page = Gate.continuePage;
				if (page.indexOf("#") === -1) {
					page = "#" + page;
				}
				changePage(page);
 			} else {
 				changePage("#home");
 			}
 			
 		};
 		
 		if (isNumeric(answer)) {
 			var i = parseInt(answer);
 			console.log(i + " === " + Gate.answer);
			if (i === Gate.answer) {
				rightAnswer();
			} else {
				wrongAnswer();
			}
 		} else {
 			wrongAnswer();	
 		}
 	},
	check: function(continueFunc, continuePage, cancelFunc, cancelPage, bNoCancel, callback) {
		console.log("[GATE]check " + Gate.bPassed);
		var cont = function() {
			if (continueFunc !== null) {
				continueFunc();
			}
			if (continuePage !== null) {
				if (continuePage.indexOf("#") !== 0) {
					continuePage = "#" + continuePage;
				}
				continuePage = continuePage.replace(/##/g, '#');
				changePage(continuePage);
			}
			
			if (callback !== undefined && callback !== null) {
				callback(true);
			}
				
			
		};
		
		var cancel = function() {
			if (cancelFunc !== null) {
				cancelFunc();
			}
			
			if (cancelPage !== null) {
				if (cancelPage.indexOf("#") !== 0) {
					cancelPage = "#" + cancelPage;
				}
				cancelPage = cancelPage.replace(/##/g, '#');
				
				changePage(cancelPage);
			}
			
			if (callback !== null && callback !== undefined) {
				callback(false);
			}
		};
		
		
		
    	if (Gate.bPassed === false) {
    		console.log("hasn't passed yet");
			Gate.getPassed(function(setting) {
				console.log("getPassed: " + setting);
	    		if (setting === true) {
	    			Gate.bPassed = true;
	    			cont();
	    		} else {
	    			Gate.continueFunc = continueFunc;
	    			Gate.continuePage = continuePage;
	    			Gate.cancelFunc = cancelFunc;
	    			Gate.cancelPage = cancelPage;
	    			Gate.bNoCancel = bNoCancel;
	    			changePage("#gate");
	    		}
	    	});		
		} else {
			console.log("Already passed");
			cont();
		}
    },
    getPassed: function(callback) {
    	Shell.getSetting("passedGate", false, function(setting) {
    		callback(setting);
    	});
    },
    setPassed: function(setting) {
    	Shell.saveSetting("passedGate", setting);
    },
	initialize: function() {
		this.continueFunc=null;
		this.continuePage=null;
		this.cancelFunc=null;
		this.cancelPage=null;
		this.bNoCancel = false;
		this.bPassed=false;
		this.answer=-1;
		
		 $('.cancelGate').on('click', function() {
			console.log("clicked cancel button");
			if (Gate.cancelFunc !== null) {
				console.log("doing function")
				Gate.cancelFunc();
			}

			if (Gate.cancelPage !== null) {
				if (Gate.cancelPage.indexOf("#") !== 0) {
					Gate.cancelPage = "#" + Gate.cancelPage;
				}
				Gate.cancelPage = Gate.cancelPage.replace(/##/g, '#');
				
				changePage(Gate.cancelPage);
			}
			
			if (Gate.cancelFunc === null && Gate.cancelPage === null) {
				changePage("#home");
			}
        });
        
        $('#gateSubmit').on('click', function() {
        	Gate.submit();
        });
        
		$('#gate').on('pagebeforeshow', function() {
			Gate.set();
		});
		
		$('#gate').on('pageshow', function() {
			$('#gateAnswer').focus();
		});
		
		$('#btnGate').on('click', function() {
			
			Social.askForReviewDialog();			
		});
    
	}
};

Gate.initialize();
