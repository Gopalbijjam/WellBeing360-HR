@echo off
set "PATH=C:\Users\Test\AppData\Local\Microsoft\dotnet;%PATH%"
echo Starting WellBeing360 .NET 10 Backend API...
dotnet run --project WellBeing360.API/WellBeing360.API.csproj --launch-profile "http"
