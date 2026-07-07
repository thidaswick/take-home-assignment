namespace TaskTracker.Application.Auth.Dtos;

/// <summary>
/// Authentication response containing a JWT and user profile.
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Gets or sets the JWT access token.
    /// </summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the UTC expiration time of the access token.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Gets or sets the authenticated user profile.
    /// </summary>
    public UserDto User { get; set; } = new();
}
