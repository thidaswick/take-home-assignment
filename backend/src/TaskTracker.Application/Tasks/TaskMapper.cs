using TaskTracker.Application.Tasks.Dtos;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Application.Tasks;

/// <summary>
/// Maps task entities to DTOs.
/// </summary>
internal static class TaskMapper
{
    /// <summary>
    /// Maps a task entity to a DTO.
    /// </summary>
    public static TaskDto ToDto(TaskItem task) =>
        new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            DueDate = task.DueDate,
            OwnerId = task.OwnerId,
            OwnerEmail = task.Owner?.Email ?? string.Empty,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
}
