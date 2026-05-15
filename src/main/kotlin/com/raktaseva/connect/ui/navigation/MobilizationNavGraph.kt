package com.raktaseva.connect.ui.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.raktaseva.connect.ui.screens.BroadcastResultsScreen
import com.raktaseva.connect.ui.screens.SelectionScreen
import com.raktaseva.connect.ui.screens.UploadScreen
import com.raktaseva.connect.viewmodel.MobilizationViewModel

sealed class Screen(val route: String) {
    object Upload : Screen("upload")
    object Selection : Screen("selection")
    object Broadcast : Screen("broadcast")
}

@Composable
fun MobilizationNavGraph(
    viewModel: MobilizationViewModel = viewModel()
) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Upload.route
    ) {
        composable(Screen.Upload.route) {
            UploadScreen(
                viewModel = viewModel,
                onNext = { navController.navigate(Screen.Selection.route) }
            )
        }
        composable(Screen.Selection.route) {
            SelectionScreen(
                viewModel = viewModel,
                onGenerate = { navController.navigate(Screen.Broadcast.route) }
            )
        }
        composable(Screen.Broadcast.route) {
            BroadcastResultsScreen(
                viewModel = viewModel,
                onFinish = { 
                    // Pop back to start or navigate to home
                    navController.popBackStack(Screen.Upload.route, inclusive = false)
                }
            )
        }
    }
}
