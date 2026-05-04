import { Link } from 'react-router'
import { UserPlus, BookMarked, BookOpen, Award, FileCheck, Download, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const STEPS = [
  {
    icon: <UserPlus size={32} />,
    number: '01',
    title: 'Register & Get Student ID',
    color: '#E8720C',
    points: [
      'Fill in your name, email, and set a password',
      'Verify your email address',
      'Receive your unique PIHE Student ID automatically',
      'Access your personal student dashboard',
    ],
  },
  {
    icon: <BookMarked size={32} />,
    number: '02',
    title: 'Enroll in Courses',
    color: '#10B981',
    points: [
      'Browse free and paid course catalog',
      'Enroll instantly in free courses',
      'One-time payment for premium courses',
      'Unlimited re-access after enrollment',
    ],
  },
  {
    icon: <BookOpen size={32} />,
    number: '03',
    title: 'Learn at Your Pace',
    color: '#3B82F6',
    points: [
      'Access HD video lessons anytime',
      'Download study materials (PDF)',
      'Take notes within the platform',
      'Track your progress lesson by lesson',
    ],
  },
  {
    icon: <Award size={32} />,
    number: '04',
    title: 'Attempt the Exam',
    color: '#8B5CF6',
    points: [
      'Online MCQ exam (30 questions, 60 min)',
      'Offline paper upload option available',
      'Minimum passing score: 40%',
      'Retake policy: 3 attempts per exam',
    ],
  },
  {
    icon: <FileCheck size={32} />,
    number: '05',
    title: 'Evaluation',
    color: '#F59E0B',
    points: [
      'Examiner reviews your submission',
      'Marks and remarks added within 7 days',
      'Admin approves final results',
      'You are notified by email',
    ],
  },
  {
    icon: <Download size={32} />,
    number: '06',
    title: 'Get Your Certificate',
    color: '#E8720C',
    points: [
      'PDF certificate generated automatically',
      'Download from your dashboard anytime',
      'Unique verification QR code included',
      'Recognized by ISKCON institutions',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>How It Works</h1>
          <div className="h-1 w-20 rounded-full mx-auto mb-6" style={{ backgroundColor: '#E8720C' }} />
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From registration to certification — your complete learning journey with ISKCON Course Portal.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-8 items-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8`}
            >
              <div className="flex-shrink-0 flex flex-col items-center text-center sm:text-left sm:items-start w-full sm:w-64">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${step.color}15` }}>
                  <span style={{ color: step.color }}>{step.icon}</span>
                </div>
                <div className="text-4xl font-bold mb-1" style={{ color: step.color, fontFamily: 'Cinzel, serif' }}>{step.number}</div>
                <h3 className="font-semibold text-xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>{step.title}</h3>
              </div>
              <div className="flex-1">
                <ul className="space-y-3">
                  {step.points.map(p => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: step.color }} />
                      <span className="text-gray-600 text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: '#FFFAF5' }}>
        <h2 className="font-bold text-3xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Ready to begin?</h2>
        <p className="text-gray-500 mb-8">Start your spiritual journey today — it's free to register.</p>
        <Link to="/register"><Button variant="primary" size="lg">Register Now →</Button></Link>
      </section>
    </div>
  )
}
