const QRCode = require('qrcode');
const os = require('os');

async function generateMobileQR() {
    try {
        // Get the actual IP address for mobile access
        const networkInterfaces = os.networkInterfaces();
        let serverIP = 'localhost';
        
        // Find the first non-internal IPv4 address
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    serverIP = iface.address;
                    break;
                }
            }
            if (serverIP !== 'localhost') break;
        }
        
        const supermarketId = 'D01';
        const qrCodeUrl = `http://${serverIP}:8080/chain/consumers/${supermarketId}`;
        
        console.log('🌐 Server IP Address:', serverIP);
        console.log('📱 Mobile QR Code URL:', qrCodeUrl);
        console.log('\n📋 Instructions for Mobile Testing:');
        console.log('1. Make sure your phone is connected to the same WiFi network as this computer');
        console.log('2. Open your phone\'s camera app or QR code scanner');
        console.log('3. Scan the QR code below');
        console.log('4. The URL will open in your phone\'s browser');
        console.log('5. You\'ll see the beautiful consumer traceability interface!');
        
        // Generate QR code
        const qrCode = await QRCode.toDataURL(qrCodeUrl);
        console.log('\n📱 QR Code Generated Successfully!');
        console.log('QR Code Data URL length:', qrCode.length);
        
        // Also generate a simple text QR code for terminal display
        const textQR = await QRCode.toString(qrCodeUrl, { type: 'terminal' });
        console.log('\n📱 QR Code (Terminal Display):');
        console.log(textQR);
        
        console.log('\n🔗 Direct URL for testing:');
        console.log(qrCodeUrl);
        
    } catch (error) {
        console.error('❌ Error generating mobile QR code:', error);
    }
}

generateMobileQR();
