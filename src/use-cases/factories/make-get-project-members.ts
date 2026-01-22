import { PrismaProjectMembersRepository } from "@/src/repositories/prisma/prisma-project-members-repository";
import { GetProjectMembersUseCase } from "../get-project-members";

export function makeGetProjectMembersUsecase(): GetProjectMembersUseCase {
  const projectMembersRepository = new PrismaProjectMembersRepository();
  const usecase = new GetProjectMembersUseCase(projectMembersRepository);

  return usecase;
}
