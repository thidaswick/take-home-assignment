using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Infrastructure.Repositories;

namespace TaskTracker.Infrastructure.Repositories;

/// <summary>
/// Repository service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds repository implementations to the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
