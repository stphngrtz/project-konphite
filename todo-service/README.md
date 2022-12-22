# TODO Service
A simple CRUD service for todo list items.

```bash
# prerequisite: redis
docker run --name redis -d -p 6379:6379 redis:7

# build and run executable jar
../gradlew :todo-service:build
java -jar build/libs/todo-service-0.0.1-SNAPSHOT.jar

# spring boot run task
../gradlew :todo-service:bootRun

# create Docker image
docker build -f src/main/docker/Dockerfile -t konphite/todo-service .

# run Docker container
docker run --name todo-service -d -p 8080:8080 konphite/todo-service

# run Docker container from ghcr.io
docker run --name todo-service -d -p 8080:8080 ghcr.io/stphngrtz/konphite/todo-service:latest
```

See `requests.http` for example requests.

## Troubleshooting
### Testcontainers with Colima
The integration test makes use of [Testcontainers](https://www.testcontainers.org/) to launch up a Redis instance. If you are on macOS and use [Colima](https://github.com/abiosoft/colima) as Docker runtime, this probably won't work out-of-the-box. You might get one of the following exceptions: 

```
java.lang.IllegalStateException: Could not find a valid Docker environment. Please see logs and check configuration
```

```
com.github.dockerjava.api.exception.NotFoundException: Status 404: {"message":"No such container: ded138..."}
```

To fix this, you need to set the following environment variables:

```bash
export DOCKER_HOST="unix://${HOME}/.colima/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
```

See [testcontainers issue #5034](https://github.com/testcontainers/testcontainers-java/issues/5034) for more details.
