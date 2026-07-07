namespace TaskTracker.Application.Tasks.Dtos;

/// <summary>
/// Filter criteria applied when listing tasks.
/// </summary>
public class TaskListFilter
{
    /// <summary>
    /// Gets or sets an optional status filter.
    /// </summary>
    public Domain.Enums.TaskStatus? Status { get; init; }

    /// <summary>
    /// Gets or sets an optional owner identifier filter.
    /// </summary>
    public Guid? OwnerId { get; init; }

    /// <summary>
    /// Gets a value indicating whether any filter is applied.
    /// </summary>
    public bool HasFilters => Status.HasValue || OwnerId.HasValue;
}
