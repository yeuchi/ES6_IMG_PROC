/*
 * Module:  Model
 *
 * Description: 
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */

'use strict';

class Model extends EventBase {
  constructor(canvasList)
  {
    super();
    this._jsonFilePath = "filePath";
    this._images = [];
    for(var i=0; i<canvasList.length; i++)
    {
      this._images[i] = new Image(canvasList[i]);
    }
  }
  
  get imageList()
  {
    return this._images;
  }
  
  /*
   * Load an ASCII file with JSON string
   *
   * Return: 
   */
  openJsonFile(filePath)
  {
    this._jsonFilePath = filePath;
    $.getJSON(filePath, this.onLoadJsonHandler);
  }
  
  /*
   * Handle JSON load from file
   *
   * Dispatch: event of success or error
   */
  onLoadJsonHandler(data)
  {
    var eventType = (data)? Event.MSG_JSON_FILE_LOADED : Event.MSG_ERROR;
    super.dispatch(eventType, data, "Model::onLoadJsonHandler()", 83);
  }
  
  /*
   * Go load a binary image file
   */
  openBinaryFile(filePath,  // file path of image
                 index)     // image index
  {
    this._images[index].filePath = filePath;

    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open("GET", filePath, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = this.onLoadBinaryFileHandler;
    xhr.onprogress = this.onLoadProgressHandler;
    
    xhr.send(null);
  }
  
  /*
   * Binary file has been loaded
   */
  onLoadBinaryFileHandler(e)
  {
    var xhr = e.currentTarget;
    var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);

    var eventType = (data)? Event.MSG_BINARY_FILE_LOADED : Event.MSG_ERROR;
    super.dispatch(eventType, data, "Model::onLoadBinaryHandler()", 70);
  }
  
  /*
   * Load progress update
   */
  onLoadProgressHandler(e)
  {
    // ** for handling large files
    if(e.lengthComputable) {
      var progress = {total:e.total, loaded:e.loaded};
    
      super.dispatch(Event.MSG_PROGRESS, progress, "Model::onLoadProgressHandler()", 82);
    }
  }
  
  /*
   * Parse data stream into local values
   *
   * Return true or false
   */
  marshalBinary(bytes,      // raw data loaded from file
                index)      // image index
  {
    return this._images[index].decode(bytes);
  }
  
  /*
   * Parse data stream into local values
   *
   * Return true or false
   */
  marshalJSON(data)       // raw data loaded from file 
  {
    // kernel data, configuration
    return true;
  }
}


