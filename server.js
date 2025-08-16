require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://telegram.org", "https://web.telegram.org"],
      connectSrc: ["'self'", "https://api.telegram.org", "https://web.telegram.org"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["'self'", "https://telegram.org"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: ['https://web.telegram.org', 'https://telegram.org', 'https://t.me'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница игры
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Страница бонусов
app.get('/bonuses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bonuses.html'));
});

// Страница рейтинга
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// Страница рефералов
app.get('/referral', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'referral.html'));
});

// API для статистики
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalPlayers: 1250,
      activeToday: 89,
      totalCoins: 1542000
    }
  });
});

// API для рейтинга
app.get('/api/leaderboard', (req, res) => {
  // Моковые данные лидеров
  const leaderboard = [
    { id: 1, name: "Игрок_1", coins: 15420, level: 15, activity: 95, quests: 8 },
    { id: 2, name: "Игрок_2", coins: 12850, level: 12, activity: 87, quests: 6 },
    { id: 3, name: "Игрок_3", coins: 11230, level: 11, activity: 92, quests: 7 },
    { id: 4, name: "Игрок_4", coins: 9870, level: 10, activity: 78, quests: 5 },
    { id: 5, name: "Игрок_5", coins: 8540, level: 9, activity: 85, quests: 4 },
    { id: 6, name: "Игрок_6", coins: 7230, level: 8, activity: 73, quests: 3 },
    { id: 7, name: "Игрок_7", coins: 6540, level: 7, activity: 69, quests: 3 },
    { id: 8, name: "Игрок_8", coins: 5870, level: 6, activity: 82, quests: 2 },
    { id: 9, name: "Игрок_9", coins: 5230, level: 5, activity: 76, quests: 2 },
    { id: 10, name: "Игрок_10", coins: 4780, level: 4, activity: 71, quests: 1 }
  ];
  res.json(leaderboard);
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Страница не найдена'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 WebApp сервер запущен на порту ${PORT}`);
  
  // Определяем окружение
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
  
  if (isProduction) {
    console.log(`🌐 Production URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app.railway.app'}`);
    console.log(`🎮 Игра: https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app.railway.app'}/game`);
  } else {
    console.log(`🌐 Доступен по адресу: http://localhost:${PORT}`);
    console.log(`🎮 Игра: http://localhost:${PORT}/game`);
  }
  
  console.log(`📊 API: /api/stats`);
});

