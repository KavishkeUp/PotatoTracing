const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runCommand(command, args, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n🔄 ${description}...`);
        console.log(`Command: ${command} ${args.join(' ')}`);
        
        const process = spawn(command, args, { stdio: 'inherit' });
        
        process.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${description} completed successfully!`);
                resolve();
            } else {
                console.error(`❌ ${description} failed with code ${code}`);
                reject(new Error(`${description} failed with code ${code}`));
            }
        });
        
        process.on('error', (err) => {
            console.error(`❌ Error running ${description}:`, err);
            reject(err);
        });
    });
}

async function checkPythonInstallation() {
    try {
        await runCommand('python', ['--version'], 'Checking Python installation');
        return true;
    } catch (error) {
        try {
            await runCommand('python3', ['--version'], 'Checking Python3 installation');
            return true;
        } catch (error) {
            console.error('❌ Python is not installed or not in PATH');
            console.log('Please install Python 3.7+ and try again');
            return false;
        }
    }
}

async function installPythonDependencies() {
    try {
        console.log('\n📦 Installing Python dependencies...');
        
        // Check if pip is available
        try {
            await runCommand('pip', ['--version'], 'Checking pip installation');
        } catch (error) {
            try {
                await runCommand('pip3', ['--version'], 'Checking pip3 installation');
            } catch (error) {
                console.error('❌ pip is not installed or not in PATH');
                console.log('Please install pip and try again');
                return false;
            }
        }
        
        // Install requirements
        const requirementsPath = path.join(__dirname, 'requirements.txt');
        if (fs.existsSync(requirementsPath)) {
            try {
                await runCommand('pip', ['install', '-r', requirementsPath], 'Installing Python dependencies');
            } catch (error) {
                try {
                    await runCommand('pip3', ['install', '-r', requirementsPath], 'Installing Python dependencies');
                } catch (error) {
                    console.error('❌ Failed to install Python dependencies');
                    return false;
                }
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error installing Python dependencies:', error);
        return false;
    }
}

async function setupMLModel() {
    try {
        console.log('🚀 Setting up ML model for potato price prediction...');
        
        // Step 1: Check Python installation
        const pythonAvailable = await checkPythonInstallation();
        if (!pythonAvailable) {
            console.log('\n❌ Setup failed: Python not available');
            return false;
        }
        
        // Step 2: Install Python dependencies
        const depsInstalled = await installPythonDependencies();
        if (!depsInstalled) {
            console.log('\n❌ Setup failed: Could not install dependencies');
            return false;
        }
        
        // Step 3: Extract training data from database
        console.log('\n📊 Extracting training data from database...');
        try {
            const { extractTrainingData } = require('./extract-training-data');
            await extractTrainingData();
        } catch (error) {
            console.error('❌ Failed to extract training data:', error);
            console.log('Make sure your database is running and contains data');
            return false;
        }
        
        // Step 4: Train the Random Forest model
        console.log('\n🌲 Training Random Forest model...');
        try {
            await runCommand('python', ['train_random_forest.py'], 'Training Random Forest model');
        } catch (error) {
            console.error('❌ Failed to train model:', error);
            return false;
        }
        
        // Step 5: Verify model files
        console.log('\n🔍 Verifying model files...');
        const modelFiles = [
            'potato_price_model.pkl',
            'model_info.json',
            'training_data.xlsx'
        ];
        
        for (const file of modelFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ ${file} exists`);
            } else {
                console.log(`❌ ${file} missing`);
            }
        }
        
        console.log('\n🎉 ML model setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Restart your backend server');
        console.log('2. Test the prediction at: http://localhost:3000/supermarket-dashboard/predict-potato-price');
        console.log('3. The system will now use the trained Random Forest model for price predictions');
        
        return true;
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    setupMLModel()
        .then((success) => {
            if (success) {
                console.log('\n✨ ML model setup completed successfully!');
                process.exit(0);
            } else {
                console.log('\n💥 ML model setup failed!');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('\n💥 Setup failed with error:', error);
            process.exit(1);
        });
}

module.exports = { setupMLModel };
