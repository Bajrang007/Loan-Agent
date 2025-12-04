# Form Validation Documentation

This document describes the validation rules implemented for the Login/Sign-Up forms in the CreditNow application.

## Validation Rules

### 📱 Phone Number Validation

The phone number must meet ALL of the following criteria:

1. **Exactly 10 digits** - No more, no less
2. **Must start with 7, 8, or 9** - Cannot start with 0-6
3. **Only numbers** - No letters, spaces, or special characters

#### Examples:
- ✅ Valid: `9876543210`, `8123456789`, `7000000000`
- ❌ Invalid: 
  - `6123456789` (starts with 6)
  - `123456789` (only 9 digits)
  - `98765abc10` (contains letters)
  - `9876 543210` (contains space)

### 📧 Email Validation

The email must meet ALL of the following criteria:

1. **Standard email format** - Must follow pattern: `username@domain.extension`
2. **No spaces** - Email cannot contain any whitespace
3. **Valid symbols only** - Only alphanumeric characters, dots (.), hyphens (-), and underscores (_) are allowed

#### Examples:
- ✅ Valid: `user@example.com`, `user.name@domain.co.in`, `user_name@example.org`
- ❌ Invalid:
  - `test @example.com` (contains space)
  - `invalid@` (missing domain)
  - `@example.com` (missing username)
  - `test@example` (missing TLD)

### 👤 Name Validation

The name must meet ALL of the following criteria:

1. **Only alphabets and spaces** - No numbers or special characters
2. **Proper capitalization** - Each word must start with a capital letter

#### Examples:
- ✅ Valid: `Shilpa Sinha`, `John Doe`, `Mary Jane Watson`
- ❌ Invalid:
  - `shilpa sinha` (lowercase first letters)
  - `Shilpa sinha` (second word not capitalized)
  - `John123` (contains numbers)
  - `John@Doe` (contains special characters)

## Implementation Details

### Files Modified

1. **`src/utils/validation.ts`** - Core validation utility functions
   - `validatePhoneNumber(phone: string): ValidationResult`
   - `validateEmail(email: string): ValidationResult`
   - `validateName(name: string): ValidationResult`
   - `validateAllInputs(name?, email?, phone?): ValidationResult`

2. **`src/app/signup/page.tsx`** - Sign-up form with validation
   - Real-time validation on blur
   - Clear error messages
   - Visual feedback (red border on invalid fields)

3. **`src/app/login/page.tsx`** - Login form with email validation
   - Email validation on blur
   - Clear error messages
   - Visual feedback

### User Experience Features

1. **Real-time Validation** - Validation occurs when user leaves a field (onBlur event)
2. **Clear Error Messages** - Specific error messages explain what's wrong
3. **Visual Feedback** - Invalid fields show a red border
4. **Error Clearing** - Errors clear when user starts typing again
5. **Pre-submission Validation** - All fields are validated before form submission

## Testing

A test file is provided at `test-validation.ts` that demonstrates all validation rules with various test cases.

To run the tests:
```bash
npx tsx test-validation.ts
```

## Validation Response Format

All validation functions return a `ValidationResult` object:

```typescript
interface ValidationResult {
    isValid: boolean;
    error?: string;
}
```

- If validation passes: `{ isValid: true }`
- If validation fails: `{ isValid: false, error: "Error message explaining the issue" }`

## Success Message

When all inputs are valid, the `validateAllInputs` function returns:
```
{ isValid: true, error: "All inputs are valid." }
```
