## Frontend · Next.js + TypeScript

![CI](https://github.com/renat2006/tat-bu-2025-frontend/actions/workflows/ci.yml/badge.svg)
![Release](https://img.shields.io/github/v/release/renat2006/tat-bu-2025-frontend)

Фронтенд AR приложения для хакатона Тат. Бу

## Стек
- **Next.js 15** (App Router, Turbopак)
- **TypeScript**
- **Tailwind CSS 4**
- **ESLint (flat) + Prettier**
- **Husky + lint-staged + Commitlint**
- **Sharp** (оптимизация изображений), **SVGO**
- **@next/bundle-analyzer**, **Vercel**

## Быстрый старт
```bash
npm install
npm run dev
```
Откройте `http://localhost:3000`.

## Скрипты
- **dev**: запуск разработки
- **build**: продакшн-сборка (Turbopack)
- **start**: запуск собранного приложения
- **lint**: ESLint (flat config)
- **format**: форматирование Prettier
- **optimize:images**: конвертация public/**/*.{jpg,jpeg,png} → WebP/AVIF в `public/_optimized`
- **clean**: очистка `.next`, `out`, `build`, `node_modules/.cache`, `public/_optimized`
- **analyze**: анализ бандла

## Автоматизация
- pre-commit: `clean → optimize:images → lint-staged → lint → build`
- commit-msg: **Commitlint** (Conventional Commits)

## Коммиты
Пример:
```text
feat(ui): add hero section
```
Поддерживаются типы: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert.

## Деплой
- Готов к деплою на **Vercel** (`vercel.json` присутствует)
- Переменные окружения: создайте `.env` на основе `.env.example`

## Структура
```text
src/
  app/           # маршруты и страницы
  lib/           # доменная логика
  utils/         # утилиты
  hooks/         # хуки
  services/      # api/клиенты
  config/        # конфигурации
  constants/     # константы
  types/         # типы
public/          # статические файлы (+ _optimized)
```

## Оптимизации
- Изображения: WebP/AVIF и кэш-хедеры для статики
- Шрифты: длительное кэширование
- Линтинг и форматирование в коммите
- Игнор мусора в `.gitignore`

