package de.stphngrtz.konphite.todo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ItemRepository : CrudRepository<Item, String>
