using TaskTracker.Application.Auth.Dtos;

namespace TaskTracker.Application.Auth;

/// <summary>
/// Authentication use cases.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new user and returns an authentication response.
    /// </summary>
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Authenticates a user and returns an authentication response.
    /// </summary>
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
