/**
 * Enhanced validation utility functions with auto-correction features
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
 * 
 * Returns the corrected name if valid
 */
export function validateAndCorrectName(name: string): ValidationResult {
    // Remove leading/trailing whitespace
    const trimmedName = name.trim();

    // Check if empty
    if (!trimmedName) {
        return {
            isValid: false,
            error: 'Name is required'
        };
    }

    // Check if contains only alphabets and spaces
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
 * - Does not allow more than 10 digits
 */
export function validatePhoneNumber(phone: string): ValidationResult {
    // Remove any whitespace
    const trimmedPhone = phone.trim();

    // Check if empty
    if (!trimmedPhone) {
        return {
            isValid: false,
            error: 'Phone number is required'
        };
    }

    // Check if contains only numbers
    if (!/^\d+$/.test(trimmedPhone)) {
        return {
            isValid: false,
            error: 'Phone number should contain only numbers'
        };
    }

    // Check if more than 10 digits
    if (trimmedPhone.length > 10) {
        return {
            isValid: false,
            error: 'Phone number cannot be more than 10 digits'
        };
    }

    // Check if exactly 10 digits
    if (trimmedPhone.length !== 10) {
        return {
            isValid: false,
            error: 'Phone number must be exactly 10 digits'
        };
    }

    // Check if starts with 7, 8, or 9
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
 * Sanitizes phone input to prevent more than 10 digits
 * Use this in onChange handler
 */
export function sanitizePhoneInput(input: string): string {
    // Remove all non-numeric characters
    const numbersOnly = input.replace(/\D/g, '');

    // Limit to 10 digits
    return numbersOnly.slice(0, 10);
}

/**
 * Validates email according to the following rules:
 * - Must follow standard format: local@domain.extension
 * - Must contain exactly one '@'
 * - Must have a valid domain
 * - Extension must be at least 2 characters
 * - No invalid characters allowed
 */
export function validateEmail(email: string): ValidationResult {
    // Remove any whitespace
    const trimmedEmail = email.trim().toLowerCase();

    // Check if empty
    if (!trimmedEmail) {
        return {
            isValid: false,
            error: 'Email is required'
        };
    }

    // Check for spaces
    if (/\s/.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Email should not contain spaces'
        };
    }

    // Count @ symbols - must be exactly one
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

    // Split by @ to check local and domain parts
    const [local, domain] = trimmedEmail.split('@');

    // Validate local part (before @)
    if (!local || local.length === 0) {
        return {
            isValid: false,
            error: 'Email must have a username before @'
        };
    }

    // Validate domain part (after @)
    if (!domain || domain.length === 0) {
        return {
            isValid: false,
            error: 'Email must have a domain after @'
        };
    }

    // Check if domain has an extension
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
        return {
            isValid: false,
            error: 'Email must have a domain extension (e.g., .com, .org)'
        };
    }

    // Validate extension (last part) - must be at least 2 characters
    const extension = domainParts[domainParts.length - 1];
    if (extension.length < 2) {
        return {
            isValid: false,
            error: 'Email extension must be at least 2 characters'
        };
    }

    // Standard email regex pattern for valid characters
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Email contains invalid characters. Use only letters, numbers, dots, hyphens, and underscores'
        };
    }

    return {
        isValid: true,
        correctedValue: trimmedEmail
    };
}

/**
 * Validates all form inputs and returns a combined result with corrected values
 */
export function validateAllInputs(
    name?: string,
    email?: string,
    phone?: string
): ValidationResult & { correctedValues?: { name?: string; email?: string; phone?: string } } {
    const errors: string[] = [];
    const correctedValues: { name?: string; email?: string; phone?: string } = {};

    // Validate name if provided
    if (name !== undefined) {
        const nameResult = validateAndCorrectName(name);
        if (!nameResult.isValid) {
            errors.push(`Name: ${nameResult.error}`);
        } else {
            correctedValues.name = nameResult.correctedValue;
        }
    }

    // Validate email if provided
    if (email !== undefined) {
        const emailResult = validateEmail(email);
        if (!emailResult.isValid) {
            errors.push(`Email: ${emailResult.error}`);
        } else {
            correctedValues.email = emailResult.correctedValue;
        }
    }

    // Validate phone if provided
    if (phone !== undefined) {
        const phoneResult = validatePhoneNumber(phone);
        if (!phoneResult.isValid) {
            errors.push(`Phone: ${phoneResult.error}`);
        } else {
            correctedValues.phone = phoneResult.correctedValue;
        }
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            error: errors.join('\n')
        };
    }

    return {
        isValid: true,
        error: 'All inputs are valid.',
        correctedValues
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
    // Check if empty
    if (!password) {
        return {
            isValid: false,
            error: 'Password is required'
        };
    }

    // Check for spaces
    if (/\s/.test(password)) {
        return {
            isValid: false,
            error: 'Password should not contain spaces'
        };
    }

    // Check minimum length
    if (password.length < 12) {
        return {
            isValid: false,
            error: 'Password must be at least 12 characters long'
        };
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 uppercase letter'
        };
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 lowercase letter'
        };
    }

    // Check for digit
    if (!/\d/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 digit'
        };
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must include at least 1 special character (!@#$%^&* etc.)'
        };
    }

    return {
        isValid: true,
        correctedValue: password
    };
}

/**
 * Validates that the retyped password matches the original password
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (!confirmPassword) {
        return {
            isValid: false,
            error: 'Please confirm your password'
        };
    }

    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Passwords do not match'
        };
    }

    return {
        isValid: true
    };
}

/**
 * Gets password strength level and feedback
 */
export function getPasswordStrength(password: string): {
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
    feedback: string[];
} {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
        feedback.push('Use at least 12 characters');
    } else {
        feedback.push('Password too short (min 12 characters)');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add lowercase letters');
    }

    // Digit check
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add numbers');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add special characters');
    }

    // No spaces check
    if (/\s/.test(password)) {
        score -= 2;
        feedback.push('Remove spaces');
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score >= 6) {
        strength = 'very-strong';
    } else if (score >= 5) {
        strength = 'strong';
    } else if (score >= 3) {
        strength = 'medium';
    } else {
        strength = 'weak';
    }

    return { strength, score, feedback };
}
