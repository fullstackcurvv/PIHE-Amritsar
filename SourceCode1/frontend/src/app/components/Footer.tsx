import logo from '../../imports/logo.png';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer 
      className="px-20 py-12"
      style={{ backgroundColor: '#0D1829' }}
    >
      <div className="grid grid-cols-5 gap-12 mb-8">
        {/* Column 1: Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="ISKCON Logo" className="w-10 h-10 object-contain" />
            <span className="text-sm text-white tracking-wide" style={{ fontWeight: 700 }}>
              ISKCON<br />COURSE PORTAL
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF', lineHeight: 1.6 }}>
            Dedicated to providing authentic Vedic knowledge for the spiritual upliftment of all.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Facebook className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Instagram className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Youtube className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </a>
            <a 
              href="#" 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Twitter className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm text-white mb-4" style={{ fontWeight: 600 }}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Exam Guidelines
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-sm text-white mb-4" style={{ fontWeight: 600 }}>
            Support
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm" style={{ color: '#9CA3AF' }}>
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h3 className="text-sm text-white mb-4" style={{ fontWeight: 600 }}>
            Contact Us
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5" style={{ color: '#FF8000' }} />
              <a href="mailto:iskconcourses@example.com" className="text-sm" style={{ color: '#9CA3AF' }}>
                iskconcourses@example.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5" style={{ color: '#FF8000' }} />
              <span className="text-sm" style={{ color: '#9CA3AF' }}>
                +91 1234567890
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#FF8000' }} />
              <span className="text-sm" style={{ color: '#9CA3AF', lineHeight: 1.5 }}>
                ISKCON, Hare Krishna Land, India
              </span>
            </li>
          </ul>
        </div>

        {/* Column 5: Newsletter */}
        <div>
          <h3 className="text-sm text-white mb-4" style={{ fontWeight: 600 }}>
            Newsletter
          </h3>
          <p className="text-sm mb-4" style={{ color: '#9CA3AF', lineHeight: 1.5 }}>
            Subscribe to get updates on new courses and important announcements.
          </p>
          <div className="flex gap-2">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-lg text-sm"
              style={{ 
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: 'white'
              }}
            />
            <button 
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#FF8000' }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div 
        className="pt-8 border-t text-center"
        style={{ borderColor: '#1E293B' }}
      >
        <p className="text-sm" style={{ color: '#6B7280' }}>
          © 2026 ISKCON Course Portal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
