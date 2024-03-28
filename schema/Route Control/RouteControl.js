import { db } from "../../connect.js";

// Create RouteControl table
`CREATE TABLE RouteControl (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Year INT NOT NULL,
    Day DATE NOT NULL,
    VehicleId INT NOT NULL,
    Revenues DECIMAL(10,2),
    TollExpenses DECIMAL(10,2),
    SpendingOnMeals DECIMAL(10,2),
    GasStationId INT,
    FuelType VARCHAR(50),
    FuelExpenditure DECIMAL(10,2),
    Litres DECIMAL(10,2),
    WeightOfTransportedCargo DECIMAL(10,2),
    InitialOdometerReading DECIMAL(10,2),
    FinalOdometerReading DECIMAL(10,2),
    TotalCoveredKms DECIMAL(10,2),
    OtherCosts DECIMAL(10,2),
    DriverId INT NOT NULL,
    Source VARCHAR(255),
    Destination VARCHAR(255),
    TravelMadeOnTime ENUM('yes', 'no'),
    KilometersPerLiter DECIMAL(10,2),
    CostPerKilometer DECIMAL(10,2),
    TotalCosts DECIMAL(10,2),
    Notes TEXT,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id),
    FOREIGN KEY (GasStationId) REFERENCES GasStations(Id),
    FOREIGN KEY (DriverId) REFERENCES Drivers(Id)
);
`