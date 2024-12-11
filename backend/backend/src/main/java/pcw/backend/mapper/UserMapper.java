package pcw.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import pcw.backend.entity.User;

@Mapper // MyBatis Mapper
public interface UserMapper {
    User getUserByEmail(String email);
    User getUserByUsername(String username);
    User getUserByUid(Integer uid);
    void insertUser(User user);
    void updateUser(User user);
    void deleteUserByUid(Integer uid);
}   // End of UserMapper.java