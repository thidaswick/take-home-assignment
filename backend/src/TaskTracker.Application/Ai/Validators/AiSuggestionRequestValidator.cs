using FluentValidation;
using TaskTracker.Application.Ai.Dtos;

namespace TaskTracker.Application.Ai.Validators;

/// <summary>
/// Validator for <see cref="AiSuggestionRequest"/>.
/// </summary>
public class AiSuggestionRequestValidator : AbstractValidator<AiSuggestionRequest>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AiSuggestionRequestValidator"/> class.
    /// </summary>
    public AiSuggestionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);
    }
}
