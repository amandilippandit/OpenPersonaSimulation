import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import GraphSection from "@/components/GraphSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-ink-300">
      <Nav />
      <Hero />
      <GraphSection />
      <HowItWorks />
      <Features />
      <UseCases />
      <CTASection />
      <Footer />
    </main>
  );
}
