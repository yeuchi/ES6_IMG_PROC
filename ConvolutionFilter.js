/*
 * Module:      FilterEnum
 *
 * Description: types of filters (convolution, bokeh, scheimpflug)
 *       
 * Author(s):   C.T. Yeung
 *
 * Date:        16Jan16
 *             
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class FilterEnum
{
    constructor() {}

    static get TYPE_CONVOLUTION() {return "TYPE_CONVOLUTION";}     
    static get TYPE_BOKEH() {return "TYPE_BOKEH";}     
    static get TYPE_SCHEIMPFLUG() {return "TYPE_SCHEIMPFLUG";}     
}

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
    constructor()   // canvas size
    {
        super();
    }
    
    apply(src,      // image pixels source
          des,      // image pixels destination
          kernel)   // bokeh kernel 
    {
        // need to check on this
        var Half = Math.floor(kernel.width/2.0);
        var height = src.height - Half;
        var width = src.width - Half;
        
        // calculate max distance
        this.calMaxDistance(kernel, {width:src.width, height:src.height});
        
        // iterate image
        for(var yy=Half; yy<height; yy++)
        {
            for(var xx=Half; xx<width; xx++)
            {
                // iterate kernel over image
                var integral = {R:0, G:0, B:0};
                
                // determine size of filter
                this.calKernelSize(kernel, {x:xx, y:yy});
                
                var half = Math.floor(kernel.width/2.0);
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
    
    calKernelSize(kernel,   // kernel 
                  pos)      // current position
    {
        // find distance between current and center
        var d = this.distance(kernel, pos);
        
        // compare with max and index kernel value set
        var num = Math.round(d / this._maxDistance*kernel.cacheCount);
        var index = (num<kernel.cacheCount)?num:kernel.cacheCount-1;
        kernel.transition = index;
    }
    
    /*
     * Find max distance
     */
    calMaxDistance(kernel,  // kernel
                   size)    // canvas size
    {
        var list = [];
        list.push(this.distance(kernel, {x:0, y:0}));
        list.push(this.distance(kernel, {x:0, y:size.height}));
        list.push(this.distance(kernel, {x:size.width, y:0}));
        list.push(this.distance(kernel, {x:size.width, y:size.height}));

        this._maxDistance = 0;
        for(var i=0; i<4; i++)
        {
            if(list[i]>this._maxDistance)
                this._maxDistance = list[i];
        }
    }
    
    distance(kernel, point)
    {
        var xx = point.x - kernel.position.x;
        var yy = point.y - kernel.position.y;
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
 * Module:      FilterFactory
 *
 * Description: Factory pattern to create convolution, bokeh, etc.
 * 
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class FilterFactory
{
    constructor() {}
    
    static create(type)
    {
        var filter = null;
        
        switch(type)
        {
            case FilterEnum.TYPE_BOKEH:
                filter = new BokehFilter();
                break;
            
            case FilterEnum.TYPE_CONVOLUTION:
                filter = new ConvolutionFilter();
                break;
        }
        
        return filter;
    }
}
