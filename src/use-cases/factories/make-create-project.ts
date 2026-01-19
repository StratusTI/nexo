import { PrismaProjectMembersRepository } from "@/src/repositories/prisma/prisma-project-members-repository";
import { PrismaProjectsRepository } from "@/src/repositories/prisma/prisma-project-repository";
import { CreateProjectUseCase } from "../create-project";

export function makeCreateProjectUseCase(): CreateProjectUseCase {
  const projectRepository = new PrismaProjectsRepository()
  const projectMembersRepository = new PrismaProjectMembersRepository()

  return new CreateProjectUseCase(projectRepository, projectMembersRepository)
}
