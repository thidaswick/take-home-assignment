using TaskTracker.Application.Auth.Dtos;
using TaskTracker.Application.Common.Abstractions;
using TaskTracker.Application.Common.Interfaces;

namespace TaskTracker.Application.Users.Queries.GetUsers;

/// <summary>
/// Handles <see cref="GetUsersQuery"/>.
/// </summary>
public interface IGetUsersQueryHandler : IQueryHandler<GetUsersQuery, IReadOnlyList<UserDto>>
{
}

/// <summary>
/// Retrieves all users for administrative views.
/// </summary>
public class GetUsersQueryHandler : IGetUsersQueryHandler
{
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUsersQueryHandler"/> class.
    /// </summary>
    public GetUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<UserDto>> HandleAsync(
        GetUsersQuery query,
        CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.ListAsync(cancellationToken);

        return users.Select(user => new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        }).ToList();
    }
}
