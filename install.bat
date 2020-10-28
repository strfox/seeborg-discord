@echo off

echo Installing dependencies for SeeBorg
call npm install || goto :npm_error

echo Copying example configuration file
copy config.example.yml config.yml || goto :error   

echo Done! Now just edit config.yml and put your token there. Once that's done, you can run start.bat.

pause
exit /b 0

:npm_error
@echo off
if NOT ["%errorlevel%"]==["0"] (
    echo An error occurred while trying to call npm. Please make sure that you have the latest version of Node.js installed.
    pause
    exit /b %errorlevel%
)

:error
@echo off
if NOT ["%errorlevel%"]==["0"] (
    echo An error occurred during installation. Please read logs above for info.
    pause
    exit /b %errorlevel%
)