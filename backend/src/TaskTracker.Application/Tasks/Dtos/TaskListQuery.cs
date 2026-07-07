namespace TaskTracker.Application.Tasks.Dtos;

using TaskTracker.Domain.Enums;

/// <summary>
/// Query parameters for listing tasks.
/// </summary>
public class TaskListQuery
{
    /// <summary>
    /// Gets or sets the page number.
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Gets or sets the page size.
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Gets or sets an optional status filter.
    /// </summary>
    public Domain.Enums.TaskStatus? Status { get; set; }

    /// <summary>
    /// Gets or sets an optional owner filter.
    /// </summary>
    public Guid? OwnerId { get; set; }
}
