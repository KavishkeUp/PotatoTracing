@echo off
echo Starting database setup...
echo Output will be saved to db-setup-output.txt
node db-setup-complete.js > db-setup-output.txt 2>&1
echo.
echo Setup completed. Check db-setup-output.txt for results.
type db-setup-output.txt
pause

