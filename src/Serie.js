'use strict';

/**
 * Class allowing to manage a Serie
 */
class Serie {
    constructor(array, dimension, options={}) {
        let {
            meta = {}
        } = options;
        if (new.target === Serie) {
            throw new Exception('You need to create either a 1D or 2D serie');
        }
        this.data=array;
        this.dimension=dimension;
        this.meta=meta;
    }

    toJSON() {
        return {
            data: this.data,
            meta: this.meta
        };
    }

    /**
     * Specify an array of index to keep
     * @param array
     */
    keep(array) {
        let newData=[];
        for (let i of array) {
            newData.push(this.data[i])
        }
        this.data=newData;
    }


}

module.exports = Serie;
