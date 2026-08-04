namespace Shared.Contracts.Inventory;

public class ReserveStockResponse
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int RemainingStock { get; set; }
}