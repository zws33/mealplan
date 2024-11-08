package me.zwsmith.mealplan

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform