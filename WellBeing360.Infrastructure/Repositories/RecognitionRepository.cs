using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class RecognitionRepository : IRecognitionRepository
    {
        private readonly WellBeingContext _context;

        public RecognitionRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task AddAwardAsync(RecognitionAward award)
        {
            await _context.RecognitionAwards.AddAsync(award);
        }

        public async Task<IEnumerable<RecognitionAward>> GetAwardsReceivedAsync(int employeeId)
        {
            return await _context.RecognitionAwards.Where(r => r.RecipientID == employeeId).ToListAsync();
        }

        public async Task<IEnumerable<RecognitionAward>> GetAwardsSentAsync(int employeeId)
        {
            return await _context.RecognitionAwards.Where(r => r.NominatorID == employeeId).ToListAsync();
        }

        public async Task<IEnumerable<RewardPoints>> GetAllPointsAsync()
        {
            return await _context.RewardPoints.ToListAsync();
        }

        public async Task<IEnumerable<RewardPoints>> GetPointsByEmployeeAsync(int employeeId)
        {
            return await _context.RewardPoints.Where(rp => rp.EmployeeID == employeeId).ToListAsync();
        }

        public async Task AddOrUpdatePointsAsync(RewardPoints points)
        {
            var existing = await _context.RewardPoints.FirstOrDefaultAsync(rp => rp.EmployeeID == points.EmployeeID);
            if (existing == null)
            {
                await _context.RewardPoints.AddAsync(points);
            }
            else
            {
                existing.TotalEarned = points.TotalEarned;
                existing.TotalRedeemed = points.TotalRedeemed;
                existing.Balance = points.Balance;
                existing.LastUpdated = points.LastUpdated;
                _context.RewardPoints.Update(existing);
            }
        }

        public async Task<IEnumerable<RedemptionCatalog>> GetCatalogAsync()
        {
            return await _context.RedemptionCatalogs.ToListAsync();
        }

        public async Task<IEnumerable<RecognitionAward>> GetAllAwardsAsync()
        {
            return await _context.RecognitionAwards.ToListAsync();
        }

        public async Task AddCatalogItemAsync(RedemptionCatalog item)
        {
            await _context.RedemptionCatalogs.AddAsync(item);
        }

        public async Task<RedemptionCatalog?> GetCatalogItemByIdAsync(int id)
        {
            return await _context.RedemptionCatalogs.FindAsync(id);
        }

        public void UpdateCatalogItem(RedemptionCatalog item)
        {
            _context.RedemptionCatalogs.Update(item);
        }
    }
}
