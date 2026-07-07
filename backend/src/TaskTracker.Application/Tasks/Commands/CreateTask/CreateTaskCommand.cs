using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Commands.CreateTask;

/// <summary>
/// Command to create a new task.
/// </summary>
/// <param name="Request">The task creation payload.</param>
public record CreateTaskCommand(CreateTaskRequest Request);
