// Менеджер медиафайлов для Magnum Coins Farm
console.log('Media manager loaded');

class MediaManager {
    constructor() {
        this.mediaCache = new Map();
        this.supportedFormats = {
            images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
            videos: ['.mp4', '.webm', '.ogg'],
            audio: ['.mp3', '.wav', '.ogg']
        };
    }

    // Загрузка изображения
    loadImage(path) {
        return new Promise((resolve, reject) => {
            if (this.mediaCache.has(path)) {
                resolve(this.mediaCache.get(path));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.mediaCache.set(path, img);
                console.log(`Image loaded: ${path}`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${path}`);
                reject(new Error(`Failed to load image: ${path}`));
            };
            img.src = path;
        });
    }

    // Загрузка видео
    loadVideo(path) {
        return new Promise((resolve, reject) => {
            if (this.mediaCache.has(path)) {
                resolve(this.mediaCache.get(path));
                return;
            }

            const video = document.createElement('video');
            video.onloadeddata = () => {
                this.mediaCache.set(path, video);
                console.log(`Video loaded: ${path}`);
                resolve(video);
            };
            video.onerror = () => {
                console.error(`Failed to load video: ${path}`);
                reject(new Error(`Failed to load video: ${path}`));
            };
            video.src = path;
            video.preload = 'metadata';
        });
    }

    // Проверка поддержки формата
    isSupportedFormat(filename, type) {
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return this.supportedFormats[type]?.includes(extension) || false;
    }

    // Получение случайного фонового изображения
    getRandomBackground() {
        const backgrounds = [
            '/media/background-gradient.css',
            '/media/coin-button.svg'
        ];
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }

    // Применение фонового изображения к элементу
    applyBackground(element, path) {
        if (this.isSupportedFormat(path, 'images')) {
            element.style.backgroundImage = `url('${path}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
            element.style.backgroundRepeat = 'no-repeat';
        } else if (path.endsWith('.css')) {
            // Для CSS градиентов
            element.className += ' game-background';
        }
    }

    // Очистка кэша
    clearCache() {
        this.mediaCache.clear();
        console.log('Media cache cleared');
    }

    // Получение информации о файле
    getFileInfo(path) {
        return {
            path: path,
            type: this.getFileType(path),
            supported: this.isSupportedFormat(path, this.getFileType(path)),
            cached: this.mediaCache.has(path)
        };
    }

    // Определение типа файла
    getFileType(filename) {
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        
        if (this.supportedFormats.images.includes(extension)) return 'images';
        if (this.supportedFormats.videos.includes(extension)) return 'videos';
        if (this.supportedFormats.audio.includes(extension)) return 'audio';
        
        return 'unknown';
    }
}

// Создаем глобальный экземпляр
window.mediaManager = new MediaManager();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaManager;
}

console.log('Media manager initialized');
