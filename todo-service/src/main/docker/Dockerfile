FROM eclipse-temurin:17-jre-jammy

RUN addgroup group; adduser --ingroup group --disabled-password user
USER user

WORKDIR /app

COPY build/libs/todo-service-*.jar /app/todo-service.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app/todo-service.jar ${0} ${@}"]
