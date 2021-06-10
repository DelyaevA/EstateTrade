package com.example.demo.service;


import com.example.demo.exception.AppException;
import com.example.demo.model.Role;
import com.example.demo.model.RoleName;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomOAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends OidcUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oAuth2User =  super.loadUser(userRequest);
        Map attributes = oAuth2User.getAttributes();
        Optional<User> userOptional = userRepository.findByEmail((String) attributes.get("email"));
        if (userOptional.isEmpty()) {
            User user = new User();
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new AppException("User Role not set."));
            user.setEmail((String) attributes.get("email"));
            user.setLogo((String) attributes.get("picture"));
            user.setUsername(((String) attributes.get("email")).replace("@gmail.com", ""));
            user.setRoles(Collections.singleton(userRole));
            Date now = new Date();
            user.setRegistrationDate(new Date(now.getYear(), now.getMonth(), now.getDay()));
            userRepository.save(user);
        }
        else{
            User user = userOptional.get();
            user.setLogo((String) attributes.get("picture"));
            userRepository.save(user);
        }
        return oAuth2User;
    }
}
