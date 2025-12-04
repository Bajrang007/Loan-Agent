'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { validateAndCorrectName, validateEmail, validatePhoneNumber, sanitizePhoneInput, validatePassword, validatePasswordMatch, getPasswordStrength } from '@/utils/validation';

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}

function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Field-level validation errors
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState<{
        strength: 'weak' | 'medium' | 'strong' | 'very-strong';
        score: number;
        feedback: string[];
    } | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Pre-fill from URL params
    if (searchParams.get('mobile') && !phone) {
        setPhone(searchParams.get('mobile')!);
    }

    // Validation handlers with auto-correction
    const handleNameBlur = () => {
        const result = validateAndCorrectName(name);
        if (result.isValid && result.correctedValue) {
            setName(result.correctedValue);
            setNameError('');
        } else {
            setNameError(result.error || '');
        }
    };

    const handleEmailBlur = () => {
        const result = validateEmail(email);
        if (result.isValid && result.correctedValue) {
            setEmail(result.correctedValue);
            setEmailError('');
        } else {
            setEmailError(result.error || '');
        }
    };

    const handlePhoneBlur = () => {
        const result = validatePhoneNumber(phone);
        setPhoneError(result.isValid ? '' : result.error || '');
    };

    const handlePhoneChange = (value: string) => {
        const sanitized = sanitizePhoneInput(value);
        setPhone(sanitized);
        setPhoneError('');
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordError('');

        if (value) {
            const strength = getPasswordStrength(value);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(null);
        }
    };

    const handlePasswordBlur = () => {
        const result = validatePassword(password);
        setPasswordError(result.isValid ? '' : result.error || '');
    };

    const handleConfirmPasswordBlur = () => {
        const result = validatePasswordMatch(password, confirmPassword);
        setConfirmPasswordError(result.isValid ? '' : result.error || '');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate all fields
        const nameValidation = validateAndCorrectName(name);
        const emailValidation = validateEmail(email);
        const phoneValidation = validatePhoneNumber(phone);
        const passwordValidation = validatePassword(password);
        const confirmPasswordValidation = validatePasswordMatch(password, confirmPassword);

        // Apply corrections
        let correctedName = name;
        let correctedEmail = email;
        let correctedPhone = phone;

        if (nameValidation.isValid && nameValidation.correctedValue) {
            correctedName = nameValidation.correctedValue;
            setName(correctedName);
        }

        if (emailValidation.isValid && emailValidation.correctedValue) {
            correctedEmail = emailValidation.correctedValue;
            setEmail(correctedEmail);
        }

        if (phoneValidation.isValid && phoneValidation.correctedValue) {
            correctedPhone = phoneValidation.correctedValue;
            setPhone(correctedPhone);
        }

        // Set errors
        setNameError(nameValidation.isValid ? '' : nameValidation.error || '');
        setEmailError(emailValidation.isValid ? '' : emailValidation.error || '');
        setPhoneError(phoneValidation.isValid ? '' : phoneValidation.error || '');
        setPasswordError(passwordValidation.isValid ? '' : passwordValidation.error || '');
        setConfirmPasswordError(confirmPasswordValidation.isValid ? '' : confirmPasswordValidation.error || '');

        // Check if all validations passed
        if (!nameValidation.isValid || !emailValidation.isValid || !phoneValidation.isValid ||
            !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
            setError('Please fix the validation errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: correctedName,
                    email: correctedEmail,
                    password,
                    phone: correctedPhone
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle duplicate user errors (409 Conflict)
                if (res.status === 409) {
                    if (data.field === 'email') {
                        setEmailError(data.message);
                    } else if (data.field === 'phone') {
                        setPhoneError(data.message);
                    }
                    setError(data.message);
                } else {
                    setError(data.message || 'Signup failed');
                }
                return;
            }

            // Success
            alert('Account created successfully! Redirecting to login...');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (!passwordStrength) return '';
        switch (passwordStrength.strength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-blue-500';
            case 'very-strong': return 'bg-green-500';
        }
    };

    const getStrengthWidth = () => {
        if (!passwordStrength) return '0%';
        return `${(passwordStrength.score / 6) * 100}%`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="font-bold font-headline text-xl">CreditNow</span>
                        </Link>
                    </div>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="grid gap-4">
                        {/* Name Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="john doe"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError('');
                                }}
                                onBlur={handleNameBlur}
                                className={nameError ? 'border-red-500' : ''}
                            />
                            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                            <p className="text-xs text-muted-foreground">Auto-capitalizes to: John Doe</p>
                        </div>

                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                onBlur={handleEmailBlur}
                                className={emailError ? 'border-red-500' : ''}
                            />
                            {emailError && (
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                    <p className="text-sm text-red-500">{emailError}</p>
                                </div>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                required
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                onBlur={handlePhoneBlur}
                                className={phoneError ? 'border-red-500' : ''}
                                maxLength={10}
                            />
                            {phoneError && (
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                    <p className="text-sm text-red-500">{phoneError}</p>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">Max 10 digits, starts with 7/8/9</p>
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    onBlur={handlePasswordBlur}
                                    className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {password && passwordStrength && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                                style={{ width: getStrengthWidth() }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium capitalize">{passwordStrength.strength}</span>
                                    </div>
                                    {passwordStrength.feedback.length > 0 && (
                                        <ul className="text-xs space-y-1">
                                            {passwordStrength.feedback.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-1 text-muted-foreground">
                                                    <X className="h-3 w-3 text-red-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                            <p className="text-xs text-muted-foreground">Min 12 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setConfirmPasswordError('');
                                    }}
                                    onBlur={handleConfirmPasswordBlur}
                                    className={confirmPasswordError ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
                            {confirmPassword && !confirmPasswordError && password === confirmPassword && (
                                <p className="text-sm text-green-500 flex items-center gap-1">
                                    <Check className="h-4 w-4" /> Passwords match
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                        {error.includes('already exists') && (
                                            <Link href="/login" className="text-sm text-red-700 underline mt-1 inline-block">
                                                Click here to login instead
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="underline">Login</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
