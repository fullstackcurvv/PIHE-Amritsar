import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const initialForm: ContactForm = { name: '', email: '', subject: '', message: '' }

const CONTACT_DETAILS = [
  { icon: <Mail size={20} />,    label: 'Email',   value: 'iskconcourses@example.com', href: 'mailto:iskconcourses@example.com', color: '#E8720C' },
  { icon: <Phone size={20} />,   label: 'Phone',   value: '+91 12345 67890',            href: 'tel:+911234567890',                color: '#10B981' },
  { icon: <MapPin size={20} />,  label: 'Address', value: 'ISKCON, Hare Krishna Land, Amritsar, Punjab, India', href: '#',       color: '#3B82F6' },
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const validate = (): boolean => {
    const e: Partial<ContactForm> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim() || form.message.length < 20) e.message = 'Message must be at least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setForm(initialForm)
    setErrors({})
    showToast("Message sent! We'll get back to you within 1–2 business days.", 'success')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Contact Us</h1>
          <div className="h-1 w-16 rounded-full mx-auto mb-4" style={{ backgroundColor: '#E8720C' }} />
          <p className="text-gray-500 text-lg max-w-xl mx-auto">We'd love to hear from you. Reach out with any questions or feedback.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-semibold text-2xl text-gray-900 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Your Name"
                      placeholder="Arjuna Das"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      error={errors.email}
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    placeholder="Inquiry about course enrollment"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    error={errors.subject}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8720C] focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  </div>
                  <Button type="submit" variant="primary" size="lg" loading={loading} icon={<Send size={16} />} className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                <h2 className="font-semibold text-2xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Get in Touch</h2>
                {CONTACT_DETAILS.map(({ icon, label, value, href, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <span style={{ color }}>{icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <a href={href} className="text-sm text-gray-700 hover:text-[#E8720C] transition-colors leading-relaxed">{value}</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-56 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.4!2d74.8723!3d31.6340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM4JzAyLjQiTiA3NMKwNTInMjAuMyJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ISKCON Amritsar location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
