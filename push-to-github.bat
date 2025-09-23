@echo off
echo ========================================
echo    Idle RPG - Auto Push to GitHub
echo ========================================
echo.

echo [1/4] Adding all changes to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files to git
    pause
    exit /b 1
)

echo [2/4] Committing changes...
git commit -m "Auto-update: %date% %time%"
if %errorlevel% neq 0 (
    echo WARNING: No changes to commit (this is normal if no files were modified)
)

echo [3/4] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo Please check your internet connection and GitHub authentication
    pause
    exit /b 1
)

echo [4/4] Success! Changes pushed to GitHub
echo.
echo Repository: https://github.com/rickpersak/idle-rpg
echo.
echo Press any key to close...
pause >nul
