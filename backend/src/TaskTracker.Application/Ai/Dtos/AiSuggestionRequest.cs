namespace TaskTracker.Application.Ai.Dtos;

/// <summary>
/// Request payload for AI task suggestions.
/// </summary>
public class AiSuggestionRequest
{
    /// <summary>
    /// Gets or sets the task title.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional additional context.
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
