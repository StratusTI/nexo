import { User } from "@/src/@types/user";
import { prismaSteel } from "@/src/lib/prisma";
import { SearchUsersParams, UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: number): Promise<User | null> {
    const user = await prismaSteel.usuario.findUnique({
        where: { id }
      })

    if (!user || !user.email) return null

    return {
      id: user.id,
      nome: user.nome ?? '',
      sobrenome: user.sobrenome ?? '',
      email: user.email,
      foto: user.foto ?? '',
      telefone: user.telefone ?? '',
      admin: user.admin ?? false,
      superadmin: user.superadmin ?? false,
      idempresa: user.idempresa ?? null,
      departamento: user.departamento ?? null,
      time: user.time ?? '',
      online: user.online
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaSteel.usuario.findUnique({
        where: { email }
      })

    if (!user || !user.email) return null

    return {
      id: user.id,
      nome: user.nome ?? '',
      sobrenome: user.sobrenome ?? '',
      email: user.email,
      foto: user.foto ?? '',
      telefone: user.telefone ?? '',
      admin: user.admin ?? false,
      superadmin: user.superadmin ?? false,
      idempresa: user.idempresa ?? null,
      departamento: user.departamento ?? null,
      time: user.time ?? '',
      online: user.online
    }
  }

  async searchByCompany(params: SearchUsersParams): Promise<User[]> {
    const where: any = {
      idempresa: params.companyId,
      email: {
        not: null
      }
    }

    if (params.query && params.query.length >= 2) {
      where.OR = [
        { nome: { contains: params.query } },
        { sobrenome: { contains: params.query } },
        { email: { contains: params.query } }
      ]
    }

    const users = await prismaSteel.usuario.findMany({
      where,
      take: params.limit || 10,
      orderBy: [
        { nome: 'asc' },
        { sobrenome: 'asc'}
      ]
    })

    let filteredUsers = users

    if (params.excludeProjectId) {
      const { prismaElo } = await import('@/src/lib/prisma')

      const projectMember = await prismaElo.projetoMembro.findMany({
        where: { projetoId: params.excludeProjectId },
        select: { usuarioId: true }
      })

      const memberIds = projectMember.map(m => m.usuarioId)
      filteredUsers = filteredUsers.filter(u => !memberIds.includes(u.id))
    }

    return filteredUsers.map(user => ({
      id: user.id,
      nome: user.nome ?? '',
      sobrenome: user.sobrenome ?? '',
      email: user.email ?? '',
      foto: user.foto ?? '',
      telefone: user.telefone ?? '',
      admin: user.admin ?? false,
      superadmin: user.superadmin ?? false,
      idempresa: user.idempresa ?? null,
      departamento: user.departamento ?? null,
      time: user.time ?? '',
      online: user.online
    }))
  }
}
