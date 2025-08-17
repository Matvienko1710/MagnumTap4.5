// Простой тест видеофона
console.log('Simple video test loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating video test...');
    
    // Создаем простой видео элемент
    const video = document.createElement('video');
    video.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -10;
        opacity: 0.8;
    `;
    
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Добавляем обработчики событий
    video.addEventListener('loadstart', () => {
        console.log('Video loadstart event');
    });
    
    video.addEventListener('loadedmetadata', () => {
        console.log('Video loadedmetadata event');
    });
    
    video.addEventListener('loadeddata', () => {
        console.log('Video loadeddata event');
    });
    
    video.addEventListener('canplay', () => {
        console.log('Video canplay event');
    });
    
    video.addEventListener('canplaythrough', () => {
        console.log('Video canplaythrough event');
    });
    
    video.addEventListener('play', () => {
        console.log('Video play event');
    });
    
    video.addEventListener('playing', () => {
        console.log('Video playing event');
    });
    
    video.addEventListener('error', (e) => {
        console.error('Video error event:', e);
        console.error('Video error details:', video.error);
        
        // Показываем fallback фон
        document.body.style.background = 'linear-gradient(135deg, #1a0033, #330066, #660033, #330000)';
    });
    
    // Пробуем разные пути к видео
    const videoPaths = [
        'magnumback.mp4',
        '/media/magnumback.mp4',
        './magnumback.mp4',
        '../magnumback.mp4'
    ];
    
    let currentPathIndex = 0;
    
    function tryNextPath() {
        if (currentPathIndex < videoPaths.length) {
            const path = videoPaths[currentPathIndex];
            console.log(`Trying video path: ${path}`);
            video.src = path;
            currentPathIndex++;
        } else {
            console.error('All video paths failed');
            document.body.style.background = 'linear-gradient(135deg, #ff0000, #ff6600, #ff0066, #6600ff)';
        }
    }
    
    video.addEventListener('error', tryNextPath);
    
    // Начинаем с первого пути
    tryNextPath();
    
    // Добавляем видео на страницу
    document.body.appendChild(video);
    
    // Добавляем оверлей
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -5;
        background: rgba(0, 0, 0, 0.3);
        pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    console.log('Video test setup complete');
});
