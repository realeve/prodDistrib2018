echo off
color 0a 

rem 测试数据目录
set destDir=\\10.8.2.133\e$\wamp\\prodDis\
set srcDir=.\dist\
 
 rem remove files
 del %destDir%\*.js
 del %destDir%\*.css
 del %destDir%\*.html

rem 拷贝HTML相关文件
copy %srcDir%*.js %destDir%
rem css
copy %srcDir%*.css %destDir%
copy %srcDir%*.html %destDir%
copy %srcDir%*.svg %destDir%
copy %srcDir%.htaccess %destDir%

REM 拷贝JSON文件
xcopy %srcDir%data %destDir%data\ /E /Y /F

pause