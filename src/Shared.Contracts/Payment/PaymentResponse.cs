namespace Shared.Contracts.Payment;

public class PaymentResponse
{
    public bool Success { get; set; }

    public string TransactionId { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}