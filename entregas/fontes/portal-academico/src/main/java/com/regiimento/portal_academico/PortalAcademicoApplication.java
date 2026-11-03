package com.regiimento.portal_academico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PortalAcademicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortalAcademicoApplication.class, args);
	}

}
