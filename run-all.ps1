$projects = @(
  "src/Customer.Api/Customer.Api.csproj",
  "src/Inventory.Api/Inventory.Api.csproj",
  "src/Payment.Api/Payment.Api.csproj",
  "src/Notification.Api/Notification.Api.csproj",
  "src/Order.Api/Order.Api.csproj"
)

foreach ($project in $projects) {
    $projectPath = Join-Path $PSScriptRoot $project
    Write-Host "Starting $projectPath" -ForegroundColor Green
    Start-Process dotnet -ArgumentList "run --project `"$projectPath`"" -NoNewWindow
}

Write-Host "All APIs started. Press Ctrl+C to stop the PowerShell window." -ForegroundColor Yellow
