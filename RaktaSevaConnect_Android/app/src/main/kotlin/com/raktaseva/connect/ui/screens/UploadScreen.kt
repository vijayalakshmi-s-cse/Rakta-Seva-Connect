package com.raktaseva.connect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.raktaseva.connect.viewmodel.MobilizationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UploadScreen(
    viewModel: MobilizationViewModel,
    onNext: () -> Unit
) {
    val selectedUri by viewModel.selectedImageUri.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Donor Mobilization", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Color(0xFFE53935)
                )
            )
        },
        containerColor = Color.White
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Text(
                text = "Upload Requirement",
                style = MaterialTheme.typography.headlineSmall,
                color = Color.Black,
                fontWeight = FontWeight.ExtraBold
            )
            
            Text(
                text = "Upload the hospital request document or a blood requirement flyer to verify the urgency.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
                    .background(Color(0xFFFDECEA), RoundedCornerShape(24.dp))
                    .border(2.dp, Color(0xFFE53935), RoundedCornerShape(24.dp))
                    .clickable { 
                        // In a real app, this would trigger image picker
                        viewModel.setImageUri("content://media/external/images/media/123")
                    },
                contentAlignment = Alignment.Center
            ) {
                if (selectedUri == null) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CloudUpload,
                            contentDescription = "Upload",
                            tint = Color(0xFFE53935),
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            "Tap to upload Flyer / Document",
                            color = Color(0xFFE53935),
                            fontWeight = FontWeight.Bold
                        )
                    }
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Uploaded",
                            tint = Color.Green,
                            modifier = Modifier.size(48.dp)
                        )
                        Text(
                            "Document Uploaded Successfully",
                            color = Color.Black,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            "tap to change",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.Gray
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = onNext,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE53935)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("Next: Select Target", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Icon(Icons.Default.ArrowForward, contentDescription = null, Modifier.padding(start = 8.dp))
            }
        }
    }
}
