package me.zwsmith.plugins.database

import io.ktor.server.application.Application
import org.jetbrains.exposed.sql.Database

fun Application.connectToDatabase(embedded: Boolean = true): Database {
    if (embedded) {
        return Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
            user = "root",
            driver = "org.h2.Driver",
            password = "",
        )
    } else {
        val url = environment.config.property("postgres.url").getString()
        val user = environment.config.property("postgres.user").getString()
        val password = environment.config.property("postgres.password").getString()
        return Database.connect(
            url = url,
            user = user,
            password = password,
        )
    }
}