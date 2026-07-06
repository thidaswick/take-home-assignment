using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace TaskTracker.Infrastructure.Persistence;

/// <summary>
/// Database initialization helpers.
/// </summary>
public static class DatabaseInitializer
{
    /// <summary>
    /// Seeds development data when the database is available.
    /// </summary>
    /// <remarks>
    /// Migrations must be applied before calling this method.
    /// </remarks>
    public static async Task SeedDevelopmentDataAsync(
        IServiceProvider serviceProvider,
        CancellationToken cancellationToken = default)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        if (!await dbContext.Database.CanConnectAsync(cancellationToken))
        {
            logger.LogWarning("Database is not available. Skipping development data seeding.");
            return;
        }

        if (await dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var seedUsers = new List<Domain.Entities.User>
        {
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                FirstName = "Standard",
                LastName = "User",
                Email = "user@tasktracker.local",
                PasswordHash = "seed-only",
                Role = Domain.Enums.UserRole.User,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@tasktracker.local",
                PasswordHash = "seed-only",
                Role = Domain.Enums.UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            }
        };

        dbContext.Users.AddRange(seedUsers);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded {UserCount} development users.", seedUsers.Count);
    }
}
