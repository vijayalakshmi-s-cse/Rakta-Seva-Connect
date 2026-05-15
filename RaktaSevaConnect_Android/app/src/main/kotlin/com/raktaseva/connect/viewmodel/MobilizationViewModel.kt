package com.raktaseva.connect.viewmodel

import androidx.lifecycle.ViewModel
import com.raktaseva.connect.model.BloodGroup
import com.raktaseva.connect.model.BloodRequest
import com.raktaseva.connect.model.BroadcastContent
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class MobilizationViewModel : ViewModel() {

    private val _requestState = MutableStateFlow(BloodRequest())
    val requestState: StateFlow<BloodRequest> = _requestState.asStateFlow()

    private val _broadcastContents = MutableStateFlow<List<BroadcastContent>>(emptyList())
    val broadcastContents: StateFlow<List<BroadcastContent>> = _broadcastContents.asStateFlow()

    private val _selectedImageUri = MutableStateFlow<String?>(null)
    val selectedImageUri: StateFlow<String?> = _selectedImageUri.asStateFlow()

    fun updatePatientName(name: String) {
        _requestState.update { it.copy(patientName = name) }
    }

    fun updatePhone(phone: String) {
        _requestState.update { it.copy(phoneNumber = phone) }
    }

    fun updateBloodGroup(group: BloodGroup) {
        _requestState.update { it.copy(bloodGroup = group) }
    }

    fun updateHospital(hospital: String) {
        _requestState.update { it.copy(hospitalName = hospital) }
    }

    fun updateLocation(location: String) {
        _requestState.update { it.copy(location = location) }
    }

    fun updateUnits(units: Int) {
        _requestState.update { it.copy(unitsRequired = units) }
    }

    fun setImageUri(uri: String?) {
        _selectedImageUri.value = uri
    }

    fun generateBroadcasts() {
        val req = _requestState.value
        val group = req.bloodGroup?.label ?: "Unknown"
        
        val whatsappText = """
            🔴 *URGENT BLOOD REQUIREMENT!*
            
            *Patient:* ${req.patientName}
            *Blood Group:* $group
            *Units Needed:* ${req.unitsRequired}
            *Hospital:* ${req.hospitalName}
            *Location:* ${req.location}
            
            *Contact:* ${req.phoneNumber}
            
            Please share this as a status and help save a life! 
            #RaktaSeva #BloodDonation #SaveALife
        """.trimIndent()

        val instagramText = """
            🚨 EMERGENCY ALERT 🚨
            
            Needs: $group Blood
            Where: ${req.hospitalName}
            ${req.unitsRequired} Units Required immediately.
            
            Contact ${req.phoneNumber} to help.
            
            #RaktaSeva #SaveALife #BloodGroup #$group
        """.trimIndent()

        val xText = """
            🆘 URGENT: $group blood needed for ${req.patientName} at ${req.hospitalName}, ${req.location}. 
            ${req.unitsRequired} units required. 
            Contact ${req.phoneNumber}. 
            
            Retweet to help! 
            #RaktaSeva #BloodNeeded #$group #DonateBlood
        """.trimIndent()

        val telegramText = """
            📢 *BLOOD REQUIREMENT ALERT*
            
            *Group:* $group
            *Hospital:* ${req.hospitalName}
            *Patient:* ${req.patientName}
            *Contact:* ${req.phoneNumber}
            
            Join our mission to connect donors.
            #RaktaSeva
        """.trimIndent()

        _broadcastContents.value = listOf(
            BroadcastContent("WhatsApp Status", whatsappText),
            BroadcastContent("Instagram Stories", instagramText),
            BroadcastContent("X (Twitter)", xText),
            BroadcastContent("Telegram / SMS", telegramText)
        )
    }
}
