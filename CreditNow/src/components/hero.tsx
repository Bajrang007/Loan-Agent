"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const formSchema = z.object({
  customerType: z.string(),
  loanType: z.string().min(1, { message: "Please select a loan type." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
});

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerType: "new",
      loanType: "",
      mobile: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Application Submitted!",
      description: "We have received your details and will get in touch shortly.",
    });
    form.reset();
  }
  
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Instant Loans for Your Every Need
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Get quick approval on a wide range of loans. Apply online in minutes and fulfill your dreams.
          </p>
          <Card className="max-w-lg shadow-lg">
            <CardContent className="p-6">
              {isClient && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="new" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="new">New Customer</TabsTrigger>
                      <TabsTrigger value="existing">Existing Customer</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Loan Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="What are you looking for?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="two-wheeler">Two Wheeler Loan</SelectItem>
                            <SelectItem value="used-car">Used Car Loan</SelectItem>
                            <SelectItem value="tractor">Tractor Loan</SelectItem>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="consumer-durable">Consumer Durable Loan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your 10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Quick Apply</Button>
                </form>
              </Form>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="relative hidden lg:block">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="rounded-xl object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
