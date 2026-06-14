using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class RecognitionManagementService : IRecognitionManagementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RecognitionManagementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<RecognitionAward> NominateAwardAsync(int nominatorId, AwardNominationRequest request)
        {
            if (nominatorId == request.RecipientID)
            {
                throw new InvalidOperationException("You cannot nominate yourself.");
            }

            var award = new RecognitionAward
            {
                NominatorID = nominatorId,
                RecipientID = request.RecipientID,
                Category = request.Category,
                BadgeName = request.BadgeName,
                PointsAwarded = request.PointsAwarded,
                Message = request.Message,
                AwardDate = DateTime.UtcNow,
                Status = "Awarded"
            };

            await _unitOfWork.RecognitionAwards.AddAsync(award);

            // Update recipient points balance
            if (request.PointsAwarded > 0)
            {
                var pointsRecords = await _unitOfWork.RewardPoints.FindAsync(rp => rp.EmployeeID == request.RecipientID);
                var pointsRecord = pointsRecords.FirstOrDefault();

                if (pointsRecord == null)
                {
                    pointsRecord = new RewardPoints
                    {
                        EmployeeID = request.RecipientID,
                        TotalEarned = request.PointsAwarded,
                        TotalRedeemed = 0,
                        Balance = request.PointsAwarded,
                        LastUpdated = DateTime.UtcNow
                    };
                    await _unitOfWork.RewardPoints.AddAsync(pointsRecord);
                }
                else
                {
                    pointsRecord.TotalEarned += request.PointsAwarded;
                    pointsRecord.Balance += request.PointsAwarded;
                    pointsRecord.LastUpdated = DateTime.UtcNow;
                    _unitOfWork.RewardPoints.Update(pointsRecord);
                }

                // Add Notification to Recipient
                var nominator = await _unitOfWork.Users.GetByIdAsync(nominatorId);
                var nominatorName = nominator?.Name ?? "A colleague";
                var notification = new Notification
                {
                    UserID = request.RecipientID,
                    Message = $"You received a Recognition Award '{request.BadgeName}' ({request.PointsAwarded} pts) from {nominatorName}!",
                    Category = "Recognition",
                    Status = "Unread",
                    CreatedDate = DateTime.UtcNow
                };
                await _unitOfWork.Notifications.AddAsync(notification);
            }

            await _unitOfWork.CompleteAsync();
            return award;
        }

        public async Task<IEnumerable<RecognitionAward>> GetAwardsReceivedAsync(int employeeId)
        {
            return await _unitOfWork.RecognitionAwards.FindAsync(ra => ra.RecipientID == employeeId);
        }

        public async Task<IEnumerable<RecognitionAward>> GetAwardsSentAsync(int employeeId)
        {
            return await _unitOfWork.RecognitionAwards.FindAsync(ra => ra.NominatorID == employeeId);
        }

        public async Task<IEnumerable<RecognitionAwardResponse>> GetAllAwardsAsync()
        {
            var awards = await _unitOfWork.RecognitionAwards.GetAllAsync();
            var users = await _unitOfWork.Users.GetAllAsync();
            var userMap = users.ToDictionary(u => u.UserID, u => u);

            return awards.Select(a => new RecognitionAwardResponse
            {
                AwardID = a.AwardID,
                NominatorName = userMap.TryGetValue(a.NominatorID, out var nom) ? nom.Name : $"Employee {a.NominatorID}",
                RecipientName = userMap.TryGetValue(a.RecipientID, out var rec) ? rec.Name : $"Employee {a.RecipientID}",
                Category = a.Category,
                BadgeName = a.BadgeName,
                PointsAwarded = a.PointsAwarded,
                Message = a.Message,
                AwardDate = a.AwardDate,
                Status = a.Status
            }).OrderByDescending(a => a.AwardDate).ToList();
        }

        public async Task<IEnumerable<EmployeePointsResponse>> GetAllPointsBalancesAsync()
        {
            var points = await _unitOfWork.RewardPoints.GetAllAsync();
            var users = await _unitOfWork.Users.GetAllAsync();
            var userMap = users.ToDictionary(u => u.UserID, u => u);

            return points.Select(p => new EmployeePointsResponse
            {
                PointsID = p.PointsID,
                EmployeeID = p.EmployeeID,
                EmployeeName = userMap.TryGetValue(p.EmployeeID, out var u) ? u.Name : $"Employee {p.EmployeeID}",
                TotalEarned = p.TotalEarned,
                TotalRedeemed = p.TotalRedeemed,
                Balance = p.Balance,
                LastUpdated = p.LastUpdated
            }).OrderByDescending(p => p.Balance).ToList();
        }

        public async Task<RewardPoints?> GetPointsBalanceAsync(int employeeId)
        {
            var records = await _unitOfWork.RewardPoints.FindAsync(rp => rp.EmployeeID == employeeId);
            return records.FirstOrDefault();
        }

        public async Task<IEnumerable<RedemptionCatalog>> GetCatalogAsync()
        {
            return await _unitOfWork.RedemptionCatalogItems.GetAllAsync();
        }

        public async Task<RedemptionCatalog> CreateCatalogItemAsync(RedemptionCatalog item)
        {
            await _unitOfWork.RedemptionCatalogItems.AddAsync(item);
            await _unitOfWork.CompleteAsync();
            return item;
        }

        public async Task<bool> RedeemItemAsync(int employeeId, int itemId)
        {
            var item = await _unitOfWork.RedemptionCatalogItems.GetByIdAsync(itemId);
            if (item == null || item.Status != "Available" || item.AvailableQuantity <= 0)
            {
                throw new ArgumentException("Item is unavailable or out of stock.");
            }

            var pointsRecords = await _unitOfWork.RewardPoints.FindAsync(rp => rp.EmployeeID == employeeId);
            var pointsRecord = pointsRecords.FirstOrDefault();

            if (pointsRecord == null || pointsRecord.Balance < item.PointsRequired)
            {
                throw new InvalidOperationException("Insufficient points balance.");
            }

            // Deduct points
            pointsRecord.TotalRedeemed += item.PointsRequired;
            pointsRecord.Balance -= item.PointsRequired;
            pointsRecord.LastUpdated = DateTime.UtcNow;
            _unitOfWork.RewardPoints.Update(pointsRecord);

            // Decrement catalog item inventory
            item.AvailableQuantity--;
            if (item.AvailableQuantity == 0)
            {
                item.Status = "OutOfStock";
            }
            _unitOfWork.RedemptionCatalogItems.Update(item);

            // Add notification
            var notification = new Notification
            {
                UserID = employeeId,
                Message = $"Redemption success: You spent {item.PointsRequired} points on '{item.ItemName}'.",
                Category = "Recognition",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
