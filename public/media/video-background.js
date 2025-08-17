// Видеофон для Magnum Coins Farm
console.log('Video background script loaded');

class VideoBackground {
    constructor() {
        this.video = null;
        this.container = null;
        this.isLoaded = false;
        this.fallbackBackground = null;
        this.init();
    }

    init() {
        console.log('Initializing video background...');
        
        // Проверяем поддержку видео
        if (!this.isVideoSupported()) {
            console.log('Video not supported, using fallback');
            this.initFallback();
            return;
        }
        
        this.createVideoBackground();
        this.isLoaded = true;
        
        console.log('Video background initialized');
    }

    isVideoSupported() {
        const video = document.createElement('video');
        return !!(video.canPlayType && video.canPlayType('video/mp4').replace(/no/, ''));
    }

    createVideoBackground() {
        // Создаем контейнер для видео
        this.container = document.createElement('div');
        this.container.id = 'videoBackgroundContainer';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            pointer-events: none;
            overflow: hidden;
        `;

        // Создаем видео элемент
        this.video = document.createElement('video');
        this.video.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
            opacity: 0.8;
        `;
        
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        this.video.preload = 'auto';
        
        // Добавляем обработчики событий
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            this.video.style.opacity = '0.8';
        });
        
        this.video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        this.video.addEventListener('canplaythrough', () => {
            console.log('Video can play through');
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            console.error('Video error details:', this.video.error);
            this.initFallback();
        });
        
        this.video.addEventListener('canplay', () => {
            this.video.play().catch(e => {
                console.warn('Autoplay failed:', e);
                // Пытаемся воспроизвести при взаимодействии пользователя
                document.addEventListener('click', () => {
                    this.video.play().catch(console.warn);
                }, { once: true });
            });
        });

        // Устанавливаем источник видео
        this.video.src = '/media/magnumback.mp4';
        
        // Добавляем видео в контейнер
        this.container.appendChild(this.video);
        
        // Добавляем контейнер в body
        document.body.appendChild(this.container);
        
        // Добавляем оверлей для лучшей читаемости текста
        this.addOverlay();
    }

    addOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'videoOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
    }

    initFallback() {
        console.log('Initializing fallback animated background...');
        
        // Создаем простой анимированный фон как fallback
        const fallbackContainer = document.createElement('div');
        fallbackContainer.id = 'fallbackBackground';
        fallbackContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
            animation: gradientShift 20s ease-in-out infinite;
        `;
        
        // Добавляем CSS анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0%, 100% { 
                    background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
                }
                25% { 
                    background: linear-gradient(135deg, #330066, #660033, #330000, #1a0033);
                }
                50% { 
                    background: linear-gradient(135deg, #660033, #330000, #1a0033, #330066);
                }
                75% { 
                    background: linear-gradient(135deg, #330000, #1a0033, #330066, #660033);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(fallbackContainer);
        
        // Добавляем оверлей
        this.addOverlay();
    }

    // Метод для остановки видео (например, при переходе на другую страницу)
    stop() {
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
        }
    }

    // Метод для возобновления видео
    play() {
        if (this.video) {
            this.video.play().catch(console.warn);
        }
    }
}

// Инициализация видеофона при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.videoBackground = new VideoBackground();
});

// Обработка видимости страницы для оптимизации производительности
document.addEventListener('visibilitychange', () => {
    if (window.videoBackground) {
        if (document.hidden) {
            window.videoBackground.stop();
        } else {
            window.videoBackground.play();
        }
    }
});
