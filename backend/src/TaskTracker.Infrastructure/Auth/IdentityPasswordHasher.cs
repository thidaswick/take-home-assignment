using Microsoft.AspNetCore.Identity;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Infrastructure.Auth;

/// <summary>
/// ASP.NET Core Identity password hasher implementation.
/// </summary>
public class IdentityPasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    /// <inheritdoc />
    public string HashPassword(User user, string password) =>
        _passwordHasher.HashPassword(user, password);

    /// <inheritdoc />
    public bool VerifyPassword(User user, string hashedPassword, string providedPassword) =>
        _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword)
            is PasswordVerificationResult.Success
            or PasswordVerificationResult.SuccessRehashNeeded;
}
