using TaskTracker.Domain.Enums;

namespace TaskTracker.Application.Common.Interfaces;

/// <summary>
/// Provides access to the currently authenticated user.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Gets the authenticated user's identifier.
    /// </summary>
    Guid UserId { get; }

    /// <summary>
    /// Gets the authenticated user's email address.
    /// </summary>
    string Email { get; }

    /// <summary>
    /// Gets the authenticated user's role.
    /// </summary>
    UserRole Role { get; }

    /// <summary>
    /// Gets a value indicating whether the current user is an administrator.
    /// </summary>
    bool IsAdmin { get; }
}
