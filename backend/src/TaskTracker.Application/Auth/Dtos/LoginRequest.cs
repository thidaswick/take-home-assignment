namespace TaskTracker.Application.Auth.Dtos;

/// <summary>
/// Request payload for user login.
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// Gets or sets the user's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the plaintext password.
    /// </summary>
    public string Password { get; set; } = string.Empty;
}
