using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Common.Models;
using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Queries.GetTasks;

/// <summary>
/// Handles <see cref="GetTasksQuery"/>.
/// </summary>
public interface IGetTasksQueryHandler : IQueryHandler<GetTasksQuery, PagedResult<TaskDto>>
{
}

/// <summary>
/// Retrieves a paginated list of tasks scoped to the current user or all tasks for admins.
/// </summary>
public class GetTasksQueryHandler : IGetTasksQueryHandler
{
    private readonly ITaskRepository _taskRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTasksQueryHandler"/> class.
    /// </summary>
    public GetTasksQueryHandler(ITaskRepository taskRepository, ICurrentUserService currentUserService)
    {
        _taskRepository = taskRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task<PagedResult<TaskDto>> HandleAsync(
        GetTasksQuery query,
        CancellationToken cancellationToken = default)
    {
        var listQuery = query.Query;
        var page = listQuery.Page < 1 ? 1 : listQuery.Page;
        var pageSize = listQuery.PageSize is < 1 or > 100 ? 10 : listQuery.PageSize;
        var ownerFilter = TaskAuthorization.ResolveOwnerFilter(listQuery.OwnerId, _currentUserService);

        var (items, totalCount) = await _taskRepository.GetPagedAsync(
            page,
            pageSize,
            listQuery.Status,
            ownerFilter,
            cancellationToken);

        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResult<TaskDto>
        {
            Items = items.Select(TaskMapper.ToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }
}
