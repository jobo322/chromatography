'use strict';

const rescaleTime = require('./rescaleTime');
const filter = require('./util/filter');
const serieFromArray = require('./serieFromArray');

/**
 * Class allowing to store time / ms (ms) series
 * It allows also to store simple time a trace
 * @class Chromatogram
 * @param {object|Array<number>} data - A GC/MS data format object or a time serie
 */
class Chromatogram {
    constructor(times, series) {
        this.series = {};
        this.times = [];
        if (times) {
            if (!Array.isArray(times)) {
                throw new TypeError('Times must be an array');
            }
            this.times = times;
        }
        if (series) {
            this.addSeries(series);
        }
    }

    get length() {
        return this.times.length;
    }


    /**
     * Find the serie giving the name
     * @param {string} name - name of the serie
     * @return {object} - Object with an array of data, dimensions of the elements in the array and name of the serie
     */
    getSerie(name) {
        return this.series[name];
    }

    getSerieNames() {
        return Object.keys(this.series);
    }

    /**
     * Delete a serie
     * @param {string} name - Name of the serie
     */
    deleteSerie(name) {
        if (!this.hasSerie(name)) {
            throw new Error(`The serie "${name}" does not exist`);
        } else {
            delete this.series[name];
        }
    }

    /**
     * Add new series
     * @param {object} series - Object with an array of data, dimensions of the elements in the array and name of the serie
     * @param {object} [options = {}] - Object with an array of data, dimensions of the elements in the array and name of the serie
     */
    addSeries(series, options = {}) {
        if (typeof series !== 'object' || Array.isArray(series)) {
            throw new TypeError('data must be an object containing arrays of series');
        }
        for (const key of Object.keys(series)) {
            this.addSerie(key, series[key], options);
        }
    }

    /**
     * Add a new serie
     * @param {string} name - Name of the serie to add
     * @param {Array} array - Object with an array of data, dimensions of the elements in the array and name of the serie
     * @param {object} [options = {}] - Options object
     * @param {boolean} [options.force = false] - Force replacement of existing serie
     */
    addSerie(name, array, options = {}) {
        if (this.hasSerie(name) && !options.force) {
            throw new Error(`A serie with name "${name}" already exists`);
        }
        if (this.times.length !== array.length) {
            throw new Error('The array size is not the same as the time size');
        }
        this.series[name] = serieFromArray(array);
    }

    /**
     * Returns true if the serie name exists
     * @param {string} name - Name of the serie to check
     * @return {boolean}
     */
    hasSerie(name) {
        return typeof this.series[name] !== 'undefined';
    }


    /**
     * Returns the first time value
     * @return {number} - First time value
     */
    get firstTime() {
        return this.times[0];
    }

    /**
     * Returns the last time value
     * @return {number} - Last time value
     */
    get lastTime() {
        return this.times[this.length - 1];
    }

    /**
     * Returns the time values
     * @return {Array<number>} - Time values
     */
    getTimes() {
        return this.times;
    }

    /**
     * Assign the time values
     * @param {Array<number>} times - New time values
     */
    setTimes(times) {
        this.times = times;
    }

    /**
     * Modifies the time applying the conversion function
     * @param {function(number)} conversionFunction
     * @return {Chromatogram}
     */
    rescaleTime(conversionFunction) {
        this.times = rescaleTime(this.times, conversionFunction);
        return this;
    }

    /**
     * Will filter the entries based on the time
     * You can either use the index of the actual time
     * @param {function(index, time)} callback
     * @return {Chromatogram}
     */
    filter(callback) {
        filter(this, callback);
        return this;
    }
}


Chromatogram.prototype.applyLockMass = require('./ms/applyLockMass');
Chromatogram.prototype.calculateTic = require('./ms/calculateTic');
Chromatogram.prototype.toJSON = require('./to/json');
Chromatogram.prototype.getPeaks = require('./util/getPeaks');

module.exports = Chromatogram;

