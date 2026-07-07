using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Application.Tasks.Commands.CreateTask;

/// <summary>
/// Handles <see cref="CreateTaskCommand"/>.
/// </summary>
public interface ICreateTaskCommandHandler : ICommandHandler<CreateTaskCommand, TaskDto>
{
}

/// <summary>
/// Creates a new task for the authenticated user or an assigned owner.
/// </summary>
public class CreateTaskCommandHandler : ICreateTaskCommandHandler
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateTaskCommandHandler"/> class.
    /// </summary>
    public CreateTaskCommandHandler(
        ITaskRepository taskRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task<TaskDto> HandleAsync(CreateTaskCommand command, CancellationToken cancellationToken = default)
    {
        var request = command.Request;
        var ownerId = TaskAuthorization.ResolveCreateOwnerId(request.OwnerId, _currentUserService);

        var owner = await _userRepository.GetByIdAsync(ownerId, cancellationToken)
            ?? throw new NotFoundException($"User with id '{ownerId}' was not found.");

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

        return TaskMapper.ToDto(task);
    }
}
