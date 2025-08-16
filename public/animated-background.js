// Оптимизированный анимированный фон
class OptimizedAnimatedBackground {
    constructor() {
        this.backgroundElement = null;
        this.isLoaded = false;
        this.init();
    }

    init() {
        // Создаем элемент для анимированного фона
        this.backgroundElement = document.createElement('div');
        this.backgroundElement.className = 'animated-background';
        
        // Добавляем стили для оптимизации
        this.backgroundElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            background: url('https://i.imgur.com/pm7ZuQo.gif') center center/cover no-repeat;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        `;
        
        document.body.appendChild(this.backgroundElement);
        
        // Предзагружаем изображение
        this.preloadImage();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.handleResize());
    }

    preloadImage() {
        const img = new Image();
        img.onload = () => {
            this.isLoaded = true;
            this.showBackground();
        };
        img.onerror = () => {
            console.log('Ошибка загрузки анимированного фона, используем fallback');
            this.useFallback();
        };
        img.src = 'https://i.imgur.com/pm7ZuQo.gif';
    }

    showBackground() {
        if (this.backgroundElement && this.isLoaded) {
            this.backgroundElement.style.opacity = '1';
        }
    }

    useFallback() {
        // Fallback градиентный фон если GIF не загрузился
        if (this.backgroundElement) {
            this.backgroundElement.style.background = `
                linear-gradient(135deg, 
                    #1a0033 0%, 
                    #330066 25%, 
                    #660033 50%, 
                    #330000 75%, 
                    #1a0033 100%
                )
            `;
            this.backgroundElement.style.opacity = '1';
        }
    }

    handleResize() {
        // Оптимизация при изменении размера окна
        if (this.backgroundElement) {
            // Пересчитываем размеры для лучшего покрытия
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Адаптируем размер фона под экран
            if (windowWidth < 768) {
                // Мобильные устройства - используем cover
                this.backgroundElement.style.backgroundSize = 'cover';
            } else {
                // Десктоп - используем contain для лучшего качества
                this.backgroundElement.style.backgroundSize = 'cover';
            }
        }
    }

    destroy() {
        if (this.backgroundElement && this.backgroundElement.parentNode) {
            this.backgroundElement.parentNode.removeChild(this.backgroundElement);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для лучшей производительности
    setTimeout(() => {
        window.animatedBackground = new OptimizedAnimatedBackground();
    }, 100);
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});

// Оптимизация для мобильных устройств
if ('serviceWorker' in navigator) {
    // Отключаем Service Worker для анимированного фона
    // чтобы избежать проблем с кешированием
}

// Дополнительные CSS стили для оптимизации
const style = document.createElement('style');
style.textContent = `
    .animated-background {
        will-change: opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    /* Оптимизация для мобильных устройств */
    @media (max-width: 768px) {
        .animated-background {
            background-attachment: scroll !important;
        }
    }
    
    /* Оптимизация для устройств с низкой производительностью */
    @media (prefers-reduced-motion: reduce) {
        .animated-background {
            background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000) !important;
        }
    }
`;
document.head.appendChild(style);
