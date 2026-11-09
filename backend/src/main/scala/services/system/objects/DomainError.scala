package services.system.objects
final case class DomainError(message: String) extends RuntimeException(message)
