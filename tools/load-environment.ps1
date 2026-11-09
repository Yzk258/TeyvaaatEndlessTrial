param([Parameter(Mandatory=$true)][string]$EnvPath)
# Read simple KEY=value data only; never evaluate configuration as shell code.
if (Test-Path -LiteralPath $EnvPath) {
  Get-Content -LiteralPath $EnvPath -Encoding UTF8 | ForEach-Object {
    $settingLine=$_.Trim()
    if ($settingLine -and -not $settingLine.StartsWith('#')) {
      if ($settingLine -notmatch '^(DB_URL|DB_USER|DB_PASSWORD|DB_POOL_SIZE|DB_CONNECTION_TIMEOUT_MS|ADMIN_USERNAME|ADMIN_PASSWORD)=(.*)$') {
        throw '数据库配置格式无效，仅支持 DB_URL、DB_USER、DB_PASSWORD、DB_POOL_SIZE、DB_CONNECTION_TIMEOUT_MS、ADMIN_USERNAME、ADMIN_PASSWORD。'
      }
      $settingName=$Matches[1]
      $settingValue=$Matches[2].Trim()
      if ($settingValue.Length -ge 2 -and (($settingValue.StartsWith('"') -and $settingValue.EndsWith('"')) -or ($settingValue.StartsWith("'") -and $settingValue.EndsWith("'")))) {
        $settingValue=$settingValue.Substring(1,$settingValue.Length-2)
      }
      if ($null -eq [Environment]::GetEnvironmentVariable($settingName,'Process')) {
        [Environment]::SetEnvironmentVariable($settingName,$settingValue,'Process')
      }
    }
  }
}
