import { prismaElo } from '@/src/lib/prisma'
import {
  GlobalSearchRepository,
  SearchFilters,
} from '../global-search-repository'
import {
  SearchResult,
  ProjectSearchResult,
  SprintSearchResult,
  TaskSearchResult,
  DocumentSearchResult,
} from '../../@types/search'

export class PrismaGlobalSearchRepository implements GlobalSearchRepository {
  /**
   * Calcula score de relevância baseado na posição da match
   * - Começa com: 100
   * - Contém no início: 75
   * - Contém no meio: 50
   * - Match exato: +50 bonus
   */
  private calculateRelevance(text: string, query: string): number {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()

    // Match exato
    if (lowerText === lowerQuery) return 150

    // Começa com
    if (lowerText.startsWith(lowerQuery)) return 100

    // Contém no início (primeiras 3 palavras)
    const words = lowerText.split(' ')
    for (let i = 0; i < Math.min(3, words.length); i++) {
      if (words[i].startsWith(lowerQuery)) return 75
    }

    // Contém em qualquer lugar
    if (lowerText.includes(lowerQuery)) return 50

    return 0
  }

  async searchGlobal(filters: SearchFilters): Promise<SearchResult[]> {
    const { query, companyId, types, limit = 20 } = filters

    if (!query || query.trim().length < 2) {
      return []
    }

    const results: SearchResult[] = []

    // Se types não especificado ou inclui 'project', buscar projetos
    if (!types || types.includes('project')) {
      const projects = await this.searchProjects(query, companyId, limit)
      results.push(...projects)
    }

    // Futuras implementações
    if (!types || types.includes('sprint')) {
      const sprints = await this.searchSprints(query, companyId, limit)
      results.push(...sprints)
    }

    if (!types || types.includes('task')) {
      const tasks = await this.searchTasks(query, companyId, limit)
      results.push(...tasks)
    }

    if (!types || types.includes('document')) {
      const documents = await this.searchDocuments(query, companyId, limit)
      results.push(...documents)
    }

    // Ordenar por relevância decrescente
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  async searchProjects(
    query: string,
    companyId: number,
    limit: number = 20
  ): Promise<ProjectSearchResult[]> {
    const searchTerm = `%${query}%`

    const projects = await prismaElo.projeto.findMany({
      where: {
        idempresa: companyId,
        OR: [
          { nome: { contains: query } },
          { projectId: { contains: query } },
          { descricao: { contains: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        nome: true,
        projectId: true,
        descricao: true,
        status: true,
        ownerId: true,
        icone: true,
      },
    })

    return projects.map((project) => {
      // Calcular relevância baseado em múltiplos campos
      let maxRelevance = 0
      maxRelevance = Math.max(
        maxRelevance,
        this.calculateRelevance(project.nome, query)
      )
      if (project.projectId) {
        maxRelevance = Math.max(
          maxRelevance,
          this.calculateRelevance(project.projectId, query)
        )
      }
      if (project.descricao) {
        maxRelevance = Math.max(
          maxRelevance,
          this.calculateRelevance(project.descricao, query) - 25 // Penalidade para match em descrição
        )
      }

      return {
        id: project.id,
        type: 'project' as const,
        title: project.nome,
        description: project.descricao || undefined,
        url: `/projects/${project.id}`,
        relevanceScore: maxRelevance,
        projectId: project.projectId || undefined,
        status: project.status || undefined,
      }
    })
  }

  async searchSprints(
    query: string,
    companyId: number,
    limit: number = 20
  ): Promise<SprintSearchResult[]> {
    // TODO: Implementar quando necessário
    // Por enquanto, retorna array vazio
    return []

    /* Implementação futura:
    const sprints = await prismaElo.sprint.findMany({
      where: {
        projeto: { idempresa: companyId },
        OR: [
          { nome: { contains: query } },
          { objetivo: { contains: query } },
        ],
      },
      take: limit,
      include: {
        projeto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    })

    return sprints.map((sprint) => ({
      id: sprint.id,
      type: 'sprint' as const,
      title: sprint.nome,
      description: sprint.objetivo || undefined,
      url: `/projects/${sprint.projetoId}/sprints/${sprint.id}`,
      relevanceScore: this.calculateRelevance(sprint.nome, query),
      projectId: sprint.projetoId,
      projectName: sprint.projeto.nome,
      startDate: sprint.dataInicio,
      endDate: sprint.dataFim,
      status: sprint.status || undefined,
    }))
    */
  }

  async searchTasks(
    query: string,
    companyId: number,
    limit: number = 20
  ): Promise<TaskSearchResult[]> {
    // TODO: Implementar quando necessário
    return []

    /* Implementação futura:
    const tasks = await prismaElo.tarefa.findMany({
      where: {
        projeto: { idempresa: companyId },
        OR: [
          { titulo: { contains: query } },
          { descricao: { contains: query } },
        ],
      },
      take: limit,
      include: {
        projeto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    })

    return tasks.map((task) => ({
      id: task.id,
      type: 'task' as const,
      title: task.titulo,
      description: task.descricao || undefined,
      url: `/projects/${task.projetoId}/tasks/${task.id}`,
      relevanceScore: this.calculateRelevance(task.titulo, query),
      projectId: task.projetoId,
      projectName: task.projeto.nome,
      status: task.status || undefined,
    }))
    */
  }

  async searchDocuments(
    query: string,
    companyId: number,
    limit: number = 20
  ): Promise<DocumentSearchResult[]> {
    // TODO: Implementar quando necessário
    return []

    /* Implementação futura:
    const documents = await prismaElo.documento.findMany({
      where: {
        projeto: { idempresa: companyId },
        OR: [
          { titulo: { contains: query } },
          { conteudo: { contains: query } },
        ],
      },
      take: limit,
      include: {
        projeto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    })

    return documents.map((doc) => ({
      id: doc.id,
      type: 'document' as const,
      title: doc.titulo,
      url: `/projects/${doc.projetoId}/documents/${doc.id}`,
      relevanceScore: this.calculateRelevance(doc.titulo, query),
      projectId: doc.projetoId,
      projectName: doc.projeto.nome,
      icon: doc.icone,
    }))
    */
  }
}
