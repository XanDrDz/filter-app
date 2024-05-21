# "Фильтр сообщений"

## Описание

Этот проект представляет собой решение для задачи фильтрации сообщений с различными типами данных. Проект реализован с использованием NestJS и предоставляет сервисы для применения различных фильтров к сообщениям.

## Структура проекта

- **`src/`**: Корневая директория проекта.
  - **`modules/filter/`**: Модуль фильтрации сообщений.
    - **`filter.service.ts`**: Сервис для применения фильтров к сообщениям.
    - **`models/`**: Сервис для применения фильтров к сообщениям.
      - **`models.ts`**: Типы данных для сообщений и фильтров.
  - **`modules/nested-filter/`**: Модуль фильтрации сообщений со вложенностями.
    - **`nested-filter.service.ts`**: Сервис для применения фильтров к сообщениям со вложенностями.
    - **`models/`**: Сервис для применения фильтров к сообщениям со вложенностями.
      - **`models.ts`**: Типы данных для сообщений и фильтров со вложенностями.
  - **`app.module.ts`**: Основной модуль приложения.

## Использование

Для запуска тестов:

```
npm run test

```

### Установка зависимостей

Перед запуском проекта убедитесь, что все зависимости установлены. Выполните следующую команду в корневой директории проекта:

```
npm install

```