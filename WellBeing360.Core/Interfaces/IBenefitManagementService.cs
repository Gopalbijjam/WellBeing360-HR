using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IBenefitManagementService
    {
        Task<IEnumerable<BenefitPlan>> GetPlansAsync();
        Task<BenefitPlan?> GetPlanByIdAsync(int id);
        Task<BenefitPlan> CreatePlanAsync(BenefitPlan plan);
        Task<IEnumerable<FlexBenefitBucket>> GetFlexBucketsAsync(int planId);
        Task<IEnumerable<EnrolmentWindow>> GetEnrolmentWindowsAsync();
        Task<EnrolmentWindow?> GetCurrentOpenWindowAsync();
        Task<EnrolmentWindow> CreateEnrolmentWindowAsync(EnrolmentWindow window);
        Task<BenefitEnrolment?> EnrolEmployeeAsync(int employeeId, EnrolmentRequest request);
        Task<IEnumerable<BenefitEnrolment>> GetEmployeeEnrolmentsAsync(int employeeId);
        Task<IEnumerable<Dependent>> GetDependentsAsync(int employeeId);
        Task<Dependent> AddDependentAsync(int employeeId, DependentDTO dependent);
        Task<bool> RemoveDependentAsync(int dependentId);
    }
}
