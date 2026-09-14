package Job.Application.Tracker.business;

import Job.Application.Tracker.dao.JobApplicationDAO;
import Job.Application.Tracker.dto.DashboardResponse;
import Job.Application.Tracker.entity.ApplicationStatus;
import Job.Application.Tracker.entity.JobApplication;
import Job.Application.Tracker.exception.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationBusiness {

    private final JobApplicationDAO jobApplicationDAO;

    public JobApplicationBusiness(JobApplicationDAO jobApplicationDAO) {
        this.jobApplicationDAO = jobApplicationDAO;
    }

    // CREATE
    public JobApplication create(JobApplication application) {

        if (application.getStatus() == null) {
            application.setStatus(ApplicationStatus.APPLIED);
        }

        return jobApplicationDAO.save(application);
    }

    // GET ALL
    // Supports search, filter and pagination
    public Page<JobApplication> getApplications(
            String search,
            ApplicationStatus status,
            Pageable pageable
    ) {

        boolean hasSearch =
                search != null && !search.trim().isEmpty();

        // Search + Status Filter
        if (hasSearch && status != null) {

            return jobApplicationDAO
                    .findByStatusAndCompanyNameContainingIgnoreCaseOrStatusAndJobTitleContainingIgnoreCase(
                            status,
                            search,
                            status,
                            search,
                            pageable
                    );
        }

        // Search only
        if (hasSearch) {

            return jobApplicationDAO
                    .findByCompanyNameContainingIgnoreCaseOrJobTitleContainingIgnoreCase(
                            search,
                            search,
                            pageable
                    );
        }

        // Status Filter only
        if (status != null) {

            return jobApplicationDAO.findByStatus(
                    status,
                    pageable
            );
        }

        // Get everything
        return jobApplicationDAO.findAll(pageable);
    }

    // GET BY ID
    public JobApplication getById(Long id) {

        return jobApplicationDAO.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job application not found with id: " + id
                        )
                );
    }

    // UPDATE COMPLETE APPLICATION
    public JobApplication update(
            Long id,
            JobApplication updatedApplication
    ) {

        JobApplication existingApplication = getById(id);

        existingApplication.setCompanyName(
                updatedApplication.getCompanyName()
        );

        existingApplication.setJobTitle(
                updatedApplication.getJobTitle()
        );

        existingApplication.setJobUrl(
                updatedApplication.getJobUrl()
        );

        existingApplication.setLocation(
                updatedApplication.getLocation()
        );

        existingApplication.setEmploymentType(
                updatedApplication.getEmploymentType()
        );

        existingApplication.setSalaryRange(
                updatedApplication.getSalaryRange()
        );

        existingApplication.setApplicationDate(
                updatedApplication.getApplicationDate()
        );

        existingApplication.setStatus(
                updatedApplication.getStatus()
        );

        existingApplication.setNotes(
                updatedApplication.getNotes()
        );

        existingApplication.setInterviewDate(
                updatedApplication.getInterviewDate()
        );

        return jobApplicationDAO.save(existingApplication);
    }

    // UPDATE STATUS ONLY
    public JobApplication updateStatus(
            Long id,
            ApplicationStatus status
    ) {

        JobApplication application = getById(id);

        application.setStatus(status);

        return jobApplicationDAO.save(application);
    }

    // DELETE
    public void delete(Long id) {

        JobApplication application = getById(id);

        jobApplicationDAO.delete(application);
    }

    // DASHBOARD STATISTICS
    public DashboardResponse getDashboard() {

        long total =
                jobApplicationDAO.count();

        long applied =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.APPLIED
                );

        long screening =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.SCREENING
                );

        long interviews =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.INTERVIEW
                );

        long offers =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.OFFER
                );

        long rejected =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.REJECTED
                );

        long withdrawn =
                jobApplicationDAO.countByStatus(
                        ApplicationStatus.WITHDRAWN
                );

        return new DashboardResponse(
                total,
                applied,
                screening,
                interviews,
                offers,
                rejected,
                withdrawn
        );
    }
}