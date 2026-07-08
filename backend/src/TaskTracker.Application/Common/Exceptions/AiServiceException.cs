namespace TaskTracker.Application.Common.Exceptions;

/// <summary>
/// Represents a failure while calling an external AI provider.
/// </summary>
public class AiServiceException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AiServiceException"/> class.
    /// </summary>
    /// <param name="message">The error message.</param>
    public AiServiceException(string message)
        : base(message)
    {
    }
}
