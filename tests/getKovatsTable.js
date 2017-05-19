|
const {Chromatogram, getKovatsTable} = require('..');

// https://en.wikipedia.org/wiki/Cauchy_distribution
function lorentzian(x, x0 = 0, gamma = 1) {
    return (gamma * gamma) / (Math.PI * gamma * (gamma * gamma + (x - x0) * (x - x0)));
}

test('triplet', () => {
    const size = 30;
    const fourth = size / 4;
    let times = new Array(size);
    let tic = new Array(size);
    let ms = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
        tic[i] = lorentzian(i, fourth) + 2 * lorentzian(i, 2 * fourth) + lorentzian(i, 3 * fourth);
        ms[i] = [[29, 43, 57, 71, 85, 114], [1, 1, 1, 1, 1, 1]];
    }
    let chrom = new Chromatogram(times);
    chrom.addSerie('tic', tic);
    chrom.addSerie('ms', ms);

    const options = {
        heightFilter: 2,
        thresholdFactor: 0,
        maxNumberPeaks: 1000,
        groupWidth: 0
    };

    let table = getKovatsTable(chrom, options);
    expect(table.length).toEqual(1);
    expect(table[0].time).toEqual(15);
    expect(table[0].value).toEqual(800);
});