using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Infrastructure.Ai;
using TaskTracker.Infrastructure.Persistence;
using TaskTracker.Infrastructure.Repositories;

namespace TaskTracker.Infrastructure;

/// <summary>
/// Infrastructure layer service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds infrastructure layer services to the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">Application configuration.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddPersistence(configuration)
            .AddRepositories()
            .AddAuthInfrastructure(configuration)
            .AddAiInfrastructure(configuration);

        return services;
    }
}
