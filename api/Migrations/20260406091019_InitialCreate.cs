using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColorDash.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "game_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    device_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    mode = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    correct_index = table.Column<int>(type: "INTEGER", nullable: false),
                    current_colors = table.Column<string>(type: "TEXT", nullable: false),
                    score_points = table.Column<int>(type: "INTEGER", nullable: false),
                    score_total = table.Column<int>(type: "INTEGER", nullable: false),
                    correct_count = table.Column<int>(type: "INTEGER", nullable: false),
                    tries_left = table.Column<int>(type: "INTEGER", nullable: false),
                    status = table.Column<string>(type: "TEXT", nullable: false),
                    started_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    expires_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ended_at = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_sessions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "highscores",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    device_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    mode = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    points = table.Column<int>(type: "INTEGER", nullable: false),
                    total = table.Column<int>(type: "INTEGER", nullable: false),
                    achieved_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    session_id = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_highscores", x => x.id);
                    table.ForeignKey(
                        name: "FK_highscores_game_sessions_session_id",
                        column: x => x.session_id,
                        principalTable: "game_sessions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_device_id",
                table: "game_sessions",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "ix_game_sessions_expires_at",
                table: "game_sessions",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_highscores_device_id_mode",
                table: "highscores",
                columns: new[] { "device_id", "mode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_highscores_session_id",
                table: "highscores",
                column: "session_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "highscores");

            migrationBuilder.DropTable(
                name: "game_sessions");
        }
    }
}
