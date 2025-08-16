// Оптимизированный анимированный фон с MP4 видео
class OptimizedAnimatedBackground {
    constructor() {
        this.backgroundElement = null;
        this.videoElement = null;
        this.isLoaded = false;
        this.init();
    }

    init() {
        // Создаем элемент для анимированного фона
        this.backgroundElement = document.createElement('div');
        this.backgroundElement.className = 'animated-background';

        // Создаем видео элемент
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'background-video';
        
        // Настройки видео для оптимизации
        this.videoElement.autoplay = true;
        this.videoElement.muted = true;
        this.videoElement.loop = true;
        this.videoElement.playsInline = true; // Важно для мобильных устройств
        this.videoElement.preload = 'metadata'; // Загружаем только метаданные для экономии трафика
        
        // Устанавливаем качество видео в зависимости от устройства
        this.setVideoQuality();
        
        // Добавляем стили для оптимизации
        this.backgroundElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 1.5s ease;
            overflow: hidden;
        `;

        this.videoElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
            filter: brightness(0.8) contrast(1.1);
        `;

        // Добавляем видео в контейнер
        this.backgroundElement.appendChild(this.videoElement);
        document.body.appendChild(this.backgroundElement);

        // Устанавливаем источник видео
        this.videoElement.src = 'https://i.imgur.com/buHbiEr.mp4';

        // Обработчики событий видео
        this.videoElement.addEventListener('loadedmetadata', () => {
            console.log('MP4 background video metadata loaded');
        });

        this.videoElement.addEventListener('canplay', () => {
            this.isLoaded = true;
            this.backgroundElement.style.opacity = 1;
            console.log('MP4 background video ready to play');
        });

        this.videoElement.addEventListener('error', (e) => {
            console.error('Failed to load MP4 background video:', e);
            this.setFallbackBackground();
        });

        // Оптимизация для мобильных устройств
        this.optimizeForMobile();
    }

    setVideoQuality() {
        // Определяем качество видео в зависимости от устройства и соединения
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (isMobile) {
            // Для мобильных устройств используем более низкое качество
            this.videoElement.style.filter = 'brightness(0.7) contrast(1.2) blur(0.5px)';
        }
        
        // Если медленное соединение, уменьшаем качество
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            this.videoElement.style.filter = 'brightness(0.6) contrast(1.3) blur(1px)';
        }
    }

    optimizeForMobile() {
        // Останавливаем видео когда страница не видна
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.videoElement.pause();
            } else {
                this.videoElement.play().catch(e => console.log('Auto-play prevented:', e));
            }
        });

        // Останавливаем видео при низком заряде батареи
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2) {
                        this.videoElement.pause();
                    } else if (!document.hidden) {
                        this.videoElement.play().catch(e => console.log('Auto-play prevented:', e));
                    }
                });
            });
        }
    }

    setFallbackBackground() {
        // Устанавливаем градиентный фон как запасной вариант
        this.backgroundElement.style.background = `
            linear-gradient(135deg, 
                #1a0033 0%, 
                #330066 25%, 
                #660033 50%, 
                #330000 75%, 
                #1a0033 100%
            )
        `;
        this.backgroundElement.style.opacity = 1;
    }

    destroy() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = '';
            this.videoElement.load();
        }
        
        if (this.backgroundElement && this.backgroundElement.parentNode) {
            this.backgroundElement.parentNode.removeChild(this.backgroundElement);
        }
    }
}

// Инициализация фона при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для оптимизации загрузки
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

// Очистка при переходе между страницами (если используется SPA)
window.addEventListener('pagehide', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});
