namespace TaskTracker.Application.Common.Exceptions;

/// <summary>
/// Represents an authorization failure.
/// </summary>
public class ForbiddenException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ForbiddenException"/> class.
    /// </summary>
    /// <param name="message">The error message.</param>
    public ForbiddenException(string message = "You do not have permission to perform this action.")
        : base(message)
    {
    }
}
