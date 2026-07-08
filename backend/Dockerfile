# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything under /backend (Railway Root Directory = backend)
COPY . .

RUN dotnet restore src/TaskTracker.API/TaskTracker.API.csproj
RUN dotnet publish src/TaskTracker.API/TaskTracker.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TaskTracker.API.dll"]
