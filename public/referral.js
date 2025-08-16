// Реферальная система

// Инициализация Telegram WebApp
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        document.body.classList.add('tg-app');
        console.log('Telegram WebApp инициализирован в рефералах');
    } else {
        console.log('Telegram WebApp не доступен, запускаем в браузере');
    }
} catch (error) {
    console.log('Telegram WebApp не доступен:', error);
}

// Данные рефералов
let referralData = {
    referralCode: '',
    totalReferrals: 0,
    totalEarned: 0,
    pendingRewards: 0,
    referrals: [],
    rewardsHistory: []
};

// Загрузка данных рефералов
function loadReferralData() {
    const saved = localStorage.getItem('magnumReferralData');
    if (saved) {
        referralData = JSON.parse(saved);
    } else {
        // Генерируем новый реферальный код
        referralData.referralCode = generateReferralCode();
    }
    
    updateReferralUI();
}

// Сохранение данных рефералов
function saveReferralData() {
    localStorage.setItem('magnumReferralData', JSON.stringify(referralData));
}

// Генерация реферального кода
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Обновление UI рефералов
function updateReferralUI() {
    updateReferralStats();
    updateReferralLink();
    updateReferralsList();
    updateRewardsHistory();
}

// Обновление статистики рефералов
function updateReferralStats() {
    const totalReferrals = document.getElementById('totalReferrals');
    const totalEarned = document.getElementById('totalEarned');
    const pendingRewards = document.getElementById('pendingRewards');
    
    if (totalReferrals) {
        totalReferrals.textContent = referralData.totalReferrals;
    }
    
    if (totalEarned) {
        totalEarned.textContent = formatNumber(referralData.totalEarned);
    }
    
    if (pendingRewards) {
        pendingRewards.textContent = formatNumber(referralData.pendingRewards);
    }
}

// Обновление реферальной ссылки
function updateReferralLink() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
        const baseUrl = window.location.origin;
        const fullLink = `${baseUrl}?ref=${referralData.referralCode}`;
        referralLink.value = fullLink;
    }
}

// Копирование реферальной ссылки
function copyReferralLink() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
        referralLink.select();
        referralLink.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            
            if (tg && tg.showAlert) {
                tg.showAlert('Ссылка скопирована в буфер обмена!');
            } else {
                alert('Ссылка скопирована в буфер обмена!');
            }
        } catch (err) {
            console.log('Ошибка копирования:', err);
        }
    }
}

// Поделиться в Telegram
function shareToTelegram() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
        const text = `🎮 Присоединяйся к Magnum Coins Farm!\n\n💰 Зарабатывай монеты, соревнуйся с друзьями и получай бонусы!\n\n🔗 Моя реферальная ссылка: ${referralLink.value}`;
        
        const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent(text)}`;
        
        if (tg && tg.openTelegramLink) {
            tg.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    }
}

// Поделиться в WhatsApp
function shareToWhatsApp() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
        const text = `🎮 Присоединяйся к Magnum Coins Farm!\n\n💰 Зарабатывай монеты, соревнуйся с друзьями и получай бонусы!\n\n🔗 Моя реферальная ссылка: ${referralLink.value}`;
        
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

// Поделиться в VK
function shareToVK() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink) {
        const text = `🎮 Присоединяйся к Magnum Coins Farm!\n\n💰 Зарабатывай монеты, соревнуйся с друзьями и получай бонусы!\n\n🔗 Моя реферальная ссылка: ${referralLink.value}`;
        
        const url = `https://vk.com/share.php?url=${encodeURIComponent(referralLink.value)}&title=Magnum Coins Farm&description=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

// Обновление списка рефералов
function updateReferralsList() {
    const referralsList = document.getElementById('referralsList');
    if (!referralsList) return;
    
    referralsList.innerHTML = '';
    
    if (referralData.referrals.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = 'rgba(255, 255, 255, 0.6)';
        emptyMessage.style.padding = '20px';
        emptyMessage.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">👥</div>
            <div>У вас пока нет рефералов</div>
            <div style="font-size: 0.9rem; margin-top: 5px;">Поделитесь ссылкой с друзьями!</div>
        `;
        referralsList.appendChild(emptyMessage);
        return;
    }
    
    referralData.referrals.forEach(referral => {
        const referralItem = document.createElement('div');
        referralItem.className = 'referral-item';
        
        const date = new Date(referral.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        referralItem.innerHTML = `
            <div class="referral-info">
                <div class="referral-name">${referral.name}</div>
                <div class="referral-date">Присоединился ${formattedDate}</div>
            </div>
            <div class="referral-stats">
                <div class="referral-level">Уровень ${referral.level}</div>
                <div class="referral-earnings">+${formatNumber(referral.earnings)} монет</div>
            </div>
        `;
        
        referralsList.appendChild(referralItem);
    });
}

// Обновление истории наград
function updateRewardsHistory() {
    const rewardsHistory = document.getElementById('rewardsHistory');
    if (!rewardsHistory) return;
    
    rewardsHistory.innerHTML = '';
    
    if (referralData.rewardsHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = 'rgba(255, 255, 255, 0.6)';
        emptyMessage.style.padding = '20px';
        emptyMessage.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🎁</div>
            <div>История наград пуста</div>
            <div style="font-size: 0.9rem; margin-top: 5px;">Приглашайте друзей для получения наград!</div>
        `;
        rewardsHistory.appendChild(emptyMessage);
        return;
    }
    
    referralData.rewardsHistory.slice(0, 10).forEach(reward => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(reward.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        historyItem.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div class="history-amount">+${formatNumber(reward.amount)}</div>
            <div class="history-type">${reward.type}</div>
        `;
        
        rewardsHistory.appendChild(historyItem);
    });
}

// Добавление нового реферала
function addReferral(referralInfo) {
    referralData.referrals.unshift({
        id: Date.now(),
        name: referralInfo.name || 'Новый игрок',
        date: new Date().toISOString(),
        level: 1,
        earnings: 0
    });
    
    referralData.totalReferrals++;
    
    // Вычисляем награду за реферала
    const baseReward = 100;
    const reward = baseReward;
    
    referralData.totalEarned += reward;
    referralData.pendingRewards += reward;
    
    // Добавляем в историю наград
    referralData.rewardsHistory.unshift({
        date: new Date().toISOString(),
        amount: reward,
        type: 'Реферал зарегистрировался'
    });
    
    // Ограничиваем историю
    if (referralData.rewardsHistory.length > 50) {
        referralData.rewardsHistory = referralData.rewardsHistory.slice(0, 50);
    }
    
    saveReferralData();
    updateReferralUI();
    
    // Уведомление
    if (tg && tg.showAlert) {
        tg.showAlert(`🎉 Новый реферал!\nПолучено ${reward} монет`);
    }
}

// Получение наград рефералов
function claimReferralRewards() {
    if (referralData.pendingRewards > 0) {
        // Добавляем монеты к основной игре
        const gameData = JSON.parse(localStorage.getItem('magnumGameData') || '{}');
        gameData.coins = (gameData.coins || 0) + referralData.pendingRewards;
        localStorage.setItem('magnumGameData', JSON.stringify(gameData));
        
        // Добавляем в историю наград
        referralData.rewardsHistory.unshift({
            date: new Date().toISOString(),
            amount: referralData.pendingRewards,
            type: 'Получены награды'
        });
        
        const claimedAmount = referralData.pendingRewards;
        referralData.pendingRewards = 0;
        
        saveReferralData();
        updateReferralUI();
        
        // Уведомление
        if (tg && tg.showAlert) {
            tg.showAlert(`💰 Получено ${formatNumber(claimedAmount)} монет с рефералов!`);
        }
    }
}

// Обновление заработка реферала
function updateReferralEarnings(referralId, earnings) {
    const referral = referralData.referrals.find(r => r.id === referralId);
    if (referral) {
        const oldEarnings = referral.earnings;
        referral.earnings = earnings;
        
        // Вычисляем комиссию (10% от заработка реферала)
        const commission = Math.floor(earnings * 0.1);
        const additionalReward = commission - Math.floor(oldEarnings * 0.1);
        
        if (additionalReward > 0) {
            referralData.totalEarned += additionalReward;
            referralData.pendingRewards += additionalReward;
            
            // Добавляем в историю наград
            referralData.rewardsHistory.unshift({
                date: new Date().toISOString(),
                amount: additionalReward,
                type: 'Комиссия с реферала'
            });
            
            saveReferralData();
            updateReferralUI();
        }
    }
}

// Проверка реферального кода при загрузке
function checkReferralCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && refCode !== referralData.referralCode) {
        // Это новый пользователь с реферальным кодом
        const referrerData = JSON.parse(localStorage.getItem('magnumReferralData') || '{}');
        
        if (referrerData.referralCode === refCode) {
            // Добавляем реферала к пригласившему
            const userInfo = {
                name: 'Новый игрок',
                level: 1
            };
            
            // В реальном проекте здесь была бы отправка данных на сервер
            console.log('Реферальный код найден:', refCode);
            
            // Показываем уведомление
            if (tg && tg.showAlert) {
                tg.showAlert('🎉 Добро пожаловать по реферальной ссылке!\nВы получите бонус за регистрацию!');
            }
        }
    }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация реферальной системы...');
    
    // Загружаем данные
    loadReferralData();
    
    // Проверяем реферальный код
    checkReferralCode();
    
    console.log('Реферальная система инициализирована');
});

// Экспорт функций для глобального доступа
window.copyReferralLink = copyReferralLink;
window.shareToTelegram = shareToTelegram;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToVK = shareToVK;
window.addReferral = addReferral;
window.claimReferralRewards = claimReferralRewards;
