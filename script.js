// Enhanced Subnet Calculator with Modern Features

// Dark Mode Toggle
const themeSwitch = document.getElementById('theme-switch');
const html = document.documentElement;

// Load saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', function() {
    if (this.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Calculation Counter
let calcCount = parseInt(localStorage.getItem('calcCount')) || 0;

function updateCalcCount() {
    calcCount++;
    localStorage.setItem('calcCount', calcCount);
    document.getElementById('calc-count').textContent = calcCount;
}

// Initialize counter display
document.getElementById('calc-count').textContent = calcCount;

// CIDR Slider Sync
function updateCIDR(value) {
    document.getElementById('subnetMask').value = value;
    document.getElementById('cidrValue').textContent = value;
}

function updateSlider(value) {
    if (value >= 0 && value <= 32) {
        document.getElementById('cidrSlider').value = value;
        document.getElementById('cidrValue').textContent = value;
    }
}

// Main Calculation Function
function calculateSubnet() {
    // Get input values
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const cidr = parseInt(document.getElementById('subnetMask').value);

    // Validate inputs
    if (!validateIP(ipAddress)) {
        showError('⚠️ Please enter a valid IP address (e.g., 192.168.1.0)');
        return;
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        showError('⚠️ Please enter a valid CIDR notation (0-32)');
        return;
    }

    // Hide any previous errors
    hideError();

    // Update calculation counter
    updateCalcCount();

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
    const usableHosts = totalHosts - 2;

    // Get IP class and type
    const ipClass = getIPClass(ipParts[0]);
    const networkType = getNetworkType(ipParts);

    // Convert to binary with formatting
    const ipBinary = formatBinary(ipParts.map(octet => octet.toString(2).padStart(8, '0')).join('.'));
    const maskBinary = formatBinary(maskParts.map(octet => octet.toString(2).padStart(8, '0')).join('.'));

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
        maskBinary,
        hostPercentage: ((usableHosts / totalHosts) * 100).toFixed(1)
    });
}

function validateIP(ip) {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipRegex);
    
    if (!match) return false;
    
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
    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)';
    return 'Unknown';
}

function getNetworkType(ipParts) {
    const first = ipParts[0];
    const second = ipParts[1];
    
    // Private IP ranges
    if (first === 10) return 'Private Network';
    if (first === 172 && second >= 16 && second <= 31) return 'Private Network';
    if (first === 192 && second === 168) return 'Private Network';
    
    // Special ranges
    if (first === 127) return 'Loopback';
    if (first === 169 && second === 254) return 'Link-Local';
    
    return 'Public Network';
}

function formatBinary(binary) {
    // Add spacing for readability
    return binary.replace(/\./g, ' . ');
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
    document.getElementById('totalHosts').textContent = formatNumber(data.totalHosts);
    document.getElementById('usableHosts').textContent = formatNumber(data.usableHosts);
    document.getElementById('ipClass').textContent = data.ipClass;
    document.getElementById('networkType').textContent = data.networkType;
    document.getElementById('cidrNotation').textContent = `${data.networkAddress}/${data.cidr}`;
    document.getElementById('ipBinary').textContent = data.ipBinary;
    document.getElementById('maskBinary').textContent = data.maskBinary;

    // Animate host bar
    const hostBar = document.getElementById('hostBarFill');
    setTimeout(() => {
        hostBar.style.width = data.hostPercentage + '%';
    }, 100);

    // Show results section with animation
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

function formatNumber(num) {
    return num.toLocaleString();
}

function showError(message) {
    hideError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.id = 'error-message';
    errorDiv.textContent = message;
    
    const calculatorSection = document.querySelector('.calculator-section');
    calculatorSection.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Keyboard shortcuts
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

// Auto-calculate on page load
window.addEventListener('load', function() {
    calculateSubnet();
    
    // Add smooth entrance animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Prevent invalid input in number field
document.getElementById('subnetMask').addEventListener('input', function(e) {
    const value = parseInt(e.target.value);
    if (value > 32) {
        e.target.value = 32;
        updateSlider(32);
    } else if (value < 0) {
        e.target.value = 0;
        updateSlider(0);
    }
});

// Copy to clipboard functionality (optional enhancement)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 Copied to clipboard!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add click-to-copy on result values
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .value:hover {
            cursor: pointer;
            background: rgba(102, 126, 234, 0.1);
            padding: 2px 8px;
            border-radius: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // Add copy functionality to all values
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('value') && e.target.textContent.trim()) {
            copyToClipboard(e.target.textContent);
        }
    });
});
