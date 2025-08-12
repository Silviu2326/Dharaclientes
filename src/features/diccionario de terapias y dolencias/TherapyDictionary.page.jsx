import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

/**
 * Datos ficticios: amplía la lista según sea necesario.
 */
const dictionaryData = [
  { therapy: 'Acupuntura', ailments: 'Dolor crónico, ansiedad, migrañas' },
  { therapy: 'Masaje terapéutico', ailments: 'Tensión muscular, estrés, lesiones deportivas' },
  { therapy: 'Homeopatía', ailments: 'Alergias, resfriados, trastornos del sueño' },
  { therapy: 'Reiki', ailments: 'Estrés, fatiga crónica, desequilibrios energéticos' },
  { therapy: 'Terapia cognitivo-conductual', ailments: 'Depresión, ansiedad, fobias' },
  { therapy: 'Yoga terapéutico', ailments: 'Dolor de espalda, artritis, rigidez' },
  { therapy: 'Aromaterapia', ailments: 'Insomnio, estrés, dolores de cabeza' },
  { therapy: 'Fisioterapia', ailments: 'Rehabilitación post-quirúrgica, lesiones musculares' },
  { therapy: 'Musicoterapia', ailments: 'Autismo, demencia, dolor agudo' },
  { therapy: 'Hipnoterapia', ailments: 'Trastornos de sueño, ansiedad, adicciones' },
  { therapy: 'Terapia de arte', ailments: 'Trauma, ansiedad, autoestima' },
  { therapy: 'Reflexología', ailments: 'Migrañas, estrés, problemas digestivos' },
  { therapy: 'Terapia de sonido', ailments: 'Insomnio, estrés, desequilibrios energéticos' },
];

export const TherapyDictionaryPage = () => {
  const [query, setQuery] = useState('');

  /**
   * Filtra los resultados de manera memorizada para rendimiento.
   */
  const filteredData = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return dictionaryData.filter(
      ({ therapy, ailments }) =>
        therapy.toLowerCase().includes(lowerQuery) ||
        ailments.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-sage mb-2">
        Diccionario de terapias y dolencias
      </h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Consulta de forma rápida los beneficios y dolencias que cada terapia puede abordar. Usa el buscador para filtrar la información.
      </p>

      {/* Buscador */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar terapia o dolencia..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition"
        />
      </div>

      {/* Tabla responsiva */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sage">
            <tr>
              <th scope="col" className="py-4 px-6 text-left text-xs font-semibold text-white tracking-wider uppercase sticky top-0">
                Terapia
              </th>
              <th scope="col" className="py-4 px-6 text-left text-xs font-semibold text-white tracking-wider uppercase sticky top-0">
                Dolencias o beneficios
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 px-6 text-center text-gray-500">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              filteredData.map(({ therapy, ailments }, idx) => (
                <tr
                  key={therapy}
                  className="hover:bg-sage/10 transition-colors"
                >
                  <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-800">
                    {therapy}
                  </td>
                  <td className="py-3 px-6 text-gray-700">
                    {ailments}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TherapyDictionaryPage;