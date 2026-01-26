// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqdlainkaqyssnsxkpha.supabase.co';
const supabaseAnonKey = 'sb_publishable_V9wudgjtPNV1A3OtPKZSAg_UpgoiEMb';

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...\n');

try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('✅ Supabase client created successfully!\n');

    // Test 1: Check if we can query Communities table
    console.log('📊 Test 1: Querying Communities table...');
    const { data: communities, error: commError } = await supabase
        .from('Communities')
        .select('id, name')
        .limit(3);

    if (commError) {
        console.log('❌ Communities query error:', commError.message);
    } else {
        console.log('✅ Communities found:', communities?.length || 0);
        if (communities && communities.length > 0) {
            console.log('   Sample:', communities[0]);
        }
    }

    // Test 2: Check if we can query profiles table
    console.log('\n📊 Test 2: Querying profiles table...');
    const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .limit(3);

    if (profError) {
        console.log('❌ Profiles query error:', profError.message);
    } else {
        console.log('✅ Profiles found:', profiles?.length || 0);
        if (profiles && profiles.length > 0) {
            console.log('   Sample:', profiles[0]);
        }
    }

    // Test 3: Check auth status
    console.log('\n🔐 Test 3: Checking auth session...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError) {
        console.log('❌ Auth error:', authError.message);
    } else if (session) {
        console.log('✅ User is logged in:', session.user.email);
    } else {
        console.log('ℹ️  No active session (user not logged in)');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 SUPABASE CONNECTION TEST COMPLETE!');
    console.log('='.repeat(50));

} catch (error) {
    console.log('\n❌ FATAL ERROR:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your Supabase URL is correct');
    console.log('2. Check if your anon key is valid');
    console.log('3. Check your internet connection');
    console.log('4. Check if Supabase project is active');
}
