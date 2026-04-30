namespace ColorDash.Api.Domain.Exceptions;

public class SessionNotFoundException(string message = "Session not found.") : Exception(message);

// Default message mirrors SessionNotFoundException to avoid leaking that a session exists for another device.
public class SessionOwnershipException(string message = "Session not found.") : Exception(message);

public class SessionExpiredException(string message = "Session has expired.") : Exception(message);

public class SessionNotActiveException(string message = "Session is no longer active.") : Exception(message);
