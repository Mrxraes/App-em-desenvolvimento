package com.bruno.MyFinances.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.UserRequest;
import com.bruno.MyFinances.dto.UserResponse;
import com.bruno.MyFinances.service.UserService;

@RestController
@RequestMapping("/api")
public class User {


    private final UserService userService;

    public User(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/getNameUser")
    public UserResponse getName(@RequestBody UserRequest request) {

        String nome = userService.getNomeUser(request.getToken());

        System.out.println(nome);

        return new UserResponse(nome);
    }

}
