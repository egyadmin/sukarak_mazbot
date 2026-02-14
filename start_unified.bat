@echo off
set HOST_IP=192.168.0.206
set PORT=3000

echo Starting Sukarak Mazboot V3 on http://%HOST_IP%:%PORT%
echo --------------------------------------------------

cd sukarak_mazbot_v3_backend
venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port %PORT%

pause
