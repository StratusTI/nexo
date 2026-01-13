export interface User {
  id: number
  nome: string
  sobrenome: string
  email: string
  foto: string
  telefone: string
  admin: boolean
  superadmin: boolean
  idempresa: number | null
  departamento: string | null
  time: string | null
  online: boolean
}
