namespace TaskTracker.Application.Tasks.Commands.DeleteTask;

/// <summary>
/// Command to delete a task.
/// </summary>
/// <param name="Id">The task identifier.</param>
public record DeleteTaskCommand(Guid Id);
