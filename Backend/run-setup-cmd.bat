@echo off
echo Setting up Backend...

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed!
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Python dependencies installation failed!
    exit /b 1
)

echo Setting up database...
call node setup-database.js
if %errorlevel% neq 0 (
    echo Database setup failed!
    exit /b 1
)

echo Training ML model...
call python train_random_forest.py
if %errorlevel% neq 0 (
    echo ML model training failed!
    exit /b 1
)

echo Backend setup completed successfully!
pause
