using PaymentModels = Payment.Api.Models;
using Payment.Api.Repositories;
using SharedContracts = Shared.Contracts.Payment;

namespace Payment.Api.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _repository;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        IPaymentRepository repository,
        ILogger<PaymentService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<SharedContracts.PaymentResponse> ProcessPaymentAsync(SharedContracts.PaymentRequest request)
    {
        _logger.LogInformation(
            "Processing payment for Order {OrderId}",
            request.OrderId);

        await Task.Delay(1000);

        var payment = new PaymentModels.Payment
        {
            OrderId = request.OrderId,
            Amount = request.Amount,
            Status = "Success",
            CreatedAt = DateTime.UtcNow
        };

        _repository.Add(payment);

        return new SharedContracts.PaymentResponse
        {
            Success = true,
            TransactionId = Guid.NewGuid().ToString(),
            Message = "Payment Successful"
        };
    }
}