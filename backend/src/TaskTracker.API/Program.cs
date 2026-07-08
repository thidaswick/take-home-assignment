using TaskTracker.API.Extensions;
using TaskTracker.Application;
using TaskTracker.Infrastructure;
using TaskTracker.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddApiServices(builder.Configuration);

var app = builder.Build();

if (!app.Environment.IsEnvironment("Testing"))
{
    await DatabaseSeeder.InitializeAsync(app.Services);
}

app.UseApiPipeline();

app.Run();

/// <summary>
/// Entry point for integration test hosting.
/// </summary>
public partial class Program;
