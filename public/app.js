// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Загрузка статистики
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalPlayers').textContent = data.data.totalPlayers.toLocaleString();
            document.getElementById('activeToday').textContent = data.data.activeToday.toLocaleString();
            document.getElementById('totalCoins').textContent = data.data.totalCoins.toLocaleString();
        }
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Переход к игре
function startGame() {
    if (tg && tg.showAlert) {
        try {
            tg.showAlert('🎮 Переходим к игре!');
        } catch (error) {
            console.log('Ошибка показа уведомления:', error);
        }
    }
    window.location.href = '/game';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем статистику
    loadStats();
    
    // Обработчик кнопки начала игры
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.addEventListener('click', startGame);
        
        // Добавляем поддержку touch событий
        startButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        
        startButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
    }
    
    // Показываем приветствие в Telegram
    if (tg && tg.MainButton) {
        try {
            tg.MainButton.setText('🎮 Играть');
            tg.MainButton.onClick(startGame);
            tg.MainButton.show();
        } catch (error) {
            console.log('Ошибка настройки кнопки:', error);
        }
    }
});

// Обновляем статистику каждые 30 секунд
setInterval(loadStats, 30000);
