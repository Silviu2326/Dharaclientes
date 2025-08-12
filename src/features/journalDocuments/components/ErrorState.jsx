import React from "react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";

const ErrorState = ({ onRetry }) => (
  <Card>
    <CardContent className="text-center py-12">
      <div className="mx-auto w-16 h-16 mb-4">
        <svg
          className="w-full h-full text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-deep mb-2">Error al cargar documentos</h3>
      <p className="text-gray-600 mb-4">
        No pudimos cargar tus documentos. Por favor, inténtalo de nuevo.
      </p>
      <Button onClick={onRetry} variant="secondary">
        Reintentar
      </Button>
    </CardContent>
  </Card>
);

export default ErrorState;