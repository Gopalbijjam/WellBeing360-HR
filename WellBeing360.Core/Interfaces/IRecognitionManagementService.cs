using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IRecognitionManagementService
    {
        Task<RecognitionAward> NominateAwardAsync(int nominatorId, AwardNominationRequest request);
        Task<IEnumerable<RecognitionAward>> GetAwardsReceivedAsync(int employeeId);
        Task<IEnumerable<RecognitionAward>> GetAwardsSentAsync(int employeeId);
        Task<IEnumerable<RecognitionAwardResponse>> GetAllAwardsAsync();
        Task<IEnumerable<EmployeePointsResponse>> GetAllPointsBalancesAsync();
        Task<RewardPoints?> GetPointsBalanceAsync(int employeeId);
        Task<IEnumerable<RedemptionCatalog>> GetCatalogAsync();
        Task<RedemptionCatalog> CreateCatalogItemAsync(RedemptionCatalog item);
        Task<bool> RedeemItemAsync(int employeeId, int itemId);
    }
}
