// Simple script to check .env configuration
const fs = require('fs');

console.log('\n' + '='.repeat(60));
console.log('🔍 ENVIRONMENT CONFIGURATION CHECK');
console.log('='.repeat(60) + '\n');

// Read .env file
try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    console.log('📄 .env file contents:');
    console.log('─'.repeat(60));
    console.log(envContent);
    console.log('─'.repeat(60) + '\n');

    // Check for placeholder values
    if (envContent.includes('your_supabase_url') || envContent.includes('your_supabase_anon_key')) {
        console.log('❌ ERROR: .env file contains placeholder values!\n');
        console.log('🔧 You need to replace:');
        console.log('   • "your_supabase_url" → Your actual Supabase project URL');
        console.log('   • "your_supabase_anon_key" → Your actual Supabase anon key\n');
        console.log('📍 Get these values from:');
        console.log('   Supabase Dashboard → Settings → API\n');
        console.log('💡 Example of correct format:');
        console.log('   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co');
        console.log('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n');
    } else {
        console.log('✅ .env file does not contain placeholder values\n');

        // Parse the values
        const lines = envContent.split('\n');
        lines.forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();

                if (key.includes('URL')) {
                    console.log(`   ${key}: ${value}`);
                    if (value.startsWith('https://') && value.includes('.supabase.co')) {
                        console.log('      ✅ URL format looks correct');
                    } else {
                        console.log('      ⚠️  URL format might be incorrect');
                        console.log('      Expected format: https://your-project-id.supabase.co');
                    }
                } else if (key.includes('KEY')) {
                    console.log(`   ${key}: ${value.substring(0, 20)}...`);
                    if (value.length > 100) {
                        console.log('      ✅ Key length looks correct');
                    } else {
                        console.log('      ⚠️  Key seems too short (should be 200+ characters)');
                    }
                }
            }
        });
    }
} catch (error) {
    console.log('❌ ERROR: Could not read .env file');
    console.log('   Error:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('📝 NEXT STEPS:');
console.log('='.repeat(60));
console.log('1. Update your .env file with actual Supabase credentials');
console.log('2. Restart the dev server: npm run dev');
console.log('3. Open http://localhost:5174 in your browser');
console.log('='.repeat(60) + '\n');
