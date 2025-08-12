import React from "react";
import { Card, CardContent } from "../../../components/Card";
import { Loader } from "../../../components/Loader";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const DocumentCard = ({ document, onPreview, onDownload }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {document.name}
            </h3>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                {document.type.toUpperCase()}
              </span>
              <span>{formatFileSize(document.size)}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div>Fecha: {new Date(document.date).toLocaleDateString()}</div>
              <div>Sesión: {document.sessionName}</div>
            </div>
          </div>

          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onPreview(document)}
              className="p-2 text-primary hover:text-primary-dark rounded-full hover:bg-gray-100"
              aria-label={`Vista previa de ${document.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDownload(document)}
              className="p-2 text-green-600 hover:text-green-900 rounded-full hover:bg-gray-100"
              aria-label={`Descargar ${document.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DocumentCards = ({ documents, onPreview, onDownload, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden space-y-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default DocumentCards;