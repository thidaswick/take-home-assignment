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
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

    /// <summary>
    /// Gets or sets the optional due date.
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Gets or sets the owner identifier.
    /// </summary>
    public Guid OwnerId { get; set; }
}
