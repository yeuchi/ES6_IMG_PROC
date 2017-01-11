/*
 * Module:      WindowsBitmap
 *
 * Description: Bitmap encoder / decoder class
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

class WindowsBitmapHeader
{
    constructor()
    {
		this._lbiSize = null;	        // 4 bytes - length of bitmap header
		this._lbiWidth = -1;			// 4 bytes - width of image in pixels
		this._lbiHeight = -1;			// 4 bytes - heigth of image in pixels
		this._ibiPlanes = -1;			// 2 bytes - color planes for output device ( must be 1 )
		this._ibiBitCount = -1;			// 2 bytes - pixel color depth
		this._lbiCompression = -1;		// 4 bytes - compression type
		this._lbiSizeImage = -1;		// 4 bytes - size of compressed image data in bytes
		this._lbiXPelsPerMetre = -1;	// 4 bytes - picture elements per meter for x
		this._lbiYPelsPerMetre = -1;	// 4 bytes - picture elements per meter for y
		this._lbiClrUsed = -1;			// 4 bytes - number of colors used from the table
		this._lbiClrImportant = -1;	    // 4 bytes - colors important to display
        
        /* compression type
        BI_RGB			An uncompressed format. 
        BI_RLE8			A run-length encoded (RLE) format for bitmaps with 8 bits per pixel. The compression format is a 2-byte format consisting of a count byte followed by a byte containing a color index. For more information, see Bitmap Compression.  
        BI_RLE4			An RLE format for bitmaps with 4 bits per pixel. The compression format is a 2-byte format consisting of a count byte followed by two word-length color indexes. For more information, see Bitmap Compression. 
        BI_BITFIELDS	Specifies that the bitmap is not compressed and that the color table consists of three DWORD color masks that specify the red, green, and blue components, respectively, of each pixel. This is valid when used with 16- and 32-bit-per-pixel bitmaps. 
        BI_JPEG			Windows 98, Windows NT 5.0 and later: Indicates that the image is a JPEG image. 
        */
		
        /*
        ibiPlanes		 = 1;
        lbiCompression   = BI_RGB;
        lbiXPelsPerMetre = 3780;
        lbiXPelsPerMetre = 3780;
		*/
    }
    
    static get SIZE() { return 40;}
    static get BPP_1(){return 1;}
    static get BPP_4(){return 4;}
    static get BPP_8(){return 8;}
    static get BPP_16(){return 16;}
    static get BPP_24(){return 24;}
    
    static get BI_RGB(){ return 0;}
    static get BI_RLE8(){ return 1;}
    static get BI_RLE4(){ return 2;}
    static get BI_BITFIELDS(){ return 3;}
    static get BI_JPEG(){ return 4;}
			
	empty()
    {
        this._lbiSize = 0;
        this._lbiWidth = 0;
        this._lbiHeight = 0;
    }

	isEmpty()
    {
        return (this._lbiSize)? false:true;
    }
    
    get bitCount()
    {
        return this._ibiBitCount;
    }
    
    get width()
    {
        return this._lbiWidth;
    }
    
    get height()
    {
        return this._lbiHeight;
    }
    
    /*
     * Decode windows bitmap header
     */
    decode(bytes)
    {
        if ( bytes.length < WindowsBitmapHeader.SIZE + WindowsBitmapFileHeader.SIZE )
            return false;
        
        // big Endian order or little Endian order ?? check
			this._lbiSize 		    =  bytes[14] +
                                    (bytes[15] << 8) +
                                    (bytes[16] << (8*2)) +
                                    (bytes[17] << (8*3));
                                    
			this._lbiWidth 		    =  bytes[18] +
                                    (bytes[19] << 8) +
                                    (bytes[20] << (8*2)) +
                                    (bytes[21] << (8*3));
                                    
			this._lbiHeight 		=  bytes[22] +
                                    (bytes[23]  << 8) +
                                    (bytes[24] << (8*2)) +
                                    (bytes[25] << (8*3));
                                    
			this._ibiPlanes 		=  bytes[26] +
                                    (bytes[27] << 8);
            
			this._ibiBitCount 	    =  bytes[28] +
                                    (bytes[29] << 8);
            
			this._lbiCompression 	=  bytes[30] +
                                    (bytes[31] << 8) +
                                    (bytes[32] << (8*2)) +
                                    (bytes[33] << (8*3));
                                    
			this._lbiSizeImage 	   =  bytes[34] +
                                    (bytes[35] << 8) +
                                    (bytes[36] << (8*2)) +
                                    (bytes[37] << (8*3));
                                    
			this._lbiXPelsPerMetre =  bytes[38] +
                                    (bytes[39] << 8) +
                                    (bytes[40] << (8*2)) +
                                    (bytes[41] << (8*3));
                                                              
			this._lbiYPelsPerMetre =  bytes[42] +
                                    (bytes[43] << 8) +
                                    (bytes[44] << (8*2)) +
                                    (bytes[45] << (8*3));
                                    
			this._lbiClrUsed	   =  bytes[46] +
                                    (bytes[47] << 8) +
                                    (bytes[48] << (8*2)) +
                                    (bytes[49] << (8*3));
                                    
			this._lbiClrImportant  =  bytes[50] +
                                    (bytes[51] << 8) +
                                    (bytes[52] << (8*2)) +
                                    (bytes[53] << (8*3));
        
        if (this._lbiCompression > WindowsBitmapHeader.BI_RGB)
            return false;
	
    	return true;
    }
}

class WindowsBitmapFileHeader
{
    constructor()
    {
		this._ubfType1 = "B";		    // 1 byte - File id "B" 
		this._ubfType2 = "M";		    // 1 byte - File id "M"
		this._lbfSize = -1;			    // 4 bytes - File length in bytes
		this._iRes1 = -1;				// 2 bytes - reserved 0
		this._iRes2 = -1;				// 2 bytes - reserved 0
		this._lbfOffs = -1;			    // 4 bytes - offset from start of file to image data
    }
    
    static get SIZE() {return 14;}
    
    /**
     * Decode bmp file's bitmap file header.
     * Validate file format.
     * @param bytes
     * @return true if successful, false upon failure
     */		
	decode (bytes)	// bytes of the entire file
    {
        if (bytes.length < WindowsBitmapFileHeader.SIZE)
            return false;
        
        if (bytes[0] != 66)
            return false;
        
        if (bytes[1] != 77)
            return false;
        
        // file size
        this._lbfSize =  bytes[2];
        this._lbfSize += (bytes[3] << 8); 
        this._lbfSize += (bytes[4] << (8*2));  
        this._lbfSize += (bytes[5] << (8*3));
        
        if (this._lbfSize != bytes.length)
            return false;
        
        // image pixel offset
        this._lbfOffs =  bytes[10];
        this._lbfOffs += (bytes[11] << 8);
        this._lbfOffs += (bytes[12] << (8*2));
        this._lbfOffs += (bytes[13] << (8*3));
        
        if ( this._lbfOffs < (WindowsBitmapFileHeader.SIZE + WindowsBitmapHeader.SIZE))
            return false;
        
        return true;
    }
    
    get imagePixelOffset()
    {
        return this._lbfOffs;
    }
}

class WindowsBitmapPalette
{
    constructor(bmpHdr)
    {
        this._bmpHdr = bmpHdr;
    }
    
    decode(bytes)
    {
        return true;
    }
    
    empty()
    {
        this._palette = null;
    }
    
    isEmpty()
    {
        return (this._palette)?false:true;
    }
    
    decode(bytes)
    {
        if(null==this._bmpHdr)
            return false;
        
        // no palette
        if(this._bmpHdr.bitCount >= WindowsBitmapHeader.BPP_24)
            return true;
        
        var palSize = this.paletteSize(this._bmpHdr.bitCount);
        if ( bytes.length < (WindowsBitmapFileHeader.SIZE + 
								 WindowsBitmapHeader.SIZE + 
								 palSize)) 
								 return false;
        var palette = [];
			var index = 54;
			for ( var i=0; i<palSize; i++) {
				var clr = bytes[index+i];
				palette.push(clr);
			}
			return true;
    }
    
    bitDepth(paletteLength)
    {
        switch(paletteLength)
        {
            case this.paletteSize(WindowsBitmapHeader.BPP_1):
            return WindowsBitmapHeader.BPP_1;
            
            case this.paletteSize(WindowsBitmapHeader.BPP_4):
            return WindowsBitmapHeader.BPP_4;
            
            case this.paletteSize(WindowsBitmapHeader.BPP_8):
            return WindowsBitmapHeader.BPP_8;
            
            case this.paletteSize(WindowsBitmapHeader.BPP_16):
            return WindowsBitmapHeader.BPP_16;
        }
        return 0;
    }
    
    static paletteSize(bitDepth)
    {
        var palByteCount = 0;
        switch(bitDepth) {
            case WindowsBitmapHeader.BPP_1:
            palByteCount = (1<<1)*WindowsBitmapData.RGB_QUAD;
            break;
            
            case WindowsBitmapHeader.BPP_4:
            palByteCount = (1<<4)*WindowsBitmapData.RGB_QUAD;
            break;
            
            case WindowsBitmapHeader.BPP_8:
            palByteCount = (1<<8)*WindowsBitmapData.RGB_QUAD;
            break;
            
            case WindowsBitmapHeader.BPP_16:
            palByteCount = (1<<16)*WindowsBitmapData.RGB_QUAD;
            break;
            
            case WindowsBitmapHeader.BPP_24:
            palByteCount = 0;
            break;
        }
        return palByteCount; 
    }
}

/*
 * Module:      WindowsBitmapData
 *
 * Description: 1) decode bitmap image data
 *              2) bitblit pixels into DOM element canvas
 */
class WindowsBitmapData
{
    constructor(canvas,
                fileHdr,
                bmpHdr,
                bmpPal)
    {
        this._fileHdr = fileHdr;
        this._bmpHdr = bmpHdr;
        this._bmpPal = bmpPal;
        
        this._canvas = canvas;
    }
    
    static get RGB_QUAD(){return 4;}
    static get MASK_WIDTH(){return 8;}
    
    decode(bytes)
    {
        if (!this._fileHdr)
            return false;
        
		if (!this._bmpHdr)
            return false;
        
		if (!this._bmpPal)
            return false;
        
        if(this.isEmpty())
            return false;
        
        var context = this._canvas.getContext("2d");
        var imageData = context.createImageData(this._canvas.width, this._canvas.height);
        var retVal = false;
        
        // should pass in DOM element canvas to receive pixels
        switch(this._bmpHdr.bitCount)
        {
            case WindowsBitmapHeader.BPP_1:
            retVal = this.decode1bpp();
            break;
        
            case WindowsBitmapHeader.BPP_4:
            retVal = this.decode4bpp();
            break;
        
            case WindowsBitmapHeader.BPP_8:
            retVal = this.decode8bpp();
            break;
        
            case WindowsBitmapHeader.BPP_16:
            retVal = this.decode16bpp();
            break;
        
            case WindowsBitmapHeader.BPP_24:
            retVal = this.decode24bpp(bytes, imageData);
            break;
        }
        if(true==retVal)
        {
            // update canvas with pixel data
            context.putImageData(imageData, 0, 0);
            return true;
        }
        return false;
    }
    
    decode1bpp()
    {
        /*
        var offset:uint = fileHdr.lbfOffs;
        var lineWidth:uint = WinBmpImg.byteWidth(bmpHdr.lbiWidth, bmpHdr.ibiBitCount);
        var Y:int=bmpHdr.lbiHeight-1;
        
        for ( var y:int=0; y<bmpHdr.lbiHeight; y++) {
            var mask:uint = 0x80;
            for ( var x:int=0; x<bmpHdr.lbiWidth; x++) {
                var i:uint = x/8;
                var pixel:uint = bytes[offset+lineWidth*Y+i];
                var palIndex:int = (pixel&mask)?1:0;
                var clr:uint = bmpPal.palette[palIndex*4];
                clr += bmpPal.palette[palIndex*4+1]<<(8);
                clr += bmpPal.palette[palIndex*4+2]<<(8*2);
                bitmapData.setPixel(x,y, clr);
                mask = (mask>1)? mask>>1:0x80;
            }
            Y --;
        }
        */
        return true;
    }
    
    decode4bpp()
    {
        /*
        var offset:uint = fileHdr.lbfOffs;
        var lineWidth:uint = WinBmpImg.byteWidth(bmpHdr.lbiWidth, bmpHdr.ibiBitCount);
        var mask:uint;
        var pixel:uint;
        var palIndex:uint;
        var Y:int=bmpHdr.lbiHeight-1;
        
        for ( var y:int=0; y<bmpHdr.lbiHeight; y++) {
            for ( var x:int=0; x<bmpHdr.lbiWidth; x++) {
                var i:uint = x/2;
                pixel = bytes[offset+lineWidth*Y+i];
                if (x%2) {
                    mask = 240;
                    palIndex = ( pixel & mask ) >> 4;						
                }
                else {
                    mask = 15;
                    palIndex = ( pixel & mask );	
                }
                var clr:uint = bmpPal.palette[palIndex*4];
                clr += bmpPal.palette[palIndex*4+1]<<(8);
                clr += bmpPal.palette[palIndex*4+2]<<(8*2);
                bitmapData.setPixel(x,y, clr);
            }
            Y --;
        } */
        return true;
    }
    
    decode8bpp()
    {
        /*
        var offset:uint = fileHdr.lbfOffs;
        var lineWidth:uint = WinBmpImg.byteWidth(bmpHdr.lbiWidth, bmpHdr.ibiBitCount);
        var palIndex:uint;
        
        var Y:int=bmpHdr.lbiHeight-1;
        for ( var y:int=0; y<bmpHdr.lbiHeight; y++) {
            for ( var x:int=0; x<bmpHdr.lbiWidth; x++) {
                palIndex = bytes[offset+lineWidth*Y+x];
                var clr:uint = bmpPal.palette[palIndex*4];
                clr += bmpPal.palette[palIndex*4+1]<<(8);
                clr += bmpPal.palette[palIndex*4+2]<<(8*2);
                bitmapData.setPixel(x,y, clr);
            }
            Y --;
        } */
        return true;
    }
    
    decode16bpp()
    {
        return true;
    }
    
    decode24bpp(src,      // source
                des)      // destination
    {
        var offset = this._fileHdr.imagePixelOffset;
        var lineWidth = this.byteWidth(this._bmpHdr.width, this._bmpHdr.bitCount);
        
        var i = 0;
        var Y = 0;
        
        var height = (this._bmpHdr.height<this._canvas.height)?this._bmpHdr.height:this._canvas.height;
        var width = (this._bmpHdr.width<this._canvas.width)?this._bmpHdr.width:this._canvas.width;
        
        for ( var y = height-1; y >= 0; y--)
        //for(var y=0; y<height; y++)
        {
            for ( var x = 0; x < width; x++)
            {
                var index = ( this._canvas.width * y + x ) * 4;
                des.data[index] = src[offset+i+2];
                des.data[index+1] = src[offset+i+1];
                des.data[index+2] = src[offset+i+0];
                des.data[index+3] = 255;
                i += 3;
            }
            i = Y * lineWidth;
            Y++;
        }
        return true;
    }
    
    /*
     * Calculate number of bytes for 1 row of pixels.
     *
     * - Windows bitmap data is 32 bit bound per row.
     *   (Add padding as needed). 
     */
    byteWidth(pixelWidth, // image width in pixels
              bitDepth)	  // bit depth

    {
        var retVal;
        var r = (pixelWidth * bitDepth) % 32;
        if (r) {
            retVal = pixelWidth * bitDepth / 32;
            retVal += 1;
            retVal *= 4;
            return retVal;
        }
        else
            return pixelWidth * bitDepth / 8;
    }
    
    empty()
    {
        this._canvas = null;
    }
    
    isEmpty()
    {
        return (this._canvas)?false:true;
    }
}

class WindowsBitmap
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._fileHdr = new WindowsBitmapFileHeader();
        this._bmpHdr = new WindowsBitmapHeader();
        this._bmpPal = new WindowsBitmapPalette(this._bmpHdr);
        this._bmpImg = new WindowsBitmapData(this._canvas, this._fileHdr, this._bmpHdr, this._bmpPal);
    }
    
    /*
     * Verify windows bitmap format
     */
    static hasBM(bytes)
    {
        if (bytes[0] != 66) return false;
        if (bytes[1] != 77) return false;
        
        return true;
    }
    
    /*
     * Decode windows bitmap 
     * - check isValid()
     * - decompress if necessary
     */
    decode(bytes)
    {
        if(this._fileHdr.decode(bytes))
            if(this._bmpHdr.decode(bytes))
                if(this._bmpPal.decode(bytes))
                    if(this._bmpImg.decode(bytes))
                        return true;
        return false;
    }
    
    get palette()
    {
        return null;
    }
    
    get pixelWidth()
    {
        if (!this._bmpHdr)
            return -1;
        
        return this._bmpHdr.width;
    }
    
    get pixelHeight()
    {
        if (!this._bmpHdr)
            return -1;
        
        return this._bmpHdr.height;
    }
    
    get bitDepth()
    {
        if (!this._bmpHdr)
            return -1;
        
		return this._bmpHdr.bitCount;
    }
    
    get compressionMethod()
    {
        if(!this._bmpPal)
            return -1;
		
        return 1;
        //return this._bmpPal.palette;
    }
}