using ColorDash.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace ColorDash.Api.Data.Repositories;

public interface ISessionRepository
{
    Task<GameSession?> GetByIdAsync(Guid id);
    Task AddAsync(GameSession session);
    Task SaveChangesAsync();
}
public class SessionRepository(AppDbContext db) : ISessionRepository
{
    public Task<GameSession?> GetByIdAsync(Guid id) =>
        db.GameSessions.FirstOrDefaultAsync(s => s.Id == id);

    public async Task AddAsync(GameSession session) =>
        await db.GameSessions.AddAsync(session);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}