package com.raktaseva.connect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.raktaseva.connect.viewmodel.MobilizationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BroadcastResultsScreen(
    viewModel: MobilizationViewModel,
    onFinish: () -> Unit
) {
    val contents by viewModel.broadcastContents.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ready to Broadcast", fontWeight = FontWeight.Bold) },
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
                .padding(24.dp)
        ) {
            Text(
                "Copy and share these pre-formatted messages to reach maximum donors via social networks.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                modifier = Modifier.padding(bottom = 20.dp)
            )

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(contents) { item ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, gap = 8.dp) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .background(Color(0xFFE53935), RoundedCornerShape(4.dp))
                                    )
                                    Text(
                                        text = item.platform,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.Black,
                                        fontSize = 14.sp
                                    )
                                }
                                Row {
                                    IconButton(onClick = { /* Copy to clipboard */ }) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                                    }
                                    IconButton(onClick = { /* Share API */ }) {
                                        Icon(Icons.Default.Share, contentDescription = null, tint = Color(0xFFE53935), modifier = Modifier.size(20.dp))
                                    }
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color.White, RoundedCornerShape(12.dp))
                                    .padding(12.dp)
                            ) {
                                Text(
                                    text = item.text,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 12.sp,
                                    lineHeight = 18.sp,
                                    color = Color.DarkGray
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = onFinish,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE53935)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("Broadcast Complete", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Icon(Icons.Default.CheckCircle, contentDescription = null, Modifier.padding(start = 8.dp))
            }
        }
    }
}
