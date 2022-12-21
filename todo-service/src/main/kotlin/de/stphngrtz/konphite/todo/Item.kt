package de.stphngrtz.konphite.todo

import org.springframework.data.redis.core.RedisHash

@RedisHash("Item")
data class Item(val id: String?, val subject: String, val done: Boolean)
