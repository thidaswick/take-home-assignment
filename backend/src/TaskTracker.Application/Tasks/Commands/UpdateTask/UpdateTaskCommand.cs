using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Commands.UpdateTask;

/// <summary>
/// Command to update an existing task.
/// </summary>
/// <param name="Id">The task identifier.</param>
/// <param name="Request">The task update payload.</param>
public record UpdateTaskCommand(Guid Id, UpdateTaskRequest Request);
