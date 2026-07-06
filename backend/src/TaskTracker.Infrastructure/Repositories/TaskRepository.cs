using Microsoft.EntityFrameworkCore;
using TaskTracker.Application.Common.Interfaces;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Enums;
using TaskItem = TaskTracker.Domain.Entities.TaskItem;

namespace TaskTracker.Infrastructure.Repositories;

/// <summary>
/// Entity Framework implementation of <see cref="ITaskRepository"/>.
/// </summary>
public class TaskRepository : ITaskRepository
{
    private readonly Persistence.ApplicationDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskRepository"/> class.
    /// </summary>
    public TaskRepository(Persistence.ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _dbContext.TaskItems
            .Include(task => task.Owner)
            .FirstOrDefaultAsync(task => task.Id == id, cancellationToken);

    /// <inheritdoc />
    public async Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        Domain.Enums.TaskStatus? status,
        Guid? ownerId,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.TaskItems
            .Include(task => task.Owner)
            .AsNoTracking()
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(task => task.Status == status.Value);
        }

        if (ownerId.HasValue)
        {
            query = query.Where(task => task.OwnerId == ownerId.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(task => task.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    /// <inheritdoc />
    public async Task AddAsync(TaskItem task, CancellationToken cancellationToken = default) =>
        await _dbContext.TaskItems.AddAsync(task, cancellationToken);

    /// <inheritdoc />
    public void Update(TaskItem task) => _dbContext.TaskItems.Update(task);

    /// <inheritdoc />
    public void Remove(TaskItem task) => _dbContext.TaskItems.Remove(task);

    /// <inheritdoc />
    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);
}
