import { useEffect, useState } from 'react'
import { Award, Download, ExternalLink, Calendar } from 'lucide-react'
import { getMyCertificates, downloadCertificate } from '@/services/certificateService'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { Certificate } from '@/types/exam'

const MOCK_CERTIFICATES: Certificate[] = [
  {
    _id: 'cert1',
    student: 'u1',
    course: 'c1',
    courseTitle: 'Bhagavad Gita Foundation',
    certId: 'CERT-2026-A1B2C3D4',
    issuedAt: '2026-04-15T00:00:00Z',
  },
]

function CertificateCard({
  cert,
  onDownload,
  downloading,
}: {
  cert: Certificate
  onDownload: (id: string) => void
  downloading: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Certificate preview area */}
      <div
        className="h-40 flex flex-col items-center justify-center gap-3 relative"
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D5E 100%)',
        }}
      >
        {/* Decorative corner */}
        <div
          className="absolute top-0 left-0 w-16 h-16 rounded-br-full opacity-20"
          style={{ backgroundColor: '#E8720C' }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full opacity-20"
          style={{ backgroundColor: '#F5A623' }}
        />

        <Award size={40} style={{ color: '#F5A623' }} />
        <p className="text-white/80 text-xs tracking-widest uppercase font-semibold">
          Certificate of Completion
        </p>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
          {cert.courseTitle}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <Calendar size={12} />
          Issued:{' '}
          {new Date(cert.issuedAt).toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        <p className="text-xs text-gray-400 mb-4">
          ID: <span className="font-mono text-gray-600">{cert.certId}</span>
        </p>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            loading={downloading}
            icon={<Download size={14} />}
            onClick={() => onDownload(cert.certId)}
            className="flex-1"
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ExternalLink size={14} />}
            onClick={() => window.open(`/verify/${cert.certId}`, '_blank')}
            className="flex-1"
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    getMyCertificates()
      .then(setCertificates)
      .catch(() => setCertificates(MOCK_CERTIFICATES))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (certId: string) => {
    setDownloading(certId)
    try {
      await downloadCertificate(certId)
    } catch {
      alert('Failed to download certificate. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const displayCerts = certificates.length > 0 ? certificates : MOCK_CERTIFICATES

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-[#E8720C]" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          My Certificates
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Download and share your earned certificates
        </p>
      </div>

      {/* Grid */}
      {displayCerts.length === 0 ? (
        <div className="text-center py-16">
          <Award size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Certificates Yet</h2>
          <p className="text-gray-400 text-sm">
            Complete a course and pass the exam to earn your first certificate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCerts.map((cert) => (
            <CertificateCard
              key={cert._id}
              cert={cert}
              onDownload={handleDownload}
              downloading={downloading === cert.certId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
