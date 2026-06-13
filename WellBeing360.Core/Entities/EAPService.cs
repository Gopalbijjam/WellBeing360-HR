namespace WellBeing360.Core.Entities
{
    public class EAPService
    {
        public int ServiceID { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // MentalHealthCounselling, LegalAdvisory, FinancialCounselling, GriefSupport, ParentingAdvisory
        public int SessionsAllowedPerEmployee { get; set; }
        public string Status { get; set; } = "Active"; // Active, Inactive
    }
}
