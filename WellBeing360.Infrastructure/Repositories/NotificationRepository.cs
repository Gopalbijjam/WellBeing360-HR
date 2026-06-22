using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly WellBeingContext _context;

        public NotificationRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications.Where(n => n.UserID == userId).OrderByDescending(n => n.CreatedDate).ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }

        public void Update(Notification notification)
        {
            _context.Notifications.Update(notification);
        }
    }
}
