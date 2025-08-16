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

