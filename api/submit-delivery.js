import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, formData } = req.body;

  if (!token || !formData) {
    return res.status(400).json({ error: 'Missing token or form data' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Update the delivery record
    const { error: updateError } = await supabase
      .from('delivery_addresses')
      .update({
        street_address: formData.street_address,
        city: formData.city,
        postal_code: formData.postal_code,
        phone_number: formData.phone_number,
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('delivery_link_token', token);

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(400).json({ error: updateError.message });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
}
