public async Task<OrderResponse> CreateOrderAsync(OrderRequest request)
{
    var customer =
        await _customerClient.GetCustomerAsync(request.CustomerId);

    if (customer == null)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Customer not found"
        };
    }

    var inventoryReserved =
        await _inventoryClient.ReserveStockAsync(
            request.ProductId,
            request.Quantity);

    if (!inventoryReserved)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Inventory reservation failed"
        };
    }

    var paymentSuccess =
        await _paymentClient.ProcessPaymentAsync(
            0,
            request.Amount);

    if (!paymentSuccess)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Payment failed"
        };
    }

    await _notificationClient.SendNotificationAsync(
        customer.Name,
        customer.Email);

    var order = new Models.Order
    {
        CustomerId = request.CustomerId,
        ProductId = request.ProductId,
        Quantity = request.Quantity,
        Amount = request.Amount,
        Status = "Completed"
    };

    var created = _repository.Add(order);

    return new OrderResponse
    {
        Success = true,
        Message = "Order Created Successfully",
        OrderId = created.Id
    };
}

When you call

POST /api/orders

Order API will execute

Receive Request
        │
        ▼
Customer API
        │
        ▼
Inventory API
        │
        ▼
Payment API
        │
        ▼
Notification API
        │
        ▼
Save Order
        │
        ▼
Return Response

This is exactly how a real orchestration service works.


for now

React

        |

        ▼

Order API

        |

        ├────────► Customer API

        ├────────► Inventory API

        ├────────► Payment API

        └────────► Notification API
Nothing more.

No Polly.

No Retry.

No Circuit Breaker.

No Clean Architecture.

No MediatR.

No Event Bus.

Nothing.

Just simple synchronous HttpClient.

Then STOP.

------


Created a startup script at run-all.ps1.

How to run it

Open PowerShell in the repository root:

    .\run-all.ps1

In the folder Ecommerce run:
If PowerShell blocks scripts, run:
    Set-ExecutionPolicy -Scope Process Bypass
.\run-all.ps1
What it does

Starts all five APIs from one place:
Customer.Api
Inventory.Api
Payment.Api
Notification.Api
Order.Api
Notes

Each API runs in its own process.
The script uses the project files under src.
To stop them, close the PowerShell window or stop the dotnet processes from Task Manager.