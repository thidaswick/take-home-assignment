using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Ai;
using TaskTracker.Application.Common.Settings;

namespace TaskTracker.Infrastructure.Ai;

/// <summary>
/// AI infrastructure service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds AI-related infrastructure services.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">Application configuration.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddAiInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<GeminiSettings>(configuration.GetSection(GeminiSettings.SectionName));
        services.AddHttpClient<IAiTaskSuggestionService, GeminiAiTaskSuggestionService>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(60);
        });

        return services;
    }
}
