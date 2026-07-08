using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Users.Queries.GetUsers;

namespace TaskTracker.Application.Users;

/// <summary>
/// User feature service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds user query handlers to the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddUserFeature(this IServiceCollection services)
    {
        services.AddScoped<IGetUsersQueryHandler, GetUsersQueryHandler>();
        return services;
    }
}
