namespace TaskTracker.Application.Ai.Dtos;

/// <summary>
/// AI-generated task planning suggestions.
/// </summary>
public class AiSuggestionResponse
{
    /// <summary>
    /// Gets or sets an improved task description.
    /// </summary>
    public string ImprovedDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the suggested priority.
    /// </summary>
    public string SuggestedPriority { get; set; } = "medium";

    /// <summary>
    /// Gets or sets the estimated effort in hours.
    /// </summary>
    public int EstimatedHours { get; set; }

    /// <summary>
    /// Gets or sets suggested subtasks.
    /// </summary>
    public IReadOnlyList<string> Subtasks { get; set; } = [];

    /// <summary>
    /// Gets or sets suggested acceptance criteria.
    /// </summary>
    public IReadOnlyList<string> AcceptanceCriteria { get; set; } = [];

    /// <summary>
    /// Gets or sets practical notes for completing the task.
    /// </summary>
    public string DeveloperNotes { get; set; } = string.Empty;
}
