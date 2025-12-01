
"use client";

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bike, Car, Tractor, Smartphone, User, ArrowRight, Building, Gem, LandPlot, Briefcase, CarTaxiFront } from "lucide-react";
import { useEffect, useState } from 'react';

const loanProducts = [
  {
    id: "two-wheeler-loan",
    title: "Bike Loan",
    subTitle: "2 Minute Loan approval",
    icon: <Bike className="h-8 w-8 text-primary" />,
  },
  {
    id: "used-car-loan",
    title: "Used Car Loan",
    subTitle: "Loan approval in just 4 hours",
    icon: <Car className="h-8 w-8 text-primary" />,
  },
  {
    id: "consumer-durable-loan",
    title: "Consumer Durable Loans",
    subTitle: "No cost EMI",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
  },
  {
    id: "mobile-loan",
    title: "Mobile Loans",
    subTitle: "Zero Down Payment",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
  },
  {
    id: "personal-loan",
    title: "Online Personal Loans",
    subTitle: "100% paperless process",
    icon: <User className="h-8 w-8 text-primary" />,
  },
  {
    id: "instacard-loan",
    title: "InstaCard",
    subTitle: "Pre-approved loan upto 1 lakh*",
    icon: <User className="h-8 w-8 text-primary" />,
  },
  {
    id: "gold-loan",
    title: "Gold Loans",
    subTitle: "Flexible Repayment Options",
    icon: <Gem className="h-8 w-8 text-primary" />,
  },
  {
    id: "used-commercial-vehicle-loan",
    title: "Used Commercial Vehicle Loans",
    subTitle: "Loans for up to 15-year-old Assets",
    icon: <Building className="h-8 w-8 text-primary" />,
  },
  {
    id: "tractor-loan",
    title: "Tractor Loans",
    subTitle: "Up to 90%* Funding",
    icon: <Tractor className="h-8 w-8 text-primary" />,
  },
  {
    id: "loan-against-property",
    title: "Loan Against Property",
    subTitle: "No hidden charges",
    icon: <LandPlot className="h-8 w-8 text-primary" />,
  },
  {
    id: "business-loan",
    title: "Emerging & Mid-Corporate Business Loans",
    subTitle: "Flexible repayment options",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
  },
  {
    id: "three-wheeler-loan",
    title: "Three Wheeler Loans",
    subTitle: "Same day loan approval",
    icon: <CarTaxiFront className="h-8 w-8 text-primary" />,
  },
];


export function ProductShowcase() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="products" className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Our Best Offers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our range of thoughtfully-curated financial products focused on your needs, available right at your fingertips.
            </p>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loanProducts.map((product) => {
            const image = PlaceHolderImages.find((img) => img.id === product.id);
            return (
              <Card key={product.id} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                  {product.icon}
                  <div className="flex-grow">
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{product.subTitle}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end p-4 pt-0">
                   {isClient && <div className="space-y-2">
                      <Button variant="outline" className="w-full">Check Eligibility</Button>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
                   </div>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
