using PaymentModels = Payment.Api.Models;

namespace Payment.Api.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private static readonly List<PaymentModels.Payment> Payments = [];

    public IEnumerable<PaymentModels.Payment> GetAll()
    {
        return Payments;
    }

    public PaymentModels.Payment Add(PaymentModels.Payment payment)
    {
        payment.Id = Payments.Count + 1;

        Payments.Add(payment);

        return payment;
    }
}