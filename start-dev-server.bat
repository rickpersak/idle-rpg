@echo off
echo ========================================
echo    Idle RPG - Starting Dev Server
echo ========================================
echo.

echo [1/2] Starting npm development server...
echo This will start the server and open your browser automatically
echo.
echo Press Ctrl+C to stop the server when you're done
echo.

REM Start the dev server and open browser
start "" "http://localhost:5173"
npm run dev

echo.
echo Development server stopped.
pause
