/*
 * Module:      Event class
 *
 * Description: a broadcasting event
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class Event {
  constructor()
  {
    this._eventType = "";
    this._data = null;
    this._classFunction = null;
    this._lineNumber = null;
  }
  
  static get MSG_BINARY_FILE_LOADED() {return "MSG_BINARY_FILE_LOADED";}
  static get MSG_JSON_FILE_LOADED() {return "MSG_JSON_FILE_LOADED";}
  static get MSG_PROGRESS() {return "MSG_PROGRESS";}
  static get MSG_FILTER_CHANGE() {return "MSG_FILTER_CHANGE";}
  static get MSG_ERROR() {return "MSG_ERROR";}
  
  setContent(eventType,
             data,
             classFunction,
             lineNumber)
  {
    this._eventType = eventType;
    this._data = data;
    this._classFunction = classFunction;
    this._lineNumber = lineNumber;
  }
  
  get data()
  {
    return this._data;
  }
  
  get classFunction()
  {
    return this._classFunction;
  }
  
  get lineNumber()
  {
    return this._lineNumber;
  }
  
  get eventType()
  {
    return this._eventType;
  }
}

/*
 * base class
 */
class EventBase {
  
  constructor()
  {
  
  }
  
  /*
   *  Dispatch error event if one makes it here.
   */
  dispatchIfError(errorMsg, classFunction, lineNumber)
  {
    if(errorMsg)
      this.dispatch(Event.MSG_ERROR, errorMsg, classFunction, lineNumber);
  }
  
  dispatch(eventType, msg, classFunction, lineNumber)
  {
    if(msg)
    {
      let event = new Event();
      event.setContent(eventType, msg, classFunction, lineNumber);
      $(document).trigger(eventType, event);
    }
  }
}