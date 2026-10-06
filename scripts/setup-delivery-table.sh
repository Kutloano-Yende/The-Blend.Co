#!/bin/bash

# Delivery Table Setup Script
# Usage: SUPABASE_SERVICE_ROLE_KEY="your-key" bash scripts/setup-delivery-table.sh

SUPABASE_URL="https://yhheeleyykqsefcbbwcp.supabase.co"
PROJECT_ID="yhheeleyykqsefcbbwcp"

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set"
    echo ""
    echo "📋 To get your service role key:"
    echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_ID/settings/api"
    echo "2. Under 'Project API keys', find 'service_role' key"
    echo "3. Copy it and run:"
    echo ""
    echo "   SUPABASE_SERVICE_ROLE_KEY='your-service-role-key' bash scripts/setup-delivery-table.sh"
    echo ""
    exit 1
fi

echo "🚀 Creating delivery_addresses table..."
echo "📍 Project: $SUPABASE_URL"
echo ""

# Read SQL file
SQL=$(cat supabase/migrations/create_delivery_addresses_table.sql)

# Execute SQL via Supabase API
# Note: The REST API doesn't directly execute raw SQL
# We need to use the SQL editor via the web interface or use psql

echo "⚠️  This script requires manual SQL execution via Supabase dashboard"
echo ""
echo "📋 Quick Setup:"
echo "1. Visit: https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
echo "2. Paste the SQL from: supabase/migrations/create_delivery_addresses_table.sql"
echo "3. Click Execute"
echo ""
echo "✅ Done! The delivery system will work immediately"
echo ""

# Alternative: Show the SQL to copy
echo "💡 SQL to execute:"
echo "---"
cat supabase/migrations/create_delivery_addresses_table.sql
echo "---"
