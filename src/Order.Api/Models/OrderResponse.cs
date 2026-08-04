namespace Order.Api.Models;

public class OrderResponse
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int OrderId { get; set; }
}