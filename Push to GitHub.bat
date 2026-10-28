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
    echo   1. សូមចូលទៅ https://github.com/new
    echo   2. ដាក់ឈ្មោះ Repository Name: Examination-Committee
    echo   3. ជ្រើសរើស Public រួចចុច "Create repository"
    echo   4. រួចហើយចុចដំណើរការ Push to GitHub.bat នេះម្តងទៀត។
    echo ========================================================
)
echo.
pause
