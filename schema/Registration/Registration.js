import { db } from "../../connect.js";

// Create Fleet Table
`CREATE TABLE Fleet (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    VehicleType VARCHAR(100) NOT NULL,
    VehicleBrand VARCHAR(100) NOT NULL,
    LicensePlate VARCHAR(20) NOT NULL,
    MaxPermissibleLoad DECIMAL(10,2) NOT NULL,
    InitialOdometerReading DECIMAL(10,2) NOT NULL,
    Color VARCHAR(50),
    Year INT NOT NULL,
    Fees DECIMAL(10,2),
    Insurance DECIMAL(10,2),
    MaintenanceExpenses DECIMAL(10,2),
    VehicleId INT,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);
`

// Create Vehicles Table
`CREATE TABLE Vehicles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IsBus BOOLEAN DEFAULT FALSE,
    IsTruck BOOLEAN DEFAULT FALSE,
    IsVan BOOLEAN DEFAULT FALSE,
    IsCar BOOLEAN DEFAULT FALSE,
    IsMotorcycle BOOLEAN DEFAULT FALSE,
    IsSUV BOOLEAN DEFAULT FALSE,
    IsOther BOOLEAN DEFAULT FALSE,
    Comments TEXT
);
`
// Create Drivers Table
`CREATE TABLE Drivers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address TEXT,
    Telephone VARCHAR(20),
    Identity VARCHAR(50),
    LicenseQualification VARCHAR(100),
    NumberOfFines INT,
    LostPoints INT,
    FinesValue DECIMAL(10,2)
);
`
// Create Workshop Table
`CREATE TABLE Workshop (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    WorkshopName VARCHAR(255) NOT NULL,
    Address TEXT,
    Telephone VARCHAR(20),
    Phone2 VARCHAR(20),
    Contact VARCHAR(255)
);
`
// Create MaintenaceType table
`CREATE TABLE MaintenanceType (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    MinorMaintenance VARCHAR(100),
    MajorMaintenance VARCHAR(100)
);
`
// Create MinorMaintenance services table
`CREATE TABLE MinorMaintenanceServices (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OilChange BOOLEAN DEFAULT FALSE,
    TireRotation BOOLEAN DEFAULT FALSE,
    WheelAlignment BOOLEAN DEFAULT FALSE,
    BrakeInspection BOOLEAN DEFAULT FALSE,
    FluidChecks BOOLEAN DEFAULT FALSE,
    AirFilterReplacements BOOLEAN DEFAULT FALSE,
    BatteryMaintenance BOOLEAN DEFAULT FALSE,
    SparkPlugReplacement BOOLEAN DEFAULT FALSE,
    CabinAirFilterReplacement BOOLEAN DEFAULT FALSE,
    HeadlightTaillightBulbReplacement BOOLEAN DEFAULT FALSE
);
`

// Create MajorMaintenance services table
`CREATE TABLE MajorMaintenanceServices (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TimingBeltReplacements BOOLEAN DEFAULT FALSE,
    TransmissionServices BOOLEAN DEFAULT FALSE,
    CoolantSystemFlush BOOLEAN DEFAULT FALSE,
    FuelSystemCleaning BOOLEAN DEFAULT FALSE,
    BrakeSystemRepairs BOOLEAN DEFAULT FALSE,
    EngineTuneUp BOOLEAN DEFAULT FALSE,
    ExhaustSystemRepairs BOOLEAN DEFAULT FALSE,
    EngineOverhaul BOOLEAN DEFAULT FALSE,
    ElectricalSystemRepairs BOOLEAN DEFAULT FALSE
);
`
// Create SupplyStations table
`CREATE TABLE SupplyStations (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    GasStation VARCHAR(255),
    PowerStation VARCHAR(255),
    Address TEXT,
    Telephone VARCHAR(20),
    Phone2 VARCHAR(20),
    Contact VARCHAR(255)
);`

// Create Causes of Defect table 
`CREATE TABLE CausesOfDefect (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    LackOfMaintenance BOOLEAN DEFAULT FALSE,
    Accident BOOLEAN DEFAULT FALSE,
    FlatTire BOOLEAN DEFAULT FALSE,
    LackOfExchange BOOLEAN DEFAULT FALSE
);
`
// Create TypesOfFuels tables
`CREATE TABLE TypesOfFuels (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    VehicleId INT,
    Gasoline BOOLEAN DEFAULT FALSE,
    Diesel BOOLEAN DEFAULT FALSE,
    NaturalGas BOOLEAN DEFAULT FALSE,
    Others BOOLEAN DEFAULT FALSE
);
`
// Create TypesOfInfringement
`CREATE TABLE TypesOfInfringement (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Light BOOLEAN DEFAULT FALSE,
    Average BOOLEAN DEFAULT FALSE,
    Serious BOOLEAN DEFAULT FALSE,
    VerySerious BOOLEAN DEFAULT FALSE
);
`
// Create Insurance table
`CREATE TABLE Insurance (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PolicyNumber VARCHAR(100) NOT NULL,
    Provider VARCHAR(255) NOT NULL,
    InsuranceType VARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    VehicleId INT NOT NULL,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id),
    FOREIGN KEY (InsuranceTypeId) REFERENCES InsuranceTypes(Id)
);
`
// Create InsuranceTypes table
`CREATE TABLE InsuranceTypes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Comprehensive BOOLEAN DEFAULT FALSE,
    Liability BOOLEAN DEFAULT FALSE,
    Collision BOOLEAN DEFAULT FALSE,
    PersonalInjuryProtection BOOLEAN DEFAULT FALSE,
    UninsuredMotoristCoverage BOOLEAN DEFAULT FALSE,
    UnderinsuredMotoristCoverage BOOLEAN DEFAULT FALSE,
    PropertyDamageLiability BOOLEAN DEFAULT FALSE,
    MedicalPaymentsCoverage BOOLEAN DEFAULT FALSE,
    RentalReimbursementCoverage BOOLEAN DEFAULT FALSE,
    RoadsideAssistanceCoverage BOOLEAN DEFAULT FALSE,
    FireDamageCoverage BOOLEAN DEFAULT FALSE
);
`



