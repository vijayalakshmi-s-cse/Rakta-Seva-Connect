package com.raktaseva.connect.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFFE53935),
    onPrimary = Color.White,
    secondary = Color(0xFFFB8C00),
    onSecondary = Color.White,
    background = Color.White,
    surface = Color(0xFFFDECEA),
    onSurface = Color.Black,
    error = Color(0xFFD32F2F),
)

@Composable
fun RaktaSevaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Force light theme for brand consistency as requested
    val colorScheme = LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
