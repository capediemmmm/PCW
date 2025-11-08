package pcw.backend.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceBt {
    private boolean success;
    private Object data;

    public ServiceBt(boolean success) {
        this.success = success;
    }
}
