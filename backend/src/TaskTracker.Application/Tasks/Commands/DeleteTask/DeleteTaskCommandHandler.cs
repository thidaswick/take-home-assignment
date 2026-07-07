using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Exceptions;
using TaskTracker.Application.Common.Interfaces;

namespace TaskTracker.Application.Tasks.Commands.DeleteTask;

/// <summary>
/// Handles <see cref="DeleteTaskCommand"/>.
/// </summary>
public interface IDeleteTaskCommandHandler : ICommandHandler<DeleteTaskCommand>
{
}

/// <summary>
/// Deletes a task when the user has access.
/// </summary>
public class DeleteTaskCommandHandler : IDeleteTaskCommandHandler
{
    private readonly ITaskRepository _taskRepository;
    private readonly ICurrentUserService _currentUserService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteTaskCommandHandler"/> class.
    /// </summary>
    public DeleteTaskCommandHandler(ITaskRepository taskRepository, ICurrentUserService currentUserService)
    {
        _taskRepository = taskRepository;
        _currentUserService = currentUserService;
    }

    /// <inheritdoc />
    public async Task HandleAsync(DeleteTaskCommand command, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(command.Id, cancellationToken)
            ?? throw new NotFoundException($"Task with id '{command.Id}' was not found.");

        TaskAuthorization.EnsureCanAccess(task, _currentUserService);

        _taskRepository.Remove(task);
        await _taskRepository.SaveChangesAsync(cancellationToken);
    }
}
