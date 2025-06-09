"use client";

import React, { useRef } from "react";
import { Upload, FileJson, FileSpreadsheet } from "lucide-react";

interface ImportExportProps {
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (file: File) => Promise<void>;
  onImportCSV: (file: File) => Promise<void>;
  phrasesCount: number;
}

export default function ImportExport({
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onImportCSV,
  phrasesCount,
}: ImportExportProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleImportJSONClick = () => {
    jsonInputRef.current?.click();
  };

  const handleImportCSVClick = () => {
    csvInputRef.current?.click();
  };

  const handleJSONFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onImportJSON(file);
    } catch (error) {
      alert("Ошибка импорта JSON файла: " + (error as Error).message);
    }

    if (jsonInputRef.current) {
      jsonInputRef.current.value = "";
    }
  };

  const handleCSVFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onImportCSV(file);
    } catch (error) {
      alert("Ошибка импорта CSV файла: " + (error as Error).message);
    }

    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Импорт и экспорт данных
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">
            Экспорт ({phrasesCount} фраз)
          </h4>
          <div className="space-y-3">
            <button
              onClick={onExportJSON}
              disabled={phrasesCount === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <FileJson size={16} />
              Экспорт в JSON
            </button>
            <button
              onClick={onExportCSV}
              disabled={phrasesCount === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <FileSpreadsheet size={16} />
              Экспорт в CSV
            </button>
          </div>
        </div>{" "}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Импорт</h4>
          <div className="space-y-3">
            <button
              onClick={handleImportJSONClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm sm:text-base"
            >
              <Upload size={16} />
              Импорт из JSON
            </button>
            <button
              onClick={handleImportCSVClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm sm:text-base"
            >
              <Upload size={16} />
              Импорт из CSV
            </button>
            <p className="text-xs text-gray-600">
              Выберите JSON или CSV файл с фразами для добавления к существующим
            </p>
          </div>
        </div>
      </div>
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json"
        onChange={handleJSONFileChange}
        className="hidden"
      />

      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVFileChange}
        className="hidden"
      />
    </div>
  );
}
