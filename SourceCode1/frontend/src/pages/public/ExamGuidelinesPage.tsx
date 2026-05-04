import { useState } from 'react'
import { Monitor, FileText, Clock, Target, Upload, Award, ChevronDown, ChevronUp } from 'lucide-react'

const GUIDELINES = [
  {
    icon: <Monitor size={24} />,
    title: 'Online MCQ Exam',
    color: '#3B82F6',
    items: [
      '30 multiple-choice questions per exam',
      'Duration: 60 minutes (timed)',
      'Questions drawn from course content',
      'Instant result on submission',
    ],
  },
  {
    icon: <FileText size={24} />,
    title: 'Offline Written Exam',
    color: '#8B5CF6',
    items: [
      'Download the question paper from portal',
      'Answer on paper in your own handwriting',
      'Scan and upload as a single PDF file',
      'Max file size: 10 MB',
    ],
  },
  {
    icon: <Clock size={24} />,
    title: 'Duration & Format',
    color: '#E8720C',
    items: [
      'Online: 60 minutes from start time',
      'Offline: 2 hours (self-supervised)',
      'Timer visible on screen during online exam',
      'Auto-submit when time expires',
    ],
  },
  {
    icon: <Target size={24} />,
    title: 'Passing Criteria',
    color: '#10B981',
    items: [
      'Minimum 40% to pass (12/30 questions)',
      'Distinction: 70%+',
      'Fail: Below 40%',
      'Maximum 3 attempts per exam',
    ],
  },
  {
    icon: <Upload size={24} />,
    title: 'Offline Upload Instructions',
    color: '#F59E0B',
    items: [
      'PDF format only (no images or Word docs)',
      'File must be under 10 MB',
      'Pages must be in correct order',
      'Submit via the exam section in your dashboard',
    ],
  },
  {
    icon: <Award size={24} />,
    title: 'Result & Certificate',
    color: '#E8720C',
    items: [
      'Online results: Instant',
      'Offline results: Within 7 working days',
      'Certificate issued after admin approval',
      'Download PDF certificate from dashboard',
    ],
  },
]

const FAQS = [
  { q: 'Can I attempt the exam more than once?', a: 'Yes, you have up to 3 attempts per exam. Your highest score will be counted.' },
  { q: 'Is there a time limit for the offline exam?', a: 'The offline exam is self-supervised with a recommended duration of 2 hours. Submit your PDF within 24 hours of downloading.' },
  { q: 'What format should the offline answer sheet be in?', a: 'Upload only PDF files, maximum 10 MB. Convert all pages into a single PDF before uploading.' },
  { q: 'When will I receive my certificate?', a: 'Online exam certificates are generated within 24 hours of passing. Offline exams take 7–10 working days after evaluator review.' },
  { q: 'What happens if I fail the exam?', a: 'You may retake the exam after a 24-hour cooldown period. You have up to 3 attempts before the exam is locked.' },
  { q: 'Can I pause an online exam midway?', a: 'No. Once started, the timer runs continuously. Make sure you are in a stable environment before starting.' },
]

export default function ExamGuidelinesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Exam Guidelines</h1>
          <div className="h-1 w-20 rounded-full mx-auto mb-6" style={{ backgroundColor: '#E8720C' }} />
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know before attempting your ISKCON Course Portal examination.
          </p>
        </div>
      </section>

      {/* Guidelines Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {GUIDELINES.map(({ icon, title, color, items }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    <span style={{ color }}>{icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>{title}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-3xl text-gray-900 mb-2 text-center" style={{ fontFamily: 'Cinzel, serif' }}>Frequently Asked Questions</h2>
            <div className="h-1 w-16 rounded-full mx-auto mb-8" style={{ backgroundColor: '#E8720C' }} />
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} className="flex-shrink-0 text-[#E8720C]" /> : <ChevronDown size={18} className="flex-shrink-0 text-gray-400" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
