using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColorDash.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStartIdempotencyKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StartIdempotencyKey",
                table: "game_sessions",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartIdempotencyKey",
                table: "game_sessions");
        }
    }
}
