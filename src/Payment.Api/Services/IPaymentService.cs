using Payment.Api.Models;

namespace Payment.Api.Services;

public interface IPaymentService
{
    Task<PaymentResponse> ProcessPaymentAsync(PaymentRequest request);
}