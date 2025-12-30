import React from 'react';

interface AppShellProps {
  appName: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  showProgress?: boolean;
}

/**
 * APP SHELL (Layout PV)
 * Container universale per tutte le app
 * Header branding, progress bar, footer
 */
export function AppShell({
  appName,
  currentStep,
  totalSteps,
  children,
  showProgress = true,
}: AppShellProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-pv-light flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Pagine Vincenti</h1>
              <p className="text-sm text-slate-600">{appName}</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              {currentStep} / {totalSteps}
            </div>
          </div>

          {showProgress && (
            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pv-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-slate-600">
          <p>© 2025 Pagine Vincenti • Piattaforma di decisioni strategiche</p>
        </div>
      </footer>
    </div>
  );
}
