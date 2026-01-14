import { User } from "@/src/@types/user";
import { prismaSteel } from "@/src/lib/prisma";
import { UsersRepository } from "../users-repository";

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
}
