import { PrismaProjectMembersRepository } from "@/src/repositories/prisma/prisma-project-members-repository";
import { PrismaProjectsRepository } from "@/src/repositories/prisma/prisma-project-repository";
import { UpdateProjectMemberRoleUseCase } from "../update-project-member-role";

export function makeUpdateProjectMemberRoleUseCase() {
  const projectsRepository = new PrismaProjectsRepository();
  const projectMembersRepository = new PrismaProjectMembersRepository();

  const useCase = new UpdateProjectMemberRoleUseCase(
    projectMembersRepository,
    projectsRepository,
  );

  return useCase;
}
