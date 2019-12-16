import { Chromatogram } from '../..';
import { simple } from '../../../testFiles/examples';

test('calculateForMass: simple case', () => {
  simple.calculateForMass(200);
  expect(simple.getSerieNames()).toContain('ms200±0.5');
  expect(simple.getSerie('ms200±0.5').data).toStrictEqual([20, 0]);
  simple.calculateForMass(200, { slotWidth: 2 });
  expect(simple.getSerieNames()).toContain('ms200±1');
  expect(simple.getSerie('ms200±1').data).toStrictEqual([20, 21]);
});

test('Errors', () => {
  const chrom = new Chromatogram([1, 2, 3, 5, 6]);
  expect(() => {
    chrom.calculateForMass();
  }).toThrow('calculateForMass: targetMass must be defined and a number');
  expect(() => {
    chrom.calculateForMass(300);
  }).toThrow('calculateForMass: the mass serie must be defined');
});
