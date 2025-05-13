// Test file for code analysis

// Naming convention issues
const MYCONSTANT = 42;  // Should be UPPER_CASE
let myVariable = "test";  // Should be camelCase
function myFunction() {}  // Should be camelCase
class MyClass {}  // Should be PascalCase
interface MyInterface {}  // Should be PascalCase
type myType = string;  // Should be PascalCase
enum myEnum {}  // Should be PascalCase

// Code organization issues
import { a } from 'b'; import { c } from 'd';  // Multiple imports
export const x = 1; export const y = 2;  // Multiple exports
if (true) {
} else {  // else on new line
}

// Modern JavaScript issues
var oldVar = "test";  // Using var
function oldFunction() {  // Using function keyword
    return "test";
}
promise.then(function(data) {  // Using .then with function
    return data;
});
for (let i = 0; i < array.length; i++) {  // Using for loop
    console.log(array[i]);
}
Object.keys(obj).forEach(function(key) {  // Using Object.keys
    console.log(key);
});
array.concat([1, 2, 3]);  // Using concat
func.apply(null, args);  // Using apply

// TypeScript issues
let anyVar: any = "test";  // Using any
let objVar: Object = {};  // Using Object
let funcVar: Function = () => {};  // Using Function
let typeAssert = value as any;  // Type assertion to any
interface BadInterface {
    prop: any;  // Interface with any
}
type BadType = any;  // Type alias with any

// Error handling issues
try {
    // Some code
} catch () {  // Empty catch
}
try {
    // Some code
} catch (error) {
    console.log(error);  // Console.log in catch
}
throw new Error("test");  // Generic error
try {
    // Some code
} catch (error) {
    // Handle error
} finally {
    // Cleanup
}

// Documentation issues
export class TestClass {}  // Missing JSDoc
export interface TestInterface {}  // Missing JSDoc
export function testFunction() {}  // Missing JSDoc
export const testConst = 42;  // Missing JSDoc
function undocumentedFunction(param: string) {}  // Missing JSDoc

// Testing issues
describe("Test suite", () => {  // Missing test cases
});
it("should do something", () => {  // Missing specific tests
});
expect(result).toBe(true);  // Using toBe

// Accessibility issues
<img src="test.jpg" />  // Missing alt
<button onClick={handleClick}>Click me</button>  // Missing aria-label
<div role="button">Click me</div>  // Missing aria-label

// Code complexity issues
function complexFunction(a: number, b: number, c: number, d: number, e: number, f: number) {
    if (a > 0) {
        if (b > 0) {
            if (c > 0) {
                if (d > 0) {
                    if (e > 0) {
                        if (f > 0) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

// Code duplication
if (condition1) {
    doSomething();
} else if (condition2) {
    doSomething();
} else if (condition3) {
    doSomething();
}

switch (value) {
    case 1:
        handleCase1();
        break;
    case 2:
        handleCase2();
        break;
    case 3:
        handleCase3();
        break;
    case 4:
        handleCase4();
        break;
    case 5:
        handleCase5();
        break;
}

// Code quality issues
console.log("Debug message");  // Console.log
debugger;  // Debugger statement
// TODO: Fix this later  // TODO comment 