# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TaskTracker.sln ./
COPY src/TaskTracker.Domain/TaskTracker.Domain.csproj src/TaskTracker.Domain/
COPY src/TaskTracker.Application/TaskTracker.Application.csproj src/TaskTracker.Application/
COPY src/TaskTracker.Infrastructure/TaskTracker.Infrastructure.csproj src/TaskTracker.Infrastructure/
COPY src/TaskTracker.API/TaskTracker.API.csproj src/TaskTracker.API/
COPY tests/TaskTracker.Tests/TaskTracker.Tests.csproj tests/TaskTracker.Tests/

RUN dotnet restore src/TaskTracker.API/TaskTracker.API.csproj

COPY . .
RUN dotnet publish src/TaskTracker.API/TaskTracker.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "TaskTracker.API.dll"]
