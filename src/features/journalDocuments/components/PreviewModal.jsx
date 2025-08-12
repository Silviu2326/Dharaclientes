import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../components/Button";

const PreviewModal = ({
  document,
  isOpen = true,
  onClose,
  documents = [],
  onNavigate = () => {},
}) => {
  const modalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (document && documents.length) {
      const idx = documents.findIndex((d) => d.id === document.id);
      setCurrentIndex(idx);
    }
  }, [document, documents]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(documents[currentIndex - 1]);
      if (e.key === "ArrowRight" && currentIndex < documents.length - 1)
        onNavigate(documents[currentIndex + 1]);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, currentIndex, documents, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen && modalRef.current) modalRef.current.focus();
  }, [isOpen]);

  if (!isOpen || !document) return null;

  const renderPreview = () => {
    switch (document.type.toLowerCase()) {
      case "pdf":
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Vista previa de PDF no disponible. Descarga el archivo.</p>
          </div>
        );
      case "image":
        return (
          <img
            src={document.url || "/api/placeholder/600/400"}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
          />
        );
      case "audio":
        return (
          <audio controls className="w-full max-w-md">
            <source src={document.url} type="audio/mpeg" />
          </audio>
        );
      case "video":
        return (
          <video controls className="max-w-full max-h-full">
            <source src={document.url} type="video/mp4" />
          </video>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Vista previa no disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          ref={modalRef}
          tabIndex={-1}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 border-b flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 truncate">{document.name}</h3>
              <p className="text-sm text-gray-500">{document.type.toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-50 px-4 py-6 sm:px-6" style={{ height: "60vh" }}>
            {renderPreview()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = document.url || "#";
                link.download = document.name;
                link.click();
              }}
            >
              Descargar
            </Button>
            <Button variant="secondary" onClick={onClose} className="mr-3">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;