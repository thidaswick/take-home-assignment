namespace TaskTracker.Domain.Enums;

/// <summary>
/// Application user roles for role-based access control.
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Standard user who can manage their own tasks.
    /// </summary>
    User = 0,

    /// <summary>
    /// Administrator who can manage all tasks.
    /// </summary>
    Admin = 1
}
