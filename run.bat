@echo off
setlocal enabledelayedexpansion

title Rights ^& Remedy Navigator
cd /d "%~dp0"

echo ===================================================
echo        Rights ^& Remedy Navigator
echo ===================================================
echo.

:: 1. Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check and initialize .env file
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creating .env file from .env.example...
        copy /y ".env.example" ".env" >nul
        echo [INFO] .env file created. You can add your GEMINI_API_KEY inside it.
    )
)

:: 3. Check node_modules
if not exist "node_modules\" (
    echo [INFO] First-time setup: Installing required dependencies...
    echo This may take a minute or two...
    echo.
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Dependencies installed successfully.
    echo.
)

:: 4. Optional: Start Python FastAPI Statutory RAG Service if environment is present
if exist "backend\.venv\Scripts\python.exe" (
    echo [INFO] Python environment detected. Launching Statutory RAG Backend on port 8000...
    start "FastAPI Backend" /b cmd /c "backend\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --app-dir backend >nul 2>&1"
)

:: 5. Start the application server
echo [INFO] Starting Rights ^& Remedy Navigator server...
echo.
echo - Web App URL: http://localhost:3000
echo - Press Ctrl + C to stop the server at any time.
echo.

:: Open browser after 2 seconds in background
start "" /b cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:3000"

:: Run the app server
call npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTICE] Server stopped with error code %ERRORLEVEL%.
    pause
)
