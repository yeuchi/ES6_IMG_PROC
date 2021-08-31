# ES6_IMG_PROC
Ecmascript6 exercise: convolution, bokeh, scheimpflug, bmp decoder \
Page : https://yeuchi.github.io/ES6_IMG_PROC/index.html

Boken \
<img width="700" src="https://user-images.githubusercontent.com/1282659/131425001-716f76ca-cf41-4544-b8a4-53889f960ecf.png">

Laplacian \
<img width="700" src="https://user-images.githubusercontent.com/1282659/131425006-17b78531-7396-4cc9-bd53-ac4d4c8e3103.png">

Sharpen \
<img width="700" src="https://user-images.githubusercontent.com/1282659/131425010-65775088-5d73-4d44-bd75-3a5f64d74983.png">


Use:

// create source and destination canvasers (pass in canvas id in constructor)
var src = new Canvaser("canvas0");
var des = new Canvaser("canvas1");

// give a center point (x,y) in pixel unit on the canvas.
var center = {x:src.width/2+60, y:src.height/2+20};

// create a kernel, see KernelEnum class for types
// give it a kernel width (example: 3 -- for a 3x3 kernel -- must be odd number)
var kernel = KernelFactory.create(kernelEnum.TYPE_BOKEH, 21, center);

// create a filter, see FilterEnum class for types
var filter = FilterFactory.create(FilterEnum.TYPE_CONVOLUTION);

filter.apply(src, des, kernel);


#### Windows bitmap decoder:
Decoder.js, WindowsBitmap.js, Canvaser.js

Decoder - take UT8BinaryArray input and coordinate between WindowsBitmap and output to Canvaser.

Canvaser - Handler to access and maintain canvas attributes and pixels.

WindowsBitmap - bmp format classes to parse pixels.
The following four sub-classes are responsible for parsing file sub-section.  No compression handling has been implemented.  This code is a work-in-progress copied/modified from a fully functional bmp decoder/encoder written in actionscript, 2009.  

1. WindowsBitmapFileHeader - BITMAP File-Header
2. WindowsBitmapHeader - Bitmap Info (Bitmap Info-header)
3. WindowsBitmapPalette - Bitmap palette (if exists)
4. WindowsBitmapData - BITMAP-Picture data

#### Convolution, bokeh, scheimflug:
Kernel.js, ConvolutionFilter.js, Canvaser.js

Canvaser - access pixel data on canvas for convolution.

Kernel - define kernel type (blur, sharpen, lapacian, bokeh, custom, etc).

ConvolutionFilter - perform global spatial convolution.

BokehFilter - performs depth of field effect with a 'SuperKernel' object.

Scheimpflug - work-in-progress.

#### References:

"The file formats handbook" by Gunter Born, International Thomson computer press, 1995.  ISBN 1-850-32128-0

"Digital Image Processing" by Rafael C. Gonzalez, Richard E. Woods, Addison Wesley Publishing, 1992.  ISBN 0-201-50803-6
