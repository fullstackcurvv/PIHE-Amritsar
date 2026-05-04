import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { UserPlus, BookMarked, BookOpen, Award, CheckCircle, Users, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CourseGrid } from '@/components/course/CourseGrid'
import { getMockCourses } from '@/services/courseService'
import type { Course } from '@/types/course'

const TRUST_BADGES = [
  { icon: <CheckCircle size={16} />, label: 'Authentic Content' },
  { icon: <Users size={16} />, label: 'Expert Guidance' },
  { icon: <Shield size={16} />, label: 'Certified Learning' },
]

const HOW_IT_WORKS = [
  { icon: <UserPlus size={28} />, title: '1. Register',     desc: 'Create your account in few simple steps.' },
  { icon: <BookMarked size={28} />, title: '2. Enroll',     desc: 'Choose and enroll in your desired courses.' },
  { icon: <BookOpen size={28} />, title: '3. Learn',        desc: 'Access lessons, study materials and exams.' },
  { icon: <Award size={28} />, title: '4. Get Certified',   desc: 'Complete exams and earn your certificate.' },
]

const STATS = [
  { icon: <Users size={32} />, value: '25K+', label: 'Students Enrolled',  color: '#E8720C' },
  { icon: <BookOpen size={32} />, value: '120+', label: 'Courses Available', color: '#10B981' },
  { icon: <BookMarked size={32} />, value: '10K+', label: 'Exams Completed', color: '#3B82F6' },
  { icon: <Award size={32} />, value: '8K+',  label: 'Certificates Issued', color: '#8B5CF6' },
]

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use mock data — will switch to real API once backend is running
    setTimeout(() => {
      setCourses(getMockCourses())
      setLoading(false)
    }, 300)
  }, [])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80"
            alt="ISKCON Amritsar"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(26,26,46,0.88) 0%, rgba(232,114,12,0.35) 100%)' }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="font-bold text-white leading-tight" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem,5vw,3.75rem)' }}>
              Learn. Understand.
              <br />
              <span style={{ color: '#E8720C' }}>Transform.</span>
            </h1>
            <p className="mt-6 text-white/80 text-lg max-w-xl leading-relaxed">
              Authentic ISKCON courses designed for spiritual growth and self-realization.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses">
                <Button variant="primary" size="lg">Explore Courses →</Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="white" size="lg" className="border border-white/40">▶ How It Works</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {TRUST_BADGES.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/90 text-sm">
                  <span className="text-[#E8720C]">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Courses ───────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: '#FFFAF5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-bold text-3xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Popular Courses</h2>
              <div className="h-1 w-16 rounded-full mt-2" style={{ backgroundColor: '#E8720C' }} />
            </div>
            <Link to="/courses" className="flex items-center gap-1 text-sm font-semibold text-[#E8720C] hover:underline">
              View All Courses <ChevronRight size={16} />
            </Link>
          </div>
          <CourseGrid courses={courses} loading={loading} columns={4} />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>How It Works</h2>
            <div className="h-1 w-16 rounded-full mt-2 mx-auto" style={{ backgroundColor: '#E8720C' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gray-200 z-0">
                    <ChevronRight size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300" />
                  </div>
                )}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative z-10" style={{ backgroundColor: '#FDE8D8' }}>
                  <span className="text-[#E8720C]">{step.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ─────────────────────────────────── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D50 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-white" style={{ fontFamily: 'Cinzel, serif' }}>Trusted by Learners Worldwide</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${color}20` }}>
                  <span style={{ color }}>{icon}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8720C 0%, #C55E00 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Begin your spiritual journey today</h2>
          <p className="text-white/90 text-lg mb-8">Join thousands of learners in exploring the wisdom of Vedic knowledge.</p>
          <Link to="/register">
            <Button variant="white" size="lg">Get Started Now →</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
