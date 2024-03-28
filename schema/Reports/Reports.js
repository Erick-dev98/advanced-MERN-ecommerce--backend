import { db } from "../../connect.js";

// Create CashFlowReports Table 
`CREATE TABLE CashFlowReports (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    Revenues DECIMAL(10,2) DEFAULT 0,
    FuelExpenditures DECIMAL(10,2) DEFAULT 0,
    TollExpenses DECIMAL(10,2) DEFAULT 0,
    SpendingOnMeals DECIMAL(10,2) DEFAULT 0,
    MaintenanceExpenses DECIMAL(10,2) DEFAULT 0,
    ExpensesWithFines DECIMAL(10,2) DEFAULT 0,
    OtherCosts DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2) DEFAULT 0
);
`
// Create ExpensesWithCategories table
`CREATE TABLE ExpensesWithCategories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    VehicleCategory ENUM('Car', 'Truck', 'Van', 'Motorcycle', 'Bus', 'SUV', 'Other') NOT NULL,
    Total DECIMAL(10,2) NOT NULL,
    VehicleId INT,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);
`

// Create Top15Maintenance table
`CREATE TABLE Top15Maintenance (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Maintenance VARCHAR(255) NOT NULL,
    MaintenanceType VARCHAR(255) NOT NULL,
    Amount INT NOT NULL,
    Value DECIMAL(10,2) NOT NULL
);
`
// Create Top15CausesOfMaintenance table
`CREATE TABLE Top15CausesOfMaintenance (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CauseOfMaintenance VARCHAR(255) NOT NULL,
    Occurrences INT NOT NULL
);
`

// Create Logistics table
`CREATE TABLE Logistics (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Trips INT NOT NULL,
    OnTime ENUM('yes', 'no') NOT NULL,
    OutOfTime ENUM('yes', 'no') NOT NULL,
    KmsRun DECIMAL(10, 2) NOT NULL,
    KmsPerLiter DECIMAL(10, 2) NOT NULL,
    KmsPerTrip DECIMAL(10, 2) NOT NULL,
    KmsForMaintenance DECIMAL(10, 2) NOT NULL,
    AverageTransportedWeight DECIMAL(10, 2) NOT NULL,
    AverageSpendPerTrip DECIMAL(10, 2) NOT NULL,
    RevenuePerKm DECIMAL(10, 2) NOT NULL,
    CostPerKm DECIMAL(10, 2) NOT NULL,
    Total DECIMAL(10, 2) NOT NULL
);
`
// Create IndividualReports table
`CREATE TABLE IndividualReports (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Revenues DECIMAL(10, 2) NOT NULL,
    FuelExpenditures DECIMAL(10, 2) NOT NULL,
    Liters DECIMAL(10, 2) NOT NULL,
    ExpensesWithFines DECIMAL(10, 2) NOT NULL,
    MaintenanceExpenses DECIMAL(10, 2) NOT NULL,
    KmsRun DECIMAL(10, 2) NOT NULL,
    Trips INT NOT NULL,
    KmsPerTrip DECIMAL(10, 2) NOT NULL,
    KmsPerLiter DECIMAL(10, 2) NOT NULL,
    Total DECIMAL(10, 2) NOT NULL
);
`
// CreateDrivers reports table
`CREATE TABLE DriversReports (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Revenues DECIMAL(10, 2) NOT NULL,
    KmsRun DECIMAL(10, 2) NOT NULL,
    RevenuePerKm DECIMAL(10, 2) NOT NULL,
    Trips INT NOT NULL,
    OnTime INT NOT NULL,
    OutOfTime INT NOT NULL,
    TravelRevenue DECIMAL(10, 2) NOT NULL,
    Fines DECIMAL(10, 2) NOT NULL,
    KmsRunByFine DECIMAL(10, 2) NOT NULL,
    ExpensesWithFines DECIMAL(10, 2) NOT NULL
);
`