import { PrismaProjectMembersRepository } from "@/src/repositories/prisma/prisma-project-members-repository";
import { PrismaProjectsRepository } from "@/src/repositories/prisma/prisma-project-repository";
import { PrismaUsersRepository } from "@/src/repositories/prisma/prisma-users-repository";
import { AddProjectMemberUseCase } from "../add-project-member";

export function makeAddProjectMemberUseCase() {
  const projectsRepository = new PrismaProjectsRepository();
  const projectMembersRepository = new PrismaProjectMembersRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new AddProjectMemberUseCase(
    projectMembersRepository,
    projectsRepository,
    usersRepository
  );

  return useCase;
}
