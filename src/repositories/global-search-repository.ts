import {
  SearchResult,
  SearchEntityType,
  ProjectSearchResult,
  SprintSearchResult,
  TaskSearchResult,
  DocumentSearchResult,
} from '../@types/search'

export interface SearchFilters {
  query: string
  companyId: number
  types?: SearchEntityType[]
  limit?: number
}

export interface GlobalSearchRepository {
  /**
   * Busca em múltiplas entidades do sistema
   * @param filters - Parâmetros de busca (query, empresa, tipos, limite)
   * @returns Array de resultados agrupados por tipo
   */
  searchGlobal(filters: SearchFilters): Promise<SearchResult[]>

  /**
   * Busca apenas em projetos
   * @param query - Texto de busca
   * @param companyId - ID da empresa
   * @param limit - Máximo de resultados (padrão: 20)
   * @returns Array de projetos encontrados
   */
  searchProjects(
    query: string,
    companyId: number,
    limit?: number
  ): Promise<ProjectSearchResult[]>

  /**
   * Busca apenas em sprints (futuro)
   * @param query - Texto de busca
   * @param companyId - ID da empresa
   * @param limit - Máximo de resultados (padrão: 20)
   * @returns Array de sprints encontrados
   */
  searchSprints(
    query: string,
    companyId: number,
    limit?: number
  ): Promise<SprintSearchResult[]>

  /**
   * Busca apenas em tarefas (futuro)
   * @param query - Texto de busca
   * @param companyId - ID da empresa
   * @param limit - Máximo de resultados (padrão: 20)
   * @returns Array de tarefas encontradas
   */
  searchTasks(
    query: string,
    companyId: number,
    limit?: number
  ): Promise<TaskSearchResult[]>

  /**
   * Busca apenas em documentos (futuro)
   * @param query - Texto de busca
   * @param companyId - ID da empresa
   * @param limit - Máximo de resultados (padrão: 20)
   * @returns Array de documentos encontrados
   */
  searchDocuments(
    query: string,
    companyId: number,
    limit?: number
  ): Promise<DocumentSearchResult[]>
}
