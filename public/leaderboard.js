// Система таблицы лидеров

// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован в рейтинге');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Данные рейтинга
let leaderboardData = {
    currentFilter: 'coins',
    userRank: 0,
    userStats: {
        coins: 0,
        level: 1,
        activity: 0
    }
};

// Моковые данные лидеров (в реальном проекте будут загружаться с сервера)
const mockLeaderboard = [
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

// Загрузка данных рейтинга
function loadLeaderboardData() {
    // Загружаем данные пользователя из игры
    const gameData = JSON.parse(localStorage.getItem('magnumGameData') || '{}');
    leaderboardData.userStats.coins = gameData.coins || 0;
    leaderboardData.userStats.level = gameData.level || 1;
    
    // Вычисляем активность пользователя (процент дней с активностью за последние 30 дней)
    const activityData = JSON.parse(localStorage.getItem('magnumActivityData') || '{}');
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        last30Days.push(activityData[dateStr] || false);
    }
    const activeDays = last30Days.filter(active => active).length;
    leaderboardData.userStats.activity = Math.round((activeDays / 30) * 100);
    
    updateLeaderboardUI();
}

// Обновление UI рейтинга
function updateLeaderboardUI() {
    updateUserPosition();
    updateLeaderboardList();
    updateSeasonStats();
}

// Обновление позиции пользователя
function updateUserPosition() {
    const userRank = document.getElementById('userRank');
    const userName = document.getElementById('userName');
    const userCoins = document.getElementById('userCoins');
    const userLevel = document.getElementById('userLevel');
    
    // Вычисляем позицию пользователя
    const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b[leaderboardData.currentFilter] - a[leaderboardData.currentFilter]);
    const userValue = leaderboardData.userStats[leaderboardData.currentFilter];
    
    let rank = 1;
    for (const player of sortedLeaderboard) {
        if (player[leaderboardData.currentFilter] > userValue) {
            rank++;
        } else {
            break;
        }
    }
    
    if (userRank) {
        userRank.textContent = `#${rank}`;
    }
    
    if (userName) {
        userName.textContent = 'Вы';
    }
    
    if (userCoins) {
        userCoins.textContent = formatNumber(leaderboardData.userStats.coins);
    }
    
    if (userLevel) {
        userLevel.textContent = leaderboardData.userStats.level;
    }
}

// Обновление списка лидеров
function updateLeaderboardList() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    // Сортируем по текущему фильтру
    const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b[leaderboardData.currentFilter] - a[leaderboardData.currentFilter]);
    
    sortedLeaderboard.slice(0, 10).forEach((player, index) => {
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        
        if (index < 3) {
            leaderboardItem.classList.add(`rank-${index + 1}`);
        }
        
        const rankPosition = document.createElement('div');
        rankPosition.className = 'rank-position';
        rankPosition.textContent = `#${index + 1}`;
        
        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        playerInfo.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-level">Уровень ${player.level}</div>
        `;
        
        const playerStats = document.createElement('div');
        playerStats.className = 'player-stats';
        
        let statValue, statLabel;
        switch (leaderboardData.currentFilter) {
            case 'coins':
                statValue = formatNumber(player.coins);
                statLabel = 'монет';
                break;
            case 'activity':
                statValue = player.activity;
                statLabel = '%';
                break;
            case 'quests':
                statValue = player.quests;
                statLabel = 'квестов';
                break;
        }
        
        playerStats.innerHTML = `
            <div class="player-coins">${statValue}</div>
            <div class="player-activity">${statLabel}</div>
        `;
        
        leaderboardItem.appendChild(rankPosition);
        leaderboardItem.appendChild(playerInfo);
        leaderboardItem.appendChild(playerStats);
        
        leaderboardList.appendChild(leaderboardItem);
    });
}

// Обновление статистики сезона
function updateSeasonStats() {
    const totalPlayers = document.getElementById('totalPlayers');
    const activeToday = document.getElementById('activeToday');
    const totalCoins = document.getElementById('totalCoins');
    const seasonEnd = document.getElementById('seasonEnd');
    
    if (totalPlayers) {
        totalPlayers.textContent = formatNumber(1250);
    }
    
    if (activeToday) {
        activeToday.textContent = formatNumber(89);
    }
    
    if (totalCoins) {
        totalCoins.textContent = formatNumber(1540000);
    }
    
    if (seasonEnd) {
        // Вычисляем дни до конца сезона (каждые 4 недели)
        const now = new Date();
        const seasonStart = new Date(2024, 0, 1); // 1 января 2024
        const seasonLength = 28; // 4 недели
        const daysSinceStart = Math.floor((now - seasonStart) / (1000 * 60 * 60 * 24));
        const currentSeason = Math.floor(daysSinceStart / seasonLength);
        const daysInCurrentSeason = daysSinceStart % seasonLength;
        const daysLeft = seasonLength - daysInCurrentSeason;
        
        seasonEnd.textContent = `${daysLeft} дней`;
    }
}

// Смена фильтра рейтинга
function changeFilter(filter) {
    leaderboardData.currentFilter = filter;
    
    // Обновляем активные кнопки
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    updateLeaderboardUI();
}

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Загрузка данных с сервера (для реального проекта)
async function loadLeaderboardFromServer() {
    try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
            const data = await response.json();
            // Обновляем данные лидеров
            return data;
        }
    } catch (error) {
        console.log('Ошибка загрузки рейтинга:', error);
    }
    return mockLeaderboard;
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
    console.log('Инициализация системы рейтинга...');
    
    // Загружаем данные
    loadLeaderboardData();
    
    // Обновляем активность пользователя
    updateUserActivity();
    
    console.log('Система рейтинга инициализирована');
});

// Экспорт функций для глобального доступа
window.changeFilter = changeFilter;
