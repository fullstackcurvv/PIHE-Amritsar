import { Link } from 'react-router'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Send, GraduationCap } from 'lucide-react'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="bg-[#0D1829] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#E8720C] rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                ISKCON<br />COURSE PORTAL
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Dedicated to providing authentic Vedic knowledge for the spiritual upliftment of all.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center hover:bg-[#E8720C] transition-colors" aria-label="Social link">
                  <Icon size={15} className="text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {['About Us', 'Courses', 'How It Works', 'Exam Guidelines', 'Contact Us'].map(label => (
                <li key={label}>
                  <Link to={`/${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-[#E8720C] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2.5">
              {['Help Center', 'FAQs', 'Privacy Policy', 'Terms & Conditions'].map(label => (
                <li key={label}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#E8720C] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={15} className="text-[#E8720C] mt-0.5 flex-shrink-0" />
                <a href="mailto:iskconcourses@example.com" className="text-sm text-gray-400 hover:text-white break-all">
                  iskconcourses@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#E8720C] flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 12345 67890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-[#E8720C] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">ISKCON, Hare Krishna Land, Amritsar, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Subscribe to get updates on new courses and important announcements.
            </p>
            {subscribed ? (
              <p className="text-sm text-green-400 font-medium py-1">✓ Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-[#1E293B] border border-[#334155] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8720C]"
                />
                <button type="submit" className="px-3 py-2 bg-[#E8720C] rounded-lg hover:bg-[#C55E00] transition-colors flex-shrink-0" aria-label="Subscribe">
                  <Send size={15} className="text-white" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1E293B] text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ISKCON Course Portal. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
