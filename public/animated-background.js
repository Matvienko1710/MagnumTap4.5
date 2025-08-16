// Максимально простой анимированный фон
console.log('Animated background script loaded');

// Создаем элемент фона сразу
function createAnimatedBackground() {
    console.log('Creating animated background...');
    
    // Проверяем, не создан ли уже фон
    if (document.getElementById('animatedBackground')) {
        console.log('Background already exists');
        return;
    }
    
    // Создаем элемент
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
    
    // Добавляем в body
    document.body.appendChild(backgroundDiv);
    console.log('Animated background created successfully');
    
    // Пытаемся загрузить GIF поверх градиента
    setTimeout(() => {
        try {
            const img = new Image();
            img.onload = () => {
                console.log('GIF loaded, applying to background');
                backgroundDiv.style.background = `url('https://i.imgur.com/pm7ZuQo.gif') center center/cover no-repeat`;
                backgroundDiv.style.animation = 'none';
            };
            img.onerror = () => {
                console.log('GIF failed to load, keeping gradient');
            };
            img.src = 'https://i.imgur.com/pm7ZuQo.gif';
        } catch (error) {
            console.log('Error loading GIF:', error);
        }
    }, 1000);
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAnimatedBackground);
} else {
    createAnimatedBackground();
}

// Дополнительная инициализация через небольшую задержку
setTimeout(createAnimatedBackground, 100);

console.log('Animated background script initialized');
