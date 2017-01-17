class BrowseControl extends EventBase
{
    constructor(element)
    {
        super();
        this._element = element;
        this.initHandler();
    }
    
    initHandler()
    {
        $(this._element).bind('change', this.onSelectHandler);
    }
    
    /*
     * File browse control selection changed
     */
    onSelectHandler(event)
    {
        var errorMsg = "unknown error";
        try
        {
            var files = event.target.files; // FileList object
            var f = files[0];
    
            // check file extension
            
            if(f.type.indexOf("/bmp")>0)
            {
                var reader = new FileReader();
            
                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    var result = theFile.target.result;		// my raw file data
                    //var name = theFile.name;
                    var data = new Uint8Array(result);
                    var eb = new EventBase();
                    eb.dispatch(Event.MSG_BINARY_FILE_LOADED, data, "BrowseControl::onSelectHandler()", 50);
                });
            
                // Read in the image file as a data URL.
                //reader.readAsText(f);
                reader.readAsArrayBuffer(f);
                return;
            }
            else
                errorMsg = "Try a Windows bitmap";
        }
        catch(e)
        {
           errorMsg += e.toString(); 
        }
        super.dispatch(Event.MSG_ERROR, errorMsg, "BrowseControl::onSelectHandler()", 37);
    }
}