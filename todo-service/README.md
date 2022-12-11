# TODO Service
A simple CRUD service for todo list items.

```bash
# build and run executable jar
./gradlew build
java -jar build/libs/todo-service-0.0.1-SNAPSHOT.jar

# spring boot run task
./gradlew bootRun

# create Docker image
docker build -f src/main/docker/Dockerfile -t konphite/todo-service .

# run Docker container
docker run --name todo-service -d -p 8080:8080 konphite/todo-service

# run Docker container from ghcr.io
docker run --name todo-service -d -p 8080:8080 ghcr.io/stphngrtz/konphite/todo-service:latest
```

See `requests.http` for example requests.
