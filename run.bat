@echo off
title ប្រព័ន្ធបង្កើតស្លាកសញ្ញាគណៈកម្មការប្រឡង (Exam Committee Badge Generator)
chcp 65001 > nul
cls
echo ======================================================================
echo    ប្រព័ន្ធបង្កើតស្លាកសញ្ញាគណៈកម្មការដំណើរការប្រឡង
echo    Exam Committee Badge Generator System
echo ======================================================================
echo.
echo កំពុងបើកដំណើរការកម្មវិធី... (Starting application...)
echo.
python run_server.py
if errorlevel 1 (
    echo Python មិនទាន់បានដំឡើង ឬមានបញ្ហា។ កំពុងបើក index.html ដោយផ្ទាល់...
    start index.html
)
pause
