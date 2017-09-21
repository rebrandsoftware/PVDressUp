var FileIO = {
    copyFileToTempDir: function(fileURI, newName, callback) {
        ////console.log("[FILEIO]: copyFileToTempDir " + fileURI);
        window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
            ////console.log("[FILEIO]: Resolved fileURI to FileEntry");
            ////console.log(fileEntry);
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
                function(fileSystem) {
                    ////console.log("[FILEIO]: Got filesystem");
                    ////console.log(fileSystem);
                    fileEntry.moveTo(fileSystem.root, newName, function(newFileEntry) {
                        ////console.log("[FILEIO]: Moved File");
                        ////console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                        callback(newFileEntry.fullPath);
                    }, FileIO.errorHandler);

                }, FileIO.errorHandler);
        }, FileIO.errorHandler);

    },
    makeFilePersistent: function(tempURI, newName, callback) {
        //resolve the file URI
        //console.log("[FILEIO]: makeFilePersistent: " + tempURI);
        if (Device.platform === "FirefoxOS") {
            newName = Globals.appNameNoSpaces.replace(/ /g, '') + "/" + newName;
            ////console.log("tempURI: " + tempURI);
            ////console.log("newname: " + newName);

            //var elDom = document.getElementById("imgSImage");
            var elDom = document.createElement("img");
            var myLoad;
            ////console.log("created img");
            myLoad = function() {

                ////console.log("load");
                elDom.removeEventListener('load', myLoad); // to avoid a loop
                var imgCanvas = document.createElement("canvas"),
                    imgContext = imgCanvas.getContext("2d");
                imgCanvas.width = elDom.width;
                imgCanvas.height = elDom.height;
                imgContext.drawImage(elDom, 0, 0, elDom.width, elDom.height);
                imgCanvas.toBlob(function(blob) {
                    ////console.log("Blob");
                    ////console.log(blob);
                    var sdcard = navigator.getDeviceStorage("pictures");
                    var requestAdd = sdcard.addNamed(blob, newName);

                    requestAdd.onsuccess = function() {
                        $.mobile.loading("hide");
                        ////console.log("RequestAdd success");
                        callback(newName);
                    };

                    requestAdd.onerror = function() {
                        $.mobile.loading("hide");
                        FileIO.errorHandler("Unable to write file: " + this.error.name);
                    };
                });
            };
            $.mobile.loading("show");
            elDom.addEventListener("load", myLoad, false);
            ////console.log("setting src");
            elDom.src = tempURI;
		} else if (Device.platform === "Browser") {
			callback("data:image/png;base64," + tempURI);
        } else {
            window.resolveLocalFileSystemURL(tempURI, function(fileEntry) {
                ////console.log("[FILEIO]: Resolved Temp File to FileEntry");
                ////console.log(fileEntry);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function(fileSystem) {
                        ////console.log("[FILEIO]: Got filesystem");
                        ////console.log(fileSystem);
                        if (Device.platform === "Android") {
                            fileSystem.root.getDirectory(Globals.appNameNoSpaces.replace(/ /g, ''), {
                                create: true
                            }, function(dirEntry) {
                                fileEntry.copyTo(dirEntry, newName, function(newFileEntry) {
                                    ////console.log("[FILEIO]: Moved File");
                                    ////console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                                    callback(newFileEntry.fullPath);
                                }, FileIO.errorHandler);
                            });
                        } else {
                            fileEntry.moveTo(fileSystem.root, newName, function(newFileEntry) {
                                ////console.log("[FILEIO]: Moved File");
                                ////console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                                callback(newFileEntry.fullPath);
                            }, FileIO.errorHandler);
                        }
                    }, FileIO.errorHandler);
            }, FileIO.errorHandler);
        }
    },

    deleteFile: function(fileURI, callback) {
        ////console.log("[FILEIO]: deleteFile: " + fileURI);
        if (Device.platform !== "Browser") {
            window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
                ////console.log("[FILEIO]: Resolved File to FileEntry");
                fileEntry.remove();
                ////console.log("removed");
                callback(true);
            }, FileIO.errorHandler);
        } else {
            callback(true);
        }
    },

    writeBinaryFile: function(binaryData, fileName, callback) {
        ////console.log("[FILEIO]: writeBinaryFile " + fileName);
        try {

            if (Device.platform !== "Browser") {

                try {
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                        function(fileSystem) {
                            ////console.log("Got Filesystem");
                            try {
                                fileSystem.root.getFile(fileName, {
                                    create: true,
                                    exclusive: false
                                }, function(fileEntry) {
                                    ////console.log("Got fileEntry");
                                    fileEntry.createWriter(function(writer) {
                                        ////console.log("[FILEIO]: created writer");
                                        writer.onwriteend = function(evt) {
                                            ////console.log("[FILEIO]: write end");
                                            ////console.log(evt);
                                            callback(fileEntry.fullPath);
                                        };

                                        writer.write(binaryData);
                                    });
                                }, FileIO.errorHandler);
                            } catch (err) {
                                ////console.log("1 " + err.message);
                            }
                        }, FileIO.errorHandler);
                } catch (err) {
                    ////console.log("2 " + err.message);
                    callback(undefined);
                }

            } else {
                ////console.log("wrong device type");
                callback(null);
            }
        } catch (err) {
            callback(undefined);
            ////console.log("WriteBinaryFile err 3: " + err.message);
        }

    },

    getFileURI: function(partialPath, callback) {
        ////console.log("[FileIO]getFileURI");
        ////console.log("Device Platform: " + Device.platform);
        if (Device.platform === "Browser" || partialPath.indexOf("Local:") > -1) {
        	if (partialPath) {
        		if (partialPath.indexOf("Local:") > -1) {
                ////console.log("Replace Local");
	                partialPath = partialPath.replace("Local:", "");
	            }
        	} else {
        		partialPath = "";
        	}
            
            callback(partialPath);
        } else if (Device.platform === "FirefoxOS") {
            var files = navigator.getDeviceStorage("pictures");
            var cursor = files.enumerate();

            cursor.onsuccess = function() {

                var file = this.result;

                if (file !== null) {
                    ////console.log("Got file: " + file.name);
                    if (file.name === "/sdcard/" + partialPath) {
                        ////console.log("FOUND IT");
                        fileURI = window.URL.createObjectURL(file);
                        ////console.log("FileURI: " + fileURI);
                        callback(fileURI);
                        this.done = true;
                    } else {
                        this.done = false;
                    }

                } else {
                    this.done = true;
                }

                if (!this.done) {
                    this.continue();
                }
            };
        } else if (partialPath === "" || partialPath === "BLOB") {
            ////console.log("was emtpy or blob");
            callback("");
        } else {
            // if (partialPath.charAt(0) === "/") {
            // partialPath = partialPath.slice(1);
            // ////console.log("new partial path: " + partialPath);
            // }
            //removing the doubleslash was causing the file to be missing
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem) {
                    ////console.log("[FILEIO]: Got filesystem");
                    var fileURI = fileSystem.root.toURL() + partialPath;
                    ////console.log("[FILEIO]: Full Path: " + fileURI);
                    callback(fileURI);
                }, FileIO.errorHandler);
        }
    },

    getB64FromFileURI: function(fileURI, callback) {
        if (fileURI !== undefined) {
            ////console.log(fileURI);
            if (fileURI !== "undefined" && fileURI.indexOf(";base64,") === -1 && fileURI.indexOf("http://") === -1 && fileURI.indexOf('https://') === -1) {
                ////console.log('[FILEIO]: getB64FromFileURI: ' + fileURI);
                if (fileURI.indexOf("file://") > -1) {
                    ////console.log("Acceptable");
                    window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
                        ////console.log("[FILEIO]: Resolved FileURI to FileEntry");
                        ////console.log(fileEntry);
                        fileEntry.file(function(file) {
                            ////console.log("Reading as Data URL");
                            var reader = new FileReader();
                            var b64 = '';
                            reader.onloadend = function(evt) {
                                b64 = evt.target.result;
                                ////console.log("[FILEIO]: got base64 len: " + b64.length);
                                ////console.log("[FILEIO]: line breaks: " + b64.indexOf("\n"));
                                callback(b64);
                            };
                            reader.readAsDataURL(file);
                        }, FileIO.errorHandler);
                    }, FileIO.errorHandler);
                } else {
                    callback(fileURI);
                }
            } else {
                callback(fileURI);
            }
        } else {
            callback(fileURI);
        }
    },
    saveB64PhotoToDevice: function(fileName, b64Data, callback) {
        ////console.log("[FileIO] saveB64PhotoToDevice: " + fileName);
        var contentType = "image/jpeg";
        if (fileName.indexOf(".png") > -1) {
            contentType = "image/png";
        }
        ////console.log("content type: " + contentType);
        if (b64Data.indexOf(";base64,") > -1) {
            ////console.log("b64 confirmed");
            var blob = FileIO.getBlobFromBase64(b64Data, contentType);
            if (blob !== null) {
                ////console.log("Got blob");
                FileIO.writeBinaryFile(blob, fileName, function(fileURI) {
                    ////console.log("fileURI: " + fileURI);
                    callback(fileURI);
                });
            } else {
                ////console.log("Blob was NULL");
                callback(b64Data);
            }
        } else {
            ////console.log("!!Not b64!!");
            callback(b64Data);
        }
    },
    getBlobFromBase64: function(b64Data, contentType) {
        ////console.log('[FILEIO]: getBlobFromBase64');
        ////console.log('b64Data');
        if (b64Data.indexOf(";base64,") > -1) {
            var binary;
            if (b64Data.indexOf(',') > -1) {
                try {
                    binary = atob(b64Data.split(',')[1]);
                } catch (err) {
                    ////console.log(err.message);
                }

            } else {
                binary = b64Data;
            }



            // atob() decode base64 data.. 
            ////console.log("[FILEIO]: got binary");
            var array = [];
            var byteArray;
            var binaryArray;
            var byteArrays;
            for (var i = 0; i < binary.length; i++) {
                try {
                    array.push(binary.charCodeAt(i));
                } catch (err) {
                    ////console.log(err.message);
                }

                // convert to binary.. 
            }
            ////console.log("[FILEIO]: pushed to array");
            var blob = null;
            try {
                byteArrays = [new Uint8Array(array)];
            } catch (err) {
                ////console.log(err);
            }

            try {
                byteArray = new Uint8Array(array);
            } catch (err) {
                ////console.log(err);
            }

            try {
                binaryArray = byteArray.buffer;
            } catch (err) {
                ////console.log(err);
            }
            if (contentType === undefined) {
                contentType = 'image/jpeg';
            }
            try {
                blob = new Blob(byteArrays, {
                    type: contentType
                });
            } catch (e) {
                // TypeError old chrome and FF
                blob = binaryArray;
            }
            //var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});    // create blob file.. 
            ////console.log('[FILEIO]: Got Blob');
            ////console.log(blob);
            return blob;
        } else {
            return null;
        }
    },

    // simple error handler
    errorHandler: function(e) {
        ////console.log('[FILEIO]: Error: ');
        ////console.log(e.message);
    }
};