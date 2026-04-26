using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColorDash.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIdempotencyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EndResponseJson",
                table: "game_sessions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastGuessIdempotencyKey",
                table: "game_sessions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastGuessResponseJson",
                table: "game_sessions",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndResponseJson",
                table: "game_sessions");

            migrationBuilder.DropColumn(
                name: "LastGuessIdempotencyKey",
                table: "game_sessions");

            migrationBuilder.DropColumn(
                name: "LastGuessResponseJson",
                table: "game_sessions");
        }
    }
}
