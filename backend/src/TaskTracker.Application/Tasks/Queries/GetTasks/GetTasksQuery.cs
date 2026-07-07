using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Queries.GetTasks;

/// <summary>
/// Query to get a paginated list of tasks.
/// </summary>
/// <param name="Query">Pagination and filter options.</param>
public record GetTasksQuery(TaskListQuery Query);
