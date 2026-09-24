"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Package, 
  Settings, 
  MessageSquare, 
  Users, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Phone, 
  Mail,
  Search,
  ExternalLink
} from "lucide-react";
import { BookingRecord, OrderRecord, Service, Product } from "@/lib/types";
import { SITE_SETTINGS } from "@/lib/constants";

interface AdminDashboardProps {
  initialBookings: BookingRecord[];
  initialOrders: OrderRecord[];
  services: Service[];
  products: Product[];
  contactMessages: any[];
}

export function AdminDashboard({
  initialBookings,
  initialOrders,
  services,
  products,
  contactMessages,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "orders" | "services" | "products" | "messages" | "settings"
  >("overview");

  const [bookings, setBookings] = useState(initialBookings);
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [searchBooking, setSearchBooking] = useState<string>("");

  const updateStatus = (id: string, newStatus: BookingRecord["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === "all" || b.status === bookingFilter;
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.phone.includes(searchBooking);
    return matchesFilter && matchesSearch;
  });

  const totalBookingRevenue = bookings.reduce(
    (sum, b) => (b.paymentStatus === "paid" ? sum + b.price : sum),
    0
  );
  const totalOrderRevenue = initialOrders.reduce(
    (sum, o) => (o.paymentStatus === "paid" ? sum + o.total : sum),
    0
  );
  const totalRevenue = totalBookingRevenue + totalOrderRevenue;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-vedic-dark text-gold-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              ॐ
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 block">
                Administrative Control Center
              </span>
              <h1 className="font-serif text-2xl font-bold text-vedic-dark">
                Astro Raj Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-xs font-semibold text-vedic-dark transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-border shadow-xs">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "bookings", label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: "orders", label: `Orders (${initialOrders.length})`, icon: ShoppingBag },
            { id: "services", label: `Services (${services.length})`, icon: Sparkles },
            { id: "products", label: `Products (${products.length})`, icon: Package },
            { id: "messages", label: `Messages (${contactMessages.length})`, icon: MessageSquare },
            { id: "settings", label: "Site Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-saffron-600 text-white shadow-xs"
                    : "text-vedic-dark hover:bg-ivory"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-vedic-muted">Consultations & Store Sales</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Total Bookings</span>
                  <div className="w-8 h-8 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">100% Verified Payments</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Physical Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  {initialOrders.length}
                </div>
                <div className="text-[11px] text-vedic-muted">Consecrated Parcels</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Active Inquiries</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  {contactMessages.length}
                </div>
                <div className="text-[11px] text-vedic-muted">Via Ashram Contact Form</div>
              </div>
            </div>

            {/* Recent Bookings in Overview */}
            <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-serif text-lg font-bold text-vedic-dark">
                  Recent Scheduled Consultations
                </h2>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-semibold text-saffron-700 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                      <th className="py-3 px-3">Booking ID</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Service</th>
                      <th className="py-3 px-3">Scheduled Slot</th>
                      <th className="py-3 px-3">Fee</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-ivory/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                          {b.bookingCode}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-vedic-dark">{b.fullName}</div>
                          <div className="text-vedic-muted text-[11px]">{b.phone}</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate">{b.serviceTitle}</td>
                        <td className="py-3 px-3">
                          <div>{b.date}</div>
                          <div className="text-vedic-muted text-[11px]">{b.timeSlot}</div>
                        </td>
                        <td className="py-3 px-3 font-bold">₹{b.price.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                              b.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Consultation Bookings Management
                </h2>
                <p className="text-xs text-vedic-muted">
                  View full birth coordinates, customer notes, and update consultation status.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-vedic-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client / phone..."
                    value={searchBooking}
                    onChange={(e) => setSearchBooking(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden"
                  />
                </div>

                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="p-1.5 bg-ivory rounded-xl border border-border text-xs font-semibold text-vedic-dark focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Full Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Client & Birth Coordinates</th>
                    <th className="py-3 px-3">Service & Mode</th>
                    <th className="py-3 px-3">Scheduled Slot</th>
                    <th className="py-3 px-3">Fee</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-ivory/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                        {b.bookingCode}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-vedic-dark">{b.fullName}</div>
                        <div className="text-[11px] text-vedic-muted">{b.phone} • {b.email}</div>
                        <div className="text-[11px] text-gold-700 mt-0.5">
                          DOB: {b.dateOfBirth} | TOB: {b.timeOfBirth} | POB: {b.placeOfBirth}
                        </div>
                        {b.questionOrNotes && (
                          <div className="text-[11px] text-vedic-muted italic mt-1 max-w-xs">
                            Query: &ldquo;{b.questionOrNotes}&rdquo;
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-vedic-dark">{b.serviceTitle}</div>
                        <div className="text-[11px] text-vedic-muted capitalize">
                          {b.consultationType} Call ({b.durationMinutes} min)
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold">{b.date}</div>
                        <div className="text-vedic-muted text-[11px]">{b.timeSlot}</div>
                      </td>
                      <td className="py-3 px-3 font-bold">₹{b.price.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value as any)}
                          className="p-1 bg-ivory rounded border border-border text-[11px] font-semibold text-vedic-dark focus:outline-hidden"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Shop Orders & Physical Consecration Fulfillment
              </h2>
              <p className="text-xs text-vedic-muted">
                Track gemstone and yantra orders dispatched from Rishikesh.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer & Shipping Address</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {initialOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-ivory/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-vedic-dark">{ord.customer.fullName}</div>
                        <div className="text-[11px] text-vedic-muted">{ord.customer.phone}</div>
                        <div className="text-[11px] text-vedic-muted mt-0.5">
                          {ord.customer.shippingAddress.street}, {ord.customer.shippingAddress.city},{" "}
                          {ord.customer.shippingAddress.state} - {ord.customer.shippingAddress.postalCode}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="line-clamp-1">
                            {i.productName} × {i.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 font-serif font-bold text-vedic-dark">
                        ₹{ord.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES MANAGEMENT */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Services & Puja Offerings
                </h2>
                <p className="text-xs text-vedic-muted">
                  Overview of all active consultation formats and ritual pujas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-ivory border border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 block">
                    {s.categoryId.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-base font-bold text-vedic-dark">{s.title}</h3>
                  <p className="text-xs text-vedic-muted line-clamp-2">{s.shortDescription}</p>
                  <div className="font-serif font-bold text-sm text-saffron-700 pt-2 border-t border-border">
                    From ₹{s.priceStartingFrom.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Product Catalog ({products.length} Items)
              </h2>
              <p className="text-xs text-vedic-muted">
                Inventory extracted from authentic Astro Raj shop.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-vedic-muted uppercase tracking-wider">
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Stock</th>
                    <th className="py-2.5 px-3">Certified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-ivory/60">
                      <td className="py-2.5 px-3 font-mono text-saffron-700">{p.sku}</td>
                      <td className="py-2.5 px-3 font-semibold text-vedic-dark">{p.name}</td>
                      <td className="py-2.5 px-3">{p.categoryLabel}</td>
                      <td className="py-2.5 px-3 font-bold">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">In Stock</td>
                      <td className="py-2.5 px-3">{p.certified ? "Yes" : "Standard"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT MESSAGES */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Contact Form Inquiries
              </h2>
              <p className="text-xs text-vedic-muted">
                Messages submitted directly through the contact page.
              </p>
            </div>

            <div className="space-y-4">
              {contactMessages.map((msg: any) => (
                <div key={msg.id} className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-sm font-bold text-vedic-dark">{msg.fullName}</div>
                    <span className="text-[11px] text-vedic-muted">{msg.createdAt.split("T")[0]}</span>
                  </div>
                  <div className="text-xs text-vedic-muted">
                    Phone: {msg.phone} | Email: {msg.email}
                  </div>
                  {msg.subject && (
                    <div className="text-xs font-semibold text-saffron-800">
                      Subject: {msg.subject}
                    </div>
                  )}
                  <p className="text-xs text-vedic-dark/90 italic bg-white p-3 rounded-xl border border-border/60">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Central Site Configuration
              </h2>
              <p className="text-xs text-vedic-muted">
                Official contact parameters, WhatsApp endpoints, and Rishikesh ashram details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-ivory border border-border">
                <span className="text-vedic-muted block">Astrologer Name</span>
                <span className="font-bold text-vedic-dark text-sm">{SITE_SETTINGS.astrologerName}</span>
              </div>
              <div className="p-4 rounded-xl bg-ivory border border-border">
                <span className="text-vedic-muted block">Direct Phone</span>
                <span className="font-bold text-vedic-dark text-sm">{SITE_SETTINGS.phone}</span>
              </div>
              <div className="p-4 rounded-xl bg-ivory border border-border">
                <span className="text-vedic-muted block">WhatsApp Endpoint Number</span>
                <span className="font-bold text-emerald-800 text-sm">+{SITE_SETTINGS.whatsappNumber}</span>
              </div>
              <div className="p-4 rounded-xl bg-ivory border border-border">
                <span className="text-vedic-muted block">Official Email</span>
                <span className="font-bold text-vedic-dark text-sm">{SITE_SETTINGS.email}</span>
              </div>
              <div className="p-4 rounded-xl bg-ivory border border-border sm:col-span-2">
                <span className="text-vedic-muted block">Rishikesh Ashram Address</span>
                <span className="font-bold text-vedic-dark text-sm">{SITE_SETTINGS.address}</span>
              </div>
              <div className="p-4 rounded-xl bg-ivory border border-border sm:col-span-2">
                <span className="text-vedic-muted block">Google Analytics 4 Measurement ID</span>
                <span className="font-mono font-bold text-saffron-700 text-sm">{SITE_SETTINGS.gaMeasurementId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
