'use client';

import { Search01Icon } from '@hugeicons-pro/core-stroke-rounded';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import type { SearchResult } from '@/src/@types/search';
import { useDebounce } from '@/src/hooks/use-debounce';
import { useGlobalSearch } from '@/src/hooks/use-global-search';
import { Icon } from '../HugeIcons';

export function SearchPages() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounce da query para evitar muitas requests
  const debouncedQuery = useDebounce(inputValue, 500);

  // Hook do TanStack Query
  const { data, isLoading, error } = useGlobalSearch({
    query: debouncedQuery,
    types: ['project'], // Por enquanto apenas projetos
    limit: 10,
    enabled: isOpen && debouncedQuery.length >= 2,
  });

  // Toggle do search modal
  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInputValue('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handler de mudança do input
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setSelectedIndex(0);
    },
    [],
  );

  // Navegação com teclado (↑↓ Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!data?.results.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < data.results.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && data.results[selectedIndex]) {
        e.preventDefault();
        window.location.href = data.results[selectedIndex].url;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, data, selectedIndex]);

  // Renderizar ícone por tipo
  const renderResultIcon = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        return (
          <div className='w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-semibold'>
            📁
          </div>
        );
      case 'sprint':
        return (
          <div className='w-10 h-10 rounded bg-purple-100 flex items-center justify-center text-purple-600'>
            🏃
          </div>
        );
      case 'task':
        return (
          <div className='w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-600'>
            ✓
          </div>
        );
      case 'document':
        return (
          <div className='w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600'>
            📄
          </div>
        );
    }
  };

  return (
    <div className='relative flex justify-center'>
      {/* Input de busca */}
      <div
        className={`relative flex items-center transition-all duration-300 ease-in-out z-30 ${
          isOpen ? 'w-138.5' : 'w-91'
        }`}
        onClick={toggleSearch}
      >
        <Icon icon={Search01Icon} />
        <Input
          type='text'
          placeholder='Search'
          value={inputValue}
          onChange={handleInputChange}
          className='cursor-pointer'
        />
      </div>

      {/* Dropdown de resultados */}
      <div
        className={`absolute -top-1.5 left-1/2 -translate-x-1/2 bg-surface-1 border border-subtle-1 rounded-md shadow-lg flex flex-col overflow-hidden z-20 transition-all duration-300 ease-in-out pt-10 ${
          isOpen ? 'w-143.5 max-h-[80vh] opacity-100' : 'w-0 h-0 opacity-0'
        }`}
      >
        <div className='size-full flex flex-col overflow-hidden'>
          <div className='flex-1 overflow-y-auto'>
            {inputValue.length === 0 ? (
              // Tela default (vazia)
              <div className='p-6 text-center text-muted-foreground'>
                <p className='text-sm'>Digite algo para começar a pesquisar</p>
              </div>
            ) : isLoading ? (
              // Loading state
              <div className='p-6 text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto' />
                <p className='text-sm text-muted-foreground mt-2'>
                  Buscando...
                </p>
              </div>
            ) : error ? (
              // Error state
              <div className='p-6 text-center text-red-600'>
                <p className='text-sm'>Erro ao buscar. Tente novamente.</p>
              </div>
            ) : data && data.results.length > 0 ? (
              // Resultados
              <div className='divide-y divide-subtle-1'>
                {data.results.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className={`flex items-center gap-3 p-3 hover:bg-surface-2 transition-colors cursor-pointer ${
                      index === selectedIndex ? 'bg-surface-2' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Ícone */}
                    {renderResultIcon(result)}

                    {/* Conteúdo */}
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {result.title}
                      </p>
                      {result.description && (
                        <p className='text-xs text-muted-foreground truncate'>
                          {result.description}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {result.type === 'project' && '📁 Projeto'}
                        {result.type === 'sprint' && '🏃 Sprint'}
                        {result.type === 'task' && '✓ Tarefa'}
                        {result.type === 'document' && '📄 Documento'}
                      </p>
                    </div>

                    {/* Badge de relevância (opcional, para debug) */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className='text-xs text-muted-foreground'>
                        {result.relevanceScore}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              // Sem resultados
              <div className='p-6 text-center text-muted-foreground'>
                <p className='text-sm'>Nenhum resultado encontrado</p>
              </div>
            )}
          </div>

          {/* Footer com atalhos de teclado */}
          <div className='shrink-0 pt-5 pb-2 px-3 flex items-center gap-4 border-t border-subtle-1'>
            <p className='flex items-center gap-1.5 text-xs text-placeholder'>
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              Navegar
            </p>
            <p className='flex items-center gap-1.5 text-xs text-placeholder'>
              <Kbd>Enter</Kbd>
              Abrir
            </p>
            <p className='flex items-center gap-1.5 text-xs text-placeholder'>
              <Kbd>Esc</Kbd>
              Fechar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
