import { supabase, isBackendAvailable } from './src/supabase-client';

console.log('\n' + '='.repeat(60));
console.log('🔍 SUPABASE CONNECTION STATUS CHECK');
console.log('='.repeat(60) + '\n');

console.log('Environment Variables:');
console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || '❌ NOT SET');
console.log('  VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
console.log('  VITE_DEMO_MODE:', import.meta.env.VITE_DEMO_MODE || 'false (not set)');

console.log('\nSupabase Client Status:');
console.log('  Client Instance:', supabase ? '✅ CREATED' : '❌ NULL');
console.log('  Backend Available:', isBackendAvailable ? '✅ YES' : '❌ NO');

if (supabase) {
    console.log('\n✅ SUCCESS: Supabase is properly connected!');
    console.log('   Your app can now access the database.');

    // Try a simple query
    console.log('\n📊 Testing database query...');
    try {
        const { data, error } = await supabase
            .from('Communities')
            .select('count')
            .limit(1);

        if (error) {
            console.log('   ⚠️  Query error:', error.message);
            console.log('   This might mean the Communities table doesn\'t exist yet.');
        } else {
            console.log('   ✅ Database query successful!');
        }
    } catch (e) {
        console.log('   ⚠️  Error:', e.message);
    }
} else {
    console.log('\n❌ FAILED: Supabase client is not initialized!');
    console.log('\n🔧 Possible issues:');
    console.log('   1. VITE_DEMO_MODE is set to true');
    console.log('   2. Environment variables are missing');
    console.log('   3. .env file is not being loaded');
    console.log('\n💡 Solution:');
    console.log('   1. Check your .env file');
    console.log('   2. Restart the dev server: npm run dev');
}

console.log('\n' + '='.repeat(60) + '\n');
