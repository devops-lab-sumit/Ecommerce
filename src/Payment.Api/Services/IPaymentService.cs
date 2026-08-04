using SharedContracts = Shared.Contracts.Payment;

namespace Payment.Api.Services;

public interface IPaymentService
{
    Task<SharedContracts.PaymentResponse> ProcessPaymentAsync(SharedContracts.PaymentRequest request);
}