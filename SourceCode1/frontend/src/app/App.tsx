import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Features } from './components/Features';
import { CoursesSection } from './components/CoursesSection';
import { HowItWorks } from './components/HowItWorks';
import { Statistics } from './components/Statistics';
import { CTABanner } from './components/CTABanner';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5EE' }}>
      <Navbar />
      <HeroSection />
      <Features />
      <CoursesSection />
      <HowItWorks />
      <Statistics />
      <CTABanner />
      <Footer />
    </div>
  );
}
