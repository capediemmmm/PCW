package pcw.backend.service;

import jakarta.persistence.PersistenceException;
import pcw.backend.entity.User;
import pcw.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ServiceBt validate(String username, String password) {
        User user = userMapper.getUserByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return new ServiceBt(true, user.getUid());
        } else if (user == null) {
            return new ServiceBt(false, "Wrong username");
        } else {
            return new ServiceBt(false, "Wrong password");
        }
    }

    public ServiceBt register(String username, String password, String email) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);

        // 打印User：
        System.out.println(user);
        try {
            userMapper.insertUser(user);
            return new ServiceBt(true);
        } catch (PersistenceException e) {
            System.out.println("Username or email already exists");
            return new ServiceBt(false, "Username or email already exists");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ServiceBt(false, e.getMessage());
        }
    }

    public ServiceBt validateUserName(String username) {
        User user = userMapper.getUserByUsername(username);
        if (user != null) {
            return new ServiceBt(true, user.getUsername());
        } else {
            return new ServiceBt(false, "Username not found");
        }
    }

    public ServiceBt validateEmail(String email) {
        User user = userMapper.getUserByEmail(email);
        if (user != null) {
            return new ServiceBt(true, user.getEmail());
        } else {
            return new ServiceBt(false, "Email not found");
        }
    }

    public ServiceBt getUserInfo(Integer uid) {
        User user = userMapper.getUserByUid(uid);
        if (user != null) {
            return new ServiceBt(true, user);
        } else {
            return new ServiceBt(false, "User not found");
        }
    }

    public ServiceBt updateUserName (Integer uid, String username) {
        User user = userMapper.getUserByUid(uid);
        if (user != null) {
            user.setUsername(username);
            try {
                userMapper.updateUser(user);
            } catch (Exception e) {
                return new ServiceBt(false, e.getMessage());
            }
            return new ServiceBt(true);
        } else {
            return new ServiceBt(false, "User not found");
        }
    }

    public ServiceBt updatePasswd(Integer uid, String old_password, String new_password) {
        User user = userMapper.getUserByUid(uid);
        if (user != null && passwordEncoder.matches(old_password, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(new_password));
            try{
                userMapper.updateUser(user);
            } catch (Exception e) {
                return new ServiceBt(false, e.getMessage());
            }
            return new ServiceBt(true);
        } else {
            return new ServiceBt(false, "Wrong password");
        }
    }

    public ServiceBt updateEmail(Integer uid, String email) {
        User user = userMapper.getUserByUid(uid);
        if (user != null) {
            user.setEmail(email);
            try {
                userMapper.updateUser(user);
            } catch (Exception e) {
                return new ServiceBt(false, e.getMessage());
            }
            return new ServiceBt(true);
        } else {
            return new ServiceBt(false, "User not found");
        }
    }

    public ServiceBt delete(Integer uid, String password) {
        User user = userMapper.getUserByUid(uid);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            try {
                userMapper.deleteUserByUid(uid);
            } catch (Exception e) {
                return new ServiceBt(false, e.getMessage());
            }
            return new ServiceBt(true);
        } else {
            return new ServiceBt(false, "Wrong password");
        }
    }

}
