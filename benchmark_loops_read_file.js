const Benchmark = require('benchmark');
const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const fname = "file.txt";

const suite = new Benchmark.Suite;
const itemsLen = 10000;
const arr = new Array(itemsLen);
const precision = 3;

suite.add('Promise.all', () => promiseAllLoop())
    .add('Native Loop', () => nativeLoop())
    .add('Lodash ForEach', () => lodashForEach())
    .on('error', () => console.error(this.error))
    .on('complete', function () {
        const promiseAllInMs = this[0].stats.mean * 1000;
        const nativeLoopInMs = this[1].stats.mean * 1000;
        const lodashInMs = this[2].stats.mean * 1000;
        console.log(`Promise.all Average: ${promiseAllInMs.toFixed(precision)}`);
        console.log(`Native Loop Average: ${nativeLoopInMs.toFixed(precision)}`);
        console.log(`Lodash ForEach Average: ${lodashInMs.toFixed(precision)}`);
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });

const promiseAllLoop = async () => {
    await Promise.all(arr.map(async (value) => {
        await readFile(fname);
    }));
}

const nativeLoop = async () => {
    let i = 0;
    const len = arr.length;
    for (; i < len; ++i) {
        const value = arr[i];
        await readFile(fname);
    }
}

const lodashForEach = () => {
    _.forEach(arr, async (value) => {
        await readFile(fname);
    });
}
