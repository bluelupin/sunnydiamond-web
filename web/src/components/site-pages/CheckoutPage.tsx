"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/shared/PageHead";
import OrderSummary from "@/components/shared/OrderSummary";
import { FormInput } from "@/components/shared/FormInput";
import { PrimaryButton, PrimaryLink } from "@/components/shared/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/hooks/use-gtag";
import { CheckCircle } from "lucide-react";
import { seoContent } from "@/data/content";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    if (items.length > 0) {
      trackEvent("begin_checkout", {
        currency: "INR",
        value: totalPrice,
        items: items.map((i) => ({ item_id: i.product.id, item_name: i.product.name, price: i.product.price, quantity: i.quantity })),
      });
    }
  }, []);

  if (items.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <PageHead title={seoContent.checkout.title} description={seoContent.checkout.description} />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl text-foreground">No items to checkout</h1>
          <Link href="/products" className="text-primary underline mt-4 inline-block font-body text-sm">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <PageHead title="Order Confirmed" description="Your order has been placed successfully." />
        <div className="container py-20 text-center space-y-4 animate-fade-in">
          <CheckCircle size={56} className="mx-auto text-primary" />
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">Thank You!</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
          </p>
          <PrimaryLink to="/products" className="mt-4">Continue Shopping</PrimaryLink>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      trackEvent("purchase", {
        currency: "INR",
        value: totalPrice,
        items: items.map((i) => ({ item_id: i.product.id, item_name: i.product.name, price: i.product.price, quantity: i.quantity })),
      });
      clearCart();
      setOrderPlaced(true);
      toast({ title: "Order placed!", description: "Your order has been placed successfully." });
    }, 1200);
  };

  return (
    <Layout>
      <PageHead title={seoContent.checkout.title} description={seoContent.checkout.description} />
      <section className="container py-10 md:py-16">
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <fieldset className="space-y-4">
              <legend className="font-heading text-lg font-medium text-foreground">
                Contact Information
              </legend>
              <FormInput type="email" placeholder="Email address" label="Email Address" required value={form.email} onChange={updateField("email")} />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-heading text-lg font-medium text-foreground">
                Shipping Address
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput type="text" placeholder="First name" label="First Name" required value={form.firstName} onChange={updateField("firstName")} />
                <FormInput type="text" placeholder="Last name" label="Last Name" required value={form.lastName} onChange={updateField("lastName")} />
              </div>
              <FormInput type="text" placeholder="Address" label="Address" required value={form.address} onChange={updateField("address")} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormInput type="text" placeholder="City" label="City" required value={form.city} onChange={updateField("city")} />
                <FormInput type="text" placeholder="State" label="State" required value={form.state} onChange={updateField("state")} />
                <FormInput type="text" placeholder="ZIP Code" label="ZIP Code" required value={form.zip} onChange={updateField("zip")} className="col-span-2 sm:col-span-1" />
              </div>
            </fieldset>
          </div>

          <OrderSummary items={items} totalPrice={totalPrice} showItemDetails>
            <PrimaryButton type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Processing..." : "Place Order"}
            </PrimaryButton>
          </OrderSummary>
        </form>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
