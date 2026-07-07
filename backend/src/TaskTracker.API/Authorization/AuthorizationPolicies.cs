using TaskTracker.Domain.Enums;

namespace TaskTracker.API.Authorization;

/// <summary>
/// Authorization policy names used by the API.
/// </summary>
public static class AuthorizationPolicies
{
    /// <summary>
    /// Requires any authenticated user.
    /// </summary>
    public const string AuthenticatedUser = nameof(AuthenticatedUser);

    /// <summary>
    /// Requires an administrator role.
    /// </summary>
    public const string AdminOnly = nameof(AdminOnly);

    /// <summary>
    /// Role names used in authorization policies.
    /// </summary>
    public static class Roles
    {
        /// <summary>
        /// Standard user role.
        /// </summary>
        public const string User = nameof(UserRole.User);

        /// <summary>
        /// Administrator role.
        /// </summary>
        public const string Admin = nameof(UserRole.Admin);
    }
}
