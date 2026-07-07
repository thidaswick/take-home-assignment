$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot/..

dotnet ef database update `
  --project src/TaskTracker.Infrastructure `
  --startup-project src/TaskTracker.API
