package de.stphngrtz.konphite.todo

import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class TodoServiceApplication {

    @Bean
    fun init(repository: ItemRepository) = ApplicationRunner {
        if (!repository.existsById("1"))
            repository.save(Item("1", "first example", false))
        if (!repository.existsById("2"))
            repository.save(Item("2", "second example", true))
        if (!repository.existsById("3"))
            repository.save(Item("3", "third example", false))
    }
}

fun main(args: Array<String>) {
    @Suppress("SpreadOperator")
    runApplication<TodoServiceApplication>(*args)
}
