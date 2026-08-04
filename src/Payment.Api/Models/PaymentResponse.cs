namespace Payment.Api.Models;

public class PaymentResponse
{
    public bool Success { get; set; }

    public string TransactionId { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}