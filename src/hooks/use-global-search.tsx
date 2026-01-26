import { useQuery } from '@tanstack/react-query'
import { GlobalSearchResponse, SearchEntityType } from '@/src/@types/search'

interface UseGlobalSearchParams {
  query: string
  types?: SearchEntityType[]
  limit?: number
  enabled?: boolean
}

export function useGlobalSearch({
  query,
  types,
  limit = 20,
  enabled = true,
}: UseGlobalSearchParams) {
  return useQuery<GlobalSearchResponse>({
    queryKey: ['global-search', query, types, limit],
    queryFn: async () => {
      // Se query vazia, retornar vazio sem fazer request
      if (!query || query.trim().length < 2) {
        return {
          results: [],
          totalResults: 0,
          query: query.trim(),
        }
      }

      const params = new URLSearchParams({
        q: query.trim(),
        limit: limit.toString(),
      })

      // Adicionar tipos se especificados
      if (types && types.length > 0) {
        types.forEach((type) => params.append('types', type))
      }

      const response = await fetch(`/api/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      return response.json()
    },
    enabled: enabled && query.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
  })
}
