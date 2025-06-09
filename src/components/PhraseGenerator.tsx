"use client";

import React, { useState } from "react";
import { RefreshCw, Copy, Eye, EyeOff, Save } from "lucide-react";
import {
  generateMnemonicPhrase,
  encryptData,
  PhraseWord,
  MnemonicPhrase,
  generatePhraseId,
  phraseToString,
} from "@/lib/passphrase";

interface PhraseGeneratorProps {
  onSave?: (phrase: MnemonicPhrase) => void;
}

export default function PhraseGenerator({ onSave }: PhraseGeneratorProps) {
  const [phrase, setPhrase] = useState<PhraseWord[]>([]);
  const [title, setTitle] = useState("");
  const [showPhrase, setShowPhrase] = useState(true);
  const [phraseLength, setPhraseLength] = useState(6);
  const [dataToEncrypt, setDataToEncrypt] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [showEncrypted, setShowEncrypted] = useState(false);

  const generateNewPhrase = () => {
    const newPhrase = generateMnemonicPhrase(phraseLength);
    setPhrase(newPhrase);
    setEncrypted("");
    setShowEncrypted(false);
  };
  const encryptDataWithPhrase = () => {
    if (phrase.length === 0 || !dataToEncrypt) return;

    const passphraseString = phraseToString(phrase);
    const encryptedData = encryptData(dataToEncrypt, passphraseString);
    setEncrypted(encryptedData);
    setShowEncrypted(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const savePhrase = () => {
    if (!phrase.length || !title) return;

    const mnemonicPhrase: MnemonicPhrase = {
      id: generatePhraseId(),
      words: phrase,
      createdAt: new Date(),
      title,
      encrypted,
    };

    onSave?.(mnemonicPhrase);
    setTitle("");
    setDataToEncrypt("");
    setEncrypted("");
    setShowEncrypted(false);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Генератор мнемонических фраз
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Длина фразы:
            </label>{" "}
            <select
              value={phraseLength}
              onChange={(e) => setPhraseLength(Number(e.target.value))}
              className="border-2 border-gray-400 rounded-md px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:outline-none shadow-sm"
            >
              <option value={4}>4 слова</option>
              <option value={6}>6 слов</option>
              <option value={8}>8 слов</option>
              <option value={10}>10 слов</option>
            </select>
          </div>

          <button
            onClick={generateNewPhrase}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Создать фразу</span>
            <span className="sm:hidden">Создать</span>
          </button>
        </div>
      </div>
      {phrase.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Ваша мнемоническая фраза:
            </h3>
            <button
              onClick={() => setShowPhrase(!showPhrase)}
              className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              {showPhrase ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPhrase ? "Скрыть" : "Показать"}
            </button>
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
            {phrase.map((word, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 sm:p-4 border-2 border-gray-300 rounded-lg bg-white shadow-sm"
              >
                <div className="text-2xl sm:text-3xl mb-2">{word.icon}</div>
                <div className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">
                  {word.category}
                </div>
                <div className="font-bold text-center text-gray-900 text-base sm:text-lg">
                  {showPhrase ? word.word : "•••••"}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => copyToClipboard(phraseToString(phrase))}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Copy size={16} />
            Копировать фразу
          </button>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Шифрование данных
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название (для сохранения):
            </label>{" "}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Аккаунт Gmail"
              className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900 font-medium bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Данные для шифрования:
            </label>{" "}
            <textarea
              value={dataToEncrypt}
              onChange={(e) => setDataToEncrypt(e.target.value)}
              placeholder="Введите пароль или другие данные для шифрования"
              className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900 font-medium bg-white"
              rows={3}
            />
          </div>{" "}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={encryptDataWithPhrase}
              disabled={!phrase.length || !dataToEncrypt}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Зашифровать
            </button>

            {encrypted && !showEncrypted && (
              <button
                onClick={() => setShowEncrypted(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Показать результат
              </button>
            )}
          </div>
          {showEncrypted && encrypted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зашифрованные данные:
              </label>{" "}
              <div className="relative">
                {" "}
                <textarea
                  value={encrypted}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-gray-50 text-gray-900 font-mono text-sm font-semibold"
                  rows={3}
                />
                <button
                  onClick={() => copyToClipboard(encrypted)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {phrase.length > 0 && title && (
        <div className="flex gap-2">
          <button
            onClick={savePhrase}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors w-full sm:w-auto"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Сохранить фразу</span>
            <span className="sm:hidden">Сохранить</span>
          </button>
        </div>
      )}
    </div>
  );
}
