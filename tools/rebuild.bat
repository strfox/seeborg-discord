@echo off
if "%~1"=="" goto :blank
node rebuild.js -i "%~1" -o "%~n1"-fixed.json

pause
exit /b 0

:blank
echo Please drag and drop a file onto this script.
pause
exit /b 1