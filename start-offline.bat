@echo off
title Cartoon Short Kit - Offline
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0desktop\serve-offline.ps1"
if errorlevel 1 (
  echo.
  echo Could not start the offline preview.
  echo Make sure Windows PowerShell is available.
  pause
)
