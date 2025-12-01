"use client";

import Link from 'next/link';
import { Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#products', label: 'Products' },
  { href: '#about', label: 'About Us' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">CreditNow</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {isClient && (
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Button className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex h-full flex-col">
                  <div className="flex items-center border-b pb-4">
                    <Link href="/" className="flex items-center space-x-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <span className="font-bold font-headline">CreditNow</span>
                    </Link>
                  </div>
                  <nav className="mt-6 flex flex-grow flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
