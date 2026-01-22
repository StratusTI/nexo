import { ProjectMember, ProjectRole } from "../@types/project-role";

export interface ProjectMemberWithUser extends ProjectMember {
  usuario: {
    id: number
    nome: string
    sobrenome: string
    email: string
    foto: string | null
  }
}

export interface ProjectMembersRepository {
  findByUserAndProject(userId: number, projectId: number): Promise<ProjectMember[]>
  findByProject(projectId: number): Promise<ProjectMember[]>
  findByProjectWithUsers(projectId: number): Promise<ProjectMemberWithUser[]>
  countOwners(projectId: number): Promise<number>
  findMembership(projectId: number, userId: number, source?: string): Promise<ProjectMember | null>
  create(data: {
    projectId: number,
    userId: number,
    role: ProjectRole,
    source?: string
  }): Promise<ProjectMember>
  updateRole(id: number, role: ProjectRole): Promise<ProjectMember>
  delete(id: number): Promise<void>
  deleteByUserAndProject(userId: number, projectId: number, source?: string): Promise<void>
}
