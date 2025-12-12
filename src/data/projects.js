export const projects = [
  {
    id: 1,
    title: "IoT Weather Monitoring System",
    shortDesc: "NodeMCU + DHT11 + Gas Sensor + ThingSpeak",
    image: "https://via.placeholder.com/400x250?text=Weather+Project",
    components: [
      "NodeMCU ESP8266",
      "DHT11 Temperature & Humidity Sensor",
      "MQ-135 Gas Sensor",
      "Jumper Wires",
      "USB Cable"
    ],
    theory:
      "This project monitors temperature, humidity, and air quality using NodeMCU and uploads data to ThingSpeak.",
    circuit:
      "https://via.placeholder.com/400x250?text=Circuit+Diagram", // replace with real image link
    procedure: [
      "Connect DHT11 to NodeMCU",
      "Connect MQ-135 to A0 pin",
      "Configure WiFi credentials in code",
      "Send data to ThingSpeak"
    ],
    code: `// sample Arduino code
void setup() {
  Serial.begin(115200);
}
void loop() {
  Serial.println("Sensor Reading...");
}`,
    applications: [
      "Smart Home Environment Monitoring",
      "Agriculture Monitoring",
      "Weather Stations",
      "Air Quality Monitoring"
    ]
  }
];
