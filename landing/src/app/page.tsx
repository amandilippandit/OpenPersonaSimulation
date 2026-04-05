import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import GraphSection from "@/components/GraphSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import DeveloperSection from "@/components/DeveloperSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#fafafa] text-slate-900">
      <Nav />
      <Hero />
      <GraphSection />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <Features />
      <UseCases />
      <DeveloperSection />
      <CTASection />
      <Footer />
    </main>
  );
}
