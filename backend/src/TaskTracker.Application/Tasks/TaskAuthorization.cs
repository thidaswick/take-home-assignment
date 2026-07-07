using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Application.Tasks;

/// <summary>
/// Applies task ownership and role-based access rules.
/// </summary>
internal static class TaskAuthorization
{
    /// <summary>
    /// Ensures the current user can access the task.
    /// </summary>
    public static void EnsureCanAccess(TaskItem task, ICurrentUserService currentUser)
    {
        if (currentUser.IsAdmin || task.OwnerId == currentUser.UserId)
        {
            return;
        }

        throw new ForbiddenException("You do not have permission to access this task.");
    }

    /// <summary>
    /// Resolves the owner filter for listing tasks.
    /// </summary>
    public static Guid? ResolveOwnerFilter(Guid? requestedOwnerId, ICurrentUserService currentUser)
    {
        if (currentUser.IsAdmin)
        {
            return requestedOwnerId;
        }

        if (requestedOwnerId.HasValue && requestedOwnerId.Value != currentUser.UserId)
        {
            throw new ForbiddenException("You can only view your own tasks.");
        }

        return currentUser.UserId;
    }

    /// <summary>
    /// Resolves the owner identifier for task creation.
    /// </summary>
    public static Guid ResolveCreateOwnerId(Guid requestedOwnerId, ICurrentUserService currentUser)
    {
        if (currentUser.IsAdmin)
        {
            return requestedOwnerId == Guid.Empty
                ? currentUser.UserId
                : requestedOwnerId;
        }

        if (requestedOwnerId != Guid.Empty && requestedOwnerId != currentUser.UserId)
        {
            throw new ForbiddenException("You can only create tasks for your own account.");
        }

        return currentUser.UserId;
    }
}
