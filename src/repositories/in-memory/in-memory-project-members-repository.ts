import { ProjectMember, ProjectRole } from "@/src/@types/project-role";
import { ProjectMembersRepository, ProjectMemberWithUser } from "../project-members-repository";

export class InMemoryProjectMembersRepository implements ProjectMembersRepository {
  public items: ProjectMember[] = []
  public users: Array<{
    id: number
    nome: string
    sobrenome: string
    email: string
    foto: string | null
  }> = []
  private idCounter = 1

  async findByUserAndProject(userId: number, projectId: number): Promise<ProjectMember[]> {
    return this.items.filter(
      (item) => item.usuarioId === userId && item.projetoId == projectId
    )
  }

  async findByProject(projectId: number): Promise<ProjectMember[]> {
    return this.items.filter((item) => item.projetoId === projectId)
  }

  async findByProjectWithUsers(projectId: number): Promise<ProjectMemberWithUser[]> {
    const members = this.items.filter((item) => item.projetoId === projectId)

    return members.map(member => {
      const user = this.users.find(u => u.id === member.usuarioId)

      if (!user) throw new Error(`User ${member.usuarioId} not found`)

      return {
        ...member,
        usuario: user
      }
    })
  }

  async countOwners(projectId: number): Promise<number> {
    return this.items.filter(
      (item) => item.projetoId === projectId && item.role == 'owner'
    ).length
  }

  async findMembership(projectId: number, userId: number, source?: string): Promise<ProjectMember | null> {
    const membership = this.items.find(
      (item) =>
        item.projetoId === projectId &&
        item.usuarioId === userId &&
        item.source === source
    )

    return membership || null
  }

  async create(data: { projectId: number; userId: number; role: ProjectRole; source?: string; }): Promise<ProjectMember> {
    const member: ProjectMember = {
      id: this.idCounter++,
      projetoId: data.projectId,
      usuarioId: data.userId,
      role: data.role,
      source: data.source || 'direct',
      adicionadoEm: new Date()
    }

    this.items.push(member)
    return member
  }

  async updateRole(id: number, role: ProjectRole): Promise<ProjectMember> {
    const member = this.items.find((item) => item.id === id)

    if (!member) throw new Error('Member not found')

    member.role = role

    return member
  }

  async delete(id: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error('Member not found')
    }

    this.items.splice(index, 1)
  }


  async deleteByUserAndProject(projectId: number, userId: number, source?: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.projetoId === projectId &&
        item.usuarioId === userId &&
        item.source === source
    )

    if (index === -1) throw new Error('Membership not found')

    this.items.splice(index, 1)
  }
}
