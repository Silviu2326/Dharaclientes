import React from "react";
import SearchBar from "./SearchBar";
import SessionFilter from "./SessionFilter";

// Encabezado con título, búsqueda y filtros
const DocsHeader = ({ onSearch, onFilterSession, searchTerm, selectedSession, sessions }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-deep">Diario Personal y Documentos</h1>
        <p className="text-gray-600 mt-2">Registra tu diario personal y revisa documentos compartidos por tus terapeutas</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
        <SessionFilter 
          onFilter={onFilterSession} 
          selectedSession={selectedSession} 
          sessions={sessions} 
        />
      </div>
    </div>
  );
};

export default DocsHeader;