using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Common.Interfaces;

/// <summary>
/// Pushes task change events to connected clients.
/// </summary>
public interface ITaskRealtimeNotifier
{
    /// <summary>
    /// Notifies clients that a task was created.
    /// </summary>
    Task NotifyTaskCreatedAsync(TaskDto task, CancellationToken cancellationToken = default);

    /// <summary>
    /// Notifies clients that a task was updated.
    /// </summary>
    Task NotifyTaskUpdatedAsync(TaskDto task, CancellationToken cancellationToken = default);

    /// <summary>
    /// Notifies clients that a task was deleted.
    /// </summary>
    Task NotifyTaskDeletedAsync(Guid taskId, CancellationToken cancellationToken = default);
}
