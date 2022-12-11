FROM eclipse-temurin:17-jdk-jammy as builder

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

RUN ./gradlew build -x test

# ---

FROM eclipse-temurin:17-jre-jammy

RUN addgroup group; adduser --ingroup group --disabled-password user
USER user

WORKDIR /app

COPY --from=builder /app/build/libs/todo-service-*.jar /app/todo-service.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app/todo-service.jar ${0} ${@}"]
