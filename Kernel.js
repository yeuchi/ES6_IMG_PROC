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
    static TYPE_LAPLACIAN() {return "TYPE_LAPLACIAN";}
    static TYPE_IDENTITY() {return "TYPE_IDENTITY";}
    static TYPE_BOKEH() {return "TYPE_BOKEH";}
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
 * A laplacian 3x3 sharpening kernel 
 */
class LaplacianKernel extends Kernel
{
    constructor()
    {
        super(3);
        this._values = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
        this._divider = 1;
    }
}

/*
 * A laplacian 3x3 sharpening kernel + identity
 *
 * - should have a multiplier to adjust the lapacian result before adding to identity.
 * - ( or is that only unsharpmask )
 */
class SharpenKernel extends Kernel
{
    constructor()
    {
        super(3);
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
                point)          // cartesian coordinates of this kernel applied on image
    {
        super();
        
        if(typeof point === 'undefined' || null == point)
            point = {x:0, y:0};
            
        this._point = point;    // try cartesian to start (may use polar for radial)
        
        if(width>1)
            this.createTransitionKernels(width);        
    }
    
    /*
     * Create and cache all kernels we will need to process the image
     */
    createTransitionKernels(width)
    {
        this._cachedKernels = [];
        // record shape (topology) -> linear interpolation... if custom
        // reduce in width until we reach identity.
        // incomplete here
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
 * Module:      BokehKernel
 *
 * Description: A colection of RECT functions with cartesian coordinates.
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class BokehKernel extends SuperKernel
{
    constructor(width,          // width of the kernel
                point)          // cartesian coordinates of this kernel applied on image
    {
        super();
        this._point = point;    // try cartesian to start (may use polar for radial)
        this.createTransitionKernels(width);
    }
    
    /*
     * Create and cache all kernels we will need to process the image
     */
    createTransitionKernels(width)
    {
        // for now with only bokeh, don't worry about topology, RECT function
        this._cachedValues = [];
        for(var i=1; i<width; i++)
        {
            if(i%2==1)
            {
                var kernelValues = [];
    
                for(var y=0; y<i*i; y++)
                    kernelValues.push(1);
                    
                this._cachedValues.push(kernelValues);
            }
        }
    }
    
    /*
     * Need to set all the attributes..
     */
    set transition(index)
    {
        if(index >=0 && index < this._cachedValues.length)
        {
            if(this._cachedValues && this._cachedValues.length>0)
            {
                this._values = this._cachedValues[index];
                this._divider = this._values.length;
            }
        }
    }
    
    get cacheCount()
    {
        return this._cachedValues.length;
    }
    
    get maxWidth()
    {
        if(this._cachedValues && this._cachedValues.length)
        {
            var length = 0;
            this._cachedValues.forEach(function(e){
                if(length > e.length)
                    length = e.length;
            });
            
            return (length==0)?0:Math.sqrt(length);
        }

        return 0;
    }
}

/*
 * Module:      KernelFactory
 *
 * Description: Software design Factory pattern.
 *              - Create kernel of types (sobel, blur, guassian, sharpen, custom, etc)
 *
 * Note:        User will be able to select kernel types from Kernel view; generate them here.
 *
 * Author(s):   C.T. Yeung
 *
 * Date:        05Jan16
 * 
 * Copyright (c) 2016 MSSE Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. See the AUTHORS file for names of contributors.
 */
class KernelFactory
{
    constructor()
    {
    }
    
    /*
     * Build and return kernel
     */
    static create(type,     // kernel type
                  width,    // kernel width
                  pos)      // cartesian coordinates (x,y) 
    {
        var kernel = null;
        switch(type)
        {
            case KernelEnum.TYPE_RECT:
                kernel = new BlurKernel(width);
                break;
            
            case KernelEnum.TYPE_SOBEL_X:
                break;
            
            case KernelEnum.TYPE_SOBEL_Y:
                break;
            
            case KernelEnum.TYPE_GUASSIAN:
                break;
            
            case KernelEnum.TYPE_SHARPEN:
                kernel = new SharpenKernel(width);
                break;
            
            case KernelEnum.TYPE_LAPLACIAN:
                kernel = new LaplacianKernel();
                break;
            
            case KernelEnum.TYPE_BOKEH:
                kernel = new BokehKernel(width, pos);
                break;
            
            case KernelEnum.TYPE_IDENTITY:
                kernel = new Kernel(width);
                break;
        }
        return kernel;
    }
}
