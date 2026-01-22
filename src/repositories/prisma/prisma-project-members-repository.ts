import { ProjectMember, ProjectRole } from "@/src/@types/project-role";
import { prismaElo, prismaSteel } from "@/src/lib/prisma";
import { ProjectMembersRepository, ProjectMemberWithUser } from "../project-members-repository";

export class PrismaProjectMembersRepository implements ProjectMembersRepository {
  async findByUserAndProject(userId: number, projectId: number): Promise<ProjectMember[]> {
    const members = await prismaElo.projetoMembro.findMany({
      where: {
        usuarioId: userId,
        projetoId: projectId
      }
    })

    return members.map((member) => ({
      id: member.id,
      projetoId: member.projetoId,
      usuarioId: member.usuarioId,
      role: (member.role as ProjectRole) ?? 'member',
      source: member.source ?? 'direct',
      adicionadoEm: member.adicionadoEm ?? new Date()
    }))
  }

  async findByProject(projectId: number): Promise<ProjectMember[]> {
    const members = await prismaElo.projetoMembro.findMany({
      where: {
        projetoId: projectId
      }
    })

    return members.map((member) => ({
      id: member.id,
      projetoId: member.projetoId,
      usuarioId: member.usuarioId,
      role: (member.role as ProjectRole) ?? 'member',
      source: member.source ?? 'direct',
      adicionadoEm: member.adicionadoEm ?? new Date()
    }))
  }

  async findByProjectWithUsers(projectId: number): Promise<ProjectMemberWithUser[]> {
    const members = await prismaElo.projetoMembro.findMany({
      where: {
        projetoId: projectId
      }
    })

    if (members.length === 0) return []

    const userIds = members.map(m => m.usuarioId)

    const users = await prismaSteel.usuario.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        foto: true
      }
    })

    const usersMap = new Map(users.map(u => [u.id, u]))

    return members.map((member) => {
      const user = usersMap.get(member.usuarioId)

      if (!user) throw new Error(`User ${member.usuarioId} not found`)

      return {
        id: member.id,
        projetoId: member.projetoId,
        usuarioId: member.usuarioId,
        role: (member.role as ProjectRole) ?? 'member',
        source: member.source ?? 'direct',
        adicionadoEm: member.adicionadoEm ?? new Date(),
        usuario: {
          id: user.id,
          nome: user.nome ?? '',
          sobrenome: user.sobrenome ?? '',
          email: user.email ?? '',
          foto: user.foto ?? null
        }
      }
    })
  }

  async countOwners(projectId: number): Promise<number> {
    return await prismaElo.projetoMembro.count({
      where: {
        projetoId: projectId,
        role: 'owner'
      }
    })
  }

  async findMembership(projectId: number, userId: number, source?: string): Promise<ProjectMember | null> {
    const member = await prismaElo.projetoMembro.findFirst({
      where: {
        projetoId: projectId,
        usuarioId: userId,
        source: source
      }
    })

    if (!member) return null

    return {
      id: member.id,
      projetoId: member.projetoId,
      usuarioId: member.usuarioId,
      role: (member.role as ProjectRole) ?? 'member',
      source: member.source ?? 'direct',
      adicionadoEm: member.adicionadoEm as Date,
    }
  }

  async create(data: { projectId: number; userId: number; role: ProjectRole; source?: string; }): Promise<ProjectMember> {
    const member = await prismaElo.projetoMembro.create({
      data: {
        projetoId: data.projectId,
        usuarioId: data.userId,
        role: data.role as any,
        source: data.source ?? 'direct'
      }
    })

    return {
       id: member.id,
       projetoId: member.projetoId,
       usuarioId: member.usuarioId,
       role: (member.role as ProjectRole) ?? 'member',
       source: member.source ?? 'direct',
       adicionadoEm: member.adicionadoEm as Date,
    }
  }

  async updateRole(id: number, role: ProjectRole): Promise<ProjectMember> {
    const member = await prismaElo.projetoMembro.update({
      where: { id },
      data: { role: role as any }
    })

    return {
      id: member.id,
      projetoId: member.projetoId,
      usuarioId: member.usuarioId,
      role: (member.role as ProjectRole) ?? 'member',
      source: member.source ?? 'direct',
      adicionadoEm: member.adicionadoEm as Date,
    }
  }

  async delete(id: number): Promise<void> {
    await prismaElo.projetoMembro.delete({
      where: { id }
    })
  }

  async deleteByUserAndProject(userId: number, projectId: number, source?: string): Promise<void> {
    await prismaElo.projetoMembro.deleteMany({
      where: { usuarioId: userId, projetoId: projectId, source: source ?? 'direct' }
    })
  }
}
