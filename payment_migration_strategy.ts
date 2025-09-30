// ====================================
// PAYMENT PROCESSOR MIGRATION STRATEGY
// Gumroad → Stripe Evolution Path
// ====================================

// /config/billing.config.ts
export const BILLING_CONFIG = {
  // Phase 1: MVP with Gumroad (Simple, fast setup)
  gumroad: {
    enabled: process.env.BILLING_PROVIDER === 'gumroad',
    products: {
      'tokens-small': { id: 'small-pack-25', price: 29, tokens: 25 },
      'tokens-medium': { id: 'medium-pack-50', price: 49, tokens: 50 },
      'tokens-large': { id: 'large-pack-100', price: 89, tokens: 100 }
    },
    webhookUrl: process.env.GUMROAD_WEBHOOK_URL,
    apiKey: process.env.GUMROAD_API_KEY
  },

  // Phase 2: Scale with Stripe (Advanced features)  
  stripe: {
    enabled: process.env.BILLING_PROVIDER === 'stripe',
    prices: {
      'pro1-monthly': { id: 'price_pro1_monthly', amount: 1900 },
      'pro2-monthly': { id: 'price_pro2_monthly', amount: 4900 },
      'tokens-small': { id: 'price_tokens_small', amount: 2900 }
    },
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    secretKey: process.env.STRIPE_SECRET_KEY
  }
};

// /lib/billing/payment-service.ts
interface PaymentProvider {
  createCheckout(items: any[], customerEmail: string): Promise<string>;
  handleWebhook(payload: any, signature: string): Promise<any>;
  getCustomerPortalUrl(customerId: string): Promise<string>;
}

// Gumroad Implementation (Phase 1)
class GumroadProvider implements PaymentProvider {
  async createCheckout(items: any[], customerEmail: string): Promise<string> {
    // Gumroad checkout implementation
    const product = BILLING_CONFIG.gumroad.products[items[0].id];
    
    const checkoutUrl = new URL('https://gumroad.com/l/' + product.id);
    checkoutUrl.searchParams.set('email', customerEmail);
    checkoutUrl.searchParams.set('wanted', 'true');
    
    return checkoutUrl.toString();
  }

  async handleWebhook(payload: any, signature: string): Promise<any> {
    // Gumroad webhook validation and processing
    const { sale_id, purchaser_email, product_name, price } = payload;
    
    return {
      customerId: purchaser_email,
      productId: product_name,
      amount: price,
      status: 'completed'
    };
  }

  async getCustomerPortalUrl(customerId: string): Promise<string> {
    // Gumroad doesn't have customer portal, redirect to support
    return '/support?type=billing';
  }
}

// Stripe Implementation (Phase 2)
class StripeProvider implements PaymentProvider {
  private stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  async createCheckout(items: any[], customerEmail: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: items.map(item => ({
        price: BILLING_CONFIG.stripe.prices[item.id].id,
        quantity: item.quantity || 1
      })),
      mode: items[0].mode || 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`
    });

    return session.url!;
  }

  async handleWebhook(payload: any, signature: string): Promise<any> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      BILLING_CONFIG.stripe.webhookSecret
    );

    return {
      customerId: event.data.object.customer,
      amount: event.data.object.amount_total,
      status: event.data.object.status
    };
  }

  async getCustomerPortalUrl(customerId: string): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`
    });
    
    return session.url;
  }
}

// Universal Payment Service
export class PaymentService {
  private provider: PaymentProvider;

  constructor() {
    this.provider = process.env.BILLING_PROVIDER === 'stripe' 
      ? new StripeProvider() 
      : new GumroadProvider();
  }

  async purchaseTokens(userId: string, tokenPackId: string, email: string) {
    const checkoutUrl = await this.provider.createCheckout(
      [{ id: tokenPackId }],
      email
    );

    // Store pending purchase
    await supabase.from('pending_purchases').insert({
      user_id: userId,
      product_id: tokenPackId,
      checkout_url: checkoutUrl,
      status: 'pending'
    });

    return checkoutUrl;
  }

  async processWebhook(payload: any, signature: string) {
    const purchase = await this.provider.handleWebhook(payload, signature);
    
    if (purchase.status === 'completed') {
      await this.fulfillPurchase(purchase);
    }
  }

  private async fulfillPurchase(purchase: any) {
    // Add tokens to user account
    const tokenPack = Object.values(BILLING_CONFIG.gumroad.products)
      .find(p => p.id === purchase.productId);
    
    if (tokenPack) {
      await BillingService.addBonusTokens(
        purchase.customerId,
        'universal-app', // or derive from product
        tokenPack.tokens,
        6 // 6 months expiry
      );
    }
  }
}

// Migration Strategy Implementation
export class BillingMigration {
  // Phase 1: Gumroad MVP Setup (Day 1)
  static async setupGumroad() {
    return {
      requirements: [
        'Gumroad account creation',
        'Product setup (3 token packs)',  
        'Webhook endpoint configuration',
        'Basic checkout flow integration'
      ],
      timeToLive: '2-3 hours',
      cost: '$0 (0% transaction fee first $10k)'
    };
  }

  // Phase 2: Stripe Migration (Month 2-3)
  static async migrateToStripe() {
    return {
      requirements: [
        'Stripe account setup + verification',
        'Tax handling configuration',
        'Subscription product creation',
        'Customer portal setup',
        'Data migration script'
      ],
      benefits: [
        'Recurring subscriptions',
        'Advanced tax handling', 
        'Customer portal',
        'Better analytics',
        'Lower fees at scale'
      ],
      timeToMigrate: '1-2 weeks'
    };
  }
}

// Phase 1: Gumroad Components
// /components/billing/gumroad-checkout.tsx
'use client';

export function GumroadCheckout({ tokenPackId, userEmail }: {
  tokenPackId: string;
  userEmail: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product_id: tokenPackId,
          email: userEmail 
        })
      });

      const { checkout_url } = await response.json();
      
      // Redirect to Gumroad
      window.open(checkout_url, '_blank');
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Opening checkout...' : 'Buy Now with Gumroad'}
    </Button>
  );
}