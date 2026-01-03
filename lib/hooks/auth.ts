import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface UserData {
  id: string
  email: string
  name: string
  admin: boolean
  superadmin: boolean
  idempresa: string
  empresa: string
}

export async function useUser(): Promise<UserData | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserData
    return decoded
  } catch (error) {
    return null
  }
}
