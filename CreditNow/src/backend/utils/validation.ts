/**
 * Backend validation utility functions with auto-correction
 * These mirror the frontend validation to ensure data integrity
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    correctedValue?: string;
}

/**
 * Auto-corrects and validates name according to the following rules:
 * - Only alphabets are allowed (A–Z, a–z)
 * - Automatically converts first letter of each word to uppercase
 * - After every space, the next letter is automatically uppercase
 * - No numeric or special characters accepted
 */
export function validateAndCorrectName(name: string): ValidationResult {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return {
            isValid: false,
            error: 'Name is required'
        };
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
        return {
            isValid: false,
            error: 'Name should contain only alphabets and spaces (no numbers or special characters)'
        };
    }

    // Auto-correct: Capitalize first letter of each word
    const words = trimmedName.split(/\s+/);
    const correctedWords = words.map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const correctedName = correctedWords.join(' ');

    return {
        isValid: true,
        correctedValue: correctedName
    };
}

/**
 * Validates phone number according to the following rules:
 * - Must be exactly 10 digits
 * - First digit must be 7, 8, or 9 (not 0-6)
 * - Only numeric characters allowed
 */
export function validatePhoneNumber(phone: string): ValidationResult {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
        return {
            isValid: false,
            error: 'Phone number is required'
        };
    }

    if (!/^\d+$/.test(trimmedPhone)) {
        return {
            isValid: false,
            error: 'Phone number should contain only numbers'
        };
    }

    if (trimmedPhone.length > 10) {
        return {
            isValid: false,
            error: 'Phone number cannot be more than 10 digits'
        };
    }

    if (trimmedPhone.length !== 10) {
        return {
            isValid: false,
            error: 'Phone number must be exactly 10 digits'
        };
    }

    const firstDigit = trimmedPhone[0];
    if (!['7', '8', '9'].includes(firstDigit)) {
        return {
            isValid: false,
            error: 'Phone number must start with 7, 8, or 9 (not 0-6)'
        };
    }

    return {
        isValid: true,
        correctedValue: trimmedPhone
    };
}

/**
 * Validates email according to the following rules:
 * - Must follow standard format: local@domain.extension
 * - Must contain exactly one '@'
 * - Must have a valid domain
 * - Extension must be at least 2 characters
 */
export function validateEmail(email: string): ValidationResult {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
        return {
            isValid: false,
            error: 'Email is required'
        };
    }

    if (/\s/.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Email should not contain spaces'
        };
    }

    const atCount = (trimmedEmail.match(/@/g) || []).length;
    if (atCount === 0) {
        return {
            isValid: false,
            error: 'Email must contain an @ symbol'
        };
    }
    if (atCount > 1) {
        return {
            isValid: false,
            error: 'Email must contain exactly one @ symbol'
        };
    }

    const [local, domain] = trimmedEmail.split('@');

    if (!local || local.length === 0) {
        return {
            isValid: false,
            error: 'Email must have a username before @'
        };
    }

    if (!domain || domain.length === 0) {
        return {
            isValid: false,
            error: 'Email must have a domain after @'
        };
    }

    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
        return {
            isValid: false,
            error: 'Email must have a domain extension (e.g., .com, .org)'
        };
    }

    const extension = domainParts[domainParts.length - 1];
    if (extension.length < 2) {
        return {
            isValid: false,
            error: 'Email extension must be at least 2 characters'
        };
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Email contains invalid characters'
        };
    }

    return {
        isValid: true,
        correctedValue: trimmedEmail
    };
}

// Legacy function for backward compatibility
export function validateName(name: string): ValidationResult {
    return validateAndCorrectName(name);
}

/**
 * Validates password according to the following rules:
 * - Minimum length: 12 characters
 * - Must include at least 1 uppercase letter
 * - Must include at least 1 lowercase letter
 * - Must include at least 1 digit
 * - Must include at least 1 special character
 * - No spaces allowed
 */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return {
            isValid: false,
            error: 'Password is required'
        };
    }

    if (/\s/.test(password)) {
        return {
            isValid: false,
            error: 'Password should not contain spaces'
        };
    }

    if (password.length < 12) {
        return {
            isValid: false,
            error: 'Password must be at least 12 characters long'
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 uppercase letter'
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 lowercase letter'
        };
    }

    if (!/\d/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 digit'
        };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 special character'
        };
    }

    return {
        isValid: true,
        correctedValue: password
    };
}
