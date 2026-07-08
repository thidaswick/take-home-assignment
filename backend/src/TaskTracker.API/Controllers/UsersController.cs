using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.API.Authorization;
using TaskTracker.Application.Auth.Dtos;
using TaskTracker.Application.Users.Queries.GetUsers;

namespace TaskTracker.API.Controllers;

/// <summary>
/// Endpoints for managing users (administrators only).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Policy = AuthorizationPolicies.AdminOnly)]
public class UsersController : ControllerBase
{
    private readonly IGetUsersQueryHandler _getUsersQueryHandler;

    /// <summary>
    /// Initializes a new instance of the <see cref="UsersController"/> class.
    /// </summary>
    public UsersController(IGetUsersQueryHandler getUsersQueryHandler)
    {
        _getUsersQueryHandler = getUsersQueryHandler;
    }

    /// <summary>
    /// Gets all registered users.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A list of users.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await _getUsersQueryHandler.HandleAsync(new GetUsersQuery(), cancellationToken);
        return Ok(users);
    }
}
