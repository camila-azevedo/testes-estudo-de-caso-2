# Etapa 1: compila o jar com o Maven Wrapper do projeto
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Baixa as dependências antes de copiar o código, para aproveitar o cache do Docker
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -B dependency:go-offline

COPY src src
RUN ./mvnw -q -B -DskipTests package

# Etapa 2: imagem final só com o JRE e o jar
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
# Limita o heap à memória do container (importante em VPS pequena)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
