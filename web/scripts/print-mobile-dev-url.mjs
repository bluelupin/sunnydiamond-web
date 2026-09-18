import { networkInterfaces } from "node:os";

const port = process.env.PORT?.trim() || "3000";

function getLanIpv4Addresses() {
  const addresses = [];

  for (const [interfaceName, nets] of Object.entries(networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family !== "IPv4" || net.internal) {
        continue;
      }

      addresses.push({
        interfaceName,
        address: net.address,
      });
    }
  }

  return addresses;
}

const addresses = getLanIpv4Addresses();
const wifiLike = addresses.filter(({ address, interfaceName }) => {
  const name = interfaceName.toLowerCase();
  return (
    address.startsWith("192.168.") ||
    address.startsWith("10.") ||
    name.includes("wi-fi") ||
    name.includes("wifi") ||
    name.includes("wlan")
  );
});

const recommended = wifiLike.length > 0 ? wifiLike : addresses;

console.log("\nMobile dev access (same Wi-Fi as this PC):");
if (recommended.length === 0) {
  console.log("  No LAN IPv4 found. Connect to Wi-Fi, then run ipconfig.");
} else {
  for (const { address, interfaceName } of recommended) {
    console.log(`  http://${address}:${port}  (${interfaceName})`);
  }
}

console.log("\nNotes:");
console.log("  - Do not open http://0.0.0.0 in the phone browser.");
console.log("  - Prefer the 192.168.x.x address over 172.x.x.x virtual adapters.");
console.log("  - If the page does not load, allow port", port, "in Windows Firewall.\n");
