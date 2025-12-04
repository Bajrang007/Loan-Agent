# Validation Examples and Test Cases

## 📋 Quick Reference Guide

### Phone Number Validation Examples

#### ✅ VALID Phone Numbers:
```
9876543210  → Valid (starts with 9, exactly 10 digits)
8123456789  → Valid (starts with 8, exactly 10 digits)
7000000000  → Valid (starts with 7, exactly 10 digits)
7999999999  → Valid (starts with 7, exactly 10 digits)
8888888888  → Valid (starts with 8, exactly 10 digits)
```

#### ❌ INVALID Phone Numbers:
```
6123456789  → Error: "Phone number must start with 7, 8, or 9"
5987654321  → Error: "Phone number must start with 7, 8, or 9"
0123456789  → Error: "Phone number must start with 7, 8, or 9"
123456789   → Error: "Phone number must be exactly 10 digits"
98765432101 → Error: "Phone number must be exactly 10 digits"
98765abc10  → Error: "Phone number should contain only numbers"
9876 543210 → Error: "Phone number should contain only numbers"
987-654-3210→ Error: "Phone number should contain only numbers"
```

---

### Email Validation Examples

#### ✅ VALID Emails:
```
user@example.com           → Valid
john.doe@company.co.in     → Valid
test_user@domain.org       → Valid
admin@test-site.com        → Valid
contact@my-website.io      → Valid
```

#### ❌ INVALID Emails:
```
test @example.com          → Error: "Email should not contain spaces"
user @domain.com           → Error: "Email should not contain spaces"
invalid@                   → Error: "Please enter a valid email address"
@example.com               → Error: "Please enter a valid email address"
test@example               → Error: "Please enter a valid email address"
notanemail                 → Error: "Please enter a valid email address"
user@.com                  → Error: "Please enter a valid email address"
```

---

### Name Validation Examples

#### ✅ VALID Names:
```
Shilpa Sinha              → Valid (proper capitalization)
John Doe                  → Valid (proper capitalization)
Mary Jane Watson          → Valid (all words capitalized)
A B                       → Valid (single letters capitalized)
Alice                     → Valid (single name)
John Paul George Ringo    → Valid (multiple words, all capitalized)
```

#### ❌ INVALID Names:
```
shilpa sinha              → Error: "Each word in the name must start with a capital letter"
Shilpa sinha              → Error: "Each word in the name must start with a capital letter"
john Doe                  → Error: "Each word in the name must start with a capital letter"
JOHN DOE                  → Valid (all caps is allowed)
John123                   → Error: "Name should contain only alphabets and spaces"
John@Doe                  → Error: "Name should contain only alphabets and spaces"
John_Doe                  → Error: "Name should contain only alphabets and spaces"
John-Doe                  → Error: "Name should contain only alphabets and spaces"
```

---

## 🧪 Complete Test Scenarios

### Scenario 1: All Valid Inputs
```
Name:  Shilpa Sinha
Email: shilpa@example.com
Phone: 9876543210

Result: ✅ "All inputs are valid."
Form submits successfully
```

### Scenario 2: Invalid Phone Number
```
Name:  Shilpa Sinha
Email: shilpa@example.com
Phone: 6123456789

Result: ❌ "Phone number must start with 7, 8, or 9"
Form does not submit
Red border appears on phone field
```

### Scenario 3: Invalid Name Capitalization
```
Name:  shilpa sinha
Email: shilpa@example.com
Phone: 9876543210

Result: ❌ "Each word in the name must start with a capital letter"
Form does not submit
Red border appears on name field
```

### Scenario 4: Invalid Email Format
```
Name:  Shilpa Sinha
Email: test @example.com
Phone: 9876543210

Result: ❌ "Email should not contain spaces"
Form does not submit
Red border appears on email field
```

### Scenario 5: Multiple Invalid Fields
```
Name:  john doe
Email: invalid email
Phone: 123

Result: ❌ Multiple errors shown:
- "Each word in the name must start with a capital letter"
- "Please enter a valid email address"
- "Phone number must be exactly 10 digits"
Form does not submit
Red borders on all invalid fields
```

---

## 🎯 Testing Instructions

### Manual Testing Steps:

1. **Navigate to Signup Page**
   - Go to `http://localhost:3000/signup`

2. **Test Phone Validation**
   - Enter: `6123456789`
   - Click outside the field
   - Expected: Red border + error message

3. **Test Email Validation**
   - Enter: `test @example.com`
   - Click outside the field
   - Expected: Red border + error message

4. **Test Name Validation**
   - Enter: `john doe`
   - Click outside the field
   - Expected: Red border + error message

5. **Test Valid Inputs**
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
   - Password: `password123`
   - Click "Sign Up"
   - Expected: Form submits successfully

### Automated Testing:
```bash
# Run the validation test suite
npx tsx test-validation.ts
```

---

## 💡 Tips for Users

1. **Phone Number**: Always start with 7, 8, or 9
2. **Email**: No spaces allowed, must have @ and domain
3. **Name**: Capitalize the first letter of each word
4. **Real-time Feedback**: Errors appear when you leave a field
5. **Error Clearing**: Start typing to clear the error

---

## 🔧 Developer Notes

### Validation Timing:
- **onBlur**: Validation triggers when field loses focus
- **onChange**: Errors clear when user starts typing
- **onSubmit**: All fields validated before submission

### Error Display:
- Red border on invalid fields
- Error message below the field
- General error at form level if submission fails

### Backend Validation:
- All frontend validations are mirrored on the backend
- Server returns specific error messages
- Prevents invalid data from reaching the database
