/**
 * Test file to demonstrate validation functionality
 * Run this file with: npx ts-node test-validation.ts
 */

import { validatePhoneNumber, validateEmail, validateName, validateAllInputs } from './src/utils/validation';

console.log('=== VALIDATION TESTS ===\n');

// Phone Number Tests
console.log('📱 PHONE NUMBER VALIDATION TESTS:');
console.log('-----------------------------------');

const phoneTests = [
    { value: '9876543210', expected: true, description: 'Valid phone starting with 9' },
    { value: '8123456789', expected: true, description: 'Valid phone starting with 8' },
    { value: '7000000000', expected: true, description: 'Valid phone starting with 7' },
    { value: '6123456789', expected: false, description: 'Invalid - starts with 6' },
    { value: '123456789', expected: false, description: 'Invalid - only 9 digits' },
    { value: '12345678901', expected: false, description: 'Invalid - 11 digits' },
    { value: '98765abc10', expected: false, description: 'Invalid - contains letters' },
    { value: '9876 543210', expected: false, description: 'Invalid - contains space' },
];

phoneTests.forEach(test => {
    const result = validatePhoneNumber(test.value);
    const status = result.isValid === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: "${test.value}"`);
    if (!result.isValid) {
        console.log(`   Error: ${result.error}`);
    }
});

// Email Tests
console.log('\n📧 EMAIL VALIDATION TESTS:');
console.log('-----------------------------------');

const emailTests = [
    { value: 'test@example.com', expected: true, description: 'Valid email' },
    { value: 'user.name@domain.co.in', expected: true, description: 'Valid email with dots' },
    { value: 'user_name@example.org', expected: true, description: 'Valid email with underscore' },
    { value: 'invalid@', expected: false, description: 'Invalid - missing domain' },
    { value: '@example.com', expected: false, description: 'Invalid - missing username' },
    { value: 'test @example.com', expected: false, description: 'Invalid - contains space' },
    { value: 'test@example', expected: false, description: 'Invalid - missing TLD' },
    { value: 'notanemail', expected: false, description: 'Invalid - not an email format' },
];

emailTests.forEach(test => {
    const result = validateEmail(test.value);
    const status = result.isValid === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: "${test.value}"`);
    if (!result.isValid) {
        console.log(`   Error: ${result.error}`);
    }
});

// Name Tests
console.log('\n👤 NAME VALIDATION TESTS:');
console.log('-----------------------------------');

const nameTests = [
    { value: 'Shilpa Sinha', expected: true, description: 'Valid name with proper capitalization' },
    { value: 'John Doe', expected: true, description: 'Valid name' },
    { value: 'Mary Jane Watson', expected: true, description: 'Valid name with three words' },
    { value: 'shilpa sinha', expected: false, description: 'Invalid - lowercase first letters' },
    { value: 'Shilpa sinha', expected: false, description: 'Invalid - second word not capitalized' },
    { value: 'John123', expected: false, description: 'Invalid - contains numbers' },
    { value: 'John@Doe', expected: false, description: 'Invalid - contains special characters' },
    { value: 'John  Doe', expected: true, description: 'Valid - multiple spaces handled' },
];

nameTests.forEach(test => {
    const result = validateName(test.value);
    const status = result.isValid === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: "${test.value}"`);
    if (!result.isValid) {
        console.log(`   Error: ${result.error}`);
    }
});

// Combined Validation Tests
console.log('\n🔍 COMBINED VALIDATION TESTS:');
console.log('-----------------------------------');

console.log('\nTest 1: All valid inputs');
const test1 = validateAllInputs('Shilpa Sinha', 'shilpa@example.com', '9876543210');
console.log(test1.isValid ? '✅ ' + test1.error : '❌ ' + test1.error);

console.log('\nTest 2: Invalid name');
const test2 = validateAllInputs('shilpa sinha', 'shilpa@example.com', '9876543210');
console.log(test2.isValid ? '✅ ' + test2.error : '❌ Errors:\n' + test2.error);

console.log('\nTest 3: Invalid phone');
const test3 = validateAllInputs('Shilpa Sinha', 'shilpa@example.com', '6123456789');
console.log(test3.isValid ? '✅ ' + test3.error : '❌ Errors:\n' + test3.error);

console.log('\nTest 4: Multiple invalid fields');
const test4 = validateAllInputs('john doe', 'invalid email', '123');
console.log(test4.isValid ? '✅ ' + test4.error : '❌ Errors:\n' + test4.error);

console.log('\n=== TESTS COMPLETE ===\n');
