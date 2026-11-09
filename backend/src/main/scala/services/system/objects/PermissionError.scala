package services.system.objects
final case class PermissionError(message: String) extends RuntimeException(message)
