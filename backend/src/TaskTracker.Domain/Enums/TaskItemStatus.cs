namespace TaskTracker.Domain.Enums;

/// <summary>
/// Workflow status of a task.
/// </summary>
public enum TaskItemStatus
{
    /// <summary>
    /// Task has been created but not started.
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Task is actively being worked on.
    /// </summary>
    InProgress = 1,

    /// <summary>
    /// Task has been finished.
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Task was cancelled and will not be completed.
    /// </summary>
    Cancelled = 3
}
