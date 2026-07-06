using TaskTracker.API.Extensions;
using TaskTracker.Application;
using TaskTracker.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddApiServices();

var app = builder.Build();

app.UseApiPipeline();

app.Run();

/// <summary>
/// Entry point for integration test hosting.
/// </summary>
public partial class Program;
