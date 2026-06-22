using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IRecognitionRepository
    {
        Task<IEnumerable<RecognitionAward>> GetAllAwardsAsync();

        Task AddAwardAsync(RecognitionAward award);
        Task<IEnumerable<RecognitionAward>> GetAwardsReceivedAsync(int employeeId);
        Task<IEnumerable<RecognitionAward>> GetAwardsSentAsync(int employeeId);

        Task<IEnumerable<RewardPoints>> GetAllPointsAsync();
        Task<IEnumerable<RewardPoints>> GetPointsByEmployeeAsync(int employeeId);
        Task AddOrUpdatePointsAsync(RewardPoints points);

        Task<IEnumerable<RedemptionCatalog>> GetCatalogAsync();
        Task AddCatalogItemAsync(RedemptionCatalog item);
        Task<RedemptionCatalog?> GetCatalogItemByIdAsync(int id);
        void UpdateCatalogItem(RedemptionCatalog item);
    }
}
