import { MessageCircle, Mail, Phone } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          Support
        </h1>
        <p className="text-gray-500 text-sm mt-1">Get help with your studies</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
        <MessageCircle size={48} className="mx-auto mb-4" style={{ color: '#E8720C' }} />
        <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          Need Help?
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Our support team is here to assist you with any questions about courses, exams, or certificates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@iskconamritsar.org"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Mail size={16} style={{ color: '#E8720C' }} />
            Email Support
          </a>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Phone size={16} style={{ color: '#E8720C' }} />
            Call Us
          </a>
        </div>
      </div>
    </div>
  )
}
