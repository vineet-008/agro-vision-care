/*
 * Smart Sprinkler Controller - Sequence Control Version
 * Controls pump (pin 8) and solenoid valve (pin 7) via serial commands
 * Uses active LOW relays (HIGH = OFF, LOW = ON)
 * 
 * Commands:
 * '1' - Start treatment sequence: Valve ON for 5s, then Valve OFF + Pump ON continuously
 * '0' - Stop all: Turn both valve and pump OFF
 */

const int SOLENOID_PIN = 7;
const int PUMP_PIN = 8;

void setup() {
  Serial.begin(9600);

  pinMode(SOLENOID_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);

  // Initialize relays OFF (HIGH for active LOW)
  digitalWrite(SOLENOID_PIN, HIGH);
  digitalWrite(PUMP_PIN, HIGH);

  Serial.println("--- Solenoid and Pump Control ---");
  Serial.println("Enter '1' to turn valve ON for 5s, then pump ON continuously.");
  Serial.println("Enter '0' to turn both OFF.");
  Serial.println("---------------------------------");
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    if (command == '1') {
      Serial.println("Valve ON for 5 seconds...");
      digitalWrite(SOLENOID_PIN, LOW);  // Valve ON (active LOW)
      digitalWrite(PUMP_PIN, HIGH);     // Pump OFF
      
      delay(5000);                      // Wait 5 seconds
      
      Serial.println("Valve OFF, Pump ON continuously.");
      digitalWrite(SOLENOID_PIN, HIGH); // Valve OFF (active LOW)
      digitalWrite(PUMP_PIN, LOW);      // Pump ON (active LOW)
      
    } else if (command == '0') {
      Serial.println("Turning both OFF...");
      digitalWrite(SOLENOID_PIN, HIGH); // Valve OFF (active LOW)
      digitalWrite(PUMP_PIN, HIGH);     // Pump OFF (active LOW)
    }
  }
}