// Простой градиентный фон для Magnum Coins Farm
// Версия: 2.0 - Принудительное применение для Telegram Web App
console.log('Gradient background enabled - v2.0');

// Принудительно применяем градиентный фон
function applyGradientBackground() {
    console.log('Applying gradient background...');
    
    // Применяем фон к body
    document.body.style.backgroundImage = 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    
    // Применяем фон к html
    document.documentElement.style.backgroundImage = 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)';
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.backgroundPosition = 'center';
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    
    // Убираем старые элементы фона
    const oldBackgrounds = document.querySelectorAll('#animatedBackground, #fallbackBackground, #videoOverlay');
    oldBackgrounds.forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    console.log('Gradient background applied successfully');
}

// Отключаем анимированный фон
class AnimatedBackground {
    constructor() {
        console.log('Animated background disabled - using CSS gradient');
        applyGradientBackground();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - applying gradient background');
    applyGradientBackground();
});

// Альтернативная инициализация если DOM уже загружен
if (document.readyState !== 'loading') {
    console.log('DOM already loaded - applying gradient background immediately');
    applyGradientBackground();
}

// Применяем фон также при изменении видимости (для Telegram Web App)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('Page became visible - reapplying gradient background');
        setTimeout(applyGradientBackground, 100);
    }
});
