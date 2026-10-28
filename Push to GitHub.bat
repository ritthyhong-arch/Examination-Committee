@echo off
title Push Examination Committee Badge System to GitHub
chcp 65001 > nul
cd /d "D:\Examination Committee"
cls
echo ========================================================
echo   Pushing to GitHub: Examination-Committee
echo   Repository: https://github.com/ritthyhong-arch/Examination-Committee.git
echo ========================================================
echo.
git add .
git commit -m "Update Examination Committee Badge System"
git branch -M main
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   [SUCCESS / ជោគជ័យ]
    echo   បាន Push ឡើងទៅ GitHub រួចរាល់ហើយ!
    echo   តំណភ្ជាប់ Online នឹងដំណើរការក្នុងរយៈពេល ១-២ នាទី ៖
    echo   https://ritthyhong-arch.github.io/Examination-Committee/
    echo ========================================================
) else (
    echo ========================================================
    echo   [ចំណាំ / NOTICE]
    echo   ប្រសិនបើមិនទាន់បានបង្កើត Repository នៅលើ GitHub ៖
    echo   1. កម្មវិធីនឹងបើកទំព័របង្កើត Repository លើ Browser ដោយស្វ័យប្រវត្តិ
    echo   2. សូមចុចប៊ូតុងពណ៌បៃតង "Create repository"
    echo   3. រួចហើយចុច Enter ដើម្បីសាកល្បង Push ម្តងទៀត...
    echo ========================================================
    start https://github.com/new?name=Examination-Committee^&description=Examination+Committee+Badge+Generator^&public=true
    echo.
    pause
    echo កំពុងសាកល្បង Push ម្តងទៀត...
    git push -u origin main
)
echo.
pause
