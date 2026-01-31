@echo off
chcp 65001 >nul
cd /d E:\WarehouseScanner
"C:\Program Files\Git\cmd\git.exe" config --global user.name "3996510229-cell"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "cell@example.com"
"C:\Program Files\Git\cmd\git.exe" config --global init.defaultBranch main
"C:\Program Files\Git\cmd\git.exe" config --list --show-origin | findstr /i "user.name user.email"
