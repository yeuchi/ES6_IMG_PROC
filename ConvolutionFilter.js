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

    constructor()
    {
        super();
    }
    
    apply(src,      // image pixels source
          des,      // image pixels destination
          kernel)   // 1 global kernel to apply
    {
        var half = Math.floor(kernel.width/2.0);
        var height = src.height - half;
        var width = src.width - half;
        
        // iterate image
        for(var yy=half; yy<height; yy++)
        {
            for(var xx=half; xx<width; xx++)
            {
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
}

/*
 * Module:      CustomMultiKernelFilter
 *
 * Description: Perform convolution on raster pictorial image
*       
 * Notes:       We are not limited to blur or sharpen (for example: derivative transition to normal).
 *              This is a good candidate for a library of tweening effect filters.
 *              Focus on Web (small) and not massive commercial, print, medical or astronomical images.
 *
 * Experiment:  Allow user to input N kernels and specify their cartesian coordinates.
 *              - interpolate kernels in between for smooth transitions.
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        16Jan16
 *             
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class CustomMultiKernelFilter extends ConvolutionFilter
{
    constructor()
    {
        
    }
    
    static get TYPE_RADIAL() { return "TYPE_RADIAL"; }  // 2 kernels
    static get TYPE_PLANE() { return "TYPE_PLANE"; }    // 3 kernels
    
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
}

/*
 * Module:      BokehFilter
 *
 * Description: 2 kernels.
 *              - kernel #1 is center of Bokeh
 *              - kernel #1->#3 mark area of increasing blur
 *                (may want to define the transition with a curve?)
 *                
 * Author(s):   C.T. Yeung
 *
 * Date:        16Jan16
 *             
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class BokehFilter extends ConvolutionFilter
{
    constructor()
    {
        
    }
    
    /*
     * 2 kernels -- assume a radial effect
     */
    calRadial(point)
    {
        // cache distance here
        if(typeof this._disCircle === 'undefined' || null==this._disCircle)
            this._disCircle = this.distanceFromIndexes(0,1);
            
        // cache kernel0
        if(typeof this._ptCenter === 'undefined' || null==this._ptCenter)
            this._ptCenter = this._kernelsContainer.retrieveAt(0).position;
    
        // calculate distance (x,y) from kernel0
        var dis = this.distanceFromPoint(0, point)
        
        switch(dis)
        {
            
        }
        // point outside
        if(dis > this._disCircle)
            return this._kernelsContainer.retrieveAt(1);

        // point inside circle -- interpolate kernel
        return this._kernelsContainer.retrieveAt(0);
    }
    
    distanceFromIndexes(index0, index1)
    {
        var kernel0 = this._list[index0];
        var kernel1 = this._list[index1];
        
        var xx = kernel0.position.x - kernel1.position.x;
        var yy = kernel0.position.y - kernel1.position.y;
        var dis = Math.sqrt(xx * xx + yy - yy);
        return dis;
    }
    
    distanceFromPoint(index0, point)
    {
        var kernel0 = this._list[index0];
        
        var xx = point.x - kernel0.position.x;
        var yy = point.y - kernel0.position.y;
        var dis = Math.sqrt(xx * xx + yy - yy);
        return dis;
    }
}

/*
 * Module:      ScheimpflugFilter
 *
 * Description: Scheimpflug principle defines in focus plane by
 *              intersection of 3 planes (subject, lens, image).
 *              This is selective filtering by plane selection
 *
 *              Kernels #1 + #2 define a plane.
 *              Kernel #3 define another axis.
 *                
 * Author(s):   C.T. Yeung
 *
 * Date:        16Jan16
 *             
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class ScheimpflugFilter extends ConvolutionFilter
{
    constructor()
    {
        
    }
    
    /*
     * 3 kernels -- assume a plane by 1st two points
     */
    calPlane(point)
    {
        
    }
}
