namespace TaskTracker.Application.Tasks.Dtos;

using TaskTracker.Domain.Enums;

/// <summary>
/// Request payload for creating a task.
/// </summary>
public class CreateTaskRequest
{
    /// <summary>
    /// Gets or sets the task title.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the task description.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the task status.
    /// </summary>
    public Domain.Enums.TaskStatus Status { get; set; } = Domain.Enums.TaskStatus.Pending;

    /// <summary>
    /// Gets or sets the optional due date.
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Gets or sets the owner identifier.
    /// </summary>
    public Guid OwnerId { get; set; }
}
