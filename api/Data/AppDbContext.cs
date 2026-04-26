using ColorDash.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace ColorDash.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<GameSession> GameSessions => Set<GameSession>();
    public DbSet<Highscore> Highscores => Set<Highscore>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        bool isPostgres = Database.IsNpgsql();

        modelBuilder.Entity<GameSession>(e =>
        {
            e.ToTable("game_sessions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.DeviceId).HasColumnName("device_id");
            e.Property(x => x.Mode).HasColumnName("mode").HasMaxLength(8)
                .HasConversion<string>();
            e.Property(x => x.CorrectIndex).HasColumnName("correct_index");
            e.Property(x => x.CurrentColors).HasColumnName("current_colors")
                .HasColumnType(isPostgres ? "jsonb" : "TEXT");
            e.Property(x => x.ScorePoints).HasColumnName("score_points");
            e.Property(x => x.ScoreTotal).HasColumnName("score_total");
            e.Property(x => x.CorrectCount).HasColumnName("correct_count");
            e.Property(x => x.TriesLeft).HasColumnName("tries_left");
            e.Property(x => x.Status).HasColumnName("status")
                .HasConversion<string>();
            e.Property(x => x.StartedAt).HasColumnName("started_at")
                .HasColumnType(isPostgres ? "jsonb" : "TEXT");
            e.Property(x => x.ExpiresAt).HasColumnName("expires_at")
                .HasColumnType(isPostgres ? "jsonb" : "TEXT");
            e.Property(x => x.EndedAt).HasColumnName("ended_at")
                .HasColumnType(isPostgres ? "jsonb" : "TEXT");

            e.HasIndex(x => x.DeviceId).HasDatabaseName("ix_game_sessions_device_id");
            e.HasIndex(x => x.ExpiresAt).HasDatabaseName("ix_game_sessions_expires_at");
            e.HasIndex(x => new { x.DeviceId, x.StartIdempotencyKey })
                .HasDatabaseName("ix_game_sessions_device_id_start_key");

            e.HasOne(x => x.Highscore)
                .WithOne(x => x.Session)
                .HasForeignKey<Highscore>(x => x.SessionId);
        });

        modelBuilder.Entity<Highscore>(e =>
        {
            e.ToTable("highscores");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.DeviceId).HasColumnName("device_id");
            e.Property(x => x.Mode).HasColumnName("mode").HasMaxLength(8)
                .HasConversion<string>();
            e.Property(x => x.Points).HasColumnName("points");
            e.Property(x => x.Total).HasColumnName("total");
            e.Property(x => x.AchievedAt).HasColumnName("achieved_at")
                .HasColumnType(isPostgres ? "jsonb" : "TEXT");
            e.Property(x => x.SessionId).HasColumnName("session_id");

            e.HasIndex(x => new { x.DeviceId, x.Mode })
                .IsUnique()
                .HasDatabaseName("ix_highscores_device_id_mode");
        });
    }
}