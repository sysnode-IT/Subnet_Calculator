// Subnet Calculator - Main Logic

function calculateSubnet() {
    // Get input values
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const cidr = parseInt(document.getElementById('subnetMask').value);

    // Validate inputs
    if (!validateIP(ipAddress)) {
        showError('Please enter a valid IP address (e.g., 192.168.1.0)');
        return;
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        showError('Please enter a valid CIDR notation (0-32)');
        return;
    }

    // Hide any previous errors
    hideError();

    // Perform calculations
    const ipParts = ipAddress.split('.').map(Number);
    const subnetMask = cidrToMask(cidr);
    const maskParts = subnetMask.split('.').map(Number);

    // Calculate network address
    const networkParts = ipParts.map((octet, i) => octet & maskParts[i]);
    const networkAddress = networkParts.join('.');

    // Calculate broadcast address
    const wildcardParts = maskParts.map(octet => 255 - octet);
    const broadcastParts = networkParts.map((octet, i) => octet | wildcardParts[i]);
    const broadcastAddress = broadcastParts.join('.');

    // Calculate first and last usable host
    const firstHostParts = [...networkParts];
    firstHostParts[3] += 1;
    const firstHost = firstHostParts.join('.');

    const lastHostParts = [...broadcastParts];
    lastHostParts[3] -= 1;
    const lastHost = lastHostParts.join('.');

    // Calculate number of hosts
    const hostBits = 32 - cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2; // Subtract network and broadcast addresses

    // Get IP class and type
    const ipClass = getIPClass(ipParts[0]);
    const networkType = getNetworkType(ipParts);

    // Convert to binary
    const ipBinary = ipParts.map(octet => octet.toString(2).padStart(8, '0')).join('.');
    const maskBinary = maskParts.map(octet => octet.toString(2).padStart(8, '0')).join('.');

    // Display results
    displayResults({
        ipAddress,
        networkAddress,
        broadcastAddress,
        subnetMask,
        wildcardMask: wildcardParts.join('.'),
        firstHost,
        lastHost,
        totalHosts,
        usableHosts: usableHosts > 0 ? usableHosts : 0,
        ipClass,
        networkType,
        cidr,
        ipBinary,
        maskBinary
    });
}

function validateIP(ip) {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipRegex);
    
    if (!match) return false;
    
    // Check if each octet is between 0 and 255
    for (let i = 1; i <= 4; i++) {
        const octet = parseInt(match[i]);
        if (octet < 0 || octet > 255) return false;
    }
    
    return true;
}

function cidrToMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const n = Math.min(cidr, 8);
        mask.push(256 - Math.pow(2, 8 - n));
        cidr -= n;
    }
    return mask.join('.');
}

function getIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
    return 'Unknown';
}

function getNetworkType(ipParts) {
    const first = ipParts[0];
    const second = ipParts[1];
    
    // Private IP ranges
    if (first === 10) return 'Private (Class A)';
    if (first === 172 && second >= 16 && second <= 31) return 'Private (Class B)';
    if (first === 192 && second === 168) return 'Private (Class C)';
    
    // Loopback
    if (first === 127) return 'Loopback';
    
    // Link-local
    if (first === 169 && second === 254) return 'Link-Local';
    
    return 'Public';
}

function displayResults(data) {
    // Update all result fields
    document.getElementById('ipAddr').textContent = data.ipAddress;
    document.getElementById('networkAddr').textContent = data.networkAddress;
    document.getElementById('broadcastAddr').textContent = data.broadcastAddress;
    document.getElementById('subnetMaskDecimal').textContent = data.subnetMask;
    document.getElementById('wildcardMask').textContent = data.wildcardMask;
    document.getElementById('firstHost').textContent = data.firstHost;
    document.getElementById('lastHost').textContent = data.lastHost;
    document.getElementById('totalHosts').textContent = data.totalHosts.toLocaleString();
    document.getElementById('usableHosts').textContent = data.usableHosts.toLocaleString();
    document.getElementById('ipClass').textContent = data.ipClass;
    document.getElementById('networkType').textContent = data.networkType;
    document.getElementById('cidrNotation').textContent = `${data.networkAddress}/${data.cidr}`;
    document.getElementById('ipBinary').textContent = data.ipBinary;
    document.getElementById('maskBinary').textContent = data.maskBinary;

    // Show results section with animation
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
    // Remove any existing error
    hideError();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.id = 'error-message';
    errorDiv.textContent = message;
    
    // Insert error after calculator section
    const calculatorSection = document.querySelector('.calculator-section');
    calculatorSection.appendChild(errorDiv);
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Allow Enter key to trigger calculation
document.getElementById('ipAddress').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateSubnet();
    }
});

document.getElementById('subnetMask').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateSubnet();
    }
});

// Calculate on page load with default values
window.addEventListener('load', function() {
    calculateSubnet();
});
