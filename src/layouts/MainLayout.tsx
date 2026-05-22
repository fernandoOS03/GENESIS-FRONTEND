import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
