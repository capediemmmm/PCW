package pcw.backend.controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import pcw.backend.entity.PriceDropEmailRequest;
import pcw.backend.entity.User;
import pcw.backend.service.ServiceBt;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pcw.backend.service.UserService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://10.192.48.150:5173/"}, allowCredentials = "true")
public class UserController {
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
        private boolean remember;
    }

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;


    private void sendEmail(String to, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        helper.setText(content, false); // 第二个参数表示是否为HTML
        helper.setTo(to);
        helper.setSubject(subject);
        // 使用application.properties中设置的发件邮箱
        helper.setFrom(fromEmail);

        mailSender.send(message);
    }

    @PostMapping("/sendPriceDropEmail")
    public ResponseEntity<String> sendPriceDropEmail(@RequestBody PriceDropEmailRequest request) {
        String toEmail = request.getEmail();
        String productName = request.getProductName();

        if (toEmail == null || toEmail.isEmpty() || productName == null || productName.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid email or product name.");
        }

        String subject = "商品降价提醒";
        String content = "您好，\n\n您关注的商品 \"" + productName + "\" 已经降价！赶快去查看吧。\n\n祝您购物愉快！\n\n星际飙车侠";

        try {
            sendEmail(toEmail, subject, content);
            return ResponseEntity.ok("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        ServiceBt result = userService.validate(loginRequest.getUsername(), loginRequest.getPassword());
        if (result.isSuccess()) {
            session.setAttribute("uid", result.getData());
            // 输出uid
            System.out.println("uid: " + result.getData());
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        session.invalidate();
        return ResponseEntity.ok("success");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        ServiceBt result = userService.register(user.getUsername(), user.getPassword(), user.getEmail());
        if (result.isSuccess()) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody User user, HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        ServiceBt result = userService.delete(uid, user.getPassword());
        if (result.isSuccess()) {
            session.invalidate();
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok((String) result.getData());
        }
    }

    @GetMapping("/validateUsername")
    public ResponseEntity<String> validateUsername(@RequestParam String username) {
        ServiceBt result = userService.validateUserName(username);
        if (result.isSuccess()) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/validateEmail")
    public ResponseEntity<String> validateEmail(@RequestParam String email) {
        ServiceBt result = userService.validateEmail(email);
        if (result.isSuccess()) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<User> getUserInfo(HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        ServiceBt result = userService.getUserInfo(uid);
        if (result.isSuccess()) {
            return ResponseEntity.ok((User) result.getData());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/changeUsername")
    public ResponseEntity<String> changeUsername(@RequestBody User user, HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        ServiceBt result = userService.updateUserName(uid, user.getUsername());
        if (result.isSuccess()) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @Data
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest, HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        ServiceBt result = userService.updatePasswd((Integer) session.getAttribute("uid"), changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
        if (result.isSuccess()) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok((String) result.getData());
        }
    }

    @PostMapping("/changeEmail")
    public ResponseEntity<String> changeEmail(@RequestBody User user, HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        if (user.getEmail() != null) {
            ServiceBt result = userService.updateEmail(uid, user.getEmail());
            if (result.isSuccess()) {
                return ResponseEntity.ok("success");
            } else {
                return ResponseEntity.ok("fail");
            }
        } else {
            return ResponseEntity.badRequest().body("fail");
        }
    }

    // 返回email
    @GetMapping("/getEmail")
    public ResponseEntity<String> getEmail(HttpSession session) {
        Integer uid = (Integer) session.getAttribute("uid");
        if (uid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 (Unauthorized)
        }
        ServiceBt result = userService.getUserInfo(uid);
        if (result.isSuccess()) {
            return ResponseEntity.ok(((User) result.getData()).getEmail());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
