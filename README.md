# ES6_IMG_PROC
Ecmascript6 exercise: convolution, bokeh, scheimpflug, bmp decoder

This project is writting in an event-driven architecture.
There are sub-features which should be placed in separate modules, bmp-format decoding + convolution,bokeh,scheimpflug.

Windows bitmap decoder:  Decoder.js, WindowsBitmap.js, Canvaser.js

Decoder - take UT8BinaryArray input and coordinate between WindowsBitmap and output to Canvaser.
Canvaser - Handler to access and maintain canvas attributes and pixels.

WindowsBitmap - bmp format classes to parse pixels.
The following four sub-classes are responsible for parsing file sub-section.  No compression handling has been implemented.  This code is a work-in-progress copied/modified from a fully functional bmp decoder/encoder written in actionscript, 2009.  

1. WindowsBitmapFileHeader - BITMAP File-Header
2. WindowsBitmapHeader - Bitmap Info (Bitmap Info-header)
3. WindowsBitmapPalette - Bitmap palette (if exists)
4. WindowsBitmapData - BITMAP-Picture data

Convolution, bokeh, scheimflug: Kernel.js, ConvolutionFilter.js, Canvaser.js

Canvaser - access pixel data on canvas for convolution.
Kernel - define kernel type (blur, sharpen, lapacian, bokeh, custom, etc).
ConvolutionFilter - perform global spatial convolution.
BokehFilter - performs depth of field effect with a 'SuperKernel' object.
Scheimpflug - work-in-progress.

References:
"The file formats handbook" by Gunter Born, International Thomson computer press, 1995.  ISBN 1-850-32128-0
"Digital Image Processing" by Rafael C. Gonzalez, Richard E. Woods, Addison Wesley Publishing, 1992.  ISBN 0-201-50803-6
