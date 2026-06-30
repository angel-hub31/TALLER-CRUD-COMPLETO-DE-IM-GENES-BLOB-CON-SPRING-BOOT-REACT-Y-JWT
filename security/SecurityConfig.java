package com.krakedev.taller_jwt.security;


import java.util.Arrays;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



@Configuration

@EnableWebSecurity

public class SecurityConfig {



    private final JwtAuthenticationFilter jwtAuthenticationFilter;




    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ){

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

    }








    @Bean

    public SecurityFilterChain filterChain(

            HttpSecurity http

    ) throws Exception {



        http



        // CAMBIO:
        // desactivamos csrf para API REST

        .csrf(
            csrf -> csrf.disable()
        )



        .cors(
            cors ->
            cors.configurationSource(
                corsConfigurationSource()
            )
        )



        .authorizeHttpRequests(auth -> auth




            // LOGIN Y REGISTRO

            .requestMatchers(
                "/auth/login",
                "/auth/registrar"
            )

            .permitAll()






            // LISTAR CELULARES

            .requestMatchers(

                org.springframework.http.HttpMethod.GET,

                "/auth/celulares"

            )

            .permitAll()





            // FOTO DEL CELULAR

            .requestMatchers(

                org.springframework.http.HttpMethod.GET,

                "/auth/celulares/*/foto"

            )

            .permitAll()






            // REGISTRAR CELULAR

            .requestMatchers(

                "/auth/celulares/registrar"

            )

            .permitAll()







            // TODO LO DEMAS NECESITA TOKEN


            .requestMatchers(

                "/auth/celulares/**"

            )

            .authenticated()





            .anyRequest()

            .authenticated()



        )





        .addFilterBefore(

            jwtAuthenticationFilter,

            UsernamePasswordAuthenticationFilter.class

        );






        return http.build();

    }










    @Bean

    public UrlBasedCorsConfigurationSource corsConfigurationSource(){



        CorsConfiguration config =
                new CorsConfiguration();




        config.setAllowedOrigins(

            Arrays.asList(

                "http://localhost:5173"

            )

        );




        config.setAllowedMethods(

            Arrays.asList(

                "GET",

                "POST",

                "PUT",

                "DELETE",

                "OPTIONS"

            )

        );




        config.setAllowedHeaders(

            Arrays.asList("*")

        );




        config.setAllowCredentials(true);





        UrlBasedCorsConfigurationSource source =

                new UrlBasedCorsConfigurationSource();




        source.registerCorsConfiguration(

            "/**",

            config

        );




        return source;


    }



}