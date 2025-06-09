"use client";

import React, { useState } from "react";
import { Shield, Key, RefreshCw, Trash2, Brain } from "lucide-react";
import PhraseGenerator from "@/components/PhraseGenerator";
import PhraseManager from "@/components/PhraseManager";
import ImportExport from "@/components/ImportExport";
import PhraseTest from "@/components/PhraseTest";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "generate" | "manage" | "import" | "test"
  >("generate");
  const {
    phrases,
    savePhrase,
    deletePhrase,
    clearAllData,
    exportToJSON,
    exportToCSV,
    importFromJSON,
    importFromCSV,
  } = useLocalStorage();

  const handleClearAll = () => {
    if (
      confirm(
        "Вы уверены, что хотите удалить все сохраненные фразы? Это действие нельзя отменить.",
      )
    ) {
      clearAllData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <Shield className="text-blue-600" size={32} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              PassPhrase
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
            Современная замена паролей с мнемоническими фразами и визуальными
            подсказками
          </p>
        </header>

        <nav className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="bg-white rounded-lg p-1 shadow-md flex flex-col sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium text-sm sm:text-base ${
                activeTab === "generate"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Key size={16} />
              <span className="hidden sm:inline">Создать фразу</span>
              <span className="sm:hidden">Создать</span>
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium text-sm sm:text-base ${
                activeTab === "manage"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Shield size={16} />
              <span className="hidden sm:inline">
                Мои фразы ({phrases.length})
              </span>
              <span className="sm:hidden">Фразы ({phrases.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium text-sm sm:text-base ${
                activeTab === "import"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Импорт/Экспорт</span>
              <span className="sm:hidden">Импорт</span>
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium text-sm sm:text-base ${
                activeTab === "test"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Brain size={16} />
              <span className="hidden sm:inline">Проверка памяти</span>
              <span className="sm:hidden">Тест</span>
            </button>
          </div>
        </nav>

        <main>
          {activeTab === "generate" ? (
            <PhraseGenerator onSave={savePhrase} />
          ) : activeTab === "import" ? (
            <ImportExport
              onExportJSON={exportToJSON}
              onExportCSV={exportToCSV}
              onImportJSON={importFromJSON}
              onImportCSV={importFromCSV}
              phrasesCount={phrases.length}
            />
          ) : activeTab === "test" ? (
            <PhraseTest phrases={phrases} />
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                {phrases.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                    Очистить все
                  </button>
                )}
              </div>
              <PhraseManager phrases={phrases} onDelete={deletePhrase} />
            </div>
          )}
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p className="mb-2">
            PassPhrase - безопасное хранение паролей с использованием
            мнемонических техник
          </p>
          <p>Все данные хранятся локально в вашем браузере</p>
        </footer>
      </div>
    </div>
  );
}
