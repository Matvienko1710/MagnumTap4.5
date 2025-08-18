# Автоматический пуш на GitHub
# Запуск: .\auto-push.ps1

Write-Host "🚀 Автоматический мониторинг и пуш на GitHub" -ForegroundColor Green
Write-Host "Нажмите Ctrl+C для остановки" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    try {
        # Проверяем статус Git
        $status = git status --porcelain
        
        if ($status) {
            Write-Host "📝 Обнаружены изменения:" -ForegroundColor Cyan
            Write-Host $status -ForegroundColor White
            
            # Добавляем все изменения
            git add .
            
            # Создаем коммит с временной меткой
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $commitMessage = "Авто-обновление: $timestamp"
            git commit -m $commitMessage
            
            # Пушим на GitHub
            git push origin main
            
            Write-Host "✅ Изменения успешно запушены!" -ForegroundColor Green
            Write-Host "Время: $timestamp" -ForegroundColor Gray
        } else {
            Write-Host "⏳ Изменений нет... Проверяем через 30 секунд" -ForegroundColor Gray
        }
        
        # Ждем 30 секунд перед следующей проверкой
        Start-Sleep -Seconds 30
        
    } catch {
        Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Повторная попытка через 60 секунд..." -ForegroundColor Yellow
        Start-Sleep -Seconds 60
    }
}
