package services.identity.utils
import cats.effect.{IO,Resource}
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import java.security.{SecureRandom,MessageDigest}
import java.util.Base64
private[identity] def passwordKey(password: String, salt: Array[Byte], iterations: Int): IO[Array[Byte]] =
  Resource.make(IO.blocking(new PBEKeySpec(password.toCharArray,salt,iterations,256)))(spec=>IO.blocking(spec.clearPassword())).use(spec=>
    IO.blocking(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded)
  )
private[identity] def hashPassword(password: String): IO[String] =
  for
    salt <- IO.blocking(new SecureRandom().generateSeed(16))
    key <- passwordKey(password,salt,600000)
  yield "600000:"+Base64.getEncoder.encodeToString(salt)+":"+Base64.getEncoder.encodeToString(key)
private[identity] def verifyPassword(password: String, encoded: Option[String]): IO[Boolean] =
  for
    parts <- IO(encoded.getOrElse("600000:AAAAAAAAAAAAAAAAAAAAAA==:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=").split(":").toList)
    derived <- passwordKey(password,Base64.getDecoder.decode(parts(1)),parts.head.toInt)
    matches <- IO.blocking(MessageDigest.isEqual(derived,Base64.getDecoder.decode(parts(2))))
  yield encoded.nonEmpty && matches
private[identity] def sessionDigest(token: String): IO[String] =
  IO.blocking(Base64.getEncoder.encodeToString(MessageDigest.getInstance("SHA-256").digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8))))
private[identity] def sessionToken: IO[String] =
  IO.blocking(Base64.getUrlEncoder.withoutPadding().encodeToString(new SecureRandom().generateSeed(32)))
