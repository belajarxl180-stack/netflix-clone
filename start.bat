@echo off
echo Starting Netflix Clone...
cd /d "%~dp0"
node node_modules\next\dist\compiled\next-server\server\next-start-server.js dev
pause
