import { describe, it, expect, beforeEach } from 'vitest';
import { TankCalculator } from '../../../src/domain/calculations/TankCalculator.js';

describe('TankCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new TankCalculator();
  });

  describe('calculateVolume', () => {
    it('calculates volume correctly for standard tank', () => {
      const volume = calculator.calculateVolume(48, 24, 24);
      // 48 * 24 * 24 cubic inches = 27648 cubic inches
      // 27648 * 2.54^3 / 1000 = ~1150 liters
      expect(volume).toBeGreaterThan(1000);
      expect(volume).toBeLessThan(1200);
    });

    it('calculates volume correctly for small tank', () => {
      const volume = calculator.calculateVolume(10, 10, 10);
      // 10 * 10 * 10 cubic inches = 1000 cubic inches
      // 1000 * 2.54^3 / 1000 = ~16.4 liters
      expect(volume).toBeCloseTo(16.4, 1);
    });

    it('throws error for negative dimensions', () => {
      expect(() => calculator.calculateVolume(-10, 20, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, -20, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, 20, -30)).toThrow();
    });

    it('throws error for zero dimensions', () => {
      expect(() => calculator.calculateVolume(0, 20, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, 0, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, 20, 0)).toThrow();
    });

    it('throws error for non-numeric dimensions', () => {
      expect(() => calculator.calculateVolume('abc', 20, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, null, 30)).toThrow();
      expect(() => calculator.calculateVolume(10, 20, undefined)).toThrow();
    });
  });

  describe('convertToGallons', () => {
    it('converts liters to gallons correctly', () => {
      const gallons = calculator.convertToGallons(100);
      // 100 liters / 3.78541 = ~26.4 gallons
      expect(gallons).toBeCloseTo(26.4, 1);
    });

    it('converts 1 liter correctly', () => {
      const gallons = calculator.convertToGallons(1);
      expect(gallons).toBeCloseTo(0.264, 3);
    });
  });

  describe('calculateSurfaceArea', () => {
    it('calculates surface area correctly', () => {
      const area = calculator.calculateSurfaceArea(48, 24, 24);
      expect(area.topSqIn).toBe(1152); // 48 * 24
      expect(area.topSqFt).toBeCloseTo(8, 1); // 1152 / 144
    });
  });

  describe('adjustForDisplacement', () => {
    it('reduces volume by displacement percentage', () => {
      const originalVolume = 100;
      const adjustedVolume = calculator.adjustForDisplacement(originalVolume);
      // Should reduce by 10%
      expect(adjustedVolume).toBeCloseTo(90, 1);
    });
  });

  describe('calculateWaterWeight', () => {
    it('calculates freshwater weight correctly', () => {
      const weight = calculator.calculateWaterWeight(100, false);
      // 100 gallons * 8.34 lbs/gallon = 834 lbs
      expect(weight.lbs).toBeCloseTo(834, 1);
    });

    it('calculates saltwater weight correctly', () => {
      const weight = calculator.calculateWaterWeight(100, true);
      // 100 gallons * 8.55 lbs/gallon = 855 lbs
      expect(weight.lbs).toBeCloseTo(855, 1);
    });

    it('includes kg calculation', () => {
      const weight = calculator.calculateWaterWeight(100, false);
      expect(weight.kg).toBeGreaterThan(300);
      expect(weight.kg).toBeLessThan(400);
    });
  });
});
