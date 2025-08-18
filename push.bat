@echo off
echo 🚀 Автоматический пуш на GitHub
echo.

echo 📝 Добавляем все изменения...
git add .

echo.
echo 💾 Создаем коммит...
git commit -m "Обновление: %date% %time%"

echo.
echo 📤 Пушим на GitHub...
git push origin main

echo.
echo ✅ Готово! Изменения запушены на GitHub
echo.
pause
