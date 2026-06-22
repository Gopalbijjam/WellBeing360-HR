using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class BenefitPlanRepository : GenericRepository<BenefitPlan>, IBenefitPlanRepository
    {
        public BenefitPlanRepository(WellBeingContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BenefitPlan>> GetActivePlansAsync()
        {
            return await _dbSet.Where(p => p.Status == "Active").ToListAsync();
        }

        public async Task<BenefitPlan?> GetWithBucketsAsync(int id)
        {
            return await _context.BenefitPlans
                .Include(bp => bp.FlexBuckets)
                .FirstOrDefaultAsync(bp => bp.PlanID == id);
        }
    }
}
