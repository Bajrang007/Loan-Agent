import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Briefcase, Building, HandCoins, Users } from "lucide-react";

const stats = [
    { value: "Rs. 27,807 Cr", label: "AUM Q2 FY26", icon: <HandCoins className="h-10 w-10 text-white" /> },
    { value: "2.1+ Cr", label: "Customers served", icon: <Users className="h-10 w-10 text-white" /> },
    { value: "157", label: "Area offices", icon: <Building className="h-10 w-10 text-white" /> },
    { value: "15,000+", label: "Employees", icon: <Briefcase className="h-10 w-10 text-white" /> },
]

export function Journey() {
    const bgImage = PlaceHolderImages.find(img => img.id === 'journey-background');

    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 text-white">
            {bgImage && (
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description}
                    data-ai-hint={bgImage.imageHint}
                    fill
                    className="object-cover z-0"
                />
            )}
            <div className="absolute inset-0 bg-primary/80 z-10"></div>
            <div className="container relative z-20 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Our Journey So Far</h2>
                        <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            With an extensive network spanning across India, TVS Credit is committed to serving customers from every region, ensuring financial support is just a step away.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid grid-cols-2 gap-8 pt-12 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-white/20 p-4">
                                {stat.icon}
                            </div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm text-white/80">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
