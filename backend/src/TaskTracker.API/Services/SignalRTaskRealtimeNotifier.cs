using Microsoft.AspNetCore.SignalR;
using TaskTracker.API.Hubs;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.API.Services;

/// <summary>
/// Broadcasts task events through SignalR.
/// </summary>
public class SignalRTaskRealtimeNotifier : ITaskRealtimeNotifier
{
    private readonly IHubContext<TaskHub> _hubContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="SignalRTaskRealtimeNotifier"/> class.
    /// </summary>
    public SignalRTaskRealtimeNotifier(IHubContext<TaskHub> hubContext)
    {
        _hubContext = hubContext;
    }

    /// <inheritdoc />
    public Task NotifyTaskCreatedAsync(TaskDto task, CancellationToken cancellationToken = default) =>
        _hubContext.Clients.Group("tasks").SendAsync("TaskCreated", task, cancellationToken);

    /// <inheritdoc />
    public Task NotifyTaskUpdatedAsync(TaskDto task, CancellationToken cancellationToken = default) =>
        _hubContext.Clients.Group("tasks").SendAsync("TaskUpdated", task, cancellationToken);

    /// <inheritdoc />
    public Task NotifyTaskDeletedAsync(Guid taskId, CancellationToken cancellationToken = default) =>
        _hubContext.Clients.Group("tasks").SendAsync("TaskDeleted", taskId, cancellationToken);
}
