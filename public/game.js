// Тестовая функция для проверки кликов
function testClick() {
    console.log('=== ТЕСТОВЫЙ КЛИК ===');
    alert('Тестовая кнопка работает! Монеты: ' + gameData.coins);
    clickCoin();
}

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
            console.log('Данные загружены:', gameData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    } else {
        console.log('Сохраненных данных нет, используем начальные значения');
    }
}

// Сохранение данных
function saveGameData() {
    try {
        localStorage.setItem('magnumCoinsGame', JSON.stringify(gameData));
        console.log('Данные сохранены:', gameData);
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

// Обновление интерфейса
function updateUI() {
    const coinsElement = document.getElementById('coins');
    const cpsElement = document.getElementById('cps');
    
    if (coinsElement) {
        coinsElement.textContent = Math.floor(gameData.coins).toLocaleString();
    }
    
    if (cpsElement) {
        cpsElement.textContent = gameData.clickPower.toFixed(1);
    }
    
    console.log('UI обновлен - Монеты:', gameData.coins, 'CPS:', gameData.clickPower);
}

// Клик по монете
function clickCoin() {
    console.log('Клик по монете!');
    
    const earnedCoins = gameData.clickPower;
    
    gameData.coins += earnedCoins;
    gameData.totalClicks += 1;
    gameData.totalCoinsEarned += earnedCoins;
    
    console.log('Заработано монет:', earnedCoins, 'Всего монет:', gameData.coins);
    
    // Показываем плавающую монету
    showFloatingCoin(`+${Math.floor(earnedCoins)}`, 'normal');
    
    // Обновляем интерфейс
    updateUI();
    saveGameData();
    
    // Показываем уведомление в Telegram
    if (tg && tg.showAlert) {
        try {
            tg.showAlert(`+${Math.floor(earnedCoins)} монет!`);
        } catch (error) {
            console.log('Ошибка показа уведомления:', error);
        }
    }
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
    console.log('Плавающая монета показана:', text);
    
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
    console.log('Отслеживание сессии начато');
}

function endSessionTracking() {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const sessionData = {
        coins: sessionCoins,
        clicks: sessionClicks,
        duration: sessionDuration,
        cps: gameData.clickPower
    };
    
    console.log('Сессия завершена:', sessionData);
    
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
    console.log('Активность обновлена для:', today);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ ИГРЫ ===');
    
    // Инициализируем менеджер медиафайлов
    if (window.mediaManager) {
        console.log('Media manager доступен');
        // Можно загрузить дополнительные медиафайлы здесь
        // window.mediaManager.loadImage('/media/coin-button.svg');
    }
    
    // Загружаем данные
    loadGameData();
    
    // Настраиваем клик по монете
    const clickArea = document.getElementById('clickArea');
    console.log('Найден элемент clickArea:', clickArea);
    
    if (clickArea) {
        // Обычный клик
        clickArea.addEventListener('click', function(e) {
            console.log('Клик по clickArea (click)');
            e.preventDefault();
            clickCoin();
        });
        
        // Touch события для мобильных
        clickArea.addEventListener('touchstart', function(e) {
            console.log('Touch start по clickArea');
            e.preventDefault();
            e.stopPropagation();
        });
        
        clickArea.addEventListener('touchend', function(e) {
            console.log('Touch end по clickArea');
            e.preventDefault();
            e.stopPropagation();
            clickCoin();
        });
        
        // Добавляем стили для лучшей отзывчивости
        clickArea.style.cursor = 'pointer';
        clickArea.style.userSelect = 'none';
        clickArea.style.webkitUserSelect = 'none';
        
        console.log('Обработчики событий добавлены к clickArea');
    } else {
        console.error('Элемент clickArea не найден!');
    }
    
    // Обновляем интерфейс
    updateUI();
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGameData, 10000);
    
    // Интеграция с аналитикой
    startSessionTracking();
    
    // Отслеживаем уход со страницы
    window.addEventListener('beforeunload', endSessionTracking);
    
    console.log('=== ИГРА ИНИЦИАЛИЗИРОВАНА ===');
});

// Дополнительная инициализация для случаев, когда DOMContentLoaded уже сработал
if (document.readyState === 'loading') {
    console.log('DOM еще загружается...');
} else {
    console.log('DOM уже загружен, инициализируем сразу...');
    
    // Загружаем данные
    loadGameData();
    
    // Настраиваем клик по монете
    const clickArea = document.getElementById('clickArea');
    if (clickArea) {
        clickArea.addEventListener('click', function(e) {
            console.log('Клик по clickArea (immediate)');
            e.preventDefault();
            clickCoin();
        });
        
        clickArea.style.cursor = 'pointer';
        clickArea.style.userSelect = 'none';
        clickArea.style.webkitUserSelect = 'none';
    }
    
    // Обновляем интерфейс
    updateUI();
}
