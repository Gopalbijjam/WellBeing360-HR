using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class EnrolmentRepository : IEnrolmentRepository
    {
        private readonly WellBeingContext _context;

        public EnrolmentRepository(WellBeingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnrolmentWindow>> GetEnrolmentWindowsAsync()
        {
            return await _context.EnrolmentWindows.ToListAsync();
        }

        public async Task<EnrolmentWindow?> GetByIdAsync(int id)
        {
            return await _context.EnrolmentWindows.FindAsync(id);
        }

        public async Task AddWindowAsync(EnrolmentWindow window)
        {
            await _context.EnrolmentWindows.AddAsync(window);
        }

        public async Task<IEnumerable<BenefitEnrolment>> GetEmployeeEnrolmentsAsync(int employeeId)
        {
            return await _context.BenefitEnrolments.Where(e => e.EmployeeID == employeeId).ToListAsync();
        }

        public async Task AddEnrolmentAsync(BenefitEnrolment enrolment)
        {
            await _context.BenefitEnrolments.AddAsync(enrolment);
        }

        public async Task<IEnumerable<BenefitEnrolment>> GetAllEnrolmentsAsync()
        {
            return await _context.BenefitEnrolments.ToListAsync();
        }

        public async Task<BenefitEnrolment?> GetEnrolmentByIdAsync(int id)
        {
            return await _context.BenefitEnrolments.FindAsync(id);
        }

        public void UpdateEnrolment(BenefitEnrolment enrolment)
        {
            _context.BenefitEnrolments.Update(enrolment);
        }

        public void RemoveEnrolment(BenefitEnrolment enrolment)
        {
            _context.BenefitEnrolments.Remove(enrolment);
        }

        public async Task<IEnumerable<Dependent>> GetDependentsAsync(int employeeId)
        {
            return await _context.Dependents.Where(d => d.EmployeeID == employeeId && d.Status == "Active").ToListAsync();
        }

        public async Task AddDependentAsync(Dependent dependent)
        {
            await _context.Dependents.AddAsync(dependent);
        }

        public async Task<Dependent?> GetDependentByIdAsync(int id)
        {
            return await _context.Dependents.FindAsync(id);
        }

        public void UpdateDependent(Dependent dependent)
        {
            _context.Dependents.Update(dependent);
        }
    }
}
