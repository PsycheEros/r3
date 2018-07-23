@echo off
setlocal
pushd "%~dp0"

set "NETWORK=r3-redis-network"
set "SERVER_CONTAINER=r3-redis"
set "SERVER_IMAGE=redis"
set "CLIENT_CONTAINER=r3-redis-cli"
set "CLIENT_IMAGE=goodsmileduck/redis-cli"
set "REDIS_PORT=6379"

call :cleanup

docker network create "%NETWORK%"
if ERRORLEVEL 1 goto :abend
docker run -d --network "%NETWORK%" --name "%SERVER_CONTAINER%" --rm -p %REDIS_PORT%:%REDIS_PORT% --expose %REDIS_PORT% %SERVER_IMAGE%
if ERRORLEVEL 1 goto :abend
docker run -it --network "%NETWORK%" --name "%CLIENT_CONTAINER%" --rm %CLIENT_IMAGE% redis-cli -h "%SERVER_CONTAINER%" -p %REDIS_PORT%
if ERRORLEVEL 1 goto :abend

call :cleanup

popd
endlocal
exit /B 0

:abend
call :cleanup
exit /B 1

:cleanup
docker stop "%CLIENT_CONTAINER%" 2> nul
docker stop "%SERVER_CONTAINER%" 2> nul
docker network rm "%NETWORK%" 2> nul
exit /B 0
