/*
 * Module:      Decoder
 *
 * Description: Decode incoming binary data into canvas data and image object
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 *
 * Reference:   The File Formats Handbook by Gunter Born, 1995 International Thomson Computer Press. ISBN 1-850-32128-0
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
 
 class Decoder
 {
    constructor()
    {
    
    }
    
    static get TYPE_PNG() {return "png";} // not yet supported
    static get TYPE_BMP() {return "bmp";}
    
    static marshal(bytes,  // source
                   image) // destination
    {
        if(WindowsBitmap.hasBM(bytes))
        {
            this._type = this.TYPE_BMP;
            this._decoder = new WindowsBitmap(image.canvas);
            var retVal = this._decoder.decode(bytes);
            if(true==retVal)
            {
                image.initContextData();
                image.width = this._decoder.pixelWidth;
                image.height = this._decoder.pixelHeight;
                image.bitDepth = this._decoder.bitDepth;
                return image;
            }
        }
        
        else
        {
            // handle png 
        }
        return image;
    }
 }