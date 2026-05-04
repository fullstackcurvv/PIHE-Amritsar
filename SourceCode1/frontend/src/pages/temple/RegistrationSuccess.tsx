import { useNavigate } from 'react-router'
import { CheckCircle } from 'lucide-react'
import { motion } from 'motion/react'

export default function RegistrationSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </motion.div>

        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          Temple Registered Successfully!
        </h1>

        <p className="text-gray-600 text-sm">
          Login credentials have been created for the President &amp; Vice-President
          and sent to their registered email addresses.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-2 bg-[#E8720C] text-white rounded-md hover:bg-[#c4610a] transition-colors font-medium text-sm"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
