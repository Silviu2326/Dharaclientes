import React from "react";

// Filtro por sesión
const SessionFilter = ({ onFilter, selectedSession, sessions }) => {
  return (
    <select
      value={selectedSession}
      onChange={(e) => onFilter(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      aria-label="Filtrar por sesión"
    >
      <option value="">Todas las sesiones</option>
      {sessions.map((session) => (
        <option key={session.id} value={session.id}>
          {session.name} - {new Date(session.date).toLocaleDateString()}
        </option>
      ))}
    </select>
  );
};

export default SessionFilter;