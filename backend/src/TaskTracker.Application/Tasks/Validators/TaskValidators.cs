namespace TaskTracker.Application.Tasks.Validators;

using FluentValidation;
using TaskTracker.Application.Tasks.Dtos;

/// <summary>
/// Validator for <see cref="CreateTaskRequest"/>.
/// </summary>
public class CreateTaskRequestValidator : AbstractValidator<CreateTaskRequest>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="CreateTaskRequestValidator"/> class.
    /// </summary>
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Status)
            .IsInEnum();
    }
}

/// <summary>
/// Validator for <see cref="UpdateTaskRequest"/>.
/// </summary>
public class UpdateTaskRequestValidator : AbstractValidator<UpdateTaskRequest>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateTaskRequestValidator"/> class.
    /// </summary>
    public UpdateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Status)
            .IsInEnum();
    }
}

/// <summary>
/// Validator for <see cref="TaskListQuery"/>.
/// </summary>
public class TaskListQueryValidator : AbstractValidator<TaskListQuery>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="TaskListQueryValidator"/> class.
    /// </summary>
    public TaskListQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100);

        RuleFor(x => x.Status)
            .IsInEnum()
            .When(x => x.Status.HasValue);
    }
}
