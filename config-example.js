// Пример конфигурации для интеграции Monetag
// Скопируйте этот код в public/index.html и замените YOUR_ZONE_ID на ваш реальный Zone ID

const AD_CONFIG = {
    // Zone ID от Monetag
    zoneId: '9731351',
    
    // Награда за просмотр рекламы (в монетах)
    rewardAmount: 50,
    
    // Кулдаун между просмотрами рекламы (в минутах)
    cooldownMinutes: 5,
    
    // Длительность рекламы (в секундах)
    adDuration: 30,
    
    // Максимальное количество реклам в день
    maxAdsPerDay: 20,
    
    // Настройки для разных типов рекламы
    adTypes: {
        video: {
            reward: 50,
            cooldown: 5
        },
        game: {
            reward: 100,
            cooldown: 10
        },
        install: {
            reward: 200,
            cooldown: 60
        }
    }
};

// Пример настройки для разных регионов
const REGIONAL_CONFIG = {
    'US': {
        rewardAmount: 75,
        cooldownMinutes: 3
    },
    'EU': {
        rewardAmount: 60,
        cooldownMinutes: 4
    },
    'RU': {
        rewardAmount: 40,
        cooldownMinutes: 5
    },
    'default': {
        rewardAmount: 50,
        cooldownMinutes: 5
    }
};

// Функция для определения региона пользователя
function getUserRegion() {
    // Простая логика определения региона
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('America')) return 'US';
    if (timezone.includes('Europe')) return 'EU';
    if (timezone.includes('Asia') || timezone.includes('Moscow')) return 'RU';
    return 'default';
}

// Функция для получения конфигурации для региона
function getRegionalAdConfig() {
    const region = getUserRegion();
    const config = REGIONAL_CONFIG[region] || REGIONAL_CONFIG.default;
    
    return {
        ...AD_CONFIG,
        ...config
    };
}

// Пример использования:
// const userAdConfig = getRegionalAdConfig();
// console.log('Конфигурация для пользователя:', userAdConfig);
