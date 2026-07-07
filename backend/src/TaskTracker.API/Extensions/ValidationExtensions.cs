using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;

namespace TaskTracker.API.Extensions;

/// <summary>
/// FluentValidation pipeline configuration extensions.
/// </summary>
public static class ValidationExtensions
{
    /// <summary>
    /// Integrates FluentValidation into the ASP.NET Core request pipeline
    /// and configures <see cref="ValidationProblemDetails"/> responses.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The MVC builder for chaining.</returns>
    public static IMvcBuilder AddValidationPipeline(this IServiceCollection services)
    {
        services.AddProblemDetails();

        return services.AddControllers()
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                        Title = "One or more validation errors occurred.",
                        Status = StatusCodes.Status400BadRequest,
                        Instance = context.HttpContext.Request.Path
                    };

                    return new BadRequestObjectResult(problemDetails)
                    {
                        ContentTypes = { "application/problem+json", "application/json" }
                    };
                };
            });
    }

    /// <summary>
    /// Enables automatic FluentValidation before controller actions execute.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddFluentValidationPipeline(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation(config =>
        {
            config.DisableDataAnnotationsValidation = true;
        });

        return services;
    }
}
