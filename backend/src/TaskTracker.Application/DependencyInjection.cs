using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Auth;
using TaskTracker.Application.Auth.Validators;
using TaskTracker.Application.Tasks;
using TaskTracker.Application.Users;

namespace TaskTracker.Application;

/// <summary>
/// Application layer service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds application layer services to the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        services.AddTaskFeature();
        services.AddUserFeature();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
