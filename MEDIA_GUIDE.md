# Руководство по добавлению медиафайлов

## 📁 Структура папки media

```
public/media/
├── README.md                    # Инструкции по использованию
├── background-gradient.css      # CSS градиенты для фонов
├── coin-button.svg             # SVG кнопка монеты
├── media-manager.js            # JavaScript менеджер медиафайлов
└── [ваши файлы]                # Добавляйте сюда свои файлы
```

## 🖼️ Поддерживаемые форматы

### Изображения
- **PNG** - для изображений с прозрачностью
- **JPG/JPEG** - для фотографий
- **GIF** - для анимаций
- **SVG** - для векторной графики (рекомендуется)
- **WebP** - современный формат (хорошая поддержка)

### Видео
- **MP4** - основной формат
- **WebM** - современный формат
- **OGG** - альтернативный формат

### Аудио
- **MP3** - основной формат
- **WAV** - несжатый звук
- **OGG** - альтернативный формат

## 📝 Как добавить файлы

### 1. Загрузите файлы в папку `public/media/`

### 2. Используйте в коде

#### В CSS:
```css
.element {
    background-image: url('/media/your-image.jpg');
}
```

#### В JavaScript:
```javascript
// Загрузка изображения
window.mediaManager.loadImage('/media/your-image.jpg')
    .then(img => {
        console.log('Изображение загружено');
    });

// Применение фона
window.mediaManager.applyBackground(element, '/media/background.jpg');
```

#### В HTML:
```html
<img src="/media/your-image.jpg" alt="Описание">
<video src="/media/your-video.mp4" controls></video>
```

## 🎨 Рекомендации по размерам

### Изображения
- **Фоновые изображения**: 1920x1080 или больше
- **Кнопки и иконки**: 64x64 до 256x256
- **Логотипы**: 200x200 до 400x400

### Видео
- **Фоновые видео**: 720p или 1080p
- **Короткие анимации**: 480p достаточно
- **Длительность**: до 30 секунд для фоновых

## ⚡ Оптимизация

### Изображения
1. **Сжимайте PNG/JPG** - используйте TinyPNG или аналоги
2. **Используйте SVG** для иконок и простой графики
3. **WebP** для современных браузеров

### Видео
1. **Сжимайте MP4** - используйте HandBrake или FFmpeg
2. **WebM** как альтернатива MP4
3. **Короткие циклы** для фоновых видео

## 🔧 Примеры использования

### Замена фона кнопки монеты:
```css
.click-area {
    background: url('/media/your-coin-button.png') center center/cover no-repeat;
}
```

### Добавление фонового видео:
```html
<video autoplay muted loop class="background-video">
    <source src="/media/background.mp4" type="video/mp4">
</video>
```

### Загрузка через JavaScript:
```javascript
// Предзагрузка изображений
window.mediaManager.loadImage('/media/coin-button.png');
window.mediaManager.loadImage('/media/background.jpg');

// Применение при клике
document.getElementById('button').addEventListener('click', function() {
    window.mediaManager.applyBackground(this, '/media/clicked-state.png');
});
```

## 🚀 Преимущества локальных файлов

1. **Быстрая загрузка** - файлы на том же сервере
2. **Надежность** - не зависим от внешних сервисов
3. **Контроль** - полный контроль над файлами
4. **Кэширование** - браузер кэширует статические файлы
5. **Безопасность** - нет внешних зависимостей

## 📱 Мобильная оптимизация

- Используйте **WebP** для изображений
- **Сжимайте видео** для мобильных устройств
- **Тестируйте** на реальных устройствах
- **Проверяйте** размеры файлов (не более 5MB)

## 🔍 Отладка

### Проверка загрузки файлов:
```javascript
// В консоли браузера
console.log(window.mediaManager.getFileInfo('/media/your-file.jpg'));
```

### Очистка кэша:
```javascript
window.mediaManager.clearCache();
```

### Проверка поддержки формата:
```javascript
window.mediaManager.isSupportedFormat('file.webp', 'images');
```
