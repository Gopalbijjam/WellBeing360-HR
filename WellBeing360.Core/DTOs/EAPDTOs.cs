using System;

namespace WellBeing360.Core.DTOs
{
    public class EAPBookingRequest
    {
        public int ServiceID { get; set; }
        public DateTime SessionDate { get; set; }
    }

    public class EAPSessionResponse
    {
        public int SessionID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime SessionDate { get; set; }
        public string CounsellorRef { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
