package pcw.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer uid;
    private String email;
    private String username;
    private String password;

    public User(String uid, String username, String email) {
        this.uid = Integer.parseInt(uid);
        this.username = username;
        this.email = email;
    }

    public User(Integer uid, String username, String email) {
        this.uid = uid;
        this.username = username;
        this.email = email;
    }
}
