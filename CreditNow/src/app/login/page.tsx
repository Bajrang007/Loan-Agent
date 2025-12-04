'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { validateEmail } from '@/utils/validation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailBlur = () => {
        const result = validateEmail(email);
        setEmailError(result.isValid ? '' : result.error || '');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email before submission
        const emailValidation = validateEmail(email);
        setEmailError(emailValidation.isValid ? '' : emailValidation.error || '');

        if (!emailValidation.isValid) {
            setError('Please fix the validation errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="font-bold font-headline text-xl">CreditNow</span>
                        </Link>
                    </div>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
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
                                    setEmailError(''); // Clear error on change
                                }}
                                onBlur={handleEmailBlur}
                                className={emailError ? 'border-red-500' : ''}
                            />
                            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="text-sm text-red-500">{error}</div>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account? <Link href="/signup" className="underline">Sign up</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
