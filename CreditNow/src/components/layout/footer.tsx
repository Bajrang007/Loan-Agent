"use client";

import Link from 'next/link';
import { Sparkles, Phone, Mail, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function Footer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="w-full border-t bg-background">
      <div className="container max-w-screen-2xl py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <h3 className="mb-2 font-semibold text-foreground">Get in Touch</h3>
             <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:044-66-123456" className="text-sm text-muted-foreground hover:text-primary">044-66-123456</a>
                </li>
                 <li className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <a href="https://wa.me/916385172692" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">+91-6385172692</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:helpdesk@tvscredit.com" className="text-sm text-muted-foreground hover:text-primary">helpdesk@tvscredit.com</a>
                </li>
             </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Products</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Two Wheeler Loan</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Used Car Loan</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Tractor Loan</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Personal Loan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Customer Portal</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="mb-2 font-semibold text-foreground">Sign up for latest updates</h3>
            {isClient && (
              <form className="flex flex-col gap-2">
                <Input type="text" placeholder="Enter Your Full Name" />
                <Input type="email" placeholder="Enter Your Email Address" />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Submit</Button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold">CreditNow</span>
          </div>
           <div className="text-center md:text-left">
            {isClient && <p>&copy; {new Date().getFullYear()} CreditNow. All rights reserved.</p>}
          </div>
           <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
