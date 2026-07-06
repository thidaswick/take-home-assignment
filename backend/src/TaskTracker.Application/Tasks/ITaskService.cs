namespace TaskTracker.Application.Tasks;

using TaskTracker.Application.Common.Models;
using TaskTracker.Application.Tasks.Dtos;

/// <summary>
/// Application service for task operations.
/// </summary>
public interface ITaskService
{
    /// <summary>
    /// Gets a task by identifier.
    /// </summary>
    Task<TaskDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a paginated list of tasks.
    /// </summary>
    Task<PagedResult<TaskDto>> GetPagedAsync(TaskListQuery query, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new task.
    /// </summary>
    Task<TaskDto> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing task.
    /// </summary>
    Task<TaskDto> UpdateAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a task.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
