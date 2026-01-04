:: Create links for avatar, img, and audio folders

cd /d "%~dp0..\src-tauri\target\debug"

mklink /j avatar ..\..\..\avatar
mklink /j img ..\..\..\img
mklink /j audio ..\..\..\audio

pause