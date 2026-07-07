param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot/..

dotnet ef migrations add $Name `
  --project src/TaskTracker.Infrastructure `
  --startup-project src/TaskTracker.API `
  --output-dir Migrations
