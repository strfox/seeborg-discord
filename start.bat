@echo off

if NOT EXIST .\node_modules\ GOTO :no_install
if NOT EXIST .\config.yml GOTO :no_install

call node .\src\main.js -c .\config.yml

pause
exit /b 0

:no_install
@echo off
echo Please run install.bat before running this script.
pause
exit /b 1
