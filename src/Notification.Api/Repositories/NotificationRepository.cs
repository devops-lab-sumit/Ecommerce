using Notification.Api.Models;

namespace Notification.Api.Repositories;

public class NotificationRepository : INotificationRepository
{
    private static readonly List<NotificationMessage> Notifications = [];

    public IEnumerable<NotificationMessage> GetAll()
    {
        return Notifications;
    }

    public NotificationMessage Add(NotificationMessage notification)
    {
        notification.Id = Notifications.Count + 1;

        Notifications.Add(notification);

        return notification;
    }
}