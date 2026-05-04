import { createContext, useContext, useState, ReactNode } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TempleData {
  templeName: string
  gstNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  pinCode: string
  logo: string | null
}

export interface PersonData {
  photo: string | null
  name: string
  mobile: string
  mobileVerified: boolean
  pan: string
  aadhar: string
  email: string
  idCard: string | null
}

export interface TempleFormData {
  temple: TempleData
  president: PersonData
  vicePresident: PersonData
}

interface TempleFormContextType {
  formData: TempleFormData
  updateTemple: (data: Partial<TempleData>) => void
  updatePresident: (data: Partial<PersonData>) => void
  updateVicePresident: (data: Partial<PersonData>) => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const TempleFormContext = createContext<TempleFormContextType | undefined>(undefined)

export const useTempleFormContext = () => {
  const context = useContext(TempleFormContext)
  if (!context) {
    throw new Error('useTempleFormContext must be used within TempleFormProvider')
  }
  return context
}

// ── Provider ──────────────────────────────────────────────────────────────────

const EMPTY_PERSON: PersonData = {
  photo: null,
  name: '',
  mobile: '',
  mobileVerified: false,
  pan: '',
  aadhar: '',
  email: '',
  idCard: null,
}

export const TempleFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<TempleFormData>({
    temple: {
      templeName: '',
      gstNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      logo: null,
    },
    president: { ...EMPTY_PERSON },
    vicePresident: { ...EMPTY_PERSON },
  })

  const updateTemple = (data: Partial<TempleData>) =>
    setFormData((prev) => ({ ...prev, temple: { ...prev.temple, ...data } }))

  const updatePresident = (data: Partial<PersonData>) =>
    setFormData((prev) => ({ ...prev, president: { ...prev.president, ...data } }))

  const updateVicePresident = (data: Partial<PersonData>) =>
    setFormData((prev) => ({ ...prev, vicePresident: { ...prev.vicePresident, ...data } }))

  return (
    <TempleFormContext.Provider value={{ formData, updateTemple, updatePresident, updateVicePresident }}>
      {children}
    </TempleFormContext.Provider>
  )
}
