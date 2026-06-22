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
        private readonly IEapRepository _eapRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public EapManagementService(IEapRepository eapRepository, INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
        {
            _eapRepository = eapRepository;
            _notificationRepository = notificationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<EAPService>> GetServicesAsync()
        {
            return await _eapRepository.GetServicesAsync();
        }

        public async Task<EAPService> CreateServiceAsync(EAPService service)
        {
            await _eapRepository.AddServiceAsync(service);
            await _unitOfWork.CompleteAsync();
            return service;
        }

        public async Task<EAPSession> BookSessionAsync(int employeeId, EAPBookingRequest request)
        {
            var service = await _eapRepository.GetServiceByIdAsync(request.ServiceID);
            if (service == null || service.Status != "Active")
            {
                throw new ArgumentException("EAP Service not found or inactive.");
            }

            // Check sessions limit
            var employeeSessions = (await _eapRepository.GetSessionsByEmployeeAsync(employeeId)).Where(s => s.ServiceID == request.ServiceID && s.Status != "Cancelled");
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

            await _eapRepository.AddSessionAsync(session);

            // Add notification
            var notification = new Notification
            {
                UserID = employeeId,
                Message = $"Your session request for '{service.ServiceName}' has been received.",
                Category = "EAP",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _notificationRepository.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return session;
        }

        public async Task<IEnumerable<EAPSession>> GetEmployeeSessionsAsync(int employeeId)
        {
            return await _eapRepository.GetSessionsByEmployeeAsync(employeeId);
        }

        public async Task<IEnumerable<EAPSession>> GetAllSessionsAsync()
        {
            return await _eapRepository.GetAllSessionsAsync();
        }

        public async Task<EAPSession?> UpdateSessionStatusAsync(int sessionId, string status, string counsellorRef)
        {
            var session = await _eapRepository.GetSessionByIdAsync(sessionId);
            if (session == null) return null;

            session.Status = status;
            if (!string.IsNullOrEmpty(counsellorRef))
            {
                session.CounsellorRef = counsellorRef;
            }

            _eapRepository.UpdateSession(session);

            // Notify employee
            var service = await _eapRepository.GetServiceByIdAsync(session.ServiceID);
            var serviceName = service?.ServiceName ?? "EAP Service";

            var notification = new Notification
            {
                UserID = session.EmployeeID,
                Message = $"Your '{serviceName}' counselling session status updated to '{status}'. Counsellor: {session.CounsellorRef}",
                Category = "EAP",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _notificationRepository.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return session;
        }
    }
}
