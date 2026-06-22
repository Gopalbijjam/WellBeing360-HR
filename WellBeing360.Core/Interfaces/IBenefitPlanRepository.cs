using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IBenefitPlanRepository : IRepository<BenefitPlan>
    {
        Task<IEnumerable<BenefitPlan>> GetActivePlansAsync();
        Task<BenefitPlan?> GetWithBucketsAsync(int id);
    }
}
