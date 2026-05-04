import hero1 from '../../imports/hero1.png';
import hero2 from '../../imports/hero2.png';
import { CheckCircle, PlayCircle, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="px-20 py-20" style={{ backgroundColor: '#F7F5EE' }}>
      <div className="flex items-center gap-12">
        {/* Hero Text */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-6xl leading-tight" style={{ fontWeight: 700, color: '#1A1A1A' }}>
            Learn. Understand.{' '}
            <span style={{ color: '#FF8000' }}>Transform.</span>
          </h1>
          <p className="text-base" style={{ color: '#666', lineHeight: 1.6 }}>
            Authentic ISKCON courses designed for spiritual growth and self-realization.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <button 
              className="px-6 py-3 rounded-lg text-sm text-white flex items-center gap-2"
              style={{ 
                fontWeight: 500,
                backgroundColor: '#FF8000'
              }}
            >
              Explore Courses
              <span>→</span>
            </button>
            <button 
              className="px-6 py-3 rounded-lg text-sm flex items-center gap-2 border"
              style={{ 
                fontWeight: 500,
                color: '#333',
                borderColor: '#E0E0E0',
                backgroundColor: 'white'
              }}
            >
              How It Works
              <PlayCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-[600px] h-[400px]">
          <img 
            src={hero1} 
            alt="ISKCON Temple" 
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />
          <img 
            src={hero2} 
            alt="Sacred Scripture" 
            className="absolute bottom-4 right-4 w-64 h-48 object-cover rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
