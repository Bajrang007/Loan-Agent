'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, Upload, CreditCard, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface LoanApplication {
    id: number;
    amount: number;
    tenure: number;
    interestRate: number;
    status: string;
    appliedAt: string;
    product?: {
        title: string;
    };
}

interface Document {
    id: number;
    documentType: string;
    documentUrl: string;
    status: string;
    uploadedAt: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loanDialogOpen, setLoanDialogOpen] = useState(false);
    const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loansLoading, setLoansLoading] = useState(false);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    // Loan Application Form State
    const [loanType, setLoanType] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanTenure, setLoanTenure] = useState('');
    const [loanSubmitting, setLoanSubmitting] = useState(false);

    // Document Upload Form State
    const [documentType, setDocumentType] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentSubmitting, setDocumentSubmitting] = useState(false);

    const fetchLoans = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoansLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/loans/my-loans', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setLoans(data);
            }
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        } finally {
            setLoansLoading(false);
        }
    };

    const fetchDocuments = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setDocumentsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/documents/my-documents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setDocumentsLoading(false);
        }
    };

    const searchParams = useSearchParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to main page if not logged in
            router.push('/');
            return;
        }

        // Check for query params to auto-open loan dialog
        const openDialog = searchParams.get('openLoanDialog');
        const type = searchParams.get('loanType');

        if (openDialog === 'true' && type) {
            setLoanType(type);
            setLoanDialogOpen(true);
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }

                const data = await res.json();
                setUser(data);

                // Fetch loans and documents after user is loaded
                fetchLoans();
                fetchDocuments();
            } catch (error) {
                console.error(error);
                // Remove invalid token and redirect to main page
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, searchParams]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('token');
            router.push('/login');
        }
    };

    const handleLoanApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoanSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/loans/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    loanType,
                    amount: parseFloat(loanAmount),
                    tenure: parseInt(loanTenure)
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Success!",
                    description: "Your loan application has been submitted successfully.",
                });
                setLoanDialogOpen(false);
                setLoanType('');
                setLoanAmount('');
                setLoanTenure('');
                // Refresh loans list
                fetchLoans();
            } else {
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit loan application. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoanSubmitting(false);
        }
    };

    const handleDocumentUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!documentFile) {
            toast({
                title: "Error",
                description: "Please select a file to upload.",
                variant: "destructive"
            });
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(documentFile.type)) {
            toast({
                title: "Error",
                description: "Only .jpg, .jpeg, and .png files are allowed.",
                variant: "destructive"
            });
            return;
        }

        // Validate file size (5MB)
        if (documentFile.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size must be less than 5MB.",
                variant: "destructive"
            });
            return;
        }

        setDocumentSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('documentType', documentType);
            formData.append('document', documentFile);

            const res = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Success!",
                    description: "Your document has been uploaded successfully.",
                });
                setDocumentDialogOpen(false);
                setDocumentType('');
                setDocumentFile(null);
                // Refresh documents list
                fetchDocuments();
            } else {
                throw new Error(data.message || 'Failed to upload document');
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to upload document. Please try again.",
                variant: "destructive"
            });
        } finally {
            setDocumentSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'PENDING': 'bg-yellow-500',
            'APPROVED': 'bg-green-500',
            'REJECTED': 'bg-red-500',
            'VERIFIED': 'bg-blue-500',
            'DISBURSED': 'bg-purple-500',
            'CLOSED': 'bg-gray-500'
        };
        return <Badge className={statusColors[status] || 'bg-gray-500'}>{status}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const activeLoans = loans.filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED').length;
    const totalBorrowed = loans
        .filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED')
        .reduce((sum, loan) => sum + Number(loan.amount), 0);

    return (
        <div className="min-h-screen bg-muted/40 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Loans
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeLoans}</div>
                            <p className="text-xs text-muted-foreground">
                                {loans.length} total applications
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Borrowed
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalBorrowed)}</div>
                            <p className="text-xs text-muted-foreground">
                                Approved loans
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Documents
                            </CardTitle>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{documents.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {documents.filter(d => d.status === 'VERIFIED').length} verified
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Account Status
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Active</div>
                            <p className="text-xs text-muted-foreground">
                                Good standing
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="loans" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="loans">My Loans</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="loans" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Loan Applications</h2>
                            <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" /> New Application
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Apply for a New Loan</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details below to submit your loan application.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleLoanApplication} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="loanType">Loan Type</Label>
                                            <Select value={loanType} onValueChange={setLoanType} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select loan type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="personal">Personal Loan</SelectItem>
                                                    <SelectItem value="two-wheeler">Two Wheeler Loan</SelectItem>
                                                    <SelectItem value="used-car">Used Car Loan</SelectItem>
                                                    <SelectItem value="tractor">Tractor Loan</SelectItem>
                                                    <SelectItem value="consumer-durable">Consumer Durable Loan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Loan Amount (₹)</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="50000"
                                                value={loanAmount}
                                                onChange={(e) => setLoanAmount(e.target.value)}
                                                required
                                                min="5000"
                                                max="1000000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tenure">Tenure (Months)</Label>
                                            <Select value={loanTenure} onValueChange={setLoanTenure} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tenure" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="6">6 Months</SelectItem>
                                                    <SelectItem value="12">12 Months</SelectItem>
                                                    <SelectItem value="24">24 Months</SelectItem>
                                                    <SelectItem value="36">36 Months</SelectItem>
                                                    <SelectItem value="48">48 Months</SelectItem>
                                                    <SelectItem value="60">60 Months</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setLoanDialogOpen(false)} disabled={loanSubmitting}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={loanSubmitting}>
                                                {loanSubmitting ? 'Submitting...' : 'Submit Application'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {loansLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : loans.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No loan applications yet. Click "New Application" to get started.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {loans.map((loan) => (
                                    <Card key={loan.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{loan.product?.title || 'Loan Application'}</CardTitle>
                                                    <CardDescription>Applied on: {formatDate(loan.appliedAt)}</CardDescription>
                                                </div>
                                                {getStatusBadge(loan.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Amount</p>
                                                    <p className="font-medium">{formatCurrency(Number(loan.amount))}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Tenure</p>
                                                    <p className="font-medium">{loan.tenure} Months</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                                                    <p className="font-medium">{Number(loan.interestRate)}% p.a.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">My Documents</h2>
                            <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" /> Upload Document
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Upload Document</DialogTitle>
                                        <DialogDescription>
                                            Upload your required documents for verification.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleDocumentUpload} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="documentType">Document Type</Label>
                                            <Select value={documentType} onValueChange={setDocumentType} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select document type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                                    <SelectItem value="pan">PAN Card</SelectItem>
                                                    <SelectItem value="income">Income Proof</SelectItem>
                                                    <SelectItem value="address">Address Proof</SelectItem>
                                                    <SelectItem value="bank">Bank Statement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="document">Choose File</Label>
                                            <Input
                                                id="document"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: JPG, JPEG, PNG (Max 5MB)
                                            </p>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setDocumentDialogOpen(false)} disabled={documentSubmitting}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={documentSubmitting}>
                                                {documentSubmitting ? 'Uploading...' : 'Upload'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {documentsLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : documents.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No documents uploaded yet. Click "Upload Document" to get started.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {documents.map((doc) => (
                                    <Card key={doc.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base capitalize">{doc.documentType}</CardTitle>
                                                {getStatusBadge(doc.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-5 w-5 text-blue-500" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm truncate">{doc.documentUrl.split('/').pop()}</p>
                                                    <p className="text-xs text-muted-foreground">Uploaded: {formatDate(doc.uploadedAt)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="profile" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{user?.name}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground">Email Address</p>
                                        <p className="font-medium">{user?.email}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground">Role</p>
                                        <p className="font-medium">{user?.role}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground">User ID</p>
                                        <p className="font-medium">{user?.id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
