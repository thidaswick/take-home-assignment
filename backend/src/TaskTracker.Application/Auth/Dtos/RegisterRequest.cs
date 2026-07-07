namespace TaskTracker.Application.Auth.Dtos;

/// <summary>
/// Request payload for user registration.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// Gets or sets the user's first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the plaintext password.
    /// </summary>
    public string Password { get; set; } = string.Empty;
}
