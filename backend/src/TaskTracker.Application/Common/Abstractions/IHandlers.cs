namespace TaskTracker.Application.Common.Abstractions;

/// <summary>
/// Handles a command that returns a result.
/// </summary>
/// <typeparam name="TCommand">The command type.</typeparam>
/// <typeparam name="TResult">The result type.</typeparam>
public interface ICommandHandler<in TCommand, TResult>
{
    /// <summary>
    /// Handles the command.
    /// </summary>
    Task<TResult> HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}

/// <summary>
/// Handles a command that does not return a result.
/// </summary>
/// <typeparam name="TCommand">The command type.</typeparam>
public interface ICommandHandler<in TCommand>
{
    /// <summary>
    /// Handles the command.
    /// </summary>
    Task HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}

/// <summary>
/// Handles a query.
/// </summary>
/// <typeparam name="TQuery">The query type.</typeparam>
/// <typeparam name="TResult">The result type.</typeparam>
public interface IQueryHandler<in TQuery, TResult>
{
    /// <summary>
    /// Handles the query.
    /// </summary>
    Task<TResult> HandleAsync(TQuery query, CancellationToken cancellationToken = default);
}
