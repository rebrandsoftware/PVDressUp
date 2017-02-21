//Functions

// (function(){
    // var oldLog = //console.log;
    // //console.log = function (message) {
        // // DO MESSAGE HERE.
        // Globals.allLogs.push(message);
        // window.localStorage.setItem("allLogs" + Globals.allLogs.length, "-------------" + message);
        // oldLog.apply(console, arguments);
    // };
// })();

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year && 3) !== 0) return false;
    return ((year % 100) !== 0 || (year % 400) === 0);
};

function makeLongWordsWrap(str) {
	str = str.replace(/([^ ]{15})/g, "$1 ");
	return str;
};

function minToHourMin(totalMins) {
	var hours = Math.floor(totalMins / 60);
	var hourMins = hours * 60;
	var mins = totalMins - hourMins;
	var a=[];
	a.push(hours);
	a.push(mins);
	return a;
}

// Get Day of Year
Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

function isSQLDatePrevDay(dSQL1, dSQL2) {
	
	var d = new Date();
	if (dSQL2 === undefined) {
		dSQL2 = d.toMysqlDateOnly();		
	}
	var a1 = dSQL1.split("-");
	var a2 = dSQL2.split("-");
	var d1 = parseInt(a1[2]);
	var d2 = parseInt(a2[2]);
	var m1 = parseInt(a1[1]);
	var m2 = parseInt(a2[1]);
	var y1 = parseInt(a1[0]);
	var y2 = parseInt(a2[0]);
	
	
	
	if (y1 === y2) {
		//console.log("same year");
		if (m1 === m2) {
			//console.log("same month");
			if (d1 === (d2 - 1)) {
				//console.log("yesterday");
				return true;
			} else {
				return false;
			}
		} else {
			//console.log("different month");
			if (m1 === (m2 - 1)) {
				//console.log("prev month");
				var months30 = [4, 6, 9 , 11];
				var months31 = [1, 3, 5, 7, 8, 10, 12];
				var months28 = [2];
				var day;
				
				if (months31.indexOf(m1) >= 0) {
					day = 31;
				} else if (months30.indexOf(m1) >= 0) {
					day = 30;
				} else {
					if (d.isLeapYear()) {
						day = 29;
					} else {
						day = 28;
					}
				}
				
				if (d1 === day) {
					//console.log("prev day");
					return true;
				} else {
					return false;
				}
					
			} else {
				return false;
			}
		}
	} else {
		//console.log("different year, yesterday should be 12/31");
		if (m1 === 12 && d1 === 31 && y1 === (y2 - 1)) {
			return true;
		} else {
			return false;
		}
	}
	
}

function isSQLDatePastOrEqual(dSQLCurr, dSQLCheck) {
	//console.log("isSQLDatePastOrEqual curr: " + dSQLCurr + " check: " + dSQLCheck);
	var d = new Date();
	var a1 = dSQLCurr.split("-");
	var a2 = dSQLCheck.split("-");
	var d1 = parseInt(a1[2]);
	var d2 = parseInt(a2[2]);
	var m1 = parseInt(a1[1]);
	var m2 = parseInt(a2[1]);
	var y1 = parseInt(a1[0]);
	var y2 = parseInt(a2[0]);

	if (dSQLCheck === "") {
		return false;
	} else {
		if (y1 > y2) {
			//year is in the past
			return true;
		} else if (y1 < y2) {
			//year is in the future
			return false;
		} else {
			//same year
			if (m1 > m2) {
				//month is in the past
				return true;
			} else if (m1 < m2) {
				//month is in the future
				return false;
			} else {
				//same month
				if (d1 > d2) {
					//day is in the past
					return true;
				} else if (d1 < d2) {
					//day is in the future
					return false;
				} else {
					//it's today
					return true;
				}
			}
		}
	}
}

function deepEqual(x, y) {
  return (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
      Object.keys(x).reduce(function(isEqual, key) {
        return isEqual && deepEqual(x[key], y[key]);
      }, true) : (x == y);
}

function tooltipVal1(args) {
	//console.log("sliderTooltipVal" + args.value);
	var $el = $('#spnEatFoodAmount');
	var val = $el.val();
	//console.log("val = " + val);
	if (isNumber(val)) {
		val = parseInt(val);
		if (parseInt(args.value, 10) < 7) {
			$('.rs-control .rs-range-color').css("background-color", "#ff0000");
			val --;
		} else if (parseInt(args.value, 10) === 7) {
			$('.rs-control .rs-range-color').css("background-color", "#54BBE0");
		} else {
			$('.rs-control .rs-range-color').css("background-color", "#20ff00");
		}
	}
	
    var steps = ["<sup>1</sup>&frasl;<sub>8</sub>", 
    			"<sup>1</sup>&frasl;<sub>4</sub>", 
    			"<sup>1</sup>&frasl;<sub>3</sub>", 
                "<sup>1</sup>&frasl;<sub>2</sub>", 
                "<sup>2</sup>&frasl;<sub>3</sub>", 
                "<sup>3</sup>&frasl;<sub>4</sub>", 
                "<sup>7</sup>&frasl;<sub>8</sub>",
                  "", 
                "<sup>1</sup>&frasl;<sub>8</sub>", 
    			"<sup>1</sup>&frasl;<sub>4</sub>", 
    			"<sup>1</sup>&frasl;<sub>3</sub>", 
                "<sup>1</sup>&frasl;<sub>2</sub>", 
                "<sup>2</sup>&frasl;<sub>3</sub>", 
                "<sup>3</sup>&frasl;<sub>4</sub>", 
                "<sup>7</sup>&frasl;<sub>8</sub>"];
    var ret;
    if (val > 0) {
    	ret = val + steps[args.value];	
    } else {
    	ret = steps[args.value];
    }
	
	//console.log("ret: " + ret);
	return ret;
}

function sliderValueFromStep(i) {
	//console.log("sliderValueFromStep");
	//console.log(i);
    var steps = [-0.87, -0.75, -0.66, 
                  -0.5, -0.33, -0.25, -0.13,
                  0.00, 0.12, 0.25, 
                  0.33, 0.5, 0.66, 0.75, 0.87];
	//console.log("ret: " + steps[i]);
    return steps[i];
}

function sliderValueFromFraction(sFrac) {
	//console.log("sliderValueFromFraction:");
	//console.log(sFrac);
	var steps = ["-0.87", "-0.75", "-0.66", 
                  "-0.50", "-0.33", "-0.25", "-0.13",
                  "0.00", "0.12", "0.25", 
                  "0.33", "0.50", "0.66", "0.75", "0.87"];
    var ret = steps.indexOf(sFrac);
    //console.log("valueFromFraction: " + ret);
    return ret;
}


function extractXMLTag(s, tag) {
    var start;
    var end;
    var s1 = "<" + tag + ">";
    var s2 = "</" + tag + ">";
    var ret;
    start = s.indexOf(s1) + s1.length; 
    end = s.indexOf(s2);
    ret = s.slice(start, end);
    if (tag == "deleted") {
        //console.log("DELETED1");
        //console.log(s);
        //console.log("DELETED2");
        //console.log("Start: " + start);
        //console.log("End: " + end)
    }
    return ret;
}

function isInt(n) {
   return n % 1 === 0;
}

function cmToFtIn(cm) {
	var a = [];
	var inches = cmToIn(cm);
	var feet = Math.floor(inches / 12);
	inches = inches % 12;
	a.push(Math.floor(feet).toFixed(3));
	a.push(Math.round(inches).toFixed(3));
	return (a);
}

function rangePercentage(input, min, max) {
	//console.log("input: " + input);
	//console.log("min: " + min);
	//console.log("max: " + max);
	var pct=0;
	
	if (max > min) {
		//console.log("gain");
		if (input >= min && input <= max) {
			pct = ((input - min) * 100) / (max - min);
			//console.log(pct + " = ((" + input + " - " + min + ") * 100) / (" + max + " - " + min + ")");
		} else if (input > max) {
			//console.log("input > max");
			pct = 100;
		}		
	} else if (max < min) {
		//console.log("lose");
		if (input >= max && input <= min) {
			//console.log("calculate");
			pct = Math.abs(((input - max) * 100) / (min - max) - 100);
			//console.log(pct + " = ((" + input + " - " + max + ") * 100) / (" + min + " - " + max + ")");
		} else if (input < max) {
			//console.log("input > min");
			pct = 100;
		}
	}
	
	//console.log("pct: " + pct);

	if (pct > 100) {
		pct = 100;
	}
	if (pct < 0) {
		pct = 0;
	}
	return pct;
}

function ftInToCm(ft, inches) {
	inches += ft * 12;
	return inToCm(inches);
}

function cmToIn(cm) {
	return (parseFloat(cm) / 2.54).toFixed(3);
}

function inToCm(inch) {
	return (parseFloat(inch) * 2.54).toFixed(3);
}

function kgToLb(kg) {
	return (parseFloat(kg) * 2.20462).toFixed(3);	
}

function lbToKg(lbs) {
	return (parseFloat(lbs) / 2.20462).toFixed(3);	
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

String.prototype.hashCode = function() {
	
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  var uCase = this.toUpperCase();
  for (i = 0, len = uCase.length; i < len; i++) {
    chr   = uCase.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function fixDate(dateVal) {
	dateVal = dateStringToBGGDate(dateVal);
    var dateValNoTime;
    var a;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }
    today = yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m + ':' + s;
    //console.log("dateVal:" + dateVal);
    if (dateVal.indexOf("/") > -1) {
        a = dateVal.split("/");
        if (a.length >= 3) {
            if (a[2].length === 4) {
                //mm/dd/yyyy
                yyyy = a[2];
                mm = a[0];
                dd = a[1];
            } else if (a[0].length === 4) {
                //yyyy/mm//dd
                yyyy = a[0];
                mm = a[1];
                dd = a[2];
            } else {
                //mm/dd/yy
                yyyy = '20' + a[2];
                mm = a[0];
                dd = a[1];
            }
            if (dd.length < 2) {
                dd = '0' + dd;
            }
            if (mm.length < 2) {
                mm = '0' + mm;
            }
            dateVal = yyyy + '-' + mm + "-" + dd + 'T' + h + ':' + m + ':' + s;
        }
    }
    //console.log("dateVal2:" + dateVal);
    if (dateVal === "" || dateVal === "Now" || dateVal === "mm/dd/yyyy") {
        dateVal = today;
    }
    //console.log("dateVal3:" + dateVal);
    if (dateVal.indexOf("T") === -1) {
        dateVal += "T" + h + ":" + m + ":" + s;
    }
    //console.log("DateVal3a:" + dateVal);
    a = dateVal.split("T");
    if (a.length >= 1) {
        dateValNoTime = a[0];
    }
    //console.log("dateVal4:" + dateVal);
    //console.log("dateValNoTime:" + dateValNoTime);
    var d = new Date(dateVal);
    //console.log(d);
    return d;
}

function dateStringToBGGDate(dateString) {
    if (dateString !== "") {
        var s = getDateFormatForDateBox();
        var a;
        var ret="";
        dateString = dateString.replace(/-/g, "/");
        a = dateString.split("/");
        //console.log(a);
        //console.log(s);
        switch (s) {
           case "dmy":
            ret = a[1] + "/" + a[0] + "/" + a[2];
            break;
           case "dym":
           ret = a[2] + "/" + a[0] + "/" + a[1];
            break;
           case "myd":
           ret = a[0] + "/" + a[2] + "/" + a[1];
            break;
           case "mdy":
           ret = a[0] + "/" + a[1] + "/" + a[2];
            break;
           case "ymd":
           ret = a[1] + "/" + a[2] + "/" + a[0];
            break;
           case "ydm":
           ret = a[2] + "/" + a[1] + "/" + a[0];
            break;
           
       }  
       return ret;
    } else {
        return "";
    }
    
}


function sqlDateToDateBoxDate(sqlDate) {
	var ret = "";
    if (sqlDate !== "") {
        var s = getDateFormatForDateBox();
        var a;
        sqlDate = sqlDate.replace(/-/g, "/");
        a = sqlDate.split("/");
        //console.log(a);
        //console.log(s);
        switch (s) {
           case "dmy":
            ret = a[2] + "/" + a[1] + "/" + a[0];
            break;
           case "dym":
           ret = a[2] + "/" + a[0] + "/" + a[1];
            break;
           case "myd":
           ret = a[1] + "/" + a[0] + "/" + a[2];
            break;
           case "mdy":
           ret = a[1] + "/" + a[2] + "/" + a[0];
            break;
           case "ymd":
           ret = a[0] + "/" + a[1] + "/" + a[2];
            break;
           case "ydm":
           ret = a[0] + "/" + a[2] + "/" + a[1];
            break;
           
       }
    }
    //console.log("sqlDateToDateBoxDate: " + ret);
    return ret;    
}



function stripFileURI(fileURI) {
    //console.log("in: " + fileURI);
    var a;
    if (fileURI.indexOf("/Documents") > -1) {
        a = fileURI.split("/Documents");  
        fileURI = a[1];  
    } else {
        if (fileURI.indexOf("/ScoreGeekDLs") > -1) {
            a = fileURI.split("/ScoreGeekDLs");
            fileURI = "/ScoreGeekDLs/" + a[1];
        } else {
            if (fileURI.indexOf("/") > -1) {
                a = fileURI.split("/");
                fileURI = "/" + a[a.length - 1];
            } else {
                fileURI = "/" + fileURI;
            }
            
        }
    }
    fileURI = fileURI.replace("//", "/");
    //console.log("ot: " + fileURI);
    return fileURI;
}

function getFileExtFromB64(b64) {
        var ext = "jpg";
        if (b64.indexOf("image/png") > -1) {
            ext = "png";
        } else {
            ext = "jpg";
        }
        return ext;
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function changePage(myTarget) {
    //console.log("Changing page: " + myTarget);
    $(":mobile-pagecontainer").pagecontainer("change", myTarget);
}

function alertDebug(s) {
    if (Globals.bDebug === true) {
        alert(s);
    } else {
    	//console.log(s);
    }
}

function doPad(s, l) {
    //console.log(s);
    //console.log(l);
    //console.log("len: " + s.length);
   while (s.length < l) {
       s = "0" + s;
   }
   return s;
}

function getTimeStamp(optDate) {
    return getTimestamp(optDate);
}

function getTimestamp(optDate) {
    var d = new Date();
    if (optDate !== undefined) {
        d = optDate;
    }
    var i = d.getTime();
    //var j = d.getTimezoneOffset();
    //console.log('timeZoneOffset: ' + j);
    //j *= 60000;
    //j = 0;
    //var k = i - j;
    //e = new Date(k);
    //Toast.toast(i + " " + j + " " + humaneDate(e));
    return i;
}

function roundHalf(num) {
    num = Math.round(num * 2) / 2;
    return num;
}

function roundQuarter(num) {
    num = Math.round(num * 4) / 4;
    return num;
}

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function stringToBoolean(string){
    switch(string.toString().toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}

function getColorCode(name) {
    name = name.toLowerCase();
    var hex='#999999';
    switch(name) {
        case "black":
            hex='#000000';
            break;
        case "blue":
            hex='#4d5fdc';
            break;
        case "brown":
            hex='#964b00';
            break;
        case "gold":
            hex='#eaa144';
            break;
                case "gray":
            hex='#808080';
            break;
                case "green":
            hex='#008000';
            break;
                case "orange":
            hex='#ff5624';
            break;
                case "pink":
            hex='#ffc0cb';
            break;
                case "purple":
            hex='#953475';
            break;
                case "red":
            hex='#ff0000';
            break;
                case "silver":
            hex='#cccccc';
            break;
                case "tan":
            hex='#c5b485';
            break;
                case "white":
            hex='#ffffff';
            break;
                case "yellow":
            hex='#d8b755';
            break;
                case "teal":
                    hex='#008080';
                    break;
    }
    return hex;
}

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
      
String.prototype.truncShort = 
      function(n){
          return this.length>n ? this.substr(0,n-1) : this;
      };

getDateFormatForDateBox = function() {
    var s = Device.datePatternLong;
    //console.log("getDateFormatForDateBox: " + s);
    s = s.replace(/M/g, "m");
    s = s.replace(/D/g, "d");
    s = s.replace(/Y/g, "y");
    s = s.replace(/mmmm/g, "m");
    s = s.replace(/mmm/g, "m");
    s = s.replace(/mm/g, "m");
    s = s.replace(/dddd/g, "d");
    s = s.replace(/ddd/g, "d");
    s = s.replace(/dd/g, "d");
    s = s.replace(/yyyy/g, "y");
    s = s.replace(/yyy/g, "y");
    s = s.replace(/yy/g, "y");
    s = s.replace(/\//g, '');
    s = s.replace(/,/g, '');
    s = s.replace(/ /g, '');
    s = s.replace(/[^mdy]/g, '');
    //console.log("format: " + s);
    return s;
};

getDateFormatForHistory = function() {
    
    var s = getDateFormatForDateBox();
    //console.log("getDateFormatForHistory: " + s);
    switch (s) {
       case "dmy":
        s = "#DDDD#, #DD# #MMMM#, #YYYY#";
        //s = "#DD#/#MM#/#YYYY# #h#:#mm# #ampm#";
        break;
       case "dym":
       s = "#DDDD# #DD#, #YYYY#, #MMMM#";
       //s = "#DD#/#YYYY#/#MM# #h#:#mm# #ampm#";
        break;
       case "myd":
       s = "#MMMM# #YYYY#, #DDDD# #DD#";
       //s = "#MM#/#YYYY#/#DD# #h#:#mm# #ampm#";
        break;
       case "mdy":
       s = " #DDDD#, #MMMM# #DD#, #YYYY#";
       //s = "#MM#/#DD#/#YYYY# #h#:#mm# #ampm#";
        break;
       case "ymd":
       s = "#YYYY#, #DDDD# #MMMM# #DD#";
       //s = "#YYYY#/#MM#/#DD# #h#:#mm# #ampm#";
        break;
       case "ydm":
       s = "#YYYY#, #DDDD# #DD# #MMMM#";
       //s = "#YYYY#/#DD#/#MM# #h#:#mm# #ampm#";
        break;
       
   }  
   //console.log("format: " + s);
    return s;
};

getDateFormatForCharts = function() {
	//console.log("getDateFormatForCharts");
	var s = getDateFormatForDateBox();
	//console.log(s);
	var ret="";
	switch (s) {
		case "mdy":
			ret = "#MM#/#DD#/#YY#";
			break;
		case "myd":
		ret = "#MM#/#YY#/#DD#";
			break;
		case "dmy":
			ret = "#DD#/#MM#/#YY#";
			break;
		case "dym":
			ret = "#MM#/#YY#/#MM#";
			break;
		case "ymd":
			ret = "#YY#/#MM#/#DD#";
			break;
		case "ydm":
			ret = "#YY#/#DD#/#MM#";
			break;
	}
	return ret;
};

Date.prototype.customFormat = function(formatString){
    // if (Device.platform === "Browser") {
        // return this.toLocaleString();
    // } else {
        // var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
        var dateObject = this;
        YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
        MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
        MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
        DD = (D=dateObject.getDate())<10?('0'+D):D;
        DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
        th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
        formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    
        h=(hhh=dateObject.getHours());
        if (h===0) h=24;
        if (h>12) h-=12;
        hh = h<10?('0'+h):h;
        AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
        mm=(m=dateObject.getMinutes())<10?('0'+m):m;
        ss=(s=dateObject.getSeconds())<10?('0'+s):s;
        return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);   
    //}
};

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};

Date.prototype.toMysqlDateOnly = function() {
    return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate());
};

function getDots(dots) {
    var s = "";
    dots++;
    if (dots > 3) {
        dots = 0;
    }
    for (var i = 0; i < dots; i++) {
        s += ".";
    }
    return s;
}

function getPlaceText(place) {
	
	var placeToString = place.toString();
	var placeRight = placeToString.slice(-1);
	var placeRight2 = placeToString.slice(-2, 2);
	//console.log("placeRight: " + placeRight);
	//console.log("placeRight2: " + placeRight2);
	if (placeRight2 !== "11" && placeRight2 !== "12" && placeRight2 !== "13") {
		switch (placeRight) {
			case "1":
				placeText = place + "st Place";
				break;
			case "2":
				placeText = place + "nd Place";
				break;
			case "3": 
				placeText = place + "rd Place";
				break;
			default:
				placeText = place + "th Place";
			  
		}
	} else {
		placeText = place + "th Place";
	}
	return placeText;
}





function playAudio(src, preload) {
    if (Device.platform === "FirefoxOS" || Device.platform === "Browser" || Device.platform === "WinPhone") {
        if (preload === false) {
          // create an audio element that can be played in the background
          var audio = new Audio(); 
          audio.src = src;
          audio.preload = 'auto';
          audio.mozAudioChannelType = 'content';
          audio.play();   
        }
    } else {
        var my_media;
        //console.log("playAudio");
        var audioSuccess = function() {
            //console.log("[AUDIO]: Success " + src);
        };
        
        var audioError = function(msg) {
            //console.log("[AUDIO]: Error " + msg);
        };
    
        if (Device.platform !== "Browser") {
            //console.log('[AUDIO]: Mobile Device');
                 // Create Media object from src
            if (Device.platform == 'Android') { 
                src = '/android_asset/www/' + src; 
                //console.log("Android src: " + src);
            } 
                 
            my_media = new Media(src, audioSuccess, audioError);
        
            // Play audio
            if (preload === true) {
                //console.log("[AUDIO]: Preloading " + src);
                if (Device.platform !== "Android") {
                   my_media.setVolume('0.0');   
                   my_media.play(); 
                }
            } else {
                my_media.setVolume('1.0');
                my_media.play(); 
                //console.log("[AUDIO]: Playing " + src);
            }
              
        } else {
            //console.log("[AUDIO]: Skipped");
        }    
    }
}





function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNumeric(n) {
    return isNumber(n);
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

function isALetter(s) {
    s = s.toLowerCase;
    switch (s) {
        case "a":
            return true;
        case "b":
            return true;
        case "c":
            return true;
        case "d":
            return true;
        case "e":
            return true;
        case "f":
            return true;
        case "g":
            return true;
        case "h":
            return true;
        case "i":
            return true;
        case "j":
            return true;
        case "k":
            return true;
        case "l":
            return true;
        case "m":
            return true;
        case "n":
            return true;
        case "o":
            return true;
        case "p":
            return true;
        case "q":
            return true;
        case "r":
            return true;
        case "s":
            return true;
        case "t":
            return true;
        case "u":
            return true;
        case "v":
            return true;
        case "w":
            return true;
        case "x":
            return true;
        case "y":
            return true;
        case "z":
            return true;
        default:
            return false;
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1, property.length - 1);
    }
    return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function(obj1, obj2) {
        var i = 0,
            result = 0,
            numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}

Array.prototype.shuffle = function(callback) {
    //console.log("Shuffle");
    var i = this.length,
        j, tempi, tempj;
    if (i === 0) {
        return this;
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = this[i];
        tempj = this[j];
        this[i] = tempj;
        this[j] = tempi;
    }
    return this;
};

function numberToText(number) {
	console.log(number);
	var ret;
	switch (number) {
		case 0:
			ret = "zero";
			break;
		case 1:
			ret = "one";
			break;
		case 2:
			ret = "two";
			break;
		case 3:
			ret = "three";
			break;
		case 4:
			ret = "four";
			break;
		case 5:
			ret = "five";
			break;
		case 6:
			ret = "six";
			break;
		case 7:
			ret = "seven";
			break;
		case 8:
			ret = "eight";
			break;
		case 9:
			ret = "nine";
			break;
	}
	
	return ret;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

String.prototype.trimMore = function() {
    var s = this.trim();
    s = s.replace(/^\s+|\s+$/g, '');
    return s;
};

function findLowest(a, b, c) {
    if ((a <= b) && (a <= c)) {
        return a;
    } else if ((b <= a) && (b <= c)) {
        return b;
    } else {
        return c;
    }
}

String.prototype.sanitize = function() {
    var s = this.trim();
    s = s.replace(/ /g, "");
    s = s.replace(/,/g, "");
    s = s.replace(/-/g, "");
    s = s.replace(/:/g, "");
    s = s.replace(/@/g, "");
    s = s.replace(/#/g, "");
    s = s.replace(/\$/g, "");
    s = s.replace(/%/g, "");
    s = s.replace(/&/g, "");
    s = s.replace(/\*/g, "");
    s = s.replace(/\(/g, "");
    s = s.replace(/\)/g, "");
    s = s.replace(/=/g, "");
    s = s.replace(/\+/g, "");
    s = s.replace(/!/g, "");
    s = s.replace(/`/g, "");
    s = s.replace(/~/g, "");
    s = s.replace(/\?/g, "");
    s = s.replace(/\./g, "");
    s = s.replace(/</g, "");
    s = s.replace(/>/g, "");
    s = s.replace(/\//g, "");
    s = s.replace(/\\/g, "");
    s = s.replace(/"/g, "");
    s = s.replace(/'/g, "");
    s = s.replace(/:/g, "");
    return s;
};

String.prototype.sanitizeBrackets = function() {
    var s = this.trim();
    s = s.replace(/</g, "");
    s = s.replace(/>/g, "");
    return s;
};

function cleanArray(actual) {
    var newArray = [];
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}