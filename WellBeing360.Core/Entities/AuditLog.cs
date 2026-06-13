using System;

namespace WellBeing360.Core.Entities
{
    public class AuditLog
    {
        public int AuditID { get; set; }
        public int UserID { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Module { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation property
        public User? User { get; set; }
    }
}
