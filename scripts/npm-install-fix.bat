@echo off
echo Fechando processos Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Removendo node_modules...
if exist node_modules (
  rmdir /s /q node_modules
  if exist node_modules (
    echo AVISO: node_modules nao foi removido. Feche o Cursor e tente de novo.
    pause
    exit /b 1
  )
)

if exist package-lock.json del package-lock.json

echo Instalando dependencias...
call npm install
if %ERRORLEVEL% neq 0 (
  echo.
  echo Se ainda der EBUSY: feche o Cursor, abra PowerShell nesta pasta e rode:
  echo   Remove-Item -Recurse -Force node_modules; npm install
  pause
  exit /b 1
)

echo Pronto.
pause
