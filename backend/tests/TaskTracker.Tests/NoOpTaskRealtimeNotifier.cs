using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Tests;

/// <summary>
/// No-op realtime notifier used during integration tests.
/// </summary>
public class NoOpTaskRealtimeNotifier : ITaskRealtimeNotifier
{
    public Task NotifyTaskCreatedAsync(TaskDto task, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;

    public Task NotifyTaskUpdatedAsync(TaskDto task, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;

    public Task NotifyTaskDeletedAsync(Guid taskId, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;
}
