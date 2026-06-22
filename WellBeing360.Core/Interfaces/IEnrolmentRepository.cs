using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IEnrolmentRepository
    {
        Task<IEnumerable<EnrolmentWindow>> GetEnrolmentWindowsAsync();
        Task<EnrolmentWindow?> GetByIdAsync(int id);
        Task AddWindowAsync(EnrolmentWindow window);

        Task<IEnumerable<BenefitEnrolment>> GetEmployeeEnrolmentsAsync(int employeeId);
        Task AddEnrolmentAsync(BenefitEnrolment enrolment);
        Task<IEnumerable<BenefitEnrolment>> GetAllEnrolmentsAsync();
        Task<BenefitEnrolment?> GetEnrolmentByIdAsync(int id);
        void UpdateEnrolment(BenefitEnrolment enrolment);
        void RemoveEnrolment(BenefitEnrolment enrolment);

        Task<IEnumerable<Dependent>> GetDependentsAsync(int employeeId);
        Task AddDependentAsync(Dependent dependent);
        Task<Dependent?> GetDependentByIdAsync(int id);
        void UpdateDependent(Dependent dependent);
    }
}
