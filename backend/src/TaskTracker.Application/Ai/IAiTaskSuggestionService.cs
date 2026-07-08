using TaskTracker.Application.Ai.Dtos;

namespace TaskTracker.Application.Ai;

/// <summary>
/// Generates AI-assisted task planning suggestions.
/// </summary>
public interface IAiTaskSuggestionService
{
    /// <summary>
    /// Generates structured suggestions for a task idea.
    /// </summary>
    /// <param name="request">The task title and optional context.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Structured planning suggestions.</returns>
    Task<AiSuggestionResponse> GenerateSuggestionsAsync(
        AiSuggestionRequest request,
        CancellationToken cancellationToken = default);
}
