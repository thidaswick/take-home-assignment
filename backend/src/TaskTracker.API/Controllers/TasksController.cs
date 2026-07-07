using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.API.Authorization;
using TaskTracker.Application.Common.Models;
using TaskTracker.Application.Tasks.Commands.CreateTask;
using TaskTracker.Application.Tasks.Commands.DeleteTask;
using TaskTracker.Application.Tasks.Commands.UpdateTask;
using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Application.Tasks.Queries.GetTaskById;
using TaskTracker.Application.Tasks.Queries.GetTasks;

namespace TaskTracker.API.Controllers;

/// <summary>
/// Endpoints for managing tasks.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Policy = AuthorizationPolicies.AuthenticatedUser)]
public class TasksController : ControllerBase
{
    private readonly IGetTasksQueryHandler _getTasksQueryHandler;
    private readonly IGetTaskByIdQueryHandler _getTaskByIdQueryHandler;
    private readonly ICreateTaskCommandHandler _createTaskCommandHandler;
    private readonly IUpdateTaskCommandHandler _updateTaskCommandHandler;
    private readonly IDeleteTaskCommandHandler _deleteTaskCommandHandler;

    /// <summary>
    /// Initializes a new instance of the <see cref="TasksController"/> class.
    /// </summary>
    public TasksController(
        IGetTasksQueryHandler getTasksQueryHandler,
        IGetTaskByIdQueryHandler getTaskByIdQueryHandler,
        ICreateTaskCommandHandler createTaskCommandHandler,
        IUpdateTaskCommandHandler updateTaskCommandHandler,
        IDeleteTaskCommandHandler deleteTaskCommandHandler)
    {
        _getTasksQueryHandler = getTasksQueryHandler;
        _getTaskByIdQueryHandler = getTaskByIdQueryHandler;
        _createTaskCommandHandler = createTaskCommandHandler;
        _updateTaskCommandHandler = updateTaskCommandHandler;
        _deleteTaskCommandHandler = deleteTaskCommandHandler;
    }

    /// <summary>
    /// Gets a paginated list of tasks.
    /// </summary>
    /// <param name="query">Pagination and filter options.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A paginated list of tasks.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<PagedResult<TaskDto>>> GetTasks(
        [FromQuery] TaskListQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _getTasksQueryHandler.HandleAsync(new GetTasksQuery(query), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a task by identifier.
    /// </summary>
    /// <param name="id">The task identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The requested task.</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskDto>> GetTask(Guid id, CancellationToken cancellationToken)
    {
        var task = await _getTaskByIdQueryHandler.HandleAsync(new GetTaskByIdQuery(id), cancellationToken);
        return Ok(task);
    }

    /// <summary>
    /// Creates a new task.
    /// </summary>
    /// <param name="request">The task creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The created task.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskDto>> CreateTask(
        [FromBody] CreateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var task = await _createTaskCommandHandler.HandleAsync(new CreateTaskCommand(request), cancellationToken);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    /// <summary>
    /// Updates an existing task.
    /// </summary>
    /// <param name="id">The task identifier.</param>
    /// <param name="request">The task update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated task.</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskDto>> UpdateTask(
        Guid id,
        [FromBody] UpdateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var task = await _updateTaskCommandHandler.HandleAsync(new UpdateTaskCommand(id, request), cancellationToken);
        return Ok(task);
    }

    /// <summary>
    /// Deletes a task.
    /// </summary>
    /// <param name="id">The task identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        await _deleteTaskCommandHandler.HandleAsync(new DeleteTaskCommand(id), cancellationToken);
        return NoContent();
    }
}
