// Улучшенный анимированный фон с Canvas API
console.log('Enhanced animated background script loaded');

class EnhancedAnimatedBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.particles = [];
        this.isLoaded = false;
        this.init();
    }

    init() {
        console.log('Initializing enhanced animated background...');
        
        // Проверяем, не создан ли уже фон
        if (document.getElementById('animatedBackground')) {
            console.log('Background already exists');
            return;
        }
        
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.isLoaded = true;
        
        console.log('Enhanced animated background initialized');
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
            z-index: -1;
            pointer-events: none;
            background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Устанавливаем размер canvas
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
        const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#ff4500', '#ff8c00', '#ff6347', 
            '#ff4500', '#ff8c00', '#ff6347'
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
            
            // Отражение от краев
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Рисуем частицу
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Добавляем свечение
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Сбрасываем прозрачность
        this.ctx.globalAlpha = 1;
        
        // Продолжаем анимацию
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Функция создания фона
function createAnimatedBackground() {
    console.log('Creating animated background...');
    
    try {
        // Проверяем поддержку Canvas
        if (typeof HTMLCanvasElement !== 'undefined') {
            window.animatedBackground = new EnhancedAnimatedBackground();
        } else {
            // Fallback для старых браузеров
            createSimpleBackground();
        }
    } catch (error) {
        console.error('Failed to create enhanced background:', error);
        createSimpleBackground();
    }
}

// Простой fallback фон
function createSimpleBackground() {
    console.log('Creating simple fallback background...');
    
    const backgroundDiv = document.createElement('div');
    backgroundDiv.id = 'animatedBackground';
    backgroundDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        background: linear-gradient(135deg, #1a0033, #330066, #660033, #330000);
        animation: gradientShift 10s ease infinite;
    `;
    
    // Добавляем CSS анимацию
    if (!document.getElementById('animatedBackgroundStyle')) {
        const style = document.createElement('style');
        style.id = 'animatedBackgroundStyle';
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
    }
    
    document.body.appendChild(backgroundDiv);
    console.log('Simple fallback background created');
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAnimatedBackground);
} else {
    createAnimatedBackground();
}

// Дополнительная инициализация через небольшую задержку
setTimeout(createAnimatedBackground, 100);

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});

console.log('Enhanced animated background script initialized');
