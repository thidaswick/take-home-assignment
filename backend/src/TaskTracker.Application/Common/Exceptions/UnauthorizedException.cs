namespace TaskTracker.Application.Common.Exceptions;

/// <summary>
/// Represents an authentication failure.
/// </summary>
public class UnauthorizedException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UnauthorizedException"/> class.
    /// </summary>
    /// <param name="message">The error message.</param>
    public UnauthorizedException(string message = "Invalid email or password.")
        : base(message)
    {
    }
}
