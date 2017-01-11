/*
 * Module:      KernelsContainer
 *
 * Description: Holder 1-3 kernels and dynamically provide transitional kernels.
 */
class KernelsContainer
{
    constructor()
    {
        this._list = [];
        this._radialCache = {}; // hash table to cache transitional kernels for radia (key= distance, value=kernel)
    }
    
    /*
     * Create a default kernel for test
     */
    createDefault()
    {
        this._list = [];
      //  var kernel0 = KernelFactory.create(KernelFactory.TYPE_IDENTITY, 1, {x:250, y:250});
      //  this._list.push(kernel0);
        
        var kernel1 = KernelFactory.create(KernelFactory.TYPE_RECT, 5, {x:400, y:0});
        this._list.push(kernel1);
    }
    
    serialize()
    {
        
    }
    
    marshal(JSON)
    {
        
    }
    
    retrieveAt(index)
    {
        return this._list[index];
    }
    
    get kernelWidth()
    {
        // return width of 1st kernel
        if(this._list.length>0)
        {
            var kernel = this._list[0];
            return kernel.width;
        }
        return -1;
    }
    
    get length()
    {
        return this._list.length;
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
    
    static TYPE_RECT() {return "TYPE_RECT";}
    static TYPE_SOBEL_X() {return "TYPE_SOBEL_X";}
    static TYPE_SOBEL_Y() {return "TYPE_SOBEL_Y";}
    static TYPE_GUASSIAN() {return "TYPE_GUASSIAN";}
    static TYPE_SHARPEN() {return "TYPE_SHARPEN";}
    static TYPE_IDENTITY() {return "TYPE_IDENTITY";}
    
    static create(type,     // kernel type
                  width,    // kernel width
                  point)    // position on image (optional)
    {
        var kernel = null;
        switch(type)
        {
            case this.TYPE_RECT:
                kernel = new BlurKernel(width, point);
                return kernel;
            
            case this.TYPE_SOBEL_X:
                break;
            
            case this.TYPE_SOBEL_Y:
                break;
            
            case this.TYPE_GUASSIAN:
                break;
            
            case this.TYPE_SHARPEN:
                break;
            
            case this.TYPE_IDENTITY:
                kernel = new Kernel(width, point);
                return kernel;
        }
        return null;
    }
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
class Kernel // identity
{
    constructor(width, point)
    {
        // no matter how big the kernel, all values are 1 except center.
        this._values = [];
        for(var i=0; i<width*width; i++)
            this._values.push(0);
            
        this._divider = 1;
        var half = Math.floor(width/2.0);
        var index = half*width+half;
        this._values[index] = 1;
        
        if(typeof point === 'undefined' || null == point)
            point = {x:0, y:0};
            
        this._point = point;    // try cartesian to start (may use polar for radial)
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
    
    get position()
    {
        return this._point;
    }
    
    set position(point)
    {
        this._point = point;
    }
    
    /*
     * Write kernel out to JSON for persistence
     */
    serialize()
    {
        
    }
    
    /*
     * Parse kernel from JSON data
     */
    marshall(json)
    {
        
    }
    
    get width()
    {
        if(this._values && this._values.length > 0)
            return Math.sqrt(this._values.length);
        
        return 0;
    }
}

class BlurKernel extends Kernel
{
    constructor(width, point)
    {
        super(width, point);
        this._values = [];
        for(var i=0; i<width*width; i++)
            this._values.push(1);
        this._divider = width*width;
    }
}

class SharpenKernel extends Kernel
{
    constructor(width, point)
    {
        super(width, point);
        // need to implement
    }
}

class SobelKernel extends Kernel
{
    constructor()
    {
        super();
    }
}