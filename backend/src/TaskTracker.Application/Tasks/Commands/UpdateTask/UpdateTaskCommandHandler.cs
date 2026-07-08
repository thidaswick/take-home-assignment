using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Tasks.Dtos;

namespace TaskTracker.Application.Tasks.Commands.UpdateTask;

/// <summary>
/// Handles <see cref="UpdateTaskCommand"/>.
/// </summary>
public interface IUpdateTaskCommandHandler : ICommandHandler<UpdateTaskCommand, TaskDto>
{
}

/// <summary>
/// Updates an existing task when the user has access.
/// </summary>
public class UpdateTaskCommandHandler : IUpdateTaskCommandHandler
{
    private readonly ITaskRepository _taskRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITaskRealtimeNotifier _taskRealtimeNotifier;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateTaskCommandHandler"/> class.
    /// </summary>
    public UpdateTaskCommandHandler(
        ITaskRepository taskRepository,
        ICurrentUserService currentUserService,
        ITaskRealtimeNotifier taskRealtimeNotifier)
    {
        _taskRepository = taskRepository;
        _currentUserService = currentUserService;
        _taskRealtimeNotifier = taskRealtimeNotifier;
    }

    /// <inheritdoc />
    public async Task<TaskDto> HandleAsync(UpdateTaskCommand command, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(command.Id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{command.Id}' was not found.");

        TaskAuthorization.EnsureCanAccess(task, _currentUserService);

        var request = command.Request;
        task.Title = request.Title.Trim();
        task.Description = request.Description.Trim();
        task.Status = request.Status;
        task.DueDate = request.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync(cancellationToken);

        var dto = TaskMapper.ToDto(task);
        await _taskRealtimeNotifier.NotifyTaskUpdatedAsync(dto, cancellationToken);

        return dto;
    }
}
