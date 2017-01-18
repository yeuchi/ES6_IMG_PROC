/*
 * Module:      Canvaser
 *
 * Description: Image class which holds 
 *              - probably too slow for ordinary images... conceptual demonstration only.
 *              - good for Adobe Flash like effect 
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 *        
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class Canvaser
{
    constructor(canvas)
    {
        this.initContextData(canvas);
        this._type = null;
        this._filePath = "";
    
        this._pixelWidth = -1;
        this._pixelHeight = -1;
        this._bitDepth = -1;
    }
    
    initContextData(canvas)
    {
        if(typeof this._canvas === 'undefined' || null == this._canvas)
        {
            this._canvas = canvas;
            this._context = this._canvas.getContext("2d");
        }

        if(this._context && this._canvas)
            this._imageData = this._context.getImageData(0,0,this._canvas.width, this._canvas.height);
    }
    
    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.initContextData(this._canvas);
    }
    
    get canvas()
    {
        return this._canvas;
    }
    
    /*
     * Get pixel RGB value
     */
    getPixel(x, y)
    {
        // check x, y
        var index = ( this._canvas.width * y + x ) * 4;
        var color = {B:this._imageData.data[index],
                     G:this._imageData.data[index+1],
                     R:this._imageData.data[index+2],
                     A:this._imageData.data[index+3]};
        return color;
    }
    
    /*
     * Set 1 pixel RGB value
     * - assume context is the entire image
     */
    setPixel(x, y, color)
    {
        // check x, y
        // check value to have R, G, B
        var index = ( this._canvas.width * y + x ) * 4;
        this._imageData.data[index] = color.B;
        this._imageData.data[index+1] = color.G;
        this._imageData.data[index+2] = color.R;
        this._imageData.data[index+3] = color.A;
    }
    
    updateCanvas()
    {
        this._context.putImageData(this._imageData, 0, 0);
    }
    
    get filePath()
    {
        return this._filePath;
    }

    set filePath(str)
    {
        this._filePath = str;
    }
    
    get width()
    {
        return this._pixelWidth;
    }
    
    get height()
    {
        return this._pixelHeight;
    }
    
    get bitDepth()
    {
        return this._bitDepth;
    }
    
    set width(num)
    {
        this._pixelWidth = num;
    }
    
    set height(num)
    {
        this._pixelHeight = num;
    }
    
    set bitDepth(num)
    {
        this._bitDepth = num;
    }
}