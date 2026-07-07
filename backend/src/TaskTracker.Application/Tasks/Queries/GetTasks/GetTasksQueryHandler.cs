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
/// Retrieves a paginated, optionally filtered list of tasks.
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
        var pageNumber = listQuery.PageNumber < 1 ? 1 : listQuery.PageNumber;
        var pageSize = listQuery.PageSize is < 1 or > 100 ? 10 : listQuery.PageSize;
        var ownerFilter = TaskAuthorization.ResolveOwnerFilter(listQuery.Owner, _currentUserService);

        var filter = new TaskListFilter
        {
            Status = listQuery.Status,
            OwnerId = ownerFilter
        };

        var (items, totalCount) = await _taskRepository.GetPagedAsync(
            pageNumber,
            pageSize,
            filter,
            cancellationToken);

        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResult<TaskDto>
        {
            Items = items.Select(TaskMapper.ToDto).ToList(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }
}
