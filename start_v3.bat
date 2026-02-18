@echo off
title Sukarak Mazboot V3 - System Launcher
color 0A

echo ============================================
echo    Sukarak Mazboot V3 - Starting System
echo ============================================
echo.

:: Kill any old processes
echo [1/3] Stopping old processes...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Start Backend on 0.0.0.0:3000
echo [2/3] Starting Backend (port 3000)...
start "Sukarak Backend" cmd /k "cd /d e:\dr.moahmed\sukarak_mazbot_v3_backend && venv_new\Scripts\activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload"

:: Wait for backend to start
timeout /t 4 /nobreak >nul

:: Start Frontend Dev Server
echo [3/3] Starting Frontend Dev Server...
start "Sukarak Frontend" cmd /k "cd /d e:\dr.moahmed\sukarak_mazbot_v3_frontend && npm run dev"

echo.
echo ============================================
echo    System Started Successfully!
echo ============================================
echo.
echo    Backend:  http://localhost:3000
echo    API:      http://localhost:3000/api/health
echo    Frontend: http://localhost:5173
echo    Emulator: http://10.0.2.2:3000
echo.
echo ============================================
echo    Press any key to close this window...
pause >nul
