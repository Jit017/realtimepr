import { bestPractices } from '../bestpractices.js';

describe('Best Practices Analysis', () => {
  test('should detect naming convention issues', async () => {
    const code = `
      const myConstant = 'value';
      let myVariable = 42;
      function myFunction() {}
      class myClass {}
      interface myInterface {}
      type myType = string;
      enum myEnum {}
    `;
    
    const result = await bestPractices(code);
    expect(result.suggestions).toContainEqual(
      expect.objectContaining({
        line: expect.any(Number),
        message: expect.stringContaining('Consider using UPPER_CASE for constant values')
      })
    );
  });

  test('should detect code organization issues', async () => {
    const code = `
      import { a, b, c } from 'module';
      export { x, y, z };
    `;
    
    const result = await bestPractices(code);
    expect(result.suggestions).toContainEqual(
      expect.objectContaining({
        line: expect.any(Number),
        message: expect.stringContaining('Multiple imports on one line')
      })
    );
  });

  test('should detect modern JavaScript issues', async () => {
    const code = `
      var oldVar = 'old';
      function oldFunction() {
        return new Promise().then(() => {});
      }
    `;
    
    const result = await bestPractices(code);
    expect(result.suggestions).toContainEqual(
      expect.objectContaining({
        line: expect.any(Number),
        message: expect.stringContaining('Consider using const or let instead of var')
      })
    );
  });

  test('should detect TypeScript issues', async () => {
    const code = `
      const anyValue: any = 'value';
      const objValue: Object = {};
      const funcValue: Function = () => {};
    `;
    
    const result = await bestPractices(code);
    expect(result.suggestions).toContainEqual(
      expect.objectContaining({
        line: expect.any(Number),
        message: expect.stringContaining('Avoid using any type')
      })
    );
  });

  test('should detect error handling issues', async () => {
    const code = `
      try {
        // some code
      } catch (e) {
      }
    `;
    
    const result = await bestPractices(code);
    expect(result.suggestions).toContainEqual(
      expect.objectContaining({
        line: expect.any(Number),
        message: expect.stringContaining('Empty catch block detected')
      })
    );
  });
}); 