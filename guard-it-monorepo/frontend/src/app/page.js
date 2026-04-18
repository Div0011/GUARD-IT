import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import StrategicOverview from '@/components/StrategicOverview';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <StrategicOverview />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
