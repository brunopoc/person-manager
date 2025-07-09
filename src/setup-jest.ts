import 'jest-preset-angular/setup-jest';
import 'zone.js';
import 'zone.js/testing';

expect.extend({
  toBeValidCpf(received: string) {
    const cpf = received.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) {
      return {
        message: () => `Expected ${received} to be a valid CPF (11 digits)`,
        pass: false,
      };
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return {
        message: () => `Expected ${received} to be a valid CPF (not all same digits)`,
        pass: false,
      };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return {
        message: () => `Expected ${received} to be a valid CPF (first check digit)`,
        pass: false,
      };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return {
        message: () => `Expected ${received} to be a valid CPF (second check digit)`,
        pass: false,
      };
    }

    return {
      message: () => `Expected ${received} not to be a valid CPF`,
      pass: true,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidCpf(): R;
    }
  }
}