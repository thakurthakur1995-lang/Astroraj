import { CONSULTATION_PRICING_MATRIX } from "./constants";
import { SERVICES } from "./data/services";
import { PRODUCTS } from "./data/products";
import { COURSES } from "./data/courses";
import { ConsultationType, ConsultationUrgency } from "./types";
import { isSupabaseConfigured, supabase } from "./supabase/client";

export interface BookingPriceResult {
  priceInINR: number;
  originalPrice?: number;
  amountInPaise: number;
  serviceTitle: string;
}

export async function validateAndCalculateBookingPrice(params: {
  serviceId: string;
  consultationType: ConsultationType;
  durationMinutes: number;
  urgency: ConsultationUrgency;
}): Promise<BookingPriceResult> {
  const { serviceId, consultationType, durationMinutes, urgency } = params;

  // Validate allowed parameters
  if (!["audio", "video", "in-person"].includes(consultationType)) {
    throw new Error(`Invalid consultation type: ${consultationType}`);
  }
  if (![15, 30, 45, 60].includes(durationMinutes)) {
    throw new Error(`Invalid consultation duration: ${durationMinutes}`);
  }
  if (!["normal", "urgent"].includes(urgency)) {
    throw new Error(`Invalid consultation urgency: ${urgency}`);
  }

  // Find service
  let serviceTitle = "Vedic Consultation";
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from("services")
        .select("title")
        .eq("id", serviceId)
        .single();
      if (data?.title) {
        serviceTitle = data.title;
      }
    } catch {
      // Fallback to local data
    }
  }

  if (serviceTitle === "Vedic Consultation") {
    const found = SERVICES.find((s) => s.id === serviceId);
    if (found) serviceTitle = found.title;
  }

  // Server-side pricing verification from official matrix
  const tier = CONSULTATION_PRICING_MATRIX.find(
    (t) =>
      t.type === consultationType &&
      t.durationMinutes === durationMinutes &&
      t.urgency === urgency
  );

  if (!tier) {
    throw new Error(
      `Pricing tier not found for ${consultationType}, ${durationMinutes} mins, ${urgency}`
    );
  }

  const priceInINR = tier.price;
  const amountInPaise = Math.round(priceInINR * 100);

  return {
    priceInINR,
    originalPrice: tier.originalPrice,
    amountInPaise,
    serviceTitle: `${serviceTitle} (${durationMinutes} Min ${
      consultationType === "video" ? "Video" : "Audio"
    })`,
  };
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderPriceResult {
  subtotal: number;
  shippingFee: number;
  total: number;
  amountInPaise: number;
  validatedItems: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export async function validateAndCalculateOrderPrice(
  items: OrderItemInput[]
): Promise<OrderPriceResult> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  const validatedItems: OrderPriceResult["validatedItems"] = [];
  let subtotal = 0;

  for (const item of items) {
    if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
      throw new Error(`Invalid item or quantity for product ${item.productId}`);
    }

    let product = null;

    // Check Supabase first if configured
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from("products")
          .select("id, name, price, images")
          .eq("id", item.productId)
          .single();
        if (data) {
          product = {
            id: data.id,
            name: data.name,
            price: Number(data.price),
            image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : "",
          };
        }
      } catch {
        // Fallback
      }
    }

    // Fallback to local products catalog
    if (!product) {
      const local = PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
      if (local) {
        product = {
          id: local.id,
          name: local.name,
          price: local.price,
          image: local.images[0] || "",
        };
      }
    }

    // Check courses catalog if not a physical product
    if (!product) {
      const course = COURSES.find((c) => c.id === item.productId || c.slug === item.productId);
      if (course) {
        product = {
          id: course.id,
          name: course.title,
          price: course.price,
          image: course.image || course.imageUrl || "",
        };
      }
    }

    if (!product) {
      throw new Error(`Product or course not found: ${item.productId}`);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  const shippingFee = 0; // Free sacred shipping as per site policy
  const total = subtotal + shippingFee;
  const amountInPaise = Math.round(total * 100);

  return {
    subtotal,
    shippingFee,
    total,
    amountInPaise,
    validatedItems,
  };
}
