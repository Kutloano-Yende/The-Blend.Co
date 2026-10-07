import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  function apiPlugin() {
    return {
      name: 'api-plugin',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/submit-delivery' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { token, formData } = JSON.parse(body);
                  const supabase = createClient(
                    env.VITE_SUPABASE_URL,
                    env.SUPABASE_SERVICE_ROLE_KEY
                  );
                  const { error } = await supabase
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

                  res.setHeader('Content-Type', 'application/json');
                  if (error) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: error.message }));
                  } else {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true }));
                  }
                } catch (error) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: error.message }));
                }
              });
            } else {
              next();
            }
          });
        };
      }
    };
  }

  return {
    plugins: [react(), apiPlugin()],
    server: {
      port: 3000,
      open: true,
    },
  };
});
