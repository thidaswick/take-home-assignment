using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Domain.Enums;

namespace TaskTracker.API.Services;

/// <summary>
/// Resolves the current user from the HTTP context JWT claims.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    /// <summary>
    /// Initializes a new instance of the <see cref="CurrentUserService"/> class.
    /// </summary>
    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    /// <inheritdoc />
    public Guid UserId =>
        Guid.TryParse(GetClaimValue(ClaimTypes.NameIdentifier), out var userId)
            ? userId
            : throw new InvalidOperationException("The authenticated user identifier is missing.");

    /// <inheritdoc />
    public string Email => GetClaimValue(ClaimTypes.Email);

    /// <inheritdoc />
    public UserRole Role =>
        Enum.TryParse<UserRole>(GetClaimValue(ClaimTypes.Role), out var role)
            ? role
            : UserRole.User;

    /// <inheritdoc />
    public bool IsAdmin => Role == UserRole.Admin;

    private string GetClaimValue(string claimType) =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(claimType)
        ?? throw new InvalidOperationException("No authenticated user is available for the current request.");
}
