"use client";

import { useState, useEffect } from "react";
import { MnemonicPhrase } from "@/lib/passphrase";

const STORAGE_KEY = "passphrase-data";

export function useLocalStorage() {
  const [phrases, setPhrases] = useState<MnemonicPhrase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const phrasesWithDates = parsed.map(
          (phrase: MnemonicPhrase & { createdAt: string }) => ({
            ...phrase,
            createdAt: new Date(phrase.createdAt),
          }),
        );
        setPhrases(phrasesWithDates);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const savePhrase = (phrase: MnemonicPhrase) => {
    const updatedPhrases = [...phrases, phrase];
    setPhrases(updatedPhrases);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка сохранения данных");
    }
  };

  const deletePhrase = (id: string) => {
    const updatedPhrases = phrases.filter((phrase) => phrase.id !== id);
    setPhrases(updatedPhrases);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления данных");
    }
  };

  const clearAllData = () => {
    setPhrases([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Ошибка очистки данных:", error);
    }
  };

  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify(phrases, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `passphrase-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка экспорта JSON:", error);
      alert("Ошибка экспорта данных");
    }
  };

  const exportToCSV = () => {
    try {
      const headers = [
        "ID",
        "Название",
        "Фраза",
        "Дата создания",
        "Зашифрованные данные",
      ];
      const csvData = phrases.map((phrase) => [
        phrase.id,
        `"${phrase.title}"`,
        `"${phrase.words.map((w) => w.word).join(" ")}"`,
        phrase.createdAt.toISOString(),
        `"${phrase.encrypted || ""}"`,
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const dataBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `passphrase-backup-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка экспорта CSV:", error);
      alert("Ошибка экспорта данных");
    }
  };

  const importFromJSON = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);

          if (!Array.isArray(importedData)) {
            throw new Error("Неверный формат файла");
          }

          const validPhrases = importedData
            .filter(
              (item) =>
                item.id &&
                item.title &&
                item.words &&
                Array.isArray(item.words) &&
                item.createdAt,
            )
            .map((phrase) => ({
              ...phrase,
              createdAt: new Date(phrase.createdAt),
            }));

          if (validPhrases.length === 0) {
            throw new Error("Не найдено валидных фраз для импорта");
          }

          const existingIds = new Set(phrases.map((p) => p.id));
          const newPhrases = validPhrases.filter((p) => !existingIds.has(p.id));

          if (newPhrases.length === 0) {
            alert("Все фразы из файла уже существуют");
            resolve();
            return;
          }

          const updatedPhrases = [...phrases, ...newPhrases];
          setPhrases(updatedPhrases);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));

          alert(`Импортировано ${newPhrases.length} новых фраз`);
          resolve();
        } catch (error) {
          console.error("Ошибка импорта:", error);
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const importFromCSV = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const lines = csvContent.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            throw new Error("CSV файл должен содержать заголовки и данные");
          }

          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));
          const expectedHeaders = [
            "ID",
            "Название",
            "Фраза",
            "Дата создания",
            "Зашифрованные данные",
          ];

          if (!expectedHeaders.every((h) => headers.includes(h))) {
            throw new Error(
              "Неверный формат CSV файла. Ожидаются колонки: ID, Название, Фраза, Дата создания, Зашифрованные данные",
            );
          }

          const idIndex = headers.indexOf("ID");
          const titleIndex = headers.indexOf("Название");
          const phraseIndex = headers.indexOf("Фраза");
          const dateIndex = headers.indexOf("Дата создания");
          const encryptedIndex = headers.indexOf("Зашифрованные данные");

          const importedPhrases = lines
            .slice(1)
            .map((line) => {
              const values = line
                .split(",")
                .map((v) => v.trim().replace(/"/g, ""));
              const phraseWords = values[phraseIndex]
                .split(" ")
                .map((word) => ({
                  word: word.trim(),
                  icon: "🔑",
                  category: "imported",
                }));

              return {
                id: values[idIndex],
                title: values[titleIndex],
                words: phraseWords,
                createdAt: new Date(values[dateIndex]),
                encrypted: values[encryptedIndex] || "",
              };
            })
            .filter(
              (phrase) => phrase.id && phrase.title && phrase.words.length > 0,
            );

          if (importedPhrases.length === 0) {
            throw new Error("Не найдено валидных фраз для импорта");
          }

          const existingIds = new Set(phrases.map((p) => p.id));
          const newPhrases = importedPhrases.filter(
            (p) => !existingIds.has(p.id),
          );

          if (newPhrases.length === 0) {
            alert("Все фразы из файла уже существуют");
            resolve();
            return;
          }

          const updatedPhrases = [...phrases, ...newPhrases];
          setPhrases(updatedPhrases);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhrases));

          alert(`Импортировано ${newPhrases.length} новых фраз из CSV`);
          resolve();
        } catch (error) {
          console.error("Ошибка импорта CSV:", error);
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    phrases,
    isLoaded,
    savePhrase,
    deletePhrase,
    clearAllData,
    exportToJSON,
    exportToCSV,
    importFromJSON,
    importFromCSV,
  };
}
