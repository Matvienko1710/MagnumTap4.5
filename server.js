require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница настроек
app.get('/settings.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Страница магазина
app.get('/shop.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

// Страница заданий
app.get('/tasks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tasks.html'));
});

// Страница достижений
app.get('/achievements.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'achievements.html'));
});

// Страница таблицы лидеров
app.get('/leaderboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// Страница биржи
app.get('/exchange.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exchange.html'));
});

// Страница улучшений
app.get('/upgrades.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upgrades.html'));
});

// Тестовая страница рекламы
app.get('/test-ad.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test-ad.html'));
});

// Страница диагностики
app.get('/debug.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'debug.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Telegram WebApp сервер запущен на порту ${PORT}`);
  console.log(`🌐 Доступен по адресу: http://localhost:${PORT}`);
  console.log(`🏥 Health check: /health`);
});

