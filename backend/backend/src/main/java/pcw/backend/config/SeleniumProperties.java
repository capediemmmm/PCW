package pcw.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "selenium")
public class SeleniumProperties {

    // Getters and Setters
    private String host;
    private int port;

}