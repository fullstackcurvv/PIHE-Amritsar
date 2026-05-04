import { useNavigate } from 'react-router'
import { CheckCircle, Download, Home } from 'lucide-react'
import { motion } from 'motion/react'

export default function RegistrationSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#FFFAF5]">
      <div className="w-full max-w-2xl space-y-8">

        {/* Success Icon + Heading */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping" />
            <div className="relative bg-green-500 rounded-full p-5">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
          </div>

          <h1
            className="text-2xl font-semibold text-gray-900 mb-3"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Temple Registered Successfully!
          </h1>

          <p className="text-gray-600 text-sm max-w-lg">
            Your registration has been submitted. Our team will verify the details and send login
            credentials to the registered email addresses within 24–48 hours.
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <h3 className="font-semibold text-gray-900">What happens next?</h3>

          {[
            {
              n: 1,
              title: 'Verification Process',
              desc: 'Our team will verify the submitted documents and information.',
            },
            {
              n: 2,
              title: 'Account Creation',
              desc: 'User accounts will be created for the President and Vice President.',
            },
            {
              n: 3,
              title: 'Credentials Sent',
              desc: 'Login credentials will be sent to the registered email addresses within 24–48 hours.',
            },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-[#E8720C] font-semibold text-sm">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Confirmation email note */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>Registration Summary Sent:</strong> A confirmation email has been sent to the
            president's email address. Please check your inbox and spam folder.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#E8720C] text-white rounded-md hover:bg-[#C55E00] transition-colors font-medium text-sm"
          >
            Go to Login
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-8 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>

      </div>
    </div>
  )
}
