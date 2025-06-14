# PassPhrase - Современная замена паролей

PassPhrase - приложение для создания и управления паролями с использованием мнемонических фраз и визуальных подсказок.

## Установка и запуск

1. Клонируйте репозиторий

2. Установка:

```bash
bun i
```

3. Запуск:

```bash
bun run dev
```

## Использование

### Создание мнемонической фразы

1. Выберите длину фразы (4, 6, 8 или 10 слов)
2. Нажмите "Создать фразу" для генерации новой фразы
3. Каждое слово отображается с иконкой и категорией
4. Используйте кнопку "Скрыть/Показать" для безопасности

### Шифрование данных

1. Введите название для сохранения (например, "Аккаунт Gmail")
2. Введите данные для шифрования (пароль, секретная информация)
3. Нажмите "Зашифровать" - данные будут зашифрованы с помощью вашей фразы
4. Сохраните фразу для дальнейшего использования

### Управление фразами

1. Переключитесь на вкладку "Мои фразы"
2. Просматривайте все сохраненные фразы
3. Используйте кнопку "Расшифровать" для восстановления данных
4. Копируйте фразы или расшифрованные данные в буфер обмена

## Безопасность

- Все данные хранятся локально в браузере (localStorage)
- Используется алгоритм AES для шифрования
- Мнемоническая фраза служит ключом шифрования
- Никакие данные не передаются на сервер
