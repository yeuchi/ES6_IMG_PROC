/*
 * Module:      OptionEnum
 *
 * Description: Enum for combo box selection of filters.
 *              It is very close to KernelEnum; one will be removed eventually.
 *              (... When/if I implement everything...)
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class OptionEnum 
{
    constructor(){ }
    
    static get TYPE_BLUR() {return "BLUR";}
    static get TYPE_SHARPEN() {return "SHARPEN";}
    static get TYPE_LAPLACIAN() {return "LAPLACIAN";}
    static get TYPE_CUSTOM() {return "CUSTOM";}
    static get TYPE_BOKEH() {return "BOKEH";}
    static get TYPE_SCHEIMPFLUG() {return "SCHEIMPFLUG";}
    static get TYPE_MANY() {return "MANY";}
    
    /*
     * temporary mapping of optionEnum to KernelEnum
     * .. because I don't have all features.
     */
    static mapKernelEnum(optionEnum)
    {
        switch(optionEnum)
        {
            case OptionEnum.TYPE_BLUR:
                return KernelEnum.TYPE_RECT;
            
            case OptionEnum.TYPE_SHARPEN:
                return KernelEnum.TYPE_SHARPEN;
            
            case OptionEnum.TYPE_LAPLACIAN:
                return KernelEnum.TYPE_LAPLACIAN;
            
            // add custom and others ...
        }
        return null;
    }
}

/*
 * Module:      ComboView
 *
 * Description: Combo box view for the selection of filters.
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class ComboView extends EventBase
{
    constructor(parentElement, options)
    {
        super();
        this._parentElement = $("."+parentElement);
        this.createElement();
        this.initListeners();
        this.initOptions(options);
    }
    
    /*
     * Create the combo box
     */
    createElement()
    {
        // do I need to check for existing combo ?
        this._select = document.createElement("select");
        $(this._select).addClass("combo");
        $(this._parentElement).append(this._select);
    }
    
    /*
     * Append options into combo box
     */
    initOptions(list)
    {
        for(var i=0; i<list.length; i++)
        {
            var option = document.createElement("option");
            $(option).value = list[i];
            $(option).text(list[i]);
            $(this._select).append(option);
        }
    }
    
    /*
     * Listen to change events
     */
    initListeners()
    {
       $(this._select).off("change") 
                      .on("change", this.onChangeHandler); 
    }
    
    /*
     * Handler for user selection
     */
    onChangeHandler(e)
    {
        var filterType = e.target.value;
        super.dispatch(Event.MSG_FILTER_CHANGE, filterType, "ComboView::onChangeHandler()", 53);
    }
}