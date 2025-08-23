@echo off
echo 🚀 Google Tag Manager Container ID Update Script
echo ================================================
echo.

set /p new_container_id="Enter your GTM container ID (e.g., GTM-ABC12345): "

if "%new_container_id%"=="" (
    echo ❌ No container ID entered.
    pause
    exit /b 1
)

if not "%new_container_id:~0,4%"=="GTM-" (
    echo ❌ Invalid container ID. Must start with 'GTM-'
    pause
    exit /b 1
)

echo.
echo 🔄 Updating all HTML files from 'GTM-XXXXXXX' to '%new_container_id%'...
echo.

set updated_count=0
set total_files=0

for %%f in (*.html) do (
    set /a total_files+=1
    echo 📄 Processing %%f...
    
    powershell -Command "(Get-Content '%%f' -Encoding UTF8) -replace 'GTM-XXXXXXX', '%new_container_id%' | Set-Content '%%f' -Encoding UTF8"
    
    if !errorlevel! equ 0 (
        echo   ✅ Updated %%f
        set /a updated_count+=1
    ) else (
        echo   ❌ Error updating %%f
    )
)

echo.
echo ================================================
echo 🎉 Update complete! Updated %updated_count% out of %total_files% files.
echo.
echo 📋 Next steps:
echo 1. Verify the updates in your HTML files
echo 2. Test your GTM implementation
echo 3. Publish your GTM container
echo.
echo 📚 For detailed setup instructions, see: GTM-SETUP-GUIDE.md
echo.
pause
