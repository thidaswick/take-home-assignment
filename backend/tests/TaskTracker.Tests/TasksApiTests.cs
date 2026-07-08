using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using TaskTracker.Application.Auth.Dtos;
using TaskTracker.Application.Common.Models;
using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Domain.Enums;
using TaskTracker.Infrastructure.Persistence;
using DomainTaskStatus = TaskTracker.Domain.Enums.TaskStatus;

namespace TaskTracker.Tests;

/// <summary>
/// Integration tests for task endpoints and RBAC rules.
/// </summary>
public class TasksApiTests : IClassFixture<TaskTrackerWebApplicationFactory>
{
    private readonly TaskTrackerWebApplicationFactory _factory;
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    public TasksApiTests(TaskTrackerWebApplicationFactory factory)
    {
        _factory = factory;
        _factory.ResetDatabase();
    }

    [Fact]
    public async Task User_CanCreateAndViewOwnTask()
    {
        var client = _factory.CreateClient();
        var token = await RegisterAndLoginAsync(client, "owner@example.com");

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createResponse = await client.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = "Write tests",
            Description = "Cover auth and tasks",
            Status = DomainTaskStatus.Pending,
            DueDate = DateTime.UtcNow.AddDays(3)
        });

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<TaskDto>(_jsonOptions);
        Assert.NotNull(created);

        var listResponse = await client.GetAsync("/api/tasks?pageNumber=1&pageSize=10");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var list = await listResponse.Content.ReadFromJsonAsync<PagedResult<TaskDto>>(_jsonOptions);
        Assert.NotNull(list);
        Assert.Single(list.Items);
        Assert.Equal("Write tests", list.Items[0].Title);
    }

    [Fact]
    public async Task User_CannotViewAnotherUsersTask()
    {
        var ownerClient = _factory.CreateClient();
        var ownerToken = await RegisterAndLoginAsync(ownerClient, "task-owner@example.com");
        ownerClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ownerToken);

        var createResponse = await ownerClient.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = "Private task",
            Description = "Only for owner",
            Status = DomainTaskStatus.Pending
        });
        var created = await createResponse.Content.ReadFromJsonAsync<TaskDto>(_jsonOptions);
        Assert.NotNull(created);

        var otherClient = _factory.CreateClient();
        var otherToken = await RegisterAndLoginAsync(otherClient, "other-user@example.com");
        otherClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", otherToken);

        var getResponse = await otherClient.GetAsync($"/api/tasks/{created.Id}");
        Assert.Equal(HttpStatusCode.Forbidden, getResponse.StatusCode);
    }

    [Fact]
    public async Task Admin_CanViewAllTasks()
    {
        var ownerClient = _factory.CreateClient();
        var ownerToken = await RegisterAndLoginAsync(ownerClient, "regular@example.com");
        ownerClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ownerToken);
        var createResponse = await ownerClient.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = "User task",
            Description = "Owned by regular user",
            Status = DomainTaskStatus.Pending
        });
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var adminClient = _factory.CreateClient();
        var adminToken = await RegisterAdminAndLoginAsync(adminClient);
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var listResponse = await adminClient.GetAsync("/api/tasks?pageNumber=1&pageSize=10");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var list = await listResponse.Content.ReadFromJsonAsync<PagedResult<TaskDto>>(_jsonOptions);
        Assert.NotNull(list);
        Assert.NotEmpty(list.Items);
    }

    [Fact]
    public async Task CreateTask_WithInvalidPayload_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var token = await RegisterAndLoginAsync(client, "invalid@example.com");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.PostAsJsonAsync("/api/tasks", new CreateTaskRequest
        {
            Title = "",
            Description = string.Empty,
            Status = DomainTaskStatus.Pending
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static async Task<string> RegisterAndLoginAsync(HttpClient client, string email)
    {
        await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = email,
            Password = "Password123!"
        });

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = "Password123!"
        });

        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        return auth!.AccessToken;
    }

    private async Task<string> RegisterAdminAndLoginAsync(HttpClient client)
    {
        const string email = "admin-tests@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            FirstName = "Admin",
            LastName = "User",
            Email = email,
            Password = "Password123!"
        });

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var user = db.Users.Single(u => u.Email == email);
            user.Role = UserRole.Admin;
            await db.SaveChangesAsync();
        }

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = email,
            Password = "Password123!"
        });

        var auth = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        return auth!.AccessToken;
    }
}
