@echo off
if "%~1"=="" goto :blank
node migrate.js -l "%~1" -o "%~n1".json

pause
exit /b 0

:blank
echo Please drag and drop a file onto this script.
pause
exit /b 1