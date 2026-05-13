import React, { useState } from 'react';
import dictionaryData from '../data/dictionary';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');

  const getAllItems = () => {
    const items = [];
    if (!dictionaryData) return items;
    
    Object.keys(dictionaryData).forEach((category) => {
      if (Array.isArray(dictionaryData[category])) {
        dictionaryData[category].forEach((item) => {
          items.push({ ...item, category });
        });
      }
    });
    return items;
  };

  const filteredItems = getAllItems().filter(
    (item) =>
      (item.english && item.english.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.garo && item.garo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📖 Garo Dictionary</h1>
      
      <input
        type="text"
        placeholder="Search English or Garo words..."
        className="w-full p-3 border rounded-lg shadow-sm mb-6 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full uppercase">
                {item.category}
              </span>
              <p className="mt-2 text-gray-900 dark:text-gray-100">
                <strong>English:</strong> {item.english}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Garo:</strong> {item.garo}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2">No matching words found.</p>
        )}
      </div>
    </div>
  );
}
