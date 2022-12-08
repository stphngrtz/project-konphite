package de.stphngrtz.konphite.todo

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import java.util.*

@Controller
@RequestMapping("/items")
class ItemController {

    companion object { // https://www.baeldung.com/kotlin/logging#companion
        @JvmStatic
        val log: Logger = LoggerFactory.getLogger(ItemController::class.java)
    }

    private val items = arrayListOf(
        Item("1", "first example", false),
        Item("2", "second example", true),
        Item("3", "third example", false)
    )

    @GetMapping
    fun getAll(): ResponseEntity<List<Item>> {
        return ResponseEntity.ok(items)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<Item> {
        val item = items.find { it.id == id }
        return if (item == null) ResponseEntity.notFound().build() else ResponseEntity.ok(item)
    }

    @PostMapping
    fun create(@RequestBody item: Item, req: HttpServletRequest): ResponseEntity<Error> {
        val alreadyExistingItem = item.id.let { id -> items.find { it.id == id } }
        if (alreadyExistingItem != null) {
            log.warn("unable to create an item, because its id already exists: $item")
            return ResponseEntity
                .badRequest()
                .body(Error("item with id '${alreadyExistingItem.id}' already exists"))
        }

        val id = item.id ?: UUID.randomUUID().toString()
        val newItem = Item(id, item.subject, item.done)
        log.info("creating new item: $newItem")
        items.add(newItem)

        return ResponseEntity
            .created(UriComponentsBuilder.fromUriString(req.requestURI).path("/{id}").build(id))
            .build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody item: Item): ResponseEntity<Void> {
        val index = items.indexOfFirst { it.id == id }
        if (index == -1)
            return ResponseEntity.notFound().build()

        items[index] = Item(item.id ?: id, item.subject, item.done)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        items.removeAll { it.id == id }
        return ResponseEntity.noContent().build()
    }
}