package Job.Application.Tracker.controller;

import Job.Application.Tracker.dto.DashboardResponse;
import Job.Application.Tracker.dto.JobApplicationRequest;
import Job.Application.Tracker.dto.JobApplicationResponse;
import Job.Application.Tracker.dto.StatusUpdateRequest;
import Job.Application.Tracker.entity.ApplicationStatus;
import Job.Application.Tracker.service.JobApplicationService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }


    // CREATE APPLICATION
    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(
            @Valid @RequestBody JobApplicationRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }


    // DASHBOARD STATISTICS
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                service.getDashboard()
        );
    }


    // GET ALL APPLICATIONS
    // Supports search, filter, pagination and sorting
    @GetMapping
    public ResponseEntity<Page<JobApplicationResponse>> getApplications(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            ApplicationStatus status,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "applicationDate")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction
    ) {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("asc")
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        return ResponseEntity.ok(
                service.getApplications(
                        search,
                        status,
                        pageable
                )
        );
    }


    // GET APPLICATION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplication(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    // UPDATE COMPLETE APPLICATION
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request
    ) {

        return ResponseEntity.ok(
                service.update(id, request)
        );
    }


    // UPDATE ONLY STATUS
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {

        return ResponseEntity.ok(
                service.updateStatus(
                        id,
                        request.getStatus()
                )
        );
    }


    // DELETE APPLICATION
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id
    ) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}