using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Enums;

namespace TaskTracker.Infrastructure.Persistence;

/// <summary>
/// Seeds development data for local testing.
/// </summary>
public static class DatabaseInitializer
{
    /// <summary>
    /// Well-known seed user identifier for local development.
    /// </summary>
    public static readonly Guid SeedUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    /// <summary>
    /// Well-known seed admin identifier for local development.
    /// </summary>
    public static readonly Guid SeedAdminId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    /// <summary>
    /// Applies migrations and seeds development data when needed.
    /// </summary>
    public static async Task InitializeAsync(
        ApplicationDbContext dbContext,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        await dbContext.Database.MigrateAsync(cancellationToken);

        if (await dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var seedUsers = new List<User>
        {
            new()
            {
                Id = SeedUserId,
                FirstName = "Standard",
                LastName = "User",
                Email = "user@tasktracker.local",
                PasswordHash = "seed-only",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = SeedAdminId,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@tasktracker.local",
                PasswordHash = "seed-only",
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            }
        };

        dbContext.Users.AddRange(seedUsers);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded {UserCount} development users.", seedUsers.Count);
    }
}
