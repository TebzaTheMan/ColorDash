using ColorDash.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace ColorDash.Api.Data.Repositories;

public interface IHighscoreRepository
{
    Task<Highscore?> GetByDeviceAndModeAsync(Guid deviceId, GameMode mode);
    Task<IEnumerable<Highscore>> GetAllByDeviceAsync(Guid deviceId);
    Task AddAsync(Highscore highscore);
    Task SaveChangesAsync();
}
public class HighscoreRepository(AppDbContext db) : IHighscoreRepository
{
    public Task<Highscore?> GetByDeviceAndModeAsync(Guid deviceId, GameMode mode) =>
        db.Highscores.FirstOrDefaultAsync(h => h.DeviceId == deviceId && h.Mode == mode);

    public async Task<IEnumerable<Highscore>> GetAllByDeviceAsync(Guid deviceId) =>
        await db.Highscores.Where(h => h.DeviceId == deviceId).ToListAsync();

    public async Task AddAsync(Highscore highscore) =>
        await db.Highscores.AddAsync(highscore);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}