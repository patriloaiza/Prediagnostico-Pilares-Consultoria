import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
        <div className="bg-[#111111] text-white p-4 flex items-center justify-between border-b-2 border-[#D7192B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D7192B]/20 text-[#D7192B] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">
              Reiniciar Prediagnóstico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-full bg-amber-50 text-amber-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                ¿Deseas reiniciar la evaluación?
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Se limpiarán las respuestas actuales y los datos del formulario para comenzar una nueva evaluación desde el paso inicial.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-xs font-extrabold text-white bg-[#D7192B] hover:bg-[#b91222] rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sí, reiniciar ahora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
