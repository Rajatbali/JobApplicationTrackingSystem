package Job.Application.Tracker.dto;

public class DashboardResponse {

    private long totalApplications;
    private long applied;
    private long screening;
    private long interviews;
    private long offers;
    private long rejected;
    private long withdrawn;

    public DashboardResponse(
            long totalApplications,
            long applied,
            long screening,
            long interviews,
            long offers,
            long rejected,
            long withdrawn
    ) {
        this.totalApplications = totalApplications;
        this.applied = applied;
        this.screening = screening;
        this.interviews = interviews;
        this.offers = offers;
        this.rejected = rejected;
        this.withdrawn = withdrawn;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getApplied() {
        return applied;
    }

    public long getScreening() {
        return screening;
    }

    public long getInterviews() {
        return interviews;
    }

    public long getOffers() {
        return offers;
    }

    public long getRejected() {
        return rejected;
    }

    public long getWithdrawn() {
        return withdrawn;
    }
}