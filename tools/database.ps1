param(
  [ValidateSet('init','status','backup')][string]$Action='status',
  [string]$PostgresBin='D:/postgresql/bin'
)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot 'load-environment.ps1') -EnvPath (Join-Path $projectRoot 'backend/.env')
$jdbcUrl=if($env:DB_URL){$env:DB_URL}else{'jdbc:postgresql://127.0.0.1:5433/teyvat'}
if($jdbcUrl -notmatch '^jdbc:postgresql://'){throw '此命令需要标准 jdbc:postgresql://host:port/database 地址。'}
$databaseUri=[Uri]($jdbcUrl.Substring(5))
$databaseName=$databaseUri.AbsolutePath.Trim('/')
if($databaseName -notmatch '^[a-z][a-z0-9_]*$'){throw '数据库名仅支持小写英文字母、数字和下划线。'}
$databasePort=if($databaseUri.Port -gt 0){$databaseUri.Port}else{5432}
$databaseUser=if($env:DB_USER){$env:DB_USER}else{'db'}
$priorPassword=[Environment]::GetEnvironmentVariable('PGPASSWORD','Process')
if($env:DB_PASSWORD){$env:PGPASSWORD=$env:DB_PASSWORD}
function Resolve-PostgresTool([string]$ToolName) {
  $toolPath=Join-Path $PostgresBin ($ToolName+'.exe')
  if(Test-Path -LiteralPath $toolPath){return $toolPath}
  $found=Get-Command $ToolName -ErrorAction SilentlyContinue
  if($found){return $found.Source}
  throw "未找到 PostgreSQL 工具 $ToolName。请安装命令行工具或使用 -PostgresBin 指定路径。"
}
try {
  $psql=Resolve-PostgresTool 'psql'
  $connectionArguments=@('-X','-w','-h',$databaseUri.Host,'-p',"$databasePort",'-U',$databaseUser,'-v','ON_ERROR_STOP=1')
  switch($Action) {
    'init' {
      $exists=& $psql @connectionArguments -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$databaseName'"
      if($LASTEXITCODE -ne 0){throw '无法连接 PostgreSQL，请先启动数据库服务并检查连接配置。'}
      if("$exists".Trim() -ne '1'){
        $createdb=Resolve-PostgresTool 'createdb'
        & $createdb -w -h $databaseUri.Host -p $databasePort -U $databaseUser $databaseName
        if($LASTEXITCODE -ne 0){throw '创建数据库失败。'}
        Write-Host "已创建数据库 $databaseName。启动后端后会初始化业务表。"
      }else{Write-Host "数据库 $databaseName 已存在，已保留现有数据。"}
    }
    'status' {
      & $psql @connectionArguments -d $databaseName -c "SELECT current_database() AS database_name,pg_size_pretty(pg_database_size(current_database())) AS database_size; SELECT relname AS table_name,n_live_tup AS approximate_rows FROM pg_stat_user_tables WHERE schemaname='public' ORDER BY relname;"
      if($LASTEXITCODE -ne 0){throw '数据库检查失败。'}
    }
    'backup' {
      $backupRoot=Join-Path $projectRoot '.local/backups'
      New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
      $backupPath=Join-Path $backupRoot ($databaseName+'-'+(Get-Date -Format 'yyyyMMdd-HHmmss-fff')+'.dump')
      $pgdump=Resolve-PostgresTool 'pg_dump'
      & $pgdump -w -h $databaseUri.Host -p $databasePort -U $databaseUser -d $databaseName --format=custom --no-owner --file=$backupPath
      if($LASTEXITCODE -ne 0){throw '备份失败，请勿将本次输出作为有效备份。'}
      Write-Host "备份完成：$backupPath"
    }
  }
} finally {
  [Environment]::SetEnvironmentVariable('PGPASSWORD',$priorPassword,'Process')
}
