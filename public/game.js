// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован в игре');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Игровые данные
let gameData = {
    coins: 0,
    clickPower: 1,
    totalClicks: 0,
    totalCoinsEarned: 0
};

// Загрузка сохраненных данных
function loadGameData() {
    const saved = localStorage.getItem('magnumCoinsGame');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameData = { ...gameData, ...parsed };
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
}

// Сохранение данных
function saveGameData() {
    try {
        localStorage.setItem('magnumCoinsGame', JSON.stringify(gameData));
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('coins').textContent = Math.floor(gameData.coins).toLocaleString();
    document.getElementById('cps').textContent = gameData.clickPower.toFixed(1);
}

// Клик по монете
function clickCoin() {
    const earnedCoins = gameData.clickPower;
    
    gameData.coins += earnedCoins;
    gameData.totalClicks += 1;
    gameData.totalCoinsEarned += earnedCoins;
    
    // Показываем плавающую монету
    showFloatingCoin(`+${Math.floor(earnedCoins)}`, 'normal');
    
    // Обновляем интерфейс
    updateUI();
    saveGameData();
}

// Показ плавающей монеты
function showFloatingCoin(text, type = 'normal') {
    const coin = document.createElement('div');
    coin.className = `floating-coin ${type}`;
    coin.textContent = text;
    
    // Случайная позиция
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';
    
    document.body.appendChild(coin);
    
    // Удаляем через 1 секунду
    setTimeout(() => {
        if (coin.parentNode) {
            coin.parentNode.removeChild(coin);
        }
    }, 1000);
}

// Отслеживание игровой сессии
let sessionStartTime = Date.now();
let sessionClicks = 0;
let sessionCoins = 0;

function startSessionTracking() {
    sessionStartTime = Date.now();
    sessionClicks = 0;
    sessionCoins = 0;
}

function endSessionTracking() {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const sessionData = {
        coins: sessionCoins,
        clicks: sessionClicks,
        duration: sessionDuration,
        cps: gameData.clickPower
    };
    
    // Добавляем сессию в аналитику
    if (window.addSession) {
        window.addSession(sessionData);
    }
    
    // Обновляем активность пользователя
    updateUserActivity();
}

// Обновление активности пользователя
function updateUserActivity() {
    const today = new Date().toDateString();
    const activityData = JSON.parse(localStorage.getItem('magnumActivityData') || '{}');
    activityData[today] = true;
    localStorage.setItem('magnumActivityData', JSON.stringify(activityData));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация игры...');
    
    // Загружаем данные
    loadGameData();
    
    // Настраиваем клик по монете
    const clickArea = document.getElementById('clickArea');
    if (clickArea) {
        clickArea.addEventListener('click', clickCoin);
        clickArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        clickArea.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            clickCoin();
        });
    }
    
    // Обновляем интерфейс
    updateUI();
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGameData, 10000);
    
    // Интеграция с аналитикой
    startSessionTracking();
    
    // Отслеживаем уход со страницы
    window.addEventListener('beforeunload', endSessionTracking);
    
    console.log('Игра инициализирована');
});
