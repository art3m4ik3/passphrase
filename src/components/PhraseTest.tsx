"use client";

import React, { useState } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { MnemonicPhrase } from "@/lib/passphrase";

interface PhraseTestProps {
  phrases: MnemonicPhrase[];
}

interface TestQuestion {
  phrase: MnemonicPhrase;
  hiddenWordIndices: number[];
  userAnswers: string[];
}

export default function PhraseTest({ phrases }: PhraseTestProps) {
  const [currentTest, setCurrentTest] = useState<TestQuestion | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHints, setShowHints] = useState(false);
  const generateTest = () => {
    if (phrases.length === 0) return;

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomPhrase = phrases[array[0] % phrases.length];

    const wordsToHide = Math.min(
      3,
      Math.max(1, Math.floor(randomPhrase.words.length / 2)),
    );

    const hiddenIndices: number[] = [];
    while (hiddenIndices.length < wordsToHide) {
      crypto.getRandomValues(array);
      const randomIndex = array[0] % randomPhrase.words.length;
      if (!hiddenIndices.includes(randomIndex)) {
        hiddenIndices.push(randomIndex);
      }
    }

    hiddenIndices.sort((a, b) => a - b);
    setCurrentTest({
      phrase: randomPhrase,
      hiddenWordIndices: hiddenIndices,
      userAnswers: new Array(hiddenIndices.length).fill(""),
    });

    setIsCompleted(false);
    setShowHints(false);
  };

  const updateAnswer = (index: number, value: string) => {
    if (!currentTest) return;

    const newAnswers = [...currentTest.userAnswers];
    newAnswers[index] = value.toLowerCase().trim();

    setCurrentTest({
      ...currentTest,
      userAnswers: newAnswers,
    });
  };

  const checkAnswers = () => {
    if (!currentTest) return;

    let correct = 0;
    const total = currentTest.hiddenWordIndices.length;

    currentTest.hiddenWordIndices.forEach((wordIndex, i) => {
      const correctWord =
        currentTest.phrase.words[wordIndex].word.toLowerCase();
      const userAnswer = currentTest.userAnswers[i].toLowerCase();

      if (correctWord === userAnswer) {
        correct++;
      }
    });
    setScore({ correct, total });
    setIsCompleted(true);
  };

  const isAnswerCorrect = (answerIndex: number): boolean => {
    if (!currentTest || !isCompleted) return false;

    const wordIndex = currentTest.hiddenWordIndices[answerIndex];
    const correctWord = currentTest.phrase.words[wordIndex].word.toLowerCase();
    const userAnswer = currentTest.userAnswers[answerIndex].toLowerCase();

    return correctWord === userAnswer;
  };

  if (phrases.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Нет сохраненных фраз
        </h3>
        <p className="text-gray-500">
          Сначала создайте и сохраните несколько фраз, чтобы проверить свою
          память
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="text-purple-600" size={32} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Проверка памяти
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Проверьте, насколько хорошо вы запомнили свои мнемонические фразы
        </p>
      </div>

      {!currentTest ? (
        <div className="text-center">
          <button
            onClick={generateTest}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-lg font-medium"
          >
            <Brain size={20} />
            Начать тест
          </button>
          <p className="text-gray-500 mt-4 text-sm">
            У вас сохранено {phrases.length} фраз для тестирования
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Тест: {currentTest.phrase.title}
              </h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                {showHints ? <EyeOff size={16} /> : <Eye size={16} />}
                {showHints ? "Скрыть подсказки" : "Показать подсказки"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {currentTest.phrase.words.map((word, index) => {
                const hiddenIndex =
                  currentTest.hiddenWordIndices.indexOf(index);
                const isHidden = hiddenIndex !== -1;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 sm:p-4 border-2 border-gray-300 rounded-lg bg-white shadow-sm"
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{word.icon}</div>
                    <div className="text-xs sm:text-sm text-gray-700 mb-2 font-medium">
                      {showHints ? word.category : "?"}
                    </div>

                    {isHidden ? (
                      <div className="w-full">
                        <input
                          type="text"
                          value={currentTest.userAnswers[hiddenIndex] || ""}
                          onChange={(e) =>
                            updateAnswer(hiddenIndex, e.target.value)
                          }
                          disabled={isCompleted}
                          placeholder="???"
                          className={`w-full text-center px-2 py-1 border rounded text-sm font-medium ${
                            isCompleted
                              ? isAnswerCorrect(hiddenIndex)
                                ? "bg-green-100 border-green-300 text-green-800"
                                : "bg-red-100 border-red-300 text-red-800"
                              : "border-gray-300 focus:border-blue-500 focus:outline-none"
                          }`}
                        />
                        {isCompleted && (
                          <div className="text-xs mt-1 text-center">
                            {isAnswerCorrect(hiddenIndex) ? (
                              <span className="text-green-600 font-medium">
                                ✓ Верно
                              </span>
                            ) : (
                              <span className="text-red-600 font-medium">
                                ✗ {word.word}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="font-bold text-center text-gray-900 text-sm sm:text-base">
                        {word.word}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!isCompleted ? (
                <button
                  onClick={checkAnswers}
                  disabled={currentTest.userAnswers.some(
                    (answer) => !answer.trim(),
                  )}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle size={16} />
                  Проверить ответы
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      score.correct === score.total
                        ? "bg-green-100 text-green-800"
                        : score.correct > score.total / 2
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {score.correct === score.total ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Результат: {score.correct} из {score.total}
                  </div>

                  <button
                    onClick={generateTest}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Новый тест
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
