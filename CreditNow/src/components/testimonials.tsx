
"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Anand Ramasamy",
    role: "MSME",
    testimonial: "Timely implementation of the moratorium was key to my business staying afloat during the lockdown. Kudos to...",
    imageId: "testimonial-1",
  },
  {
    name: "Harak Singh",
    role: "Tractor Loans",
    testimonial: "I could buy a new tractor with advanced features due to the tractor loan financing support given...",
    imageId: "testimonial-2",
  },
  {
    name: "A Prakash",
    role: "MSME",
    testimonial: "I was one of the first customers of TVS Credit MSME loans. The loan helped me with...",
    imageId: "testimonial-3",
  },
  {
    name: "Hema Dhage",
    role: "Two-Wheeler Loans",
    testimonial: "Earlier, I used to take public transport to buy the raw materials for my business. Now I...",
    imageId: "testimonial-4",
  },
];

export function Testimonials() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => {
            const image = PlaceHolderImages.find(img => img.id === testimonial.imageId);
            return (
              <Card key={testimonial.name} className="flex flex-col">
                <CardHeader className="items-center">
                  {image && (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={image.imageUrl} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </CardHeader>
                <CardContent className="flex-grow text-center">
                  <p className="italic text-muted-foreground">"{testimonial.testimonial}"</p>
                </CardContent>
                <CardFooter className="flex-col items-center justify-center pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-12">
            {isClient && <Button variant="outline">View All</Button>}
        </div>
      </div>
    </section>
  );
}
