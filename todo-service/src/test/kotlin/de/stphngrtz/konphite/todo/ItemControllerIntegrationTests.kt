package de.stphngrtz.konphite.todo

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.util.*

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ItemControllerIntegrationTests(@Autowired val restTemplate: TestRestTemplate) {

    @Test
    fun `get all items`() {
        val response = restTemplate.exchange(
            "/items",
            HttpMethod.GET,
            null,
            object :
                ParameterizedTypeReference<List<Item>>() {} // https://kotlinlang.org/docs/nested-classes.html#anonymous-inner-classes
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(3, response.body?.size)
    }

    @Test
    fun `get existing item`() {
        val response = restTemplate.getForEntity("/items/1", Item::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun `get not existing item`() {
        val response = restTemplate.getForEntity("/items/${UUID.randomUUID()}", Item::class.java)
        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
    }

    @Test
    fun `create item without id`() {
        val postResponse = restTemplate.postForEntity("/items", Item(null, "create!", true), Void::class.java)
        assertEquals(HttpStatus.CREATED, postResponse.statusCode)

        val location = postResponse.headers["Location"]!![0]
        val getResponse = restTemplate.getForEntity(location, Item::class.java)
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        assertEquals("create!", getResponse.body!!.subject)

        restTemplate.delete(location) // cleanup
    }

    @Test
    fun `create item with new id`() {
        val id = UUID.randomUUID().toString()
        val postResponse = restTemplate.postForEntity("/items", Item(id, "create!", true), Void::class.java)
        assertEquals(HttpStatus.CREATED, postResponse.statusCode)
        assertEquals("/items/$id", postResponse.headers["Location"]!![0])

        val getResponse = restTemplate.getForEntity("/items/$id", Item::class.java)
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        assertEquals("create!", getResponse.body!!.subject)

        restTemplate.delete("/items/$id") // cleanup
    }

    @Test
    fun `create item with already existing id`() {
        val response = restTemplate.postForEntity("/items", Item("3", "create!", true), Error::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("item with id '3' already exists", response.body!!.details)
    }

    @Test
    fun `update existing item`() {
        val item = restTemplate.getForEntity("/items/1", Item::class.java).body!!

        val putResponse = restTemplate.exchange(
            "/items/1",
            HttpMethod.PUT,
            HttpEntity(Item("1", "update!", true)),
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, putResponse.statusCode)

        val getResponse = restTemplate.getForEntity("/items/1", Item::class.java)
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        assertEquals("update!", getResponse.body!!.subject)

        restTemplate.put("/items/1", item) // cleanup
    }

    @Test
    fun `update existing item without id`() {
        val item = restTemplate.getForEntity("/items/1", Item::class.java).body!!

        val putResponse = restTemplate.exchange(
            "/items/1",
            HttpMethod.PUT,
            HttpEntity(Item(null, "update!", true)),
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, putResponse.statusCode)

        val getResponse = restTemplate.getForEntity("/items/1", Item::class.java)
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        assertEquals("1", getResponse.body!!.id)
        assertEquals("update!", getResponse.body!!.subject)

        restTemplate.put("/items/1", item) // cleanup
    }

    @Test
    fun `update not existing item`() {
        val id = UUID.randomUUID().toString()
        val response = restTemplate.exchange(
            "/items/$id",
            HttpMethod.PUT,
            HttpEntity(Item(id, "update!", true)),
            Void::class.java
        )
        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
    }

    @Test
    fun `delete existing item`() {
        val item = restTemplate.getForEntity("/items/1", Item::class.java).body!!

        val deleteResponse = restTemplate.exchange(
            "/items/1",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.statusCode)
        val getResponse = restTemplate.getForEntity("/items/1", Item::class.java)
        assertEquals(HttpStatus.NOT_FOUND, getResponse.statusCode)

        restTemplate.postForEntity("/items", item, Void::class.java) // cleanup
    }

    @Test
    fun `delete not existing item`() {
        val response = restTemplate.exchange(
            "/items/${UUID.randomUUID()}",
            HttpMethod.DELETE,
            null,
            Void::class.java
        )
        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
    }
}
