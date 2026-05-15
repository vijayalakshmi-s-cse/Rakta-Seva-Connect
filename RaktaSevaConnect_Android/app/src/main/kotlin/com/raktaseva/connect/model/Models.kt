package com.raktaseva.connect.model

import java.util.UUID

enum class BloodGroup(val label: String) {
    APLUS("A+"), AMINUS("A-"),
    BPLUS("B+"), BMINUS("B-"),
    ABPLUS("AB+"), ABMINUS("AB-"),
    OPLUS("O+"), OMINUS("O-")
}

data class BloodRequest(
    val id: String = UUID.randomUUID().toString(),
    val patientName: String = "",
    val phoneNumber: String = "",
    val bloodGroup: BloodGroup? = null,
    val hospitalName: String = "",
    val location: String = "",
    val unitsRequired: Int = 1,
    val isEmergency: Boolean = true,
    val timestamp: String = "",
    val status: String = "pending",
    val requesterType: String = "Patient"
)

data class BroadcastContent(
    val platform: String,
    val text: String,
    val iconResId: Int? = null // Placeholder for platform icons
)
