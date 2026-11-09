package services.system.objects
final case class AuthenticationError(message: String) extends RuntimeException(message)
