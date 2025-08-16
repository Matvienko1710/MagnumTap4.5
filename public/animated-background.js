class AnimatedBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.lavaStreams = [];
        this.animationId = null;
        this.lastTime = 0;
        this.init();
    }

    init() {
        // Создаем canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Инициализируем частицы и потоки лавы
        this.initParticles();
        this.initLavaStreams();
        
        // Запускаем анимацию
        this.animate();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                life: Math.random() * 0.5 + 0.5,
                maxLife: Math.random() * 0.5 + 0.5,
                color: this.getRandomFireColor()
            });
        }
    }

    initLavaStreams() {
        const streamCount = 3;
        
        for (let i = 0; i < streamCount; i++) {
            this.lavaStreams.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                width: Math.random() * 50 + 20,
                speed: Math.random() * 0.5 + 0.3,
                segments: [],
                time: Math.random() * Math.PI * 2
            });
            
            // Инициализируем сегменты потока
            const segmentCount = 20;
            for (let j = 0; j < segmentCount; j++) {
                this.lavaStreams[i].segments.push({
                    x: this.lavaStreams[i].x + (Math.random() - 0.5) * 30,
                    y: j * (this.canvas.height / segmentCount),
                    size: Math.random() * 20 + 10,
                    life: Math.random() * 0.5 + 0.5
                });
            }
        }
    }

    getRandomFireColor() {
        const colors = [
            '#ff4500', // оранжево-красный
            '#ff6347', // томатный
            '#ff7f50', // коралловый
            '#ff8c00', // темно-оранжевый
            '#ffa500', // оранжевый
            '#ffd700', // золотой
            '#ffff00'  // желтый
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Обновляем жизнь
            particle.life -= deltaTime * 0.001;
            
            // Пересоздаем частицу если она умерла или вышла за границы
            if (particle.life <= 0 || 
                particle.x < -10 || particle.x > this.canvas.width + 10 ||
                particle.y < -10 || particle.y > this.canvas.height + 10) {
                
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.vx = (Math.random() - 0.5) * 0.5;
                particle.vy = (Math.random() - 0.5) * 0.5;
                particle.life = particle.maxLife;
                particle.color = this.getRandomFireColor();
            }
        });
    }

    updateLavaStreams(deltaTime) {
        this.lavaStreams.forEach(stream => {
            stream.time += deltaTime * 0.001;
            
            // Обновляем сегменты
            stream.segments.forEach((segment, index) => {
                segment.y += stream.speed * deltaTime;
                segment.x = stream.x + Math.sin(stream.time + index * 0.5) * 20;
                segment.life -= deltaTime * 0.0005;
                
                // Пересоздаем сегмент если он вышел за границы
                if (segment.y > this.canvas.height + 50) {
                    segment.y = -50;
                    segment.life = 1;
                    segment.x = stream.x + (Math.random() - 0.5) * 30;
                }
            });
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            // Создаем градиент для частицы
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawLavaStreams() {
        this.lavaStreams.forEach(stream => {
            // Рисуем сегменты потока
            stream.segments.forEach((segment, index) => {
                if (index === 0) return; // Пропускаем первый сегмент
                
                const prevSegment = stream.segments[index - 1];
                const alpha = segment.life;
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha * 0.7;
                
                // Создаем градиент для сегмента
                const gradient = this.ctx.createLinearGradient(
                    segment.x - segment.size, segment.y,
                    segment.x + segment.size, segment.y
                );
                gradient.addColorStop(0, '#ff4500');
                gradient.addColorStop(0.5, '#ff8c00');
                gradient.addColorStop(1, '#ff4500');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.ellipse(
                    segment.x, segment.y,
                    segment.size, segment.size * 0.3,
                    0, 0, Math.PI * 2
                );
                this.ctx.fill();
                
                // Рисуем соединение с предыдущим сегментом
                if (prevSegment) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(prevSegment.x, prevSegment.y);
                    this.ctx.lineTo(segment.x, segment.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = segment.size * 0.6;
                    this.ctx.stroke();
                }
                
                this.ctx.restore();
            });
        });
    }

    drawBackground() {
        // Создаем градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a0033');   // Темно-фиолетовый
        gradient.addColorStop(0.3, '#330066'); // Фиолетовый
        gradient.addColorStop(0.7, '#660033'); // Темно-красный
        gradient.addColorStop(1, '#330000');   // Очень темно-красный
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон
        this.drawBackground();
        
        // Обновляем и рисуем частицы
        this.updateParticles(deltaTime);
        this.drawParticles();
        
        // Обновляем и рисуем потоки лавы
        this.updateLavaStreams(deltaTime);
        this.drawLavaStreams();
        
        // Добавляем свечение
        this.addGlow();
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    addGlow() {
        // Добавляем общее свечение
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 0.1;
        
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, '#ff4500');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.restore();
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

// Инициализация фона при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.animatedBackground = new AnimatedBackground();
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', function() {
    if (window.animatedBackground) {
        window.animatedBackground.destroy();
    }
});
