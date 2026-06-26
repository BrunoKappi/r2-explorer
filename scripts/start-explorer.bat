@echo off
title R2 Explorer Runner
cd /d "%~dp0.."
echo Starting R2 Explorer services on custom ports...

:: Start Backend in a new window (Port 3080)
start "R2 Explorer Backend" cmd /c "npm run dev:backend"

:: Start Frontend in a new window (Port 5180)
start "R2 Explorer Frontend" cmd /c "npm run dev:frontend"

echo Waiting for servers to initialize...
timeout /t 4 /nobreak > nul

:: Open the browser
start http://localhost:5180

echo Services started!
