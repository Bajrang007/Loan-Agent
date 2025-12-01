"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from '@/components/ui/card';

const offers = [
  { id: "offer-christmas", title: "Magical Christmas Offer" },
  { id: "offer-neckband", title: "Free Neckband on Two Wheeler Loan" },
  { id: "offer-movie", title: "Movie Tickets on Two Wheeler Loan" },
];

export function Offers() {
  const offerImages = offers.map(offer => ({
    ...offer,
    image: PlaceHolderImages.find((img) => img.id === offer.id)
  }));

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
          What’s in Store for You
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {offerImages.map(({id, title, image}) => (
              <CarouselItem key={id}>
                <Card className="overflow-hidden">
                  <CardContent className="relative p-0 aspect-[3/1]">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="text-white text-2xl md:text-4xl font-bold">{title}</h3>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
        <p className="text-center text-xs text-muted-foreground mt-4">
          For more details on Terms and Conditions, <a href="#" className="underline">click here</a>.
        </p>
      </div>
    </section>
  );
}
