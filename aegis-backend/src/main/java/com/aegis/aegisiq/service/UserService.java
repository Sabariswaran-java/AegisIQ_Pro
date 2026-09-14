package com.aegis.aegisiq.service;

import com.aegis.aegisiq.entity.User;

public interface UserService {
    User registerUser(User user);
    User findByUsername(String username);
}