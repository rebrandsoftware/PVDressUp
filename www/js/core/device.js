var Device = {
    getPlatform: function() {
        //toast("getDevicePlatform");
        var sDevice;
        var deviceArray;
        var userAgent = navigator.userAgent;
        //console.log(navigator.userAgent);
        //userAgent = "Mozilla/5.0 (Mobile; rv:14.0) Gecko/14.0 Firefox/14.0";
        if (userAgent.match(/(iOS|iPhone|iPod|iPad|Android|Windows Phone|Mobile)/)) {
            deviceArray = userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|Mobile)/);
            //console.log(devicePlatformArray);
            sDevice = deviceArray[0];
            if (sDevice === "Mobile") {
                deviceArray = userAgent.match(/(Firefox)/);
                sDevice = deviceArray[0];
                if (sDevice === "Firefox") {
                    sDevice = "FirefoxOS";
                } else {
                    sDevice = "Browser";
                }
            }
            //console.log("matched user agent");
            //console.log(device);
            if (sDevice === "iPhone" || sDevice === "iPod" || sDevice === "iPad") {
                sDevice = "iOS";
            }
            if (sDevice === "Windows Phone") {
                sDevice = "WinPhone";
            }
        } else {
            sDevice = "Browser";
        }
        //console.log("returning: " + sDevice);
        //toast("GetDevicePlatform: " + sDevice);
        return sDevice;
    },

    getVersion: function(versionType) {
        var v;
        if (Device.platform === "Android") {
            v = Device.getAndroidVersion();
            if (versionType === undefined) {
                return v;
            } else {
                var a = v.split(".");
                switch (versionType) {
                    case "major":
                        return parseInt(a[0]);

                    case "minor":
                        return parseInt(a[1]);

                }
            }

        } else {
            return "1.0";
        }
    },

    getAndroidVersion: function(ua) {
        ua = (ua || navigator.userAgent).toLowerCase();
        var match = ua.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    },

    initialize: function(callback) {
        this.platform = Device.getPlatform();
        this.version = Device.getVersion();
        //console.log("[DEVICE] Initialize: " + this.platform + " " + this.version);
        callback(true);
    }
};

//Device.initialize();