package de.stphngrtz.konphite.todo

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.util.UriComponentsBuilder
import java.util.*

@Controller
@RequestMapping("/items")
class ItemController(private val repository: ItemRepository) {

    companion object { // https://www.baeldung.com/kotlin/logging#companion
        @JvmStatic
        val log: Logger = LoggerFactory.getLogger(ItemController::class.java)
    }

    @GetMapping
    fun getAll(): ResponseEntity<Iterable<Item>> {
        return ResponseEntity.ok(repository.findAll())
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<Item> {
        return repository.findById(id)
            .map { ResponseEntity.ok(it) }
            .orElseGet { ResponseEntity.notFound().build() }
    }

    @PostMapping
    fun create(@RequestBody item: Item, req: HttpServletRequest): ResponseEntity<Error> {
        val exists = item.id?.let { repository.existsById(it) } ?: false
        if (exists) {
            log.warn("unable to create an item, because its id already exists: $item")
            return ResponseEntity
                .badRequest()
                .body(Error("item with id '${item.id}' already exists"))
        }

        val id = item.id ?: UUID.randomUUID().toString()
        val newItem = Item(id, item.subject, item.done)
        log.info("creating new item: $newItem")
        repository.save(newItem)

        return ResponseEntity
            .created(UriComponentsBuilder.fromUriString(req.requestURI).path("/{id}").build(id))
            .build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody item: Item): ResponseEntity<Void> {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }

        repository.save(Item(item.id ?: id, item.subject, item.done))
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        repository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
