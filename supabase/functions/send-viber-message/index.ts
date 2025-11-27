// Supabase Edge Function to send messages to Viber
// This requires Viber Bot API setup
// See VIBER_BOT_SETUP.md for instructions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VIBER_BOT_TOKEN = Deno.env.get('VIBER_BOT_TOKEN');
const VIBER_RECIPIENT_NUMBER = Deno.env.get('VIBER_RECIPIENT_NUMBER') || '09953928293';

serve(async (req) => {
  try {
    // Get order data from request
    const { order_id, customer_phone, order_details } = await req.json();

    if (!VIBER_BOT_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: 'Viber Bot not configured. Please set VIBER_BOT_TOKEN in Supabase secrets.',
          message: 'Order saved but Viber message not sent automatically.'
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get order from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Format message for Viber
    const message = `🛒 NEW ORDER RECEIVED\n\n` +
      `Customer: ${order.customer_name}\n` +
      `Phone: ${order.customer_phone}\n` +
      `Email: ${order.customer_email}\n\n` +
      `Address:\n${order.customer_address}\n` +
      `${order.customer_city}, ${order.customer_state} ${order.customer_zip_code}\n` +
      `${order.customer_country}\n\n` +
      `Order Details:\n${order_details}\n\n` +
      `Total: ₱${order.total_price.toLocaleString('en-PH')}\n` +
      `Payment: ${order.payment_method}\n` +
      `Status: ${order.status}`;

    // Send message via Viber Bot API
    // Note: This requires the recipient to have subscribed to your bot
    // Viber API needs international format (remove leading 0, add country code)
    const recipientNumber = VIBER_RECIPIENT_NUMBER.startsWith('0')
      ? '63' + VIBER_RECIPIENT_NUMBER.substring(1)
      : VIBER_RECIPIENT_NUMBER.replace('+', '');
    const viberResponse = await fetch('https://chatapi.viber.com/pa/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': VIBER_BOT_TOKEN
      },
      body: JSON.stringify({
        receiver: recipientNumber,
        type: 'text',
        text: message
      })
    });

    if (!viberResponse.ok) {
      const errorData = await viberResponse.json();
      console.error('Viber API error:', errorData);
      
      // Update order to mark that Viber send failed
      await supabaseClient
        .from('orders')
        .update({ viber_sent: false })
        .eq('id', order_id);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to send Viber message',
          details: errorData,
          message: 'Order saved. Please check Viber Bot setup.'
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Mark order as Viber sent
    await supabaseClient
      .from('orders')
      .update({ viber_sent: true })
      .eq('id', order_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Order saved and Viber message sent successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-viber-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        message: 'Order saved but Viber message not sent. Customer can send manually.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

