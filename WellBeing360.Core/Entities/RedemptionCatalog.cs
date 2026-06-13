namespace WellBeing360.Core.Entities
{
    public class RedemptionCatalog
    {
        public int ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Voucher, Merchandise, Experience, Charity
        public int PointsRequired { get; set; }
        public int AvailableQuantity { get; set; }
        public string Status { get; set; } = "Available"; // Available, OutOfStock
    }
}
