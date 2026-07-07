namespace TaskTracker.Application.Common.Exceptions;

/// <summary>
/// Represents a conflict with the current state of a resource.
/// </summary>
public class ConflictException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ConflictException"/> class.
    /// </summary>
    /// <param name="message">The error message.</param>
    public ConflictException(string message)
        : base(message)
    {
    }
}
