namespace TaskTracker.Application.Common.Interfaces;

using TaskTracker.Domain.Entities;

/// <summary>
/// Password hashing abstraction.
/// </summary>
public interface IPasswordHasher
{
    /// <summary>
    /// Hashes a plaintext password for the given user.
    /// </summary>
    string HashPassword(User user, string password);

    /// <summary>
    /// Verifies a plaintext password against a stored hash.
    /// </summary>
    bool VerifyPassword(User user, string hashedPassword, string providedPassword);
}

/// <summary>
/// JWT token generation abstraction.
/// </summary>
public interface IJwtTokenGenerator
{
    /// <summary>
    /// Generates an access token for the authenticated user.
    /// </summary>
    AuthTokenResult GenerateToken(User user);
}

/// <summary>
/// Result of JWT token generation.
/// </summary>
/// <param name="AccessToken">The encoded JWT access token.</param>
/// <param name="ExpiresAt">The UTC expiration timestamp.</param>
public record AuthTokenResult(string AccessToken, DateTime ExpiresAt);
