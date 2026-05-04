import { createContext, useContext, useState, ReactNode } from 'react'

export interface FamilyMember {
  name: string
  relation: string
  age: string
}

export interface TempleData {
  templeName: string
  gstn: string
  templeAddress1: string
  templeAddress2: string
  country: string
  state: string
  city: string
  pincode: string
  templeLogo: string | null
}

export interface PersonData {
  fullName: string
  dob: string
  gender: string
  fatherName: string
  address1: string
  address2: string
  city: string
  state: string
  country: string
  pincode: string
  mobile: string
  mobileVerified: boolean
  googleEmail: string
  govtIdType: string
  govtIdNumber: string
  govtIdFile: string | null
  photo: string | null
  altPhone: string
  emergencyContact: string
  occupation: string
  orgName: string
  workAddress: string
  familyMembers: FamilyMember[]
  initiationName: string
  guru: string
  yearsWithISKCON: string
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

const TempleFormContext = createContext<TempleFormContextType | undefined>(undefined)

export const useTempleFormContext = () => {
  const ctx = useContext(TempleFormContext)
  if (!ctx) throw new Error('useTempleFormContext must be used within TempleFormProvider')
  return ctx
}

const EMPTY_PERSON: PersonData = {
  fullName: '',
  dob: '',
  gender: '',
  fatherName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  mobile: '',
  mobileVerified: false,
  googleEmail: '',
  govtIdType: '',
  govtIdNumber: '',
  govtIdFile: null,
  photo: null,
  altPhone: '',
  emergencyContact: '',
  occupation: '',
  orgName: '',
  workAddress: '',
  familyMembers: [],
  initiationName: '',
  guru: '',
  yearsWithISKCON: '',
}

export const TempleFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<TempleFormData>({
    temple: {
      templeName: '',
      gstn: '',
      templeAddress1: '',
      templeAddress2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      templeLogo: null,
    },
    president: { ...EMPTY_PERSON },
    vicePresident: { ...EMPTY_PERSON },
  })

  const updateTemple = (data: Partial<TempleData>) =>
    setFormData(prev => ({ ...prev, temple: { ...prev.temple, ...data } }))

  const updatePresident = (data: Partial<PersonData>) =>
    setFormData(prev => ({ ...prev, president: { ...prev.president, ...data } }))

  const updateVicePresident = (data: Partial<PersonData>) =>
    setFormData(prev => ({ ...prev, vicePresident: { ...prev.vicePresident, ...data } }))

  return (
    <TempleFormContext.Provider value={{ formData, updateTemple, updatePresident, updateVicePresident }}>
      {children}
    </TempleFormContext.Provider>
  )
}
