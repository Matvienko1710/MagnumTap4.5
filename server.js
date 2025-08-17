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

// Тестовая страница рекламы
app.get('/test-ad.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test-ad.html'));
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

