namespace Payment.Api.Models;

public class Payment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}