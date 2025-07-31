@echo off
echo ========================================
echo    Excel Veri Yoneticisi - Simple Builder
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

:: Clean previous builds
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

:: Install/update dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo ✓ Dependencies installed
echo.

:: Test the app first
echo Testing the app...
echo.
echo Choose an option:
echo 1. Test app only (recommended first)
echo 2. Build portable version
echo 3. Build installer
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto test
if "%choice%"=="2" goto build_portable
if "%choice%"=="3" goto build_installer

:test
echo.
echo Starting app in test mode...
echo Close the app window to continue with build options.
echo.
call npm start
echo.
echo App test completed. You can now try building.
pause
goto menu

:build_portable
echo.
echo Building portable version...
call npx electron-builder --win portable --x64
if errorlevel 1 (
    echo ERROR: Portable build failed!
    echo.
    echo Common solutions:
    echo 1. Make sure main.js has no syntax errors
    echo 2. Try running 'npm start' first to test the app
    echo 3. Check if all dependencies are installed
    pause
    exit /b 1
)
echo.
echo ✓ Portable build completed successfully!
echo Check the 'dist' folder for your executable.
pause
exit

:build_installer
echo.
echo Building installer...
call npx electron-builder --win nsis --x64
if errorlevel 1 (
    echo ERROR: Installer build failed!
    echo.
    echo Common solutions:
    echo 1. Try building portable version first
    echo 2. Make sure main.js has no syntax errors
    echo 3. Check if all dependencies are installed
    pause
    exit /b 1
)
echo.
echo ✓ Installer build completed successfully!
echo Check the 'dist' folder for your installer.
pause
exit

:menu
echo.
echo Choose an option:
echo 1. Test app
echo 2. Build portable version  
echo 3. Build installer
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto test
if "%choice%"=="2" goto build_portable
if "%choice%"=="3" goto build_installer
if "%choice%"=="4" exit

echo Invalid choice!
goto menu