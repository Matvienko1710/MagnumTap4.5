// Простой градиентный фон для Magnum Coins Farm
// Анимированный фон отключен - используется CSS градиент
console.log('Gradient background enabled');

// Отключаем анимированный фон
class AnimatedBackground {
    constructor() {
        console.log('Animated background disabled - using CSS gradient');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - gradient background active');
});

// Альтернативная инициализация если DOM уже загружен
if (document.readyState !== 'loading') {
    console.log('DOM already loaded - gradient background active');
}
