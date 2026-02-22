# 🌐 Advanced Subnet Calculator

A professional web-based subnet calculator that demonstrates practical networking knowledge from Cisco NetAcad Network Basics certification.

## 📋 Project Overview

This interactive subnet calculator performs IPv4 subnetting calculations and displays comprehensive network information. It's designed to showcase understanding of:
- IP addressing and subnetting
- CIDR notation
- Network/broadcast address calculation
- Binary-to-decimal conversion
- IP address classes
- Public vs Private IP ranges

## 🎯 Purpose

This project proves practical application of:
- TCP/IP addressing concepts
- Subnet mask calculations
- Network planning and design
- Binary mathematics in networking

## ✨ Features

### Core Functionality
- **Subnet Calculations**: Automatically calculates network address, broadcast address, and host ranges
- **CIDR Support**: Works with CIDR notation (/0 to /32)
- **Host Information**: Shows total hosts, usable hosts, first and last usable IPs
- **Binary Conversion**: Displays IP addresses and subnet masks in binary format
- **IP Classification**: Identifies IP class (A, B, C, D, E) and network type (Public/Private)
- **Wildcard Mask**: Calculates wildcard masks (useful for ACLs)

### Technical Features
- **Real-time Validation**: Checks IP address format and CIDR range
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with smooth animations
- **Error Handling**: Clear error messages for invalid inputs

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and flexbox/grid
- **JavaScript (Vanilla)**: Core calculation logic without external dependencies
- **No frameworks required**: Pure web technologies for maximum compatibility

## 📚 Networking Concepts Demonstrated

### 1. IP Addressing
- Understanding IPv4 32-bit addressing
- Octet structure (xxx.xxx.xxx.xxx)
- Address classes (A, B, C, D, E)
- Public vs Private IP ranges

### 2. Subnetting
- CIDR notation (Classless Inter-Domain Routing)
- Subnet mask calculation
- Network and broadcast address determination
- Usable host range calculation

### 3. Binary Mathematics
- Decimal to binary conversion
- Binary AND operations (for network address)
- Binary OR operations (for broadcast address)
- Understanding bit-level operations

### 4. Network Planning
- Host requirement calculations
- Efficient IP address allocation
- Understanding network boundaries
- Wildcard mask usage in ACLs

## 🚀 How to Use

### Option 1: Run Locally (Recommended for Testing)

1. **Download the files**:
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Open in browser**:
   - Double-click `index.html`
   - Or open with any modern web browser

3. **Use the calculator**:
   - Enter an IP address (e.g., 192.168.1.0)
   - Enter CIDR notation (e.g., 24 for /24)
   - Click "Calculate Subnet"
   - View detailed results

## 📊 Example Calculations

### Example 1: Class C Private Network
**Input**: 192.168.1.0/24
**Output**:
- Network Address: 192.168.1.0
- Broadcast Address: 192.168.1.255
- First Host: 192.168.1.1
- Last Host: 192.168.1.254
- Usable Hosts: 254
- IP Class: C
- Network Type: Private (Class C)

### Example 2: Subnetted Class B
**Input**: 172.16.0.0/20
**Output**:
- Network Address: 172.16.0.0
- Broadcast Address: 172.16.15.255
- First Host: 172.16.0.1
- Last Host: 172.16.15.254
- Usable Hosts: 4,094
- IP Class: B
- Network Type: Private (Class B)

### Example 3: Large Class A Network
**Input**: 10.0.0.0/8
**Output**:
- Network Address: 10.0.0.0
- Broadcast Address: 10.255.255.255
- First Host: 10.0.0.1
- Last Host: 10.255.255.254
- Usable Hosts: 16,777,214
- IP Class: A
- Network Type: Private (Class A)

## 🎓 Learning Outcomes

By building this project, I demonstrated understanding of:

1. **Practical Subnetting**: Converting theoretical knowledge into working code
2. **Algorithm Development**: Implementing subnet calculation algorithms
3. **Binary Operations**: Using bitwise operations for network calculations
4. **Problem Solving**: Breaking down complex networking problems into logical steps
5. **Web Development**: Creating professional, user-friendly interfaces
6. **Documentation**: Writing clear technical documentation

## 🔍 Code Highlights

### Subnet Mask Conversion (CIDR to Decimal)
```javascript
function cidrToMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const n = Math.min(cidr, 8);
        mask.push(256 - Math.pow(2, 8 - n));
        cidr -= n;
    }
    return mask.join('.');
}
```

### Network Address Calculation
```javascript
const networkParts = ipParts.map((octet, i) => octet & maskParts[i]);
```
*Uses bitwise AND operation - fundamental networking concept*

### Broadcast Address Calculation
```javascript
const broadcastParts = networkParts.map((octet, i) => octet | wildcardParts[i]);
```
*Uses bitwise OR operation with wildcard mask*

## 📈 Future Enhancements

Potential improvements to demonstrate advanced knowledge:
- [ ] VLSM (Variable Length Subnet Masking) calculator
- [ ] IPv6 support
- [ ] Subnet visualization diagrams
- [ ] Export results as PDF/CSV
- [ ] History of calculations
- [ ] Comparison of different subnetting schemes
- [ ] Network design recommendations based on host requirements

## 🎯 Why This Project 

This project demonstrates:
- **Practical Application**: Not just theory, but working implementation
- **Technical Skills**: HTML, CSS, JavaScript, and networking fundamentals
- **Problem Solving**: Breaking down complex problems into code
- **Professional Quality**: Production-ready code with proper documentation
- **Self-Learning**: Ability to apply certification knowledge to real projects

## 📝 License

This project is open source and available for educational purposes.

## 👤 Author

Created by [M. Hassaan Majid Toor]
- **Certification**: Cisco NetAcad Network Basics
- **GitHub**: [ScrambleR-H]
- **Email**: [scrambler1901@gmail.com]


