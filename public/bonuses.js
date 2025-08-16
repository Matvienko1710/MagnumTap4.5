// Система ежедневных и еженедельных бонусов

// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован в бонусах');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Данные бонусов
let bonusData = {
    lastClaimDate: null,
    streakDays: 0,
    totalClaimed: 0,
    history: []
};

// Загрузка данных бонусов
function loadBonusData() {
    const saved = localStorage.getItem('magnumBonusData');
    if (saved) {
        bonusData = JSON.parse(saved);
    }
    updateBonusUI();
}

// Сохранение данных бонусов
function saveBonusData() {
    localStorage.setItem('magnumBonusData', JSON.stringify(bonusData));
}

// Обновление UI бонусов
function updateBonusUI() {
    const today = new Date().toDateString();
    const canClaim = !bonusData.lastClaimDate || bonusData.lastClaimDate !== today;
    
    // Обновляем прогресс недели
    const progressFill = document.getElementById('weeklyProgress');
    const currentDay = document.getElementById('currentDay');
    const streakCount = document.getElementById('streakCount');
    
    if (progressFill) {
        progressFill.style.width = `${Math.min(bonusData.streakDays * 14.28, 100)}%`;
    }
    
    if (currentDay) {
        currentDay.textContent = Math.min(bonusData.streakDays, 7);
    }
    
    if (streakCount) {
        streakCount.textContent = bonusData.streakDays;
    }
    
    // Обновляем бонус
    const bonusAmount = document.getElementById('bonusAmount');
    const bonusMultiplier = document.getElementById('bonusMultiplier');
    const claimBtn = document.getElementById('claimBonusBtn');
    const nextBonusTime = document.getElementById('nextBonusTime');
    
    const baseBonus = 100;
    const multiplier = Math.min(1 + (bonusData.streakDays * 0.1), 2.0);
    const finalBonus = Math.floor(baseBonus * multiplier);
    
    if (bonusAmount) {
        bonusAmount.textContent = finalBonus;
    }
    
    if (bonusMultiplier) {
        bonusMultiplier.textContent = `x${multiplier.toFixed(1)}`;
    }
    
    if (claimBtn) {
        if (canClaim) {
            claimBtn.disabled = false;
            claimBtn.textContent = '🎁 Получить бонус';
        } else {
            claimBtn.disabled = true;
            claimBtn.textContent = '✅ Уже получено';
        }
    }
    
    // Обновляем время до следующего бонуса
    if (nextBonusTime) {
        if (canClaim) {
            nextBonusTime.textContent = 'Доступно сейчас!';
        } else {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            
            const now = new Date();
            const timeLeft = nextDay - now;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            nextBonusTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Обновляем календарь
    updateCalendar();
    
    // Обновляем историю
    updateHistory();
}

// Получение ежедневного бонуса
function claimDailyBonus() {
    const today = new Date().toDateString();
    
    if (bonusData.lastClaimDate === today) {
        if (tg && tg.showAlert) {
            tg.showAlert('Вы уже получили бонус сегодня!');
        }
        return;
    }
    
    // Вычисляем бонус
    const baseBonus = 100;
    const multiplier = Math.min(1 + (bonusData.streakDays * 0.1), 2.0);
    const finalBonus = Math.floor(baseBonus * multiplier);
    
    // Проверяем серию дней
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (bonusData.lastClaimDate === yesterdayStr) {
        bonusData.streakDays++;
    } else if (bonusData.lastClaimDate !== today) {
        bonusData.streakDays = 1;
    }
    
    // Обновляем данные
    bonusData.lastClaimDate = today;
    bonusData.totalClaimed += finalBonus;
    bonusData.history.unshift({
        date: today,
        amount: finalBonus,
        streak: bonusData.streakDays
    });
    
    // Ограничиваем историю
    if (bonusData.history.length > 30) {
        bonusData.history = bonusData.history.slice(0, 30);
    }
    
    // Сохраняем данные
    saveBonusData();
    
    // Добавляем монеты к основной игре
    addCoinsToGame(finalBonus);
    
    // Показываем анимацию
    showCoinAnimation();
    
    // Обновляем UI
    updateBonusUI();
    
    // Уведомление
    if (tg && tg.showAlert) {
        tg.showAlert(`🎉 Получено ${finalBonus} монет!\nСерия: ${bonusData.streakDays} дней`);
    }
}

// Добавление монет к основной игре
function addCoinsToGame(amount) {
    const gameData = JSON.parse(localStorage.getItem('magnumGameData') || '{}');
    gameData.coins = (gameData.coins || 0) + amount;
    localStorage.setItem('magnumGameData', JSON.stringify(gameData));
}

// Анимация получения монет
function showCoinAnimation() {
    const animation = document.getElementById('coinAnimation');
    const flyingCoin = animation.querySelector('.flying-coin');
    
    if (animation && flyingCoin) {
        // Случайная позиция начала
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        flyingCoin.style.left = startX + 'px';
        flyingCoin.style.top = startY + 'px';
        
        animation.style.display = 'block';
        
        // Скрываем анимацию через 1 секунду
        setTimeout(() => {
            animation.style.display = 'none';
        }, 1000);
    }
}

// Обновление календаря
function updateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    const today = new Date();
    const currentDay = today.getDay();
    
    // Создаем календарь на неделю
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() - currentDay + i);
        const dayStr = dayDate.toDateString();
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const dayName = dayNames[i];
        
        // Проверяем статус дня
        if (dayStr === today.toDateString()) {
            dayElement.classList.add('today');
        } else if (dayDate < today) {
            const claimed = bonusData.history.some(h => h.date === dayStr);
            if (claimed) {
                dayElement.classList.add('claimed');
            }
        } else {
            dayElement.classList.add('future');
        }
        
        // Вычисляем бонус для дня
        const dayStreak = i + 1;
        const baseBonus = 100;
        const multiplier = Math.min(1 + (dayStreak * 0.1), 2.0);
        const dayBonus = Math.floor(baseBonus * multiplier);
        
        dayElement.innerHTML = `
            <div class="day-number">${dayName}</div>
            <div class="day-bonus">${dayBonus}</div>
        `;
        
        calendarGrid.appendChild(dayElement);
    }
}

// Обновление истории
function updateHistory() {
    const historyList = document.getElementById('bonusHistory');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    bonusData.history.slice(0, 10).forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        historyItem.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div class="history-amount">+${entry.amount}</div>
            <div class="history-streak">Серия: ${entry.streak}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Обновление времени до следующего бонуса
function updateNextBonusTime() {
    const nextBonusTime = document.getElementById('nextBonusTime');
    if (!nextBonusTime) return;
    
    const today = new Date().toDateString();
    const canClaim = !bonusData.lastClaimDate || bonusData.lastClaimDate !== today;
    
    if (canClaim) {
        nextBonusTime.textContent = 'Доступно сейчас!';
    } else {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        const now = new Date();
        const timeLeft = nextDay - now;
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        nextBonusTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация системы бонусов...');
    
    // Загружаем данные
    loadBonusData();
    
    // Обновляем время каждую секунду
    setInterval(updateNextBonusTime, 1000);
    
    console.log('Система бонусов инициализирована');
});

// Экспорт функций для глобального доступа
window.claimDailyBonus = claimDailyBonus;
