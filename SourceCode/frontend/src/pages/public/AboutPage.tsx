import { BookOpen, Users, Award, Heart, Globe, Star } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

const STATS = [
  { value: '25K+', label: 'Students Enrolled',  color: '#E8720C' },
  { value: '120+', label: 'Courses Available',   color: '#10B981' },
  { value: '10K+', label: 'Exams Completed',     color: '#3B82F6' },
  { value: '8K+',  label: 'Certificates Issued', color: '#8B5CF6' },
]

const VALUES = [
  { icon: <BookOpen size={24} />, title: 'Authentic Knowledge',  color: '#E8720C', desc: 'Every course is rooted in original Vedic scriptures and ISKCON teachings.' },
  { icon: <Users size={24} />,    title: 'Inclusive Community',  color: '#10B981', desc: 'Open to all — regardless of background, age, or prior knowledge.' },
  { icon: <Award size={24} />,    title: 'Certified Excellence', color: '#3B82F6', desc: 'Verifiable certificates recognized across ISKCON institutions globally.' },
  { icon: <Heart size={24} />,    title: 'Devotional Service',   color: '#8B5CF6', desc: 'Our platform is built and maintained as an act of devotional service (seva).' },
  { icon: <Globe size={24} />,    title: 'Global Reach',         color: '#F59E0B', desc: 'Students from over 50 countries have enrolled in our courses.' },
  { icon: <Star size={24} />,     title: 'Quality First',        color: '#E8720C', desc: 'Every course undergoes review by senior devotees and educators.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="font-bold text-4xl sm:text-5xl text-gray-900 leading-tight mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                About ISKCON<br /><span style={{ color: '#E8720C' }}>Course Portal</span>
              </h1>
              <div className="h-1 w-16 rounded-full mb-6" style={{ backgroundColor: '#E8720C' }} />
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                The ISKCON Amritsar Course Portal is a digital education platform dedicated to spreading the timeless wisdom of Vedic knowledge to spiritual seekers worldwide.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Founded under the guidance of ISKCON Amritsar, our platform bridges the gap between ancient wisdom and modern learning — making authentic Vaishnava education accessible to everyone.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1604608672516-5b8b41c5a5cc?w=800&q=80"
                alt="ISKCON Temple"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-semibold text-lg" style={{ fontFamily: 'Cinzel, serif' }}>ISKCON Amritsar</p>
                <p className="text-sm text-white/80">Hare Krishna Land, Punjab</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Our Mission</h2>
          <div className="h-1 w-16 rounded-full mx-auto mb-6" style={{ backgroundColor: '#E8720C' }} />
          <p className="text-gray-600 text-lg leading-relaxed">
            To provide authentic, structured, and accessible Vedic education — empowering students to understand the philosophy of Krishna consciousness, apply it in daily life, and share this wisdom with others.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D50 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, color }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, serif', color }}>{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Our Core Values</h2>
            <div className="h-1 w-16 rounded-full mx-auto" style={{ backgroundColor: '#E8720C' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, color, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
                  <span style={{ color }}>{icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: '#FFFAF5' }}>
        <h2 className="font-bold text-3xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Join Our Community</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">Be part of a global community of spiritual seekers dedicated to the teachings of Lord Krishna.</p>
        <Link to="/register"><Button variant="primary" size="lg">Start Learning Today →</Button></Link>
      </section>
    </div>
  )
}
