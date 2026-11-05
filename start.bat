@echo off
title Vers Speed Server
echo Starting Vers Speed...
start http://localhost:3333
python -m http.server 3333
pause
