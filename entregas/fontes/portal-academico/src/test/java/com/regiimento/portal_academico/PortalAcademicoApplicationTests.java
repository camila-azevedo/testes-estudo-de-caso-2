package com.regiimento.portal_academico;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Sobe o contexto completo, que precisa do Postgres (docker compose up -d) e das variáveis de
 * ambiente do README. Só roda quando o ambiente está configurado (JWT_SECRET definido); sem isso
 * o teste é ignorado e "mvnw package" não quebra em quem ainda não configurou nada.
 */
@SpringBootTest
@EnabledIfEnvironmentVariable(named = "JWT_SECRET", matches = ".+")
class PortalAcademicoApplicationTests {

	@Test
	void contextLoads() {
	}

}
