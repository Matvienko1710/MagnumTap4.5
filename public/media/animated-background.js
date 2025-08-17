// Простой анимированный фон для Magnum Coins Farm
console.log('Animated background script loaded');

class AnimatedBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        console.log('Initializing animated background...');
        this.createCanvas();
        this.createParticles();
        this.animate();
        console.log('Animated background initialized');
    }

    createCanvas() {
        // Создаем canvas элемент
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animatedBackground';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -10;
            pointer-events: none;
            background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.body.appendChild(this.canvas);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(30, Math.floor((window.innerWidth * window.innerHeight) / 30000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 2,
                opacity: Math.random() * 0.6 + 0.2,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#ff4500', '#ff8c00', '#ff6347', 
            '#ff1493', '#ff69b4', '#ff4500'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a0033');
        gradient.addColorStop(0.25, '#330066');
        gradient.addColorStop(0.5, '#660033');
        gradient.addColorStop(0.75, '#330000');
        gradient.addColorStop(1, '#1a0033');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновляем и рисуем частицы
        this.particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.pulse += 0.05;
            
            // Отражение от краев
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy = -particle.vy;
            }
            
            // Пульсация размера
            const pulseSize = Math.sin(particle.pulse) * 0.5 + 1;
            const currentSize = particle.size * pulseSize;
            
            // Рисуем частицу
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Добавляем свечение
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = currentSize * 2;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Сбрасываем прозрачность
        this.ctx.globalAlpha = 1;
        
        // Рисуем дополнительные эффекты
        this.drawLightRays();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawLightRays() {
        // Рисуем световые лучи
        const time = Date.now() * 0.001;
        const rayCount = 3;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2 + time * 0.1;
            const x = this.canvas.width / 2;
            const y = this.canvas.height / 2;
            const length = Math.max(this.canvas.width, this.canvas.height);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(
                x + Math.cos(angle) * length,
                y + Math.sin(angle) * length
            );
            
            const gradient = this.ctx.createLinearGradient(x, y, 
                x + Math.cos(angle) * length, 
                y + Math.sin(angle) * length);
            gradient.addColorStop(0, 'rgba(255, 69, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    // Метод для остановки анимации
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating animated background...');
    window.animatedBackground = new AnimatedBackground();
});

// Альтернативная инициализация если DOM уже загружен
if (document.readyState === 'loading') {
    // DOM еще загружается
} else {
    // DOM уже загружен
    console.log('DOM already loaded, creating animated background immediately...');
    window.animatedBackground = new AnimatedBackground();
}
