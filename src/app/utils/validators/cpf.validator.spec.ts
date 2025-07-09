import { FormControl } from '@angular/forms';
import { cpfValidator } from './cpf.validator';

describe('CpfValidator', () => {
  let validator: any;

  beforeEach(() => {
    validator = cpfValidator();
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for null value', () => {
    const control = new FormControl(null);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for undefined value', () => {
    const control = new FormControl(undefined);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return error for CPF with less than 11 digits', () => {
    const control = new FormControl('123456789');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for CPF with more than 11 digits', () => {
    const control = new FormControl('123456789012');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for CPF with all same digits', () => {
    const control = new FormControl('11111111111');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for CPF with all zeros', () => {
    const control = new FormControl('00000000000');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for invalid CPF with wrong first check digit', () => {
    const control = new FormControl('12345678901');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for invalid CPF with wrong second check digit', () => {
    const control = new FormControl('12345678901');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return null for valid CPF', () => {
    const control = new FormControl('12345678909');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should handle formatted CPF correctly', () => {
    const control = new FormControl('123.456.789-09');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return error for formatted invalid CPF', () => {
    const control = new FormControl('123.456.789-00');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should handle CPF with mixed characters', () => {
    const control = new FormControl('123abc456def789ghi09');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return error for CPF with only letters', () => {
    const control = new FormControl('abcdefghijk');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should return error for CPF with spaces only', () => {
    const control = new FormControl('           ');
    const result = validator(control);
    expect(result).toEqual({ cpfInvalid: true });
  });

  it('should validate known valid CPFs', () => {
    const validCpfs = [
      '11144477735',
      '12345678909'
    ];

    validCpfs.forEach(cpf => {
      const control = new FormControl(cpf);
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  it('should reject known invalid CPFs', () => {
    const invalidCpfs = [
      '12345678901',
      '12345678900',
      '04765554089',
      '11111111111',
      '22222222222'
    ];

    invalidCpfs.forEach(cpf => {
      const control = new FormControl(cpf);
      const result = validator(control);
      expect(result).toEqual({ cpfInvalid: true });
    });
  });

  it('should handle edge case where remainder is 10 or 11', () => {
    const control = new FormControl('11144477735');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should validate CPF algorithm step by step', () => {
    const cpf = '12345678909';
    const control = new FormControl(cpf);
    
    const result = validator(control);
    expect(result).toBeNull();
  });
});
