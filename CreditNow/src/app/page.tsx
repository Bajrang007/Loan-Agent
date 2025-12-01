import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/hero";
import { ProductShowcase } from "@/components/product-showcase";
import { ChatbotFab } from "@/components/chatbot-fab";
import { Offers } from "@/components/offers";
import { FeaturesBenefits } from "@/components/features-benefits";
import { Journey } from "@/components/journey";
import { Testimonials } from "@/components/testimonials";
import { AppPromo } from "@/components/app-promo";
import { PreApprovedOffer } from "@/components/pre-approved-offer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Offers />
        <ProductShowcase />
        <FeaturesBenefits />
        <PreApprovedOffer />
        <Journey />
        <Testimonials />
        <AppPromo />
      </main>
      <ChatbotFab />
      <Footer />
    </div>
  );
}
