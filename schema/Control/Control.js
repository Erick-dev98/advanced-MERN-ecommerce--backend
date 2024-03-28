import { db } from "../../connect.js";

// Create MaintenanceControl table
`CREATE TABLE MaintenanceControl (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Day INT NOT NULL,
    VehicleId INT NOT NULL,
    MaintenanceType ENUM('minor', 'major') NOT NULL,
    Maintenance VARCHAR(255) NOT NULL,
    CausesOfMaintenance TEXT,
    MaintenanceExpenses DECIMAL(10,2),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);
`
// Create FinesControl table
`CREATE TABLE FinesControl (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Month INT NOT NULL,
    Day INT NOT NULL,
    VehicleId INT NOT NULL,
    DriverId INT NOT NULL,
    TrafficViolation INT NOT NULL,
    ExpensesWithFines DECIMAL(10,2),
    Detailing TEXT,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id),
    FOREIGN KEY (DriverId) REFERENCES Drivers(Id),
    FOREIGN KEY (TrafficViolation) REFERENCES TypesOfInfringement(Id)
);
`
// Create FinancialControl table
`CREATE TABLE FinancialControl (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    RevenueSourceId INT,
    MarketingExpenses DECIMAL(10,2),
    PersonalExpenses DECIMAL(10,2),
    OperationalExpenses DECIMAL(10,2),
    OtherExpenses DECIMAL(10,2),
    Total DECIMAL(10,2),    
);
`

