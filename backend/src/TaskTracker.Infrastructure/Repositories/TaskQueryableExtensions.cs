using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Domain.Entities;
using TaskItem = TaskTracker.Domain.Entities.TaskItem;

namespace TaskTracker.Infrastructure.Repositories;

/// <summary>
/// <see cref="IQueryable"/> extensions for task filtering.
/// </summary>
internal static class TaskQueryableExtensions
{
    /// <summary>
    /// Applies optional status and owner filters to the query.
    /// </summary>
    public static IQueryable<TaskItem> ApplyFilters(
        this IQueryable<TaskItem> query,
        TaskListFilter filter)
    {
        if (filter.Status.HasValue)
        {
            query = query.Where(task => task.Status == filter.Status.Value);
        }

        if (filter.OwnerId.HasValue)
        {
            query = query.Where(task => task.OwnerId == filter.OwnerId.Value);
        }

        return query;
    }
}
