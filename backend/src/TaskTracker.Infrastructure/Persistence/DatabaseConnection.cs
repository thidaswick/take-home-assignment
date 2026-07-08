using Microsoft.Extensions.Configuration;

namespace TaskTracker.Infrastructure.Persistence;

/// <summary>
/// Resolves and normalizes database connection strings for SQL Server and PostgreSQL.
/// </summary>
public static class DatabaseConnection
{
    /// <summary>
    /// Reads the connection string from configuration (including Railway <c>DATABASE_URL</c>).
    /// </summary>
    public static string Resolve(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            connectionString = configuration["DATABASE_URL"];
        }

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' or 'DATABASE_URL' is not configured.");
        }

        return Normalize(connectionString);
    }

    /// <summary>
    /// Returns <see langword="true"/> when the connection string targets PostgreSQL.
    /// </summary>
    public static bool IsPostgreSql(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return false;
        }

        var value = connectionString.Trim();

        if (value.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (value.Contains("Host=", StringComparison.OrdinalIgnoreCase) &&
            !value.Contains("Server=", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return false;
    }

    private static string Normalize(string connectionString)
    {
        var value = connectionString.Trim();

        if (!value.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) &&
            !value.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
        {
            return value;
        }

        var uri = new Uri(value);
        var userInfo = uri.UserInfo.Split(':', 2);
        var database = uri.AbsolutePath.TrimStart('/');
        var port = uri.Port > 0 ? uri.Port : 5432;

        return
            $"Host={uri.Host};Port={port};Database={database};Username={Uri.UnescapeDataString(userInfo[0])};" +
            $"Password={Uri.UnescapeDataString(userInfo.Length > 1 ? userInfo[1] : string.Empty)};" +
            "SSL Mode=Require;Trust Server Certificate=true";
    }
}
