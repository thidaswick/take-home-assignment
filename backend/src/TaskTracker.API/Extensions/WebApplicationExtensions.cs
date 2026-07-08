using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.API.Hubs;
using TaskTracker.Application.Common.Exceptions;

namespace TaskTracker.API.Extensions;

/// <summary>
/// HTTP pipeline configuration extensions.
/// </summary>
public static class WebApplicationExtensions
{
    /// <summary>
    /// Configures the HTTP request pipeline for the API.
    /// </summary>
    /// <param name="app">The web application.</param>
    /// <returns>The web application for chaining.</returns>
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        app.UseExceptionHandler(exceptionHandlerApp =>
        {
            exceptionHandlerApp.Run(async context =>
            {
                var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                if (exception is ValidationException validationException)
                {
                    var errors = validationException.Errors
                        .GroupBy(error => error.PropertyName)
                        .ToDictionary(
                            group => group.Key,
                            group => group.Select(error => error.ErrorMessage).ToArray());

                    var problemDetails = new ValidationProblemDetails(errors)
                    {
                        Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                        Title = "One or more validation errors occurred.",
                        Status = StatusCodes.Status400BadRequest,
                        Instance = context.Request.Path
                    };

                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    context.Response.ContentType = "application/problem+json";
                    await context.Response.WriteAsJsonAsync(problemDetails);
                    return;
                }

                if (exception is NotFoundException notFoundException)
                {
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        title = notFoundException.Message
                    });
                    return;
                }

                if (exception is UnauthorizedException unauthorizedException)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        title = unauthorizedException.Message
                    });
                    return;
                }

                if (exception is ConflictException conflictException)
                {
                    context.Response.StatusCode = StatusCodes.Status409Conflict;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        title = conflictException.Message
                    });
                    return;
                }

                if (exception is ForbiddenException forbiddenException)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        title = forbiddenException.Message
                    });
                    return;
                }

                if (exception is AiServiceException aiServiceException)
                {
                    context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        title = aiServiceException.Message
                    });
                    return;
                }

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new
                {
                    title = "An unexpected error occurred."
                });
            });
        });

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTracker API v1");
                options.RoutePrefix = "swagger";
            });
            app.UseHttpsRedirection();
        }
        else
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTracker API v1");
                options.RoutePrefix = "swagger";
            });
            app.UseHsts();
        }

        app.UseCors("Frontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapHub<TaskHub>("/hubs/tasks");
        app.MapHealthChecks("/health");

        return app;
    }
}
