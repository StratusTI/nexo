import type { ComponentProps } from 'react';

interface AProps extends ComponentProps<'a'> {
  children: React.ReactNode;
}

export function A({ children, ...props }: AProps) {
  return (
    <a
      className='text-primary font-medium underline underline-offset-4'
      {...props}
    >
      {children}
    </a>
  );
}
