import { PrismaProjectMembersRepository } from "@/src/repositories/prisma/prisma-project-members-repository";
import { PrismaProjectsRepository } from "@/src/repositories/prisma/prisma-project-repository";
import { RemoveProjectMemberUseCase } from "../remove-project-member";

export function makeRemoveProjectMemberUseCase() {
  const projectsRepository = new PrismaProjectsRepository();
  const projectMembersRepository = new PrismaProjectMembersRepository();

  const useCase = new RemoveProjectMemberUseCase(
    projectMembersRepository,
    projectsRepository,
  );

  return useCase;
}
