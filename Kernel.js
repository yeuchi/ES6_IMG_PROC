/*
 * Module:      KernelEnum
 *
 * Description: Enum class for convolution kernels
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class KernelEnum
{
    constructor(){}
    
    static TYPE_RECT() {return "TYPE_RECT";}
    static TYPE_SOBEL_X() {return "TYPE_SOBEL_X";}
    static TYPE_SOBEL_Y() {return "TYPE_SOBEL_Y";}
    static TYPE_GUASSIAN() {return "TYPE_GUASSIAN";}
    static TYPE_SHARPEN() {return "TYPE_SHARPEN";}
    static TYPE_IDENTITY() {return "TYPE_IDENTITY";}
}

/*
 * Module:      Kernel
 *
 * Description: A base convolution kernel class -- identity by default
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class Kernel
{
    constructor(width)
    {
        // this is an identity kernel by default -- regardless of width
        this._values = [];
        for(var i=0; i<width*width; i++)
            this._values.push(0);
            
        this._divider = 1;
        var half = Math.floor(width/2.0);
        var index = half*width+half;
        this._values[index] = 1;
    }
    
    get divider()
    {
        return this._divider;
    }
    
    set divider(denominator)
    {
        this._divider = denominator;
    }
    
    get values()
    {
        return this._values;
    }
    
    set values(list)
    {
        this._values = list;
    }
        
    get width()
    {
        if(this._values && this._values.length > 0)
            return Math.sqrt(this._values.length);
        
        return 0;
    }
}

/*
 * A RECT function -- maximum blurring kernel
 */
class BlurKernel extends Kernel
{
    constructor(width)
    {
        super(width);
        this._values = [];
        for(var i=0; i<width*width; i++)
            this._values.push(1);
        this._divider = width*width;
    }
}

/*
 * A lapacian 3x3 sharpening kernel
 */
class SharpenKernel extends Kernel
{
    constructor()
    {
        super(width);
        this._values = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        this._divider = 1;
    }
}

/*
 * Module:      SuperKernel
 *
 * Description: A super kernel class with the following additional attributes
 *              - has cartesian coordinates (x,y)
 *              - has cached transition kernels from itself to identity
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class SuperKernel extends Kernel
{
    constructor(width,          // width of the kernel
                point,          // cartesian coordinates of this kernel applied on image
                transitionStep) // from kernel to identity, steps in percent represent the number of cached kernels.
    {
        super();
        
        if(typeof point === 'undefined' || null == point)
            point = {x:0, y:0};
            
        this._point = point;    // try cartesian to start (may use polar for radial)
        
        this._transitionStep = (typeof transitionStep != "undefined" && null != transitionStep) ? transitionStep:0;
        if(width>1)
            this.createTransitionKernels();        
    }
    
    /*
     * Create and cache all kernels we will need to process the image
     */
    createTransitionKernels()
    {
        this._kernelCache = [];
        for(var i=0; i<this._transitionStep; i++)
        {
            // create transition kernels to identity
            
            // record shape (topology) -> linear interpolation.
            // reduce in width until we reach identity.
        }
    }
    
    get position()
    {
        return this._point;
    }
    
    set position(point)
    {
        this._point = point;
    }
}

/*
 * Module:      KernelFactory
 *
 * Description: Software design Factory pattern.
 *              - Create kernel of types (sobel, blur, guassian, sharpen, custom, etc)
 *
 * Note:        User will be able to select kernel types from Kernel view; generate them here.           
 */
class KernelFactory
{
    constructor()
    {
    }
    
    static create(type,     // kernel type
                  width)    // kernel width
    {
        var kernel = null;
        switch(type)
        {
            case KernelEnum.TYPE_RECT:
                kernel = new BlurKernel(width);
                return kernel;
            
            case KernelEnum.TYPE_SOBEL_X:
                break;
            
            case KernelEnum.TYPE_SOBEL_Y:
                break;
            
            case KernelEnum.TYPE_GUASSIAN:
                break;
            
            case KernelEnum.TYPE_SHARPEN:
                kernel = new SharpenKernel(width);
                break;
            
            case KernelEnum.TYPE_IDENTITY:
                kernel = new Kernel(width);
                return kernel;
        }
        return null;
    }
}
