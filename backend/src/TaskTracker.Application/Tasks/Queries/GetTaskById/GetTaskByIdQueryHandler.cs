using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Queries.GetTaskById;

/// <summary>
/// Handles <see cref="GetTaskByIdQuery"/>.
/// </summary>
public interface IGetTaskByIdQueryHandler : IQueryHandler<GetTaskByIdQuery, TaskDto>
{
}

/// <summary>
/// Retrieves a task by identifier when the user has access.
/// </summary>
public class GetTaskByIdQueryHandler : IGetTaskByIdQueryHandler
{
    private readonly ITaskRepository _taskRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTaskByIdQueryHandler"/> class.
    /// </summary>
    public GetTaskByIdQueryHandler(ITaskRepository taskRepository, ICurrentUserService currentUserService)
    {
        _taskRepository = taskRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task<TaskDto> HandleAsync(GetTaskByIdQuery query, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(query.Id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{query.Id}' was not found.");

        TaskAuthorization.EnsureCanAccess(task, _currentUserService);

        return TaskMapper.ToDto(task);
    }
}
