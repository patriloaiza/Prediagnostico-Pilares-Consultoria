import { Topbar } from './components/Topbar';
import { PrediagnosticView } from './components/PrediagnosticView';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans selection:bg-[#D7192B] selection:text-white">
      {/* Barra de navegación superior fija */}
      <Topbar />

      {/* Contenedor Principal: Prediagnóstico Consultoría Requerida */}
      <main className="flex-1 w-full">
        <PrediagnosticView />
      </main>

      {/* Pie de Página Institucional */}
      <footer className="bg-[#111111] text-gray-400 text-xs py-6 border-t-2 border-gray-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-white tracking-wide">
              CREA Y MONETIZA®
            </span>{' '}
            · Metodología de Consultoría Estratégica por{' '}
            <strong className="text-gray-200">Patricia Loaiza</strong>
          </div>
          <div className="text-[11px] text-gray-500">
            Diagnóstico de Verificación de Evidencias © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
