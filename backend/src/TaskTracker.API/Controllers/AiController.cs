using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.API.Authorization;
using TaskTracker.Application.Ai;
using TaskTracker.Application.Ai.Dtos;

namespace TaskTracker.API.Controllers;

/// <summary>
/// Endpoints for AI-assisted task planning.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Policy = AuthorizationPolicies.AuthenticatedUser)]
public class AiController : ControllerBase
{
    private readonly IAiTaskSuggestionService _aiTaskSuggestionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="AiController"/> class.
    /// </summary>
    public AiController(IAiTaskSuggestionService aiTaskSuggestionService)
    {
        _aiTaskSuggestionService = aiTaskSuggestionService;
    }

    /// <summary>
    /// Generates structured suggestions for a task idea.
    /// </summary>
    /// <param name="request">The task title and optional context.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>AI-generated planning suggestions.</returns>
    [HttpPost("suggestions")]
    [ProducesResponseType(typeof(AiSuggestionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<AiSuggestionResponse>> GenerateSuggestions(
        [FromBody] AiSuggestionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _aiTaskSuggestionService.GenerateSuggestionsAsync(request, cancellationToken);
        return Ok(response);
    }
}
