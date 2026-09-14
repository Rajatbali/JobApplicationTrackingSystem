package Job.Application.Tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.SQLOutput;

@SpringBootApplication
public class JobApplicationTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobApplicationTrackerApplication.class, args);

		System.out.println("App Started Successfully");
	}

}
