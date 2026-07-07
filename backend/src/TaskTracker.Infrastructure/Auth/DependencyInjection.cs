using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Application.Common.Settings;
using TaskTracker.Infrastructure.Auth;

namespace TaskTracker.Infrastructure;

/// <summary>
/// Authentication infrastructure service registration.
/// </summary>
public static class AuthDependencyInjection
{
    /// <summary>
    /// Adds authentication infrastructure services.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">Application configuration.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddAuthInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.AddSingleton<IPasswordHasher, IdentityPasswordHasher>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}
