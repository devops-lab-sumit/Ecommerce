using PaymentModels = Payment.Api.Models;

namespace Payment.Api.Repositories;

public interface IPaymentRepository
{
    IEnumerable<PaymentModels.Payment> GetAll();

    PaymentModels.Payment Add(PaymentModels.Payment payment);
}