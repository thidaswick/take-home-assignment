using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Tasks.Commands.CreateTask;
using TaskTracker.Application.Tasks.Commands.DeleteTask;
using TaskTracker.Application.Tasks.Commands.UpdateTask;
using TaskTracker.Application.Tasks.Queries.GetTaskById;
using TaskTracker.Application.Tasks.Queries.GetTasks;

namespace TaskTracker.Application.Tasks;

/// <summary>
/// Task feature service registration.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds CQRS task handlers to the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddTaskFeature(this IServiceCollection services)
    {
        services.AddScoped<ICreateTaskCommandHandler, CreateTaskCommandHandler>();
        services.AddScoped<IUpdateTaskCommandHandler, UpdateTaskCommandHandler>();
        services.AddScoped<IDeleteTaskCommandHandler, DeleteTaskCommandHandler>();
        services.AddScoped<IGetTaskByIdQueryHandler, GetTaskByIdQueryHandler>();
        services.AddScoped<IGetTasksQueryHandler, GetTasksQueryHandler>();

        return services;
    }
}
