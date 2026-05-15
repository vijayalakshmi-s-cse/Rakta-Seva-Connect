package com.raktaseva.connect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.raktaseva.connect.model.BloodGroup
import com.raktaseva.connect.viewmodel.MobilizationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectionScreen(
    viewModel: MobilizationViewModel,
    onGenerate: () -> Unit
) {
    val request by viewModel.requestState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Select Target Donors", fontWeight = FontWeight.Bold) },
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
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Blood Group Selection
            Text(
                "Required Blood Group",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.height(140.dp)
            ) {
                items(BloodGroup.values()) { group ->
                    val isSelected = request.bloodGroup == group
                    Box(
                        modifier = Modifier
                            .aspectRatio(1f)
                            .background(
                                color = if (isSelected) Color(0xFFE53935) else Color(0xFFFDECEA),
                                shape = RoundedCornerShape(16.dp)
                            )
                            .clickable { viewModel.updateBloodGroup(group) },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = group.label,
                            color = if (isSelected) Color.White else Color(0xFFE53935),
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp
                        )
                    }
                }
            }

            // Patient Name & Hospital
            OutlinedTextField(
                value = request.patientName,
                onValueChange = { viewModel.updatePatientName(it) },
                label = { Text("Patient Name") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFE53935),
                    focusedLabelColor = Color(0xFFE53935)
                )
            )

            OutlinedTextField(
                value = request.hospitalName,
                onValueChange = { viewModel.updateHospital(it) },
                label = { Text("Hospital Name") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFE53935),
                    focusedLabelColor = Color(0xFFE53935)
                )
            )

            // Location Section
            Text(
                "Geographic Region",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )

            OutlinedTextField(
                value = request.location,
                onValueChange = { viewModel.updateLocation(it) },
                label = { Text("Specific City/Region") },
                placeholder = { Text("e.g. Bangalore, Indiranagar") },
                leadingIcon = { Icon(Icons.Default.Map, contentDescription = null, tint = Color(0xFFE53935)) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFE53935),
                    focusedLabelColor = Color(0xFFE53935)
                )
            )

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = {
                    viewModel.generateBroadcasts()
                    onGenerate()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE53935)),
                shape = RoundedCornerShape(16.dp),
                enabled = request.bloodGroup != null && request.patientName.isNotBlank()
            ) {
                Text("Generate High-Urgency Alerts", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Icon(Icons.Default.Send, contentDescription = null, Modifier.padding(start = 8.dp))
            }
        }
    }
}
