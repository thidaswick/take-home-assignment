namespace TaskTracker.Application.Tasks;

using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Common.Models;
using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Domain.Entities;

/// <summary>
/// Default implementation of <see cref="ITaskService"/>.
/// </summary>
public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskService"/> class.
    /// </summary>
    public TaskService(ITaskRepository taskRepository, IUserRepository userRepository)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<TaskDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        return MapToDto(task);
    }

    /// <inheritdoc />
    public async Task<PagedResult<TaskDto>> GetPagedAsync(
        TaskListQuery query,
        CancellationToken cancellationToken = default)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize is < 1 or > 100 ? 10 : query.PageSize;

        var (items, totalCount) = await _taskRepository.GetPagedAsync(
            page,
            pageSize,
            query.Status,
            query.OwnerId,
            cancellationToken);

        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResult<TaskDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }

    /// <inheritdoc />
    public async Task<TaskDto> CreateAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var owner = await _userRepository.GetByIdAsync(request.OwnerId, cancellationToken)
            ?? throw new NotFoundException($"User with id '{request.OwnerId}' was not found.");

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Status = request.Status,
            DueDate = request.DueDate,
            OwnerId = owner.Id,
            Owner = owner,
            CreatedAt = DateTime.UtcNow
        };

        await _taskRepository.AddAsync(task, cancellationToken);
        await _taskRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(task);
    }

    /// <inheritdoc />
    public async Task<TaskDto> UpdateAsync(
        Guid id,
        UpdateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        task.Title = request.Title.Trim();
        task.Description = request.Description.Trim();
        task.Status = request.Status;
        task.DueDate = request.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(task);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        _taskRepository.Remove(task);
        await _taskRepository.SaveChangesAsync(cancellationToken);
    }

    private static TaskDto MapToDto(TaskItem task) =>
        new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            DueDate = task.DueDate,
            OwnerId = task.OwnerId,
            OwnerEmail = task.Owner?.Email ?? string.Empty,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
}
