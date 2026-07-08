using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TaskTracker.API.Authorization;

namespace TaskTracker.API.Hubs;

/// <summary>
/// SignalR hub for broadcasting task changes to connected clients.
/// </summary>
[Authorize(Policy = AuthorizationPolicies.AuthenticatedUser)]
public class TaskHub : Hub
{
    /// <summary>
    /// Subscribes the connection to task update notifications.
    /// </summary>
    public Task Subscribe() => Groups.AddToGroupAsync(Context.ConnectionId, "tasks");
}
