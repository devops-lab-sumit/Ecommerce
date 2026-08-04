using Payment.Api.Models;
using Payment.Api.Repositories;
using PaymentModels = Payment.Api.Models;

namespace Payment.Api.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _repository;

    public PaymentService(IPaymentRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaymentResponse> ProcessPaymentAsync(PaymentRequest request)
    {
        // Simulate payment gateway

        await Task.Delay(3000);

        var payment = new PaymentModels.Payment
        {
            OrderId = request.OrderId,
            Amount = request.Amount,
            Status = "Success",
            CreatedAt = DateTime.UtcNow
        };

        _repository.Add(payment);

        return new PaymentResponse
        {
            Success = true,
            TransactionId = Guid.NewGuid().ToString(),
            Message = "Payment Successful"
        };
    }
}