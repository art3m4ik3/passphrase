"use client";

import React, { useState } from "react";
import { Copy, Eye, EyeOff, Trash2, Key } from "lucide-react";
import { MnemonicPhrase, decryptData, phraseToString } from "@/lib/passphrase";

interface PhraseManagerProps {
  phrases: MnemonicPhrase[];
  onDelete: (id: string) => void;
}

export default function PhraseManager({
  phrases,
  onDelete,
}: PhraseManagerProps) {
  const [visiblePhrases, setVisiblePhrases] = useState<Set<string>>(new Set());
  const [decryptedData, setDecryptedData] = useState<Record<string, string>>(
    {},
  );

  const togglePhraseVisibility = (id: string) => {
    const newVisible = new Set(visiblePhrases);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePhrases(newVisible);
  };

  const decryptPhraseData = (phrase: MnemonicPhrase) => {
    if (!phrase.encrypted) return;

    try {
      const passphraseString = phraseToString(phrase.words);
      const decrypted = decryptData(phrase.encrypted, passphraseString);
      setDecryptedData((prev) => ({
        ...prev,
        [phrase.id]: decrypted,
      }));
    } catch {
      alert("Ошибка расшифровки данных");
    }
  };
  const handleDelete = (phrase: MnemonicPhrase) => {
    if (
      confirm(
        `Вы уверены, что хотите удалить фразу "${phrase.title}"? Это действие нельзя отменить.`,
      )
    ) {
      onDelete(phrase.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (phrases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-500 text-lg">Нет сохраненных фраз</div>
        <div className="text-gray-400 text-sm mt-2">
          Создайте новую мнемоническую фразу выше
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Сохраненные фразы
      </h2>

      <div className="space-y-4">
        {phrases.map((phrase) => (
          <div
            key={phrase.id}
            className="bg-white rounded-lg shadow-md border p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {phrase.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Создано: {phrase.createdAt.toLocaleDateString("ru-RU")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => togglePhraseVisibility(phrase.id)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title={visiblePhrases.has(phrase.id) ? "Скрыть" : "Показать"}
                >
                  {visiblePhrases.has(phrase.id) ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(phraseToString(phrase.words))}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  title="Копировать фразу"
                >
                  <Copy size={16} />
                </button>{" "}
                <button
                  onClick={() => handleDelete(phrase)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {" "}
              {phrase.words.map((word, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 border-2 border-gray-300 rounded-lg bg-white shadow-sm"
                >
                  <div className="text-2xl mb-1">{word.icon}</div>
                  <div className="text-xs text-gray-700 mb-1 font-medium">
                    {word.category}
                  </div>
                  <div className="font-bold text-sm text-center text-gray-900">
                    {visiblePhrases.has(phrase.id) ? word.word : "•••••"}
                  </div>
                </div>
              ))}
            </div>

            {phrase.encrypted && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Зашифрованные данные:
                  </span>
                  <button
                    onClick={() => decryptPhraseData(phrase)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <Key size={12} />
                    Расшифровать
                  </button>
                </div>{" "}
                {decryptedData[phrase.id] ? (
                  <div className="relative">
                    <div className="p-3 bg-green-50 border-2 border-green-300 rounded text-sm font-semibold text-gray-900">
                      {decryptedData[phrase.id]}
                    </div>
                    <button
                      onClick={() => copyToClipboard(decryptedData[phrase.id])}
                      className="absolute top-2 right-2 p-1 text-green-600 hover:text-green-800"
                      title="Копировать"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-300 rounded text-xs text-gray-800 font-mono break-all font-semibold">
                    {phrase.encrypted.substring(0, 100)}...
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
