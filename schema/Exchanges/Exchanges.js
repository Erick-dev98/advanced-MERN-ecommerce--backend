import { db } from "../../connect.js";

// Create Exchanges table
`CREATE TABLE Exchanges (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    VehicleType VARCHAR(100) NOT NULL,
    VehicleId INT NOT NULL,
    NeedForExchanges ENUM('yes', 'no') NOT NULL,
    TotalKmTravelled DECIMAL(10,2),
    KmLastTireChange DECIMAL(10,2),
    ChangeTiresEveryFewKm ENUM('yes', 'no'),
    RunningInWithoutChangingTire ENUM('yes', 'no'),
    NeedToChangeTires ENUM('yes', 'no'),
    KmLastOilChange DECIMAL(10,2),
    ChangeOilEveryFewKm ENUM('yes', 'no'),
    RunningInWithoutOilChange ENUM('yes', 'no'),
    NeedToChangeOil ENUM('yes', 'no'),
    KmLastBrakeChange DECIMAL(10,2),
    ChangeBrakesEveryFewKm ENUM('yes', 'no'),
    RunningInWithoutChangingBrakes ENUM('yes', 'no'),
    NeedToChangeBrakes ENUM('yes', 'no'),
    KmLastFilterChange DECIMAL(10,2),
    ChangeFiltersEveryFewKm VARCHAR(100),
    RunningInWithoutChangingFilter ENUM('yes', 'no'),
    NeedToChangeFilters ENUM('yes', 'no'),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);
`