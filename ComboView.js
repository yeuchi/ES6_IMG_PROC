class OptionEnum 
{
    constructor(){ }
    
    static get TYPE_BLUR() {return "BLUR";}
    static get TYPE_SHARPEN() {return "SHARPEN";}
    static get TYPE_CUSTOM() {return "CUSTOM";}
    static get TYPE_BOKEH() {return "BOKEH";}
    static get TYPE_SCHEIMPFLUG() {return "SCHEIMPFLUG";}
    static get TYPE_MANY() {return "MANY";}
    
    static mapKernelEnum(optionEnum)
    {
        switch(optionEnum)
        {
            case OptionEnum.TYPE_BLUR:
                return KernelEnum.TYPE_RECT;
            
            case OptionEnum.TYPE_SHARPEN:
                return KernelEnum.TYPE_SHARPEN;
        }
        return null;
    }
}

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
    
    createElement()
    {
        // create select
        this._select = document.createElement("select");
        $(this._select).addClass("combo");
        $(this._parentElement).append(this._select);
    }
    
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
    
    initListeners()
    {
       $(this._select).off("change") 
                      .on("change", this.onChangeHandler); 
    }
    
    onChangeHandler(e)
    {
        var filterType = e.target.value;
        super.dispatch(Event.MSG_FILTER_CHANGE, filterType, "ComboView::onChangeHandler()", 53);
    }
}