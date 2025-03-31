// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecordManagement {
    struct MedicalRecord {
        string ipfsCID; // IPFS Content Identifier (CID) for off-chain storage
        address owner; // Patient's address
        bool exists;
    }
    
    // Each patient (address) can have a list of Medical Records
    // List of patient addresses that the doctor (address) has access to
    mapping(address => MedicalRecord[]) private patientRecords;
    mapping(address => mapping(address => bool)) private accessPermissions; // patient => (doctor => access granted)
    
    event RecordAdded(address indexed patient, string ipfsCID);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    
    // Only patients can manage access
    modifier onlyPatient() {
        require(patientRecords[msg.sender].length > 0, "Only a patient can perform this action");
        _;
    }
    
    function addMedicalRecord(string memory _ipfsCID) public {
        patientRecords[msg.sender].push(MedicalRecord(_ipfsCID, msg.sender, true));
        emit RecordAdded(msg.sender, _ipfsCID);
    }
    
    function grantAccess(address _doctor) public onlyPatient {
        accessPermissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }
    
    function revokeAccess(address _doctor) public onlyPatient {
        accessPermissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    // Checks if the doctor/caller has the permission to get the medical
    function getMedicalRecords(address _patient) public view returns (MedicalRecord[] memory) {
        require(accessPermissions[_patient][msg.sender], "Access denied");
        return patientRecords[_patient];
    }
}