/*
 * Module:      ErrorLog
 *
 * Description: All uncaught errors are captured here.
 *              - provide output options: Console, file or trace ?
 *              - should provide verbosity setting someday.
 *  
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class ErrorLog {
  
  constructor() {
    this.log = [];
    
  }
  
  push(errorMsg,
       classFunction,
       lineNumber)
  {
    var error = new Error(errorMsg, classFunction, lineNumber);
    this.log.push(error);
    alert(error.str);
  }
}

/*
 * Error class
 *
 * - container of an error message
 */
class Error {
  constructor(errorMsg, classFunction, lineNumber)
  {
    this._errorMsg = errorMsg;
    this._classFunction = classFunction;
    this._lineNumber = lineNumber;
  }
  
  get str()
  {
    var str = 'Error: ' + this._errorMsg + ' Function: ' + this._classFunction + ' Line: ' + this._lineNumber;
    return str;
  }
}