// Система аналитики и истории фарма

// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован в аналитике');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Данные аналитики
let analyticsData = {
    currentPeriod: 'day',
    sessions: [],
    achievements: [],
    totalEarned: 0,
    totalClicks: 0,
    playTime: 0,
    avgCPS: 0
};

// Загрузка данных аналитики
function loadAnalyticsData() {
    // Загружаем данные сессий
    const savedSessions = localStorage.getItem('magnumSessions');
    if (savedSessions) {
        analyticsData.sessions = JSON.parse(savedSessions);
    }
    
    // Загружаем достижения
    const savedAchievements = localStorage.getItem('magnumAchievements');
    if (savedAchievements) {
        analyticsData.achievements = JSON.parse(savedAchievements);
    }
    
    // Вычисляем общую статистику
    calculateTotalStats();
    
    updateAnalyticsUI();
}

// Сохранение данных аналитики
function saveAnalyticsData() {
    localStorage.setItem('magnumSessions', JSON.stringify(analyticsData.sessions));
    localStorage.setItem('magnumAchievements', JSON.stringify(analyticsData.achievements));
}

// Вычисление общей статистики
function calculateTotalStats() {
    analyticsData.totalEarned = analyticsData.sessions.reduce((sum, session) => sum + session.coins, 0);
    analyticsData.totalClicks = analyticsData.sessions.reduce((sum, session) => sum + session.clicks, 0);
    analyticsData.playTime = analyticsData.sessions.reduce((sum, session) => sum + session.duration, 0);
    analyticsData.avgCPS = analyticsData.sessions.length > 0 ? 
        analyticsData.sessions.reduce((sum, session) => sum + session.cps, 0) / analyticsData.sessions.length : 0;
}

// Обновление UI аналитики
function updateAnalyticsUI() {
    updateStatsOverview();
    updateEarningsChart();
    updateActivityChart();
    updateSessionsList();
    updateAchievementsGrid();
}

// Обновление общей статистики
function updateStatsOverview() {
    const totalEarned = document.getElementById('totalEarned');
    const avgCPS = document.getElementById('avgCPS');
    const totalClicks = document.getElementById('totalClicks');
    const playTime = document.getElementById('playTime');
    
    if (totalEarned) {
        totalEarned.textContent = formatNumber(analyticsData.totalEarned);
    }
    
    if (avgCPS) {
        avgCPS.textContent = formatNumber(analyticsData.avgCPS, 1);
    }
    
    if (totalClicks) {
        totalClicks.textContent = formatNumber(analyticsData.totalClicks);
    }
    
    if (playTime) {
        const hours = Math.floor(analyticsData.playTime / 3600);
        playTime.textContent = `${hours}ч`;
    }
}

// Обновление графика доходов
function updateEarningsChart() {
    const canvas = document.getElementById('earningsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const periodData = getPeriodData();
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (periodData.length === 0) {
        // Показываем сообщение об отсутствии данных
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Нет данных для отображения', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Настройки графика
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Находим максимальное значение
    const maxValue = Math.max(...periodData.map(d => d.coins));
    
    // Рисуем оси
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Ось Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // Ось X
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Рисуем график
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    periodData.forEach((data, index) => {
        const x = padding + (index / (periodData.length - 1)) * chartWidth;
        const y = canvas.height - padding - (data.coins / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Рисуем точки
    ctx.fillStyle = '#ff4500';
    periodData.forEach((data, index) => {
        const x = padding + (index / (periodData.length - 1)) * chartWidth;
        const y = canvas.height - padding - (data.coins / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Обновление графика активности
function updateActivityChart() {
    const activityChart = document.getElementById('activityChart');
    if (!activityChart) return;
    
    activityChart.innerHTML = '';
    
    // Получаем данные активности по часам
    const hourlyActivity = getHourlyActivity();
    
    hourlyActivity.forEach((activity, hour) => {
        const bar = document.createElement('div');
        bar.className = 'activity-bar';
        bar.style.height = `${Math.max(activity * 100, 4)}px`;
        bar.title = `${hour}:00 - ${activity} сессий`;
        activityChart.appendChild(bar);
    });
}

// Обновление списка сессий
function updateSessionsList() {
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;
    
    sessionsList.innerHTML = '';
    
    const periodSessions = getPeriodSessions();
    
    periodSessions.slice(0, 10).forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        
        const date = new Date(session.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const duration = formatDuration(session.duration);
        
        sessionItem.innerHTML = `
            <div class="session-info">
                <div class="session-date">${formattedDate}</div>
                <div class="session-duration">${duration}</div>
            </div>
            <div class="session-stats">
                <div class="session-coins">+${formatNumber(session.coins)}</div>
                <div class="session-cps">${formatNumber(session.cps, 1)}/сек</div>
            </div>
        `;
        
        sessionsList.appendChild(sessionItem);
    });
}

// Обновление сетки достижений
function updateAchievementsGrid() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    const allAchievements = getAllAchievements();
    
    allAchievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        const progress = achievement.unlocked ? 100 : achievement.progress;
        
        achievementItem.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}">
                ${achievement.unlocked ? 'Получено' : `${achievement.progress}/${achievement.target}`}
            </div>
        `;
        
        achievementsGrid.appendChild(achievementItem);
    });
}

// Получение данных за выбранный период
function getPeriodData() {
    const now = new Date();
    const periodSessions = getPeriodSessions();
    
    switch (analyticsData.currentPeriod) {
        case 'day':
            return getDailyData(periodSessions, now);
        case 'week':
            return getWeeklyData(periodSessions, now);
        case 'month':
            return getMonthlyData(periodSessions, now);
        default:
            return [];
    }
}

// Получение сессий за выбранный период
function getPeriodSessions() {
    const now = new Date();
    const periodStart = new Date();
    
    switch (analyticsData.currentPeriod) {
        case 'day':
            periodStart.setHours(0, 0, 0, 0);
            break;
        case 'week':
            periodStart.setDate(now.getDate() - 7);
            break;
        case 'month':
            periodStart.setMonth(now.getMonth() - 1);
            break;
    }
    
    return analyticsData.sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= periodStart;
    });
}

// Получение данных активности по часам
function getHourlyActivity() {
    const hourlyData = new Array(24).fill(0);
    
    analyticsData.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const hour = sessionDate.getHours();
        hourlyData[hour]++;
    });
    
    return hourlyData;
}

// Получение всех достижений
function getAllAchievements() {
    const baseAchievements = [
        {
            id: 'first_click',
            icon: '🎯',
            title: 'Первый клик',
            description: 'Сделайте первый клик',
            target: 1,
            unlocked: analyticsData.totalClicks >= 1
        },
        {
            id: 'click_master',
            icon: '⚡',
            title: 'Мастер кликов',
            description: 'Сделайте 1000 кликов',
            target: 1000,
            unlocked: analyticsData.totalClicks >= 1000
        },
        {
            id: 'coin_collector',
            icon: '💰',
            title: 'Собиратель монет',
            description: 'Заработайте 1000 монет',
            target: 1000,
            unlocked: analyticsData.totalEarned >= 1000
        },
        {
            id: 'session_player',
            icon: '🎮',
            title: 'Игрок сессий',
            description: 'Проведите 10 игровых сессий',
            target: 10,
            unlocked: analyticsData.sessions.length >= 10
        },
        {
            id: 'time_spender',
            icon: '⏱️',
            title: 'Временной магнат',
            description: 'Проведите в игре 1 час',
            target: 3600,
            unlocked: analyticsData.playTime >= 3600
        },
        {
            id: 'cps_master',
            icon: '🚀',
            title: 'Мастер CPS',
            description: 'Достигните 10 монет в секунду',
            target: 10,
            unlocked: analyticsData.avgCPS >= 10
        }
    ];
    
    // Добавляем прогресс для незаблокированных достижений
    return baseAchievements.map(achievement => {
        if (!achievement.unlocked) {
            let progress = 0;
            switch (achievement.id) {
                case 'first_click':
                case 'click_master':
                    progress = analyticsData.totalClicks;
                    break;
                case 'coin_collector':
                    progress = analyticsData.totalEarned;
                    break;
                case 'session_player':
                    progress = analyticsData.sessions.length;
                    break;
                case 'time_spender':
                    progress = analyticsData.playTime;
                    break;
                case 'cps_master':
                    progress = analyticsData.avgCPS;
                    break;
            }
            achievement.progress = Math.min(progress, achievement.target);
        }
        return achievement;
    });
}

// Смена периода
function changePeriod(period) {
    analyticsData.currentPeriod = period;
    
    // Обновляем активные кнопки
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
    
    updateAnalyticsUI();
}

// Добавление новой сессии
function addSession(sessionData) {
    analyticsData.sessions.unshift({
        date: new Date().toISOString(),
        coins: sessionData.coins || 0,
        clicks: sessionData.clicks || 0,
        duration: sessionData.duration || 0,
        cps: sessionData.cps || 0
    });
    
    // Ограничиваем количество сессий
    if (analyticsData.sessions.length > 100) {
        analyticsData.sessions = analyticsData.sessions.slice(0, 100);
    }
    
    calculateTotalStats();
    saveAnalyticsData();
}

// Форматирование чисел
function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
}

// Форматирование длительности
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    } else {
        return `${minutes}м`;
    }
}

// Вспомогательные функции для получения данных по периодам
function getDailyData(sessions, now) {
    const hourlyData = new Array(24).fill(0);
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (sessionDate.toDateString() === now.toDateString()) {
            const hour = sessionDate.getHours();
            hourlyData[hour] += session.coins;
        }
    });
    
    return hourlyData.map((coins, hour) => ({
        label: `${hour}:00`,
        coins: coins
    }));
}

function getWeeklyData(sessions, now) {
    const dailyData = new Array(7).fill(0);
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const daysDiff = Math.floor((now - sessionDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
            const dayOfWeek = sessionDate.getDay();
            dailyData[dayOfWeek] += session.coins;
        }
    });
    
    return dailyData.map((coins, day) => ({
        label: dayNames[day],
        coins: coins
    }));
}

function getMonthlyData(sessions, now) {
    const dailyData = new Array(30).fill(0);
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const daysDiff = Math.floor((now - sessionDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < 30) {
            dailyData[daysDiff] += session.coins;
        }
    });
    
    return dailyData.map((coins, day) => ({
        label: `${day + 1}`,
        coins: coins
    }));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация системы аналитики...');
    
    // Загружаем данные
    loadAnalyticsData();
    
    console.log('Система аналитики инициализирована');
});

// Экспорт функций для глобального доступа
window.changePeriod = changePeriod;
window.addSession = addSession;
