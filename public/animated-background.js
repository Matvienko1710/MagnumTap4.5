// Надежный анимированный фон с fallback
class ReliableAnimatedBackground {
    constructor() {
        this.backgroundElement = null;
        this.videoElement = null;
        this.isLoaded = false;
        this.fallbackUsed = false;
        this.init();
    }

    init() {
        // Создаем элемент для анимированного фона
        this.backgroundElement = document.createElement('div');
        this.backgroundElement.className = 'animated-background';

        // Добавляем стили для контейнера
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

        document.body.appendChild(this.backgroundElement);

        // Пробуем загрузить MP4 видео
        this.tryLoadVideo();
    }

    tryLoadVideo() {
        // Создаем видео элемент
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'background-video';
        
        // Настройки видео
        this.videoElement.autoplay = true;
        this.videoElement.muted = true;
        this.videoElement.loop = true;
        this.videoElement.playsInline = true;
        this.videoElement.preload = 'metadata';
        
        // Стили для видео
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

        // Устанавливаем источник видео
        this.videoElement.src = 'https://i.imgur.com/buHbiEr.mp4';

        // Обработчики событий
        this.videoElement.addEventListener('loadedmetadata', () => {
            console.log('MP4 background video metadata loaded');
        });

        this.videoElement.addEventListener('canplay', () => {
            this.isLoaded = true;
            this.backgroundElement.style.opacity = 1;
            console.log('MP4 background video ready to play');
            
            // Пытаемся воспроизвести видео
            this.videoElement.play().catch(e => {
                console.log('Auto-play prevented, trying fallback:', e);
                this.useGifFallback();
            });
        });

        this.videoElement.addEventListener('error', (e) => {
            console.error('Failed to load MP4 background video:', e);
            this.useGifFallback();
        });

        // Таймаут для загрузки видео
        setTimeout(() => {
            if (!this.isLoaded && !this.fallbackUsed) {
                console.log('Video loading timeout, using fallback');
                this.useGifFallback();
            }
        }, 5000);
    }

    useGifFallback() {
        if (this.fallbackUsed) return;
        this.fallbackUsed = true;
        
        console.log('Using GIF fallback background');
        
        // Удаляем видео элемент
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
        
        // Устанавливаем GIF фон
        this.backgroundElement.style.background = `
            url('https://i.imgur.com/pm7ZuQo.gif') center center/cover no-repeat
        `;
        this.backgroundElement.style.opacity = 1;
        this.isLoaded = true;
    }

    useGradientFallback() {
        if (this.fallbackUsed) return;
        this.fallbackUsed = true;
        
        console.log('Using gradient fallback background');
        
        // Удаляем видео элемент
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
        
        // Устанавливаем градиентный фон
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
        this.isLoaded = true;
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
    console.log('Initializing animated background...');
    
    // Небольшая задержка для оптимизации загрузки
    setTimeout(() => {
        try {
            window.animatedBackground = new ReliableAnimatedBackground();
        } catch (error) {
            console.error('Failed to initialize animated background:', error);
            // Создаем простой градиентный фон как последний fallback
            const fallbackDiv = document.createElement('div');
            fallbackDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
            `;
            document.body.appendChild(fallbackDiv);
        }
    }, 100);
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});

// Очистка при переходе между страницами
window.addEventListener('pagehide', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});
