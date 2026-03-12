import { ReactNode } from 'react';
import { useSidebar } from '../../context/SidebarContext';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className={`transition-all duration-500 ease-in-out ${
      isExpanded ? 'ml-56' : 'ml-20'
    }`}>
      {children}
    </div>
  );
}
