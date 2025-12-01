import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export function AppPromo() {
    const promoImage = PlaceHolderImages.find(img => img.id === 'app-promo-image');

    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
                <div className="relative">
                    {promoImage && (
                        <Image
                            src={promoImage.imageUrl}
                            alt={promoImage.description}
                            data-ai-hint={promoImage.imageHint}
                            width={600}
                            height={600}
                            className="rounded-xl object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Partner, Your App</h2>
                    <p className="text-xl text-muted-foreground">Credit Made Simpler</p>
                    <p className="max-w-[600px] text-muted-foreground md:text-lg">
                        Bringing convenience at your fingertips with our TVS Credit's Saathi app. Experience the all-in-one app for seamless payments, effortless account access, quick loan applications, and real-time tracking of your finances.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                           <Link href="#">Download the App Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
