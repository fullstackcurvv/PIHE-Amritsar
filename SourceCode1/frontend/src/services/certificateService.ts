import api from './api'
import type { Certificate } from '@/types/exam'

export const getMyCertificates = async (): Promise<Certificate[]> => {
  const res = await api.get('/certificates/my')
  return res.data.data
}

export const downloadCertificate = async (certId: string): Promise<void> => {
  const res = await api.get(`/certificates/${certId}/download`, { responseType: 'blob' })
  const url = URL.createObjectURL(res.data as Blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ISKCON-Certificate-${certId}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const verifyCertificate = async (certId: string) => {
  const res = await api.get(`/certificates/verify/${certId}`)
  return res.data.data
}
