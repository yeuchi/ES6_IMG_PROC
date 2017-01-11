/*
 * Module:      ConvolutionFilter
 *
 * Description: Perform convolution on raster pictorial image
 *              - 1 kernel is standard (fo-dough-shop)
 *              - 2 kernels can produce bokeh and other radial effects.
 *              - 3 kernels can produce Scheimpflug and other plane effects common in large format cameras.
 *              
 * Notes:       We are not limited to blur or sharpen (for example: derivative transition to normal).
 *              This is a good candidate for a library of tweening effect filters.
 *              Focus on Web (small) and not massive commercial, print, medical or astronomical images.
 *
 * Experiment: allow multiple kernels assigned to image.
 *              - dynamically calculate transitional kernels.
 *              *** implement 'ES6 module' for this
 *              *** will be slow compared to C# or C++ parallel implementation
 *              *** should use WebGL for performance
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        29Dec16
 *
 * Reference:   Digital Image Processing by Rafael C. Gonzales, 1993 Addison-Wesley Publishing.  ISBN 0-201-50803-6
 *              Class notes from D.I.P. course by Dr. Rao, Rochester Institute of Technology.
 *              
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class ConvolutionFilter extends EventBase {

    constructor(kernelsContainer)
    {
        super();
        this._kernelsContainer = kernelsContainer; // support many kernels for transition effects
    }
    
    static get TYPE_GLOBAL() { return "TYPE_GLOBAL"; }  // 1 kernel
    static get TYPE_RADIAL() { return "TYPE_RADIAL"; }  // 2 kernels
    static get TYPE_PLANE() { return "TYPE_PLANE"; }    // 3 kernels
    
    apply(src,  // image pixels source
          des)  // image pixels destination
    {
        var half = Math.floor(this._kernelsContainer.kernelWidth/2.0);
        var height = src.height - half;
        var width = src.width - half;
        
        // iterate image
        for(var yy=half; yy<height; yy++)
        {
            for(var xx=half; xx<width; xx++)
            {
                var kernel = this.calKernel({x:xx, y:yy});
                
                // iterate kernel over image
                var integral = {R:0, G:0, B:0};
                var start = -half;
                for (var y=start; y<=half; y++)
                {
                    for(var x=start; x<=half; x++)
                    {
                        var pixel = src.getPixel(xx+x,yy+y);
                        var index = (y+half) * kernel.width + (x+half);
                        integral.R += kernel.values[index] * pixel.R;
                        integral.G += kernel.values[index] * pixel.G;
                        integral.B += kernel.values[index] * pixel.B;
                    }
                }
                integral.R /= kernel.divider;
                integral.G /= kernel.divider;
                integral.B /= kernel.divider;
                integral.A = 255;

                // set destination pixel value
                des.setPixel(xx,yy, integral);
            }
        }
        des.updateCanvas();
    }
    
    /*
     * Dynamic calculation of transition kernel if multiple kernels exist.
     * - might be able to cache some computed kernels ?
     */
    calKernel(point)
    {
       switch (this._kernelsContainer.length)
       {
        case 0:
            return [1]; // return identity
        
        case 1:
            return this._kernelsContainer.retrieveAt(0);
        
        case 2: // assume radial
            return this.calRadial(point);
            
        case 3: // assume plane
        default:// not supporting more kernels for now.
            return this.calPlane(point);
       }
    }
    
    /*
     * 2 kernels -- assume a radial effect
     */
    calRadial(point)
    {
        // cache distance here
        if(typeof this._disCircle === 'undefined' || null==this._disCircle)
            this._disCircle = this._kernelsContainer.distanceFromIndexes(0,1);
            
        // cache kernel0
        if(typeof this._ptCenter === 'undefined' || null==this._ptCenter)
            this._ptCenter = this._kernelsContainer.retrieveAt(0).position;
    
        // calculate distance (x,y) from kernel0
        var dis = this._kernelsContainer.distanceFromPoint(0, point)
        
        switch(dis)
        {
            
        }
        // point outside
        if(dis > this._disCircle)
            return this._kernelsContainer.retrieveAt(1);

        // point inside circle -- interpolate kernel
        return this._kernelsContainer.retrieveAt(0);
    }
    
    /*
     * 3 kernels -- assume a plane by 1st two points
     */
    calPlane(point)
    {
        
    }
}
