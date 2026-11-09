package services.identity.utils
import cats.effect.IO
import services.system.objects.DomainError
private[identity] def validateCredentials(username: String, password: String): IO[String] =
  IO.fromEither {
    val normalized=username.trim.toLowerCase(java.util.Locale.ROOT)
    if !normalized.matches("[a-z0-9_]{3,24}") then Left(DomainError("用户名需为3至24位字母、数字或下划线"))
    else if password.length<8 || password.length>128 then Left(DomainError("密码长度需为8至128个字符"))
    else Right(normalized)
  }
