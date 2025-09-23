@echo off
echo ========================================
echo    Idle RPG - Stopping Dev Servers
echo ========================================
echo.

echo [1/4] Stopping Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js processes stopped
) else (
    echo - No Node.js processes found
)

echo [2/4] Stopping npm processes...
taskkill /f /im npm.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ npm processes stopped
) else (
    echo - No npm processes found
)

echo [3/4] Stopping Vite dev server processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a 2>nul
    if !errorlevel! equ 0 (
        echo ✓ Vite dev server stopped (PID: %%a)
    )
)

echo [4/5] Stopping any remaining development processes...
taskkill /f /im "vite.exe" 2>nul
taskkill /f /im "react-scripts.exe" 2>nul

echo [5/5] Closing browser windows with localhost...
REM Close Chrome tabs with localhost
taskkill /f /im chrome.exe /fi "WINDOWTITLE eq *localhost*" 2>nul
REM Close Edge tabs with localhost  
taskkill /f /im msedge.exe /fi "WINDOWTITLE eq *localhost*" 2>nul
REM Close Firefox tabs with localhost
taskkill /f /im firefox.exe /fi "WINDOWTITLE eq *localhost*" 2>nul

echo ✓ Browser windows with localhost closed

echo.
echo ========================================
echo    All development servers stopped!
echo    Browser windows closed!
echo ========================================
echo.
echo Press any key to close...
pause >nul
