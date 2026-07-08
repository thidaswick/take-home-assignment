using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TaskTracker.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds persistence services including SQL Server and <see cref="ApplicationDbContext"/>.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">Application configuration.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = DatabaseConnection.Resolve(configuration);

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (DatabaseConnection.IsPostgreSql(connectionString))
            {
                options.UseNpgsql(connectionString);
                return;
            }

            options.UseSqlServer(
                connectionString,
                sql => sql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
        });

        return services;
    }
}
