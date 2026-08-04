using Notification.Api.Models;

namespace Notification.Api.Repositories;

public interface INotificationRepository
{
    IEnumerable<NotificationMessage> GetAll();

    NotificationMessage Add(NotificationMessage notification);
}