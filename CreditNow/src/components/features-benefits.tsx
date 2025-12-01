
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const loanFeatures = [
    {
        title: "Two Wheeler Loans",
        features: ["Up to 95% funding on the on-road price", "2-minute loan approval", "Minimal documentation", "Flexible repayment", "No hidden charges"],
    },
    {
        title: "Used Car Loans",
        features: ["Loan up to 95% of asset value", "Loan approval in just 4 hours", "Apply without Income Proof", "Hassle-free documentation", "Flexible Repayment"],
    },
    {
        title: "Consumer Durable Loans",
        features: ["2-minute loan approval", "No Cost EMI", "Minimal Documentation", "Zero Down Payment", "First-time borrowers eligible"],
    },
    {
        title: "Mobile Loans",
        features: ["Instant approval", "100% paperless process", "Quick and easy application process", "Flexible loan amount and tenure", "Zero documentation"],
    },
    {
        title: "Online Personal Loans",
        features: ["Pre-approved loan* up to Rs 1 lakh", "Easy repayment", "No documentation", "Zero cost EMI*", "Zero processing fee"],
    },
];

export function FeaturesBenefits() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Features & Benefits</h2>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl pt-12">
                    {isClient && (
                        <Accordion type="single" collapsible className="w-full">
                            {loanFeatures.map((loan) => (
                                <AccordionItem value={loan.title} key={loan.title}>
                                    <AccordionTrigger className="text-lg font-semibold">{loan.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-3 pl-4">
                                            {loan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </div>
        </section>
    );
}
