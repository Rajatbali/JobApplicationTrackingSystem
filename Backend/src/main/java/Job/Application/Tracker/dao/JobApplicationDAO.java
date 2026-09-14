package Job.Application.Tracker.dao;

import Job.Application.Tracker.entity.ApplicationStatus;
import Job.Application.Tracker.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationDAO extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByStatus(
            ApplicationStatus status,
            Pageable pageable
    );

    Page<JobApplication> findByCompanyNameContainingIgnoreCaseOrJobTitleContainingIgnoreCase(
            String companyName,
            String jobTitle,
            Pageable pageable
    );

    Page<JobApplication> findByStatusAndCompanyNameContainingIgnoreCaseOrStatusAndJobTitleContainingIgnoreCase(
            ApplicationStatus status1,
            String companyName,
            ApplicationStatus status2,
            String jobTitle,
            Pageable pageable
    );

    long countByStatus(ApplicationStatus status);
}