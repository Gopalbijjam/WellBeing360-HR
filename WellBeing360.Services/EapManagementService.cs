using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class EapManagementService : IEapManagementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public EapManagementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<EAPService>> GetServicesAsync()
        {
            return await _unitOfWork.EAPServices.GetAllAsync();
        }

        public async Task<EAPService> CreateServiceAsync(EAPService service)
        {
            await _unitOfWork.EAPServices.AddAsync(service);
            await _unitOfWork.CompleteAsync();
            return service;
        }

        public async Task<EAPSession> BookSessionAsync(int employeeId, EAPBookingRequest request)
        {
            var service = await _unitOfWork.EAPServices.GetByIdAsync(request.ServiceID);
            if (service == null || service.Status != "Active")
            {
                throw new ArgumentException("EAP Service not found or inactive.");
            }

            // Check sessions limit
            var employeeSessions = await _unitOfWork.EAPSessions.FindAsync(s => s.EmployeeID == employeeId && s.ServiceID == request.ServiceID && s.Status != "Cancelled");
            if (employeeSessions.Count() >= service.SessionsAllowedPerEmployee)
            {
                throw new InvalidOperationException($"You have reached the maximum allowed sessions ({service.SessionsAllowedPerEmployee}) for this service.");
            }

            var session = new EAPSession
            {
                EmployeeID = employeeId,
                ServiceID = request.ServiceID,
                RequestedDate = DateTime.UtcNow,
                SessionDate = request.SessionDate,
                CounsellorRef = "Assigning Counsellor...",
                Status = "Requested"
            };

            await _unitOfWork.EAPSessions.AddAsync(session);

            // Add notification
            var notification = new Notification
            {
                UserID = employeeId,
                Message = $"Your session request for '{service.ServiceName}' has been received.",
                Category = "EAP",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return session;
        }

        public async Task<IEnumerable<EAPSession>> GetEmployeeSessionsAsync(int employeeId)
        {
            return await _unitOfWork.EAPSessions.FindAsync(s => s.EmployeeID == employeeId);
        }

        public async Task<IEnumerable<EAPSession>> GetAllSessionsAsync()
        {
            return await _unitOfWork.EAPSessions.GetAllAsync();
        }

        public async Task<EAPSession?> UpdateSessionStatusAsync(int sessionId, string status, string counsellorRef)
        {
            var session = await _unitOfWork.EAPSessions.GetByIdAsync(sessionId);
            if (session == null) return null;

            session.Status = status;
            if (!string.IsNullOrEmpty(counsellorRef))
            {
                session.CounsellorRef = counsellorRef;
            }

            _unitOfWork.EAPSessions.Update(session);

            // Notify employee
            var service = await _unitOfWork.EAPServices.GetByIdAsync(session.ServiceID);
            var serviceName = service?.ServiceName ?? "EAP Service";
            
            var notification = new Notification
            {
                UserID = session.EmployeeID,
                Message = $"Your '{serviceName}' counselling session status updated to '{status}'. Counsellor: {session.CounsellorRef}",
                Category = "EAP",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return session;
        }
    }
}
