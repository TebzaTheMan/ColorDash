namespace ColorDash.Api.Models.Requests;

public record struct DeviceId(Guid Value)
{
    public static bool TryParse(string? value, out DeviceId result)
    {
        if (Guid.TryParse(value, out var guid))
        {
            result = new DeviceId(guid);
            return true;
        }
        result = default;
        return false;
    }
}