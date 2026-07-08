using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Enums;

namespace TaskTracker.Infrastructure.Persistence;

/// <summary>
/// Seeds baseline data required for local development and demos.
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Default administrator email created when no admin exists.
    /// </summary>
    public const string DefaultAdminEmail = "admin@taskflow.ai";

    /// <summary>
    /// Default administrator password for the seeded account.
    /// </summary>
    public const string DefaultAdminPassword = "Admin123!";

    /// <summary>
    /// Applies pending migrations and seeds the default administrator if needed.
    /// </summary>
    /// <param name="services">The application service provider.</param>
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseSeeder");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.MigrateAsync();

        var hasAdmin = await dbContext.Users.AnyAsync(user => user.Role == UserRole.Admin);
        if (hasAdmin)
        {
            return;
        }

        var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var admin = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Admin",
            LastName = "User",
            Email = DefaultAdminEmail,
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        admin.PasswordHash = passwordHasher.HashPassword(admin, DefaultAdminPassword);

        await userRepository.AddAsync(admin);
        await userRepository.SaveChangesAsync();

        logger.LogInformation(
            "Seeded default admin user {Email}. Change the password after first login.",
            DefaultAdminEmail);
    }
}
