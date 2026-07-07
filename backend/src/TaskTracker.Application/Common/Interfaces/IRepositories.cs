namespace TaskTracker.Application.Common.Interfaces;

using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Enums;
using TaskItem = TaskTracker.Domain.Entities.TaskItem;

/// <summary>
/// Persistence abstraction for tasks.
/// </summary>
public interface ITaskRepository
{
    /// <summary>
    /// Gets a task by identifier.
    /// </summary>
    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a paginated list of tasks with optional filters.
    /// </summary>
    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        Domain.Enums.TaskStatus? status,
        Guid? ownerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new task.
    /// </summary>
    Task AddAsync(TaskItem task, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing task.
    /// </summary>
    void Update(TaskItem task);

    /// <summary>
    /// Removes a task.
    /// </summary>
    void Remove(TaskItem task);

    /// <summary>
    /// Persists pending changes.
    /// </summary>
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Persistence abstraction for users.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Gets a user by identifier.
    /// </summary>
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by email address.
    /// </summary>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new user.
    /// </summary>
    Task AddAsync(User user, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists pending changes.
    /// </summary>
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
