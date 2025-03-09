$base64Content = Get-Content -Path "gradient-fade.png.base64.txt" -Raw
$bytes = [Convert]::FromBase64String($base64Content)
[IO.File]::WriteAllBytes("gradient-fade.png", $bytes)
Write-Host "gradient-fade.png has been created successfully!" 