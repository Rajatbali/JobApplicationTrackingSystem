package Job.Application.Tracker.service;

import Job.Application.Tracker.business.JobApplicationBusiness;
import Job.Application.Tracker.dto.DashboardResponse;
import Job.Application.Tracker.dto.JobApplicationRequest;
import Job.Application.Tracker.dto.JobApplicationResponse;
import Job.Application.Tracker.entity.ApplicationStatus;
import Job.Application.Tracker.entity.JobApplication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class JobApplicationService {

    private final JobApplicationBusiness business;


    public JobApplicationService(JobApplicationBusiness business) {
        this.business = business;
    }


    public JobApplicationResponse create(JobApplicationRequest request) {

        JobApplication application = new JobApplication();

        mapRequestToEntity(request, application);

        JobApplication saved = business.create(application);

        return mapToResponse(saved);
    }


    public Page<JobApplicationResponse> getApplications(
            String search,
            ApplicationStatus status,
            Pageable pageable
    ) {

        return business
                .getApplications(search, status, pageable)
                .map(this::mapToResponse);
    }


    public JobApplicationResponse getById(Long id) {

        return mapToResponse(
                business.getById(id)
        );
    }


    public JobApplicationResponse update(
            Long id,
            JobApplicationRequest request
    ) {

        JobApplication application = new JobApplication();

        mapRequestToEntity(request, application);

        return mapToResponse(
                business.update(id, application)
        );
    }


    public JobApplicationResponse updateStatus(
            Long id,
            ApplicationStatus status
    ) {

        return mapToResponse(
                business.updateStatus(id, status)
        );
    }


    public void delete(Long id) {

        business.delete(id);
    }


    public DashboardResponse getDashboard() {

        return business.getDashboard();
    }


    private void mapRequestToEntity(
            JobApplicationRequest request,
            JobApplication application
    ) {

        application.setCompanyName(request.getCompanyName());
        application.setJobTitle(request.getJobTitle());
        application.setJobUrl(request.getJobUrl());
        application.setLocation(request.getLocation());
        application.setEmploymentType(request.getEmploymentType());
        application.setSalaryRange(request.getSalaryRange());
        application.setApplicationDate(request.getApplicationDate());
        application.setStatus(request.getStatus());
        application.setNotes(request.getNotes());
        application.setInterviewDate(request.getInterviewDate());
    }


    private JobApplicationResponse mapToResponse(
            JobApplication application
    ) {

        JobApplicationResponse response =
                new JobApplicationResponse();

        response.setId(application.getId());
        response.setCompanyName(application.getCompanyName());
        response.setJobTitle(application.getJobTitle());
        response.setJobUrl(application.getJobUrl());
        response.setLocation(application.getLocation());
        response.setEmploymentType(application.getEmploymentType());
        response.setSalaryRange(application.getSalaryRange());
        response.setApplicationDate(application.getApplicationDate());
        response.setStatus(application.getStatus());
        response.setNotes(application.getNotes());
        response.setInterviewDate(application.getInterviewDate());
        response.setCreatedAt(application.getCreatedAt());
        response.setUpdatedAt(application.getUpdatedAt());

        return response;
    }
}