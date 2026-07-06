namespace TaskTracker.Application.Tasks.Dtos;

using TaskTracker.Domain.Enums;

/// <summary>
/// Task data returned by the API.
/// </summary>
public class TaskDto
{
    /// <summary>
    /// Gets or sets the task identifier.
    /// </summary>
    public Guid Id { get; set; }

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
    public Domain.Enums.TaskStatus Status { get; set; }

    /// <summary>
    /// Gets or sets the optional due date.
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Gets or sets the owner identifier.
    /// </summary>
    public Guid OwnerId { get; set; }

    /// <summary>
    /// Gets or sets the owner email.
    /// </summary>
    public string OwnerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets when the task was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets when the task was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
