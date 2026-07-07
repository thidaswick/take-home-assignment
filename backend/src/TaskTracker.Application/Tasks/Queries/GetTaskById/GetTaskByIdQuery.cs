namespace TaskTracker.Application.Tasks.Queries.GetTaskById;

/// <summary>
/// Query to get a task by identifier.
/// </summary>
/// <param name="Id">The task identifier.</param>
public record GetTaskByIdQuery(Guid Id);
