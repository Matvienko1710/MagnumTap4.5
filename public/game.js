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
    autoClicker: 0,
    multiplier: 1,
    lucky: 0,
    upgrades: {
        clicker: { level: 0, cost: 10, baseCost: 10 },
        auto: { level: 0, cost: 50, baseCost: 50 },
        multiplier: { level: 0, cost: 200, baseCost: 200 },
        lucky: { level: 0, cost: 500, baseCost: 500 }
    },
    achievements: {
        firstClick: false,
        tenCoins: false,
        hundredCoins: false,
        thousandCoins: false,
        firstUpgrade: false,
        tenUpgrades: false
    },
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
    document.getElementById('cps').textContent = (gameData.autoClicker * gameData.multiplier).toFixed(1);
    
    // Обновляем улучшения
    Object.keys(gameData.upgrades).forEach(upgrade => {
        const data = gameData.upgrades[upgrade];
        document.getElementById(`${upgrade}Cost`).textContent = data.cost.toLocaleString();
        document.getElementById(`${upgrade}Level`).textContent = data.level;
        
        const button = document.querySelector(`[data-upgrade="${upgrade}"] .upgrade-btn`);
        if (button) {
            button.disabled = gameData.coins < data.cost;
        }
    });
}

// Покупка улучшения
function buyUpgrade(type) {
    const upgrade = gameData.upgrades[type];
    
    if (gameData.coins >= upgrade.cost) {
        gameData.coins -= upgrade.cost;
        
        switch (type) {
            case 'clicker':
                gameData.clickPower += 1;
                break;
            case 'auto':
                gameData.autoClicker += 1;
                break;
            case 'multiplier':
                gameData.multiplier += 0.5;
                break;
            case 'lucky':
                gameData.lucky += 0.1;
                break;
        }
        
        upgrade.level += 1;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
        
        // Проверяем достижения
        checkAchievements();
        
        // Обновляем интерфейс
        updateUI();
        saveGameData();
        
        // Показываем уведомление
        if (tg && tg.showAlert) {
            try {
                tg.showAlert(`✅ Улучшение "${getUpgradeName(type)}" куплено!`);
            } catch (error) {
                console.log('Ошибка показа уведомления:', error);
            }
        }
    }
}

// Получение названия улучшения
function getUpgradeName(type) {
    const names = {
        clicker: 'Улучшенный клик',
        auto: 'Автокликер',
        multiplier: 'Множитель',
        lucky: 'Удача'
    };
    return names[type] || type;
}

// Клик по монете
function clickCoin() {
    const baseCoins = gameData.clickPower;
    let earnedCoins = baseCoins;
    
    // Применяем множитель
    earnedCoins *= gameData.multiplier;
    
    // Проверяем удачу
    if (Math.random() < gameData.lucky) {
        earnedCoins *= 2;
        showFloatingCoin('🪙 x2!', 'lucky');
    }
    
    gameData.coins += earnedCoins;
    gameData.totalClicks += 1;
    gameData.totalCoinsEarned += earnedCoins;
    
    // Обновляем статистику сессии
    sessionClicks++;
    sessionCoins += earnedCoins;
    
    // Показываем плавающую монету
    showFloatingCoin(`+${Math.floor(earnedCoins)}`, 'normal');
    
    // Проверяем достижения
    checkAchievements();
    
    // Обновляем интерфейс
    updateUI();
    saveGameData();
}

// Показ плавающих монет
function showFloatingCoin(text, type = 'normal') {
    const coin = document.createElement('div');
    coin.className = 'floating-coin';
    coin.textContent = text;
    
    if (type === 'lucky') {
        coin.style.color = '#f39c12';
        coin.style.fontWeight = 'bold';
    }
    
    // Случайная позиция
    const clickArea = document.getElementById('clickArea');
    const rect = clickArea.getBoundingClientRect();
    const x = Math.random() * (rect.width - 50);
    const y = Math.random() * (rect.height - 50);
    
    coin.style.left = (rect.left + x) + 'px';
    coin.style.top = (rect.top + y) + 'px';
    
    document.body.appendChild(coin);
    
    // Удаляем через 1 секунду
    setTimeout(() => {
        if (coin.parentNode) {
            coin.parentNode.removeChild(coin);
        }
    }, 1000);
}

// Проверка достижений
function checkAchievements() {
    const achievements = [
        { id: 'firstClick', condition: () => gameData.totalClicks >= 1, name: 'Первый клик', desc: 'Сделайте первый клик' },
        { id: 'tenCoins', condition: () => gameData.coins >= 10, name: 'Начинающий', desc: 'Накопите 10 монет' },
        { id: 'hundredCoins', condition: () => gameData.coins >= 100, name: 'Богач', desc: 'Накопите 100 монет' },
        { id: 'thousandCoins', condition: () => gameData.coins >= 1000, name: 'Миллионер', desc: 'Накопите 1000 монет' },
        { id: 'firstUpgrade', condition: () => Object.values(gameData.upgrades).some(u => u.level > 0), name: 'Улучшатель', desc: 'Купите первое улучшение' },
        { id: 'tenUpgrades', condition: () => Object.values(gameData.upgrades).reduce((sum, u) => sum + u.level, 0) >= 10, name: 'Мастер', desc: 'Купите 10 улучшений' }
    ];
    
    achievements.forEach(achievement => {
        if (!gameData.achievements[achievement.id] && achievement.condition()) {
            gameData.achievements[achievement.id] = true;
            showAchievement(achievement.name, achievement.desc);
        }
    });
    
    updateAchievementsUI();
}

// Показ достижения
function showAchievement(name, desc) {
    if (tg && tg.showAlert) {
        try {
            tg.showAlert(`🏆 Достижение: ${name}\n${desc}`);
        } catch (error) {
            console.log('Ошибка показа достижения:', error);
        }
    }
}

// Обновление UI достижений
function updateAchievementsUI() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const achievements = [
        { id: 'firstClick', icon: '👆', name: 'Первый клик', desc: 'Сделайте первый клик' },
        { id: 'tenCoins', icon: '🪙', name: 'Начинающий', desc: 'Накопите 10 монет' },
        { id: 'hundredCoins', icon: '💰', name: 'Богач', desc: 'Накопите 100 монет' },
        { id: 'thousandCoins', icon: '💎', name: 'Миллионер', desc: 'Накопите 1000 монет' },
        { id: 'firstUpgrade', icon: '🔧', name: 'Улучшатель', desc: 'Купите первое улучшение' },
        { id: 'tenUpgrades', icon: '🏆', name: 'Мастер', desc: 'Купите 10 улучшений' }
    ];
    
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = `achievement ${gameData.achievements[achievement.id] ? 'unlocked' : ''}`;
        
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        
        grid.appendChild(div);
    });
}

// Сброс игры
function resetGame() {
    if (confirm('Вы уверены, что хотите сбросить прогресс? Это действие нельзя отменить.')) {
        localStorage.removeItem('magnumCoinsGame');
        location.reload();
    }
}

// Автокликер
function autoClicker() {
    if (gameData.autoClicker > 0) {
        const earned = gameData.autoClicker * gameData.multiplier;
        gameData.coins += earned;
        gameData.totalCoinsEarned += earned;
        updateUI();
        saveGameData();
    }
}

// Переключение между разделами
function showSection(sectionName) {
    console.log('Переключение на секцию:', sectionName);
    
    // Скрываем все секции
    const sections = ['click-section', 'upgrades-section', 'achievements-section'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Убираем активный класс со всех кнопок
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Показываем нужную секцию и активируем кнопку
    let targetSection = '';
    let targetButton = null;
    
    switch (sectionName) {
        case 'click':
            targetSection = 'click-section';
            targetButton = document.querySelector('.nav-btn[onclick*="click"]');
            break;
        case 'upgrades':
            targetSection = 'upgrades-section';
            targetButton = document.querySelector('.nav-btn[onclick*="upgrades"]');
            break;
        case 'achievements':
            targetSection = 'achievements-section';
            targetButton = document.querySelector('.nav-btn[onclick*="achievements"]');
            break;
    }
    
    if (targetSection) {
        const element = document.getElementById(targetSection);
        if (element) {
            element.style.display = 'block';
            console.log('Показана секция:', targetSection);
        }
    }
    
    if (targetButton) {
        targetButton.classList.add('active');
        console.log('Активирована кнопка:', targetButton.textContent);
    }
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
        cps: gameData.cps
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
    updateAchievementsUI();
    
    // Запускаем автокликер
    setInterval(autoClicker, 1000);
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGameData, 10000);
    
    // Показываем секцию кликера по умолчанию
    showSection('click');
    
    // Интеграция с аналитикой
    startSessionTracking();
    
    // Отслеживаем уход со страницы
    window.addEventListener('beforeunload', endSessionTracking);
    
    console.log('Игра инициализирована');
});
