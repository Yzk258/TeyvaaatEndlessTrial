param([ValidateSet('run','compile','verify-db','verify-wishes','verify-wish-db','verify-adventure')][string]$Action='run')
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'load-environment.ps1') -EnvPath (Join-Path (Split-Path -Parent $PSScriptRoot) 'backend/.env')
. (Join-Path $PSScriptRoot 'load-environment.ps1') -EnvPath (Join-Path (Split-Path -Parent $PSScriptRoot) '.local/bootstrap-admin.env')
$workspaceRoot=Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cacheRoot=Join-Path $workspaceRoot '.tooling'
$env:COURSIER_CACHE=Join-Path $cacheRoot 'coursier'
$env:COURSIER_CONFIG_DIR=Join-Path $cacheRoot 'coursier-config'
$env:SBT_OPTS="-Dsbt.boot.directory=$cacheRoot/sbt-boot -Dsbt.ivy.home=$cacheRoot/ivy2 -Dsbt.global.base=$cacheRoot/sbt-global -Djava.io.tmpdir=$cacheRoot/tmp"
Set-Location (Join-Path (Split-Path -Parent $PSScriptRoot) 'backend')
$sbtAction=switch($Action){
  'verify-db' {'Test/runMain services.system.utils.DatabaseTransactionCheck'}
  'verify-wishes' {'Test/runMain services.wishes.utils.WishRulesCheck'}
  'verify-wish-db' {'Test/runMain services.system.utils.WishTransactionCheck'}
  'verify-adventure' {';Test/runMain services.runs.utils.AdventureRulesCheck;Test/runMain services.system.utils.AdventureTransactionCheck'}
  default {$Action}
}
sbt -batch $sbtAction
exit $LASTEXITCODE
