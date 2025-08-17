// Упрощенный видеофон для Magnum Coins Farm
console.log('Simple video background script loaded');

class SimpleVideoBackground {
    constructor() {
        this.video = null;
        this.isLoaded = false;
        this.init();
    }

    init() {
        console.log('Initializing simple video background...');
        
        // Создаем видео элемент
        this.video = document.createElement('video');
        this.video.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -10;
            opacity: 0.7;
            pointer-events: none;
        `;
        
        // Настройки видео
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        this.video.preload = 'metadata';
        
        // Добавляем обработчики событий
        this.video.addEventListener('loadstart', () => {
            console.log('Video loadstart');
        });
        
        this.video.addEventListener('loadedmetadata', () => {
            console.log('Video loadedmetadata');
        });
        
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loadeddata - SUCCESS!');
            this.isLoaded = true;
            this.video.style.opacity = '0.7';
        });
        
        this.video.addEventListener('canplay', () => {
            console.log('Video canplay');
            this.forcePlay();
        });
        
        this.video.addEventListener('canplaythrough', () => {
            console.log('Video canplaythrough');
            this.forcePlay();
        });
        
        this.video.addEventListener('play', () => {
            console.log('Video play event - SUCCESS!');
        });
        
        this.video.addEventListener('playing', () => {
            console.log('Video playing event - SUCCESS!');
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            console.error('Video error details:', this.video.error);
            this.showFallback();
        });
        
        // Устанавливаем источник видео
        this.video.src = '/media/magnumback.mp4';
        
        // Добавляем видео на страницу
        document.body.appendChild(this.video);
        
        // Добавляем оверлей
        this.addOverlay();
        
        // Пытаемся запустить видео через небольшую задержку
        setTimeout(() => {
            this.forcePlay();
        }, 1000);
        
        // Добавляем обработчик клика для запуска видео
        document.addEventListener('click', () => {
            this.forcePlay();
        }, { once: true });
        
        console.log('Simple video background initialized');
    }
    
    forcePlay() {
        if (this.video && !this.video.playing) {
            console.log('Forcing video play...');
            this.video.play().then(() => {
                console.log('Video play successful!');
            }).catch(e => {
                console.warn('Video play failed:', e);
            });
        }
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
            z-index: -5;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
    }
    
    showFallback() {
        console.log('Showing fallback background');
        document.body.style.background = `
            linear-gradient(135deg, #1a0033, #330066, #660033, #330000)
        `;
        
        // Добавляем анимацию для fallback
        const style = document.createElement('style');
        style.textContent = `
            body {
                animation: gradientShift 20s ease-in-out infinite;
            }
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
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating video background...');
    window.videoBackground = new SimpleVideoBackground();
});

// Альтернативная инициализация если DOM уже загружен
if (document.readyState === 'loading') {
    // DOM еще загружается
} else {
    // DOM уже загружен
    console.log('DOM already loaded, creating video background immediately...');
    window.videoBackground = new SimpleVideoBackground();
}
