import { PrismaGlobalSearchRepository } from '../../repositories/prisma/prisma-global-search-repository'
import { GlobalSearchUseCase } from '../global-search'

export function makeGlobalSearchUseCase(): GlobalSearchUseCase {
  const globalSearchRepository = new PrismaGlobalSearchRepository()
  return new GlobalSearchUseCase(globalSearchRepository)
}
