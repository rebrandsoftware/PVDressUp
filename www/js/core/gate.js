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
 			Toast.toast("Thank you!");
 			Gate.setPassed(true);
 			if (Gate.continueFunction !== null) {
 				Gate.continueFunction();
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
	check: function(continueFunc, cancelPage, bNoCancel) {
    	if (Gate.bPassed === false) {
			Gate.getPassed(function(setting) {
	    		if (setting === true) {
	    			Gate.bPassed = true;
	    			continueFunc();
	    		} else {
	    			Gate.continueFunction = continueFunc;
	    			Gate.cancelPage = cancelPage;
	    			Gate.bNoCancel = bNoCancel;
	    			changePage("#gate");
	    		}
	    	});		
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
		this.continueFunction=null;
		this.continuePage=null;
		this.cancelPage=null;
		this.bNoCancel = false;
		this.bPassed=false;
		this.answer=-1;
		
		 $('.cancelGate').on('click', function() {
			console.log("clicked cancel button");
			var page = Gate.cancelPage;
			if (page.indexOf("#") === -1) {
				page = "#" + page;
			}
			changePage(page);
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
			
			var passedGate = function() {
				Toast.toast("You passed the gate!");
				changePage("#home");
			};
			
			Gate.check(passedGate, "home", false);
			
		});
    
	}
};

Gate.initialize();
