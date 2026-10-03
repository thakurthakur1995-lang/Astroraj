"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Package, 
  Settings, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Phone, 
  Mail,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  MapPin,
  MessageCircle,
  Truck,
  FileText,
  User,
  AlertCircle,
  Video,
  Compass,
  Check,
  X,
  LogOut
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

  // Live interactive state
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingPaymentFilter, setBookingPaymentFilter] = useState<string>("all");
  const [searchBooking, setSearchBooking] = useState<string>("");

  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>("all");
  const [searchOrder, setSearchOrder] = useState<string>("");

  // Modals for deep inspection & actions
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Form states inside modals
  const [modalMeetingLink, setModalMeetingLink] = useState<string>("");
  const [modalAdminNotes, setModalAdminNotes] = useState<string>("");
  const [isSavingModal, setIsSavingModal] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync data from database
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings || []);
        setOrders(data.orders || []);
        showToast("Admin data successfully refreshed from database.");
      } else {
        showToast(data.message || "Failed to refresh data.");
      }
    } catch {
      showToast("Network error while syncing data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update Booking Status & Metadata
  const handleUpdateBookingStatus = async (
    id: string, 
    newStatus: BookingRecord["status"], 
    extra?: { meetingLink?: string; adminNotes?: string }
  ) => {
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          id,
          status: newStatus,
          meetingLink: extra?.meetingLink,
          adminNotes: extra?.adminNotes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id || b.bookingCode === id
              ? { 
                  ...b, 
                  status: newStatus, 
                  meetingLink: extra?.meetingLink ?? b.meetingLink,
                  adminNotes: extra?.adminNotes ?? b.adminNotes,
                }
              : b
          )
        );
        if (selectedBooking && (selectedBooking.id === id || selectedBooking.bookingCode === id)) {
          setSelectedBooking((prev) =>
            prev
              ? {
                  ...prev,
                  status: newStatus,
                  meetingLink: extra?.meetingLink ?? prev.meetingLink,
                  adminNotes: extra?.adminNotes ?? prev.adminNotes,
                }
              : null
          );
        }
        showToast(`Booking ${id} status updated to ${newStatus}.`);
      } else {
        alert(data.message || "Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status. Please check your network connection.");
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    id: string, 
    newStatus: OrderRecord["orderStatus"]
  ) => {
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id || o.orderNumber === id
              ? { ...o, orderStatus: newStatus }
              : o
          )
        );
        if (selectedOrder && (selectedOrder.id === id || selectedOrder.orderNumber === id)) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, orderStatus: newStatus } : null
          );
        }
        showToast(`Order ${id} status updated to ${newStatus}.`);
      } else {
        alert(data.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status. Please check your network connection.");
    }
  };

  // Sign out admin
  const handleLogout = async () => {
    if (!confirm("Are you sure you want to sign out from the Admin Portal?")) return;
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin";
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilter === "all" || b.status === bookingFilter;
    const matchesPayment = bookingPaymentFilter === "all" || b.paymentStatus === bookingPaymentFilter;
    const searchLower = searchBooking.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      b.fullName.toLowerCase().includes(searchLower) ||
      b.bookingCode.toLowerCase().includes(searchLower) ||
      b.phone.includes(searchLower) ||
      b.email.toLowerCase().includes(searchLower) ||
      (b.concernsTopic && b.concernsTopic.toLowerCase().includes(searchLower));
    return matchesStatus && matchesPayment && matchesSearch;
  });

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === "all" || o.orderStatus === orderFilter;
    const matchesPayment = orderPaymentFilter === "all" || o.paymentStatus === orderPaymentFilter;
    const searchLower = searchOrder.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      o.orderNumber.toLowerCase().includes(searchLower) ||
      o.customer.fullName.toLowerCase().includes(searchLower) ||
      o.customer.phone.includes(searchLower) ||
      o.customer.email.toLowerCase().includes(searchLower) ||
      (o.customer.shippingAddress?.city && o.customer.shippingAddress.city.toLowerCase().includes(searchLower)) ||
      (o.customer.shippingAddress?.street && o.customer.shippingAddress.street.toLowerCase().includes(searchLower));
    return matchesStatus && matchesPayment && matchesSearch;
  });

  // Revenue & Metrics Calculation
  const totalBookingRevenue = bookings.reduce(
    (sum, b) => (b.paymentStatus === "paid" ? sum + b.price : sum),
    0
  );
  const totalOrderRevenue = orders.reduce(
    (sum, o) => (o.paymentStatus === "paid" ? sum + o.total : sum),
    0
  );
  const totalRevenue = totalBookingRevenue + totalOrderRevenue;

  const paidOrdersCount = orders.filter((o) => o.paymentStatus === "paid").length;
  const pendingOrdersCount = orders.filter((o) => o.paymentStatus === "pending").length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-vedic-dark text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-gold-400/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-border shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-vedic-dark text-gold-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              ॐ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 block">
                  Administrative Control Center
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Database Connected
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-vedic-dark">
                Astro Raj Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-xs font-semibold text-vedic-dark transition-colors disabled:opacity-60"
              title="Refresh data from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-saffron-600" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Refresh Data"}</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-xs font-semibold text-vedic-dark transition-colors shadow-xs"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Sign out from Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-border shadow-xs">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "bookings", label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
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

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
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
                <div className="text-[11px] text-vedic-muted">
                  Bookings: ₹{totalBookingRevenue.toLocaleString("en-IN")} | Store: ₹{totalOrderRevenue.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Consultations</span>
                  <div className="w-8 h-8 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {confirmedBookingsCount} Confirmed • {pendingBookingsCount} Pending
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Shop Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-vedic-dark">
                  {orders.length}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {paidOrdersCount} Paid • {pendingOrdersCount} Pending
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vedic-muted font-semibold uppercase">Inquiries</span>
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

            {/* Recent Orders in Overview */}
            <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-vedic-dark">
                    Recent Physical Shop Orders
                  </h2>
                  <p className="text-xs text-vedic-muted">Real customers & delivery coordinates</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-saffron-700 hover:underline"
                >
                  View All Orders ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-vedic-muted">No shop orders recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                        <th className="py-3 px-3">Order #</th>
                        <th className="py-3 px-3">Customer & Phone</th>
                        <th className="py-3 px-3">Delivery Destination</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-ivory/60 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-vedic-dark">{ord.customer.fullName}</div>
                            <div className="text-[11px] text-vedic-muted">{ord.customer.phone}</div>
                          </td>
                          <td className="py-3 px-3 max-w-xs truncate text-[11px]">
                            {ord.customer.shippingAddress?.city ? (
                              <span>
                                {ord.customer.shippingAddress.street ? `${ord.customer.shippingAddress.street}, ` : ""}
                                {ord.customer.shippingAddress.city} ({ord.customer.shippingAddress.state || "IN"})
                              </span>
                            ) : (
                              <span className="text-vedic-muted italic">No address provided</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[11px]">
                            {ord.items?.length || 0} item(s)
                          </td>
                          <td className="py-3 px-3 font-bold text-vedic-dark">
                            ₹{ord.total.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              ord.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 capitalize">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ivory hover:bg-ivory-card border border-border text-[11px] font-semibold text-vedic-dark"
                            >
                              <Eye className="w-3 h-3 text-saffron-600" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Bookings in Overview */}
            <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-vedic-dark">
                    Recent Scheduled Consultations
                  </h2>
                  <p className="text-xs text-vedic-muted">Birth details & scheduled video/audio calls</p>
                </div>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-semibold text-saffron-700 hover:underline"
                >
                  View All Bookings ({bookings.length}) →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-vedic-muted">No consultation bookings recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                        <th className="py-3 px-3">Booking ID</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Service & Mode</th>
                        <th className="py-3 px-3">Date & Slot</th>
                        <th className="py-3 px-3">Fee</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
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
                          <td className="py-3 px-3 max-w-xs truncate">
                            <div className="font-medium text-vedic-dark truncate">{b.serviceTitle}</div>
                            <span className="text-[10px] text-vedic-muted capitalize">{b.consultationType} ({b.durationMinutes}m)</span>
                          </td>
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
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setModalMeetingLink(b.meetingLink || "");
                                setModalAdminNotes(b.adminNotes || "");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ivory hover:bg-ivory-card border border-border text-[11px] font-semibold text-vedic-dark"
                            >
                              <Eye className="w-3 h-3 text-saffron-600" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CONSULTATION BOOKINGS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Consultation Bookings Management
                </h2>
                <p className="text-xs text-vedic-muted">
                  View full birth coordinates, queries, update status, and attach Google Meet / Zoom links.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-vedic-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, phone, code..."
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

                <select
                  value={bookingPaymentFilter}
                  onChange={(e) => setBookingPaymentFilter(e.target.value)}
                  className="p-1.5 bg-ivory rounded-xl border border-border text-xs font-semibold text-vedic-dark focus:outline-hidden"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>
            </div>

            {/* Full Bookings Table */}
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-xs text-vedic-muted bg-ivory/50 rounded-2xl border border-border">
                No bookings matching the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                      <th className="py-3 px-3">Booking ID</th>
                      <th className="py-3 px-3">Client & Birth Coordinates</th>
                      <th className="py-3 px-3">Service & Mode</th>
                      <th className="py-3 px-3">Scheduled Slot</th>
                      <th className="py-3 px-3">Fee / Payment</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-ivory/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                          {b.bookingCode}
                          <div className="text-[10px] text-vedic-muted font-normal">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-vedic-dark">{b.fullName}</div>
                          <div className="text-[11px] text-vedic-muted">{b.phone} • {b.email}</div>
                          <div className="text-[11px] text-gold-700 mt-0.5">
                            DOB: {b.dateOfBirth} | TOB: {b.timeOfBirth} | POB: {b.placeOfBirth}
                          </div>
                          {b.questionOrNotes && (
                            <div className="text-[11px] text-vedic-muted italic mt-1 max-w-xs line-clamp-1">
                              Query: &ldquo;{b.questionOrNotes}&rdquo;
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-vedic-dark">{b.serviceTitle}</div>
                          <div className="text-[11px] text-vedic-muted capitalize">
                            {b.consultationType} Call ({b.durationMinutes} min) • {b.urgency}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold">{b.date}</div>
                          <div className="text-vedic-muted text-[11px]">{b.timeSlot}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-vedic-dark">₹{b.price.toLocaleString("en-IN")}</div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${
                              b.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                            className="p-1 bg-ivory rounded-lg border border-border text-[11px] font-semibold text-vedic-dark focus:outline-hidden"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setModalMeetingLink(b.meetingLink || "");
                              setModalAdminNotes(b.adminNotes || "");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-saffron-50 hover:bg-saffron-100 text-saffron-700 text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View All Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SHOP ORDERS & FULFILLMENT MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Shop Orders & Physical Consecration Fulfillment
                </h2>
                <p className="text-xs text-vedic-muted">
                  View complete delivery shipping addresses, order items, update dispatch status, and contact customers.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-vedic-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search order#, name, city..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-ivory rounded-xl border border-border text-xs focus:outline-hidden"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="p-1.5 bg-ivory rounded-xl border border-border text-xs font-semibold text-vedic-dark focus:outline-hidden"
                >
                  <option value="all">All Orders</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="p-1.5 bg-ivory rounded-xl border border-border text-xs font-semibold text-vedic-dark focus:outline-hidden"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending Payment</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-vedic-muted bg-ivory/50 rounded-2xl border border-border">
                No orders matching the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-vedic-muted uppercase tracking-wider">
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Customer & Contact</th>
                      <th className="py-3 px-3">Full Delivery Address</th>
                      <th className="py-3 px-3">Items Purchased</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Fulfillment Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-ivory/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-saffron-700">
                          {ord.orderNumber}
                          <div className="text-[10px] text-vedic-muted font-normal">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ""}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-vedic-dark">{ord.customer.fullName}</div>
                          <div className="text-[11px] text-vedic-muted">{ord.customer.phone}</div>
                          <div className="text-[11px] text-vedic-muted truncate max-w-[150px]">{ord.customer.email}</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          {ord.customer.shippingAddress ? (
                            <div className="text-[11px] text-vedic-dark/90 leading-tight">
                              <span className="font-medium">{ord.customer.shippingAddress.street || "Address pending"}</span>
                              <div className="text-vedic-muted mt-0.5">
                                {ord.customer.shippingAddress.city ? `${ord.customer.shippingAddress.city}, ` : ""}
                                {ord.customer.shippingAddress.state ? `${ord.customer.shippingAddress.state} ` : ""}
                                {ord.customer.shippingAddress.postalCode ? `- ${ord.customer.shippingAddress.postalCode}` : ""}
                              </div>
                            </div>
                          ) : (
                            <span className="text-vedic-muted italic">No shipping details</span>
                          )}
                          {ord.customer.orderNotes && (
                            <div className="text-[10px] text-saffron-700 italic mt-0.5 line-clamp-1">
                              Note: &ldquo;{ord.customer.orderNotes}&rdquo;
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            {ord.items && ord.items.map((i, idx) => (
                              <div key={idx} className="line-clamp-1 text-[11px] text-vedic-dark">
                                • {i.productName} <span className="font-bold text-saffron-700">× {i.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-serif font-bold text-vedic-dark text-sm">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            ord.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="p-1 bg-ivory rounded-lg border border-border text-[11px] font-semibold text-vedic-dark focus:outline-hidden"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-saffron-50 hover:bg-saffron-100 text-saffron-700 text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Delivery Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SERVICES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-vedic-dark">
                  Services & Puja Offerings ({services.length})
                </h2>
                <p className="text-xs text-vedic-muted">
                  Overview of all active consultation formats and ritual pujas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
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

        {/* ======================================================== */}
        {/* TAB 5: PRODUCTS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Product Catalog ({products.length} Items)
              </h2>
              <p className="text-xs text-vedic-muted">
                Inventory available in authentic Astro Raj sacred shop.
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

        {/* ======================================================== */}
        {/* TAB 6: CONTACT MESSAGES */}
        {/* ======================================================== */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-xl font-bold text-vedic-dark">
                Contact Form Inquiries ({contactMessages.length})
              </h2>
              <p className="text-xs text-vedic-muted">
                Messages submitted directly through the website contact page.
              </p>
            </div>

            {contactMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-vedic-muted">No messages received yet.</div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((msg: any) => (
                  <div key={msg.id} className="p-5 rounded-2xl bg-ivory border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-sm font-bold text-vedic-dark">{msg.fullName}</div>
                      <span className="text-[11px] text-vedic-muted">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <div className="text-xs text-vedic-muted">
                      Phone: <a href={`tel:${msg.phone}`} className="text-saffron-700 hover:underline">{msg.phone}</a> | Email: <a href={`mailto:${msg.email}`} className="text-saffron-700 hover:underline">{msg.email}</a>
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
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SITE SETTINGS */}
        {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* MODAL 1: CONSULTATION BOOKING DEEP DETAILS */}
      {/* ======================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-saffron-700">
                    {selectedBooking.bookingCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    selectedBooking.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    Payment: {selectedBooking.paymentStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron-100 text-saffron-800 capitalize">
                    {selectedBooking.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-vedic-dark">
                  Consultation & Kundli Birth Coordinates
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-ivory hover:bg-ivory-card border border-border flex items-center justify-center text-vedic-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Coordinates & Vedic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ivory border border-border space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-vedic-dark text-sm">
                  <User className="w-4 h-4 text-saffron-600" />
                  <span>Client Information</span>
                </div>
                <div><span className="text-vedic-muted">Name:</span> <strong className="text-vedic-dark">{selectedBooking.fullName}</strong></div>
                <div><span className="text-vedic-muted">Phone:</span> <strong className="text-vedic-dark">{selectedBooking.phone}</strong></div>
                <div><span className="text-vedic-muted">Email:</span> <strong className="text-vedic-dark">{selectedBooking.email}</strong></div>
                {selectedBooking.gender && (
                  <div><span className="text-vedic-muted">Gender:</span> <strong className="text-vedic-dark capitalize">{selectedBooking.gender}</strong></div>
                )}
                {selectedBooking.preferredLanguage && (
                  <div><span className="text-vedic-muted">Language:</span> <strong className="text-vedic-dark">{selectedBooking.preferredLanguage}</strong></div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-ivory border border-border space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-vedic-dark text-sm">
                  <Compass className="w-4 h-4 text-gold-600" />
                  <span>Kundli Birth Details</span>
                </div>
                <div><span className="text-vedic-muted">Date of Birth:</span> <strong className="text-vedic-dark">{selectedBooking.dateOfBirth}</strong></div>
                <div>
                  <span className="text-vedic-muted">Time of Birth:</span>{" "}
                  <strong className="text-vedic-dark">{selectedBooking.timeOfBirth}</strong>
                  {selectedBooking.timeIsApproximate && (
                    <span className="ml-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Approximate</span>
                  )}
                </div>
                <div><span className="text-vedic-muted">Place of Birth:</span> <strong className="text-vedic-dark">{selectedBooking.placeOfBirth}</strong></div>
                {selectedBooking.concernsTopic && (
                  <div><span className="text-vedic-muted">Focus Area:</span> <strong className="text-saffron-700 font-bold">{selectedBooking.concernsTopic}</strong></div>
                )}
              </div>
            </div>

            {/* Session Scheduled */}
            <div className="p-4 rounded-2xl bg-saffron-50/70 border border-saffron-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-saffron-900 text-sm">{selectedBooking.serviceTitle}</span>
                <span className="font-serif font-bold text-base text-saffron-800">₹{selectedBooking.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-saffron-800">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedBooking.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedBooking.timeSlot}</span>
                </div>
                <div className="capitalize">
                  Mode: <strong>{selectedBooking.consultationType} ({selectedBooking.durationMinutes} mins)</strong>
                </div>
              </div>
            </div>

            {/* Client Query / Note */}
            {selectedBooking.questionOrNotes && (
              <div className="p-4 rounded-2xl bg-ivory border border-border space-y-1.5">
                <span className="text-xs font-bold text-vedic-dark block">Client Query / Concerns:</span>
                <p className="text-xs text-vedic-dark/90 italic bg-white p-3 rounded-xl border border-border/60">
                  &ldquo;{selectedBooking.questionOrNotes}&rdquo;
                </p>
              </div>
            )}

            {/* Admin Fulfillment / Status Form */}
            <div className="space-y-4 pt-2 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vedic-dark">
                Astrologer Actions & Session Setup
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-vedic-muted font-medium mb-1">Consultation Status</label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateBookingStatus(selectedBooking.id, e.target.value as any)}
                    className="w-full p-2 bg-ivory rounded-xl border border-border font-semibold text-vedic-dark focus:outline-hidden"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-vedic-muted font-medium mb-1">Google Meet / Video Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={modalMeetingLink}
                    onChange={(e) => setModalMeetingLink(e.target.value)}
                    className="w-full p-2 bg-ivory rounded-xl border border-border text-vedic-dark focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-vedic-muted font-medium mb-1 text-xs">
                  Astrologer Internal Notes / Chart Analysis Findings
                </label>
                <textarea
                  rows={2}
                  placeholder="Record observations, remedial gems, stotras suggested..."
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                  className="w-full p-2.5 bg-ivory rounded-xl border border-border text-xs text-vedic-dark focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Communication buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hari Om ${selectedBooking.fullName} ji! This is Astrologer Rajat Thakur's office regarding your upcoming consultation for "${selectedBooking.serviceTitle}" scheduled on ${selectedBooking.date} at ${selectedBooking.timeSlot}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-xs font-semibold text-vedic-dark"
                  >
                    <Phone className="w-3.5 h-3.5 text-vedic-muted" />
                    <span>Call</span>
                  </a>
                </div>

                <button
                  disabled={isSavingModal}
                  onClick={async () => {
                    setIsSavingModal(true);
                    await handleUpdateBookingStatus(selectedBooking.id, selectedBooking.status, {
                      meetingLink: modalMeetingLink,
                      adminNotes: modalAdminNotes,
                    });
                    setIsSavingModal(false);
                    setSelectedBooking(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {isSavingModal ? "Saving..." : "Save Updates"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ORDER & DELIVERY DETAILS DEEP INSPECTION */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-border my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-saffron-700">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    selectedOrder.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    Payment: {selectedOrder.paymentStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 capitalize">
                    Fulfillment: {selectedOrder.orderStatus}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-vedic-dark">
                  Delivery Coordinates & Sacred Order Fulfillment
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-ivory hover:bg-ivory-card border border-border flex items-center justify-center text-vedic-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery Shipping Coordinates */}
            <div className="p-5 rounded-2xl bg-ivory border border-border space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-vedic-dark text-sm border-b border-border pb-2">
                <Truck className="w-4 h-4 text-saffron-600" />
                <span>Shipping Address & Delivery Instructions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-vedic-muted block">Recipient Name & Contact</span>
                  <strong className="text-vedic-dark text-sm block">{selectedOrder.customer.fullName}</strong>
                  <div className="text-vedic-dark font-medium">{selectedOrder.customer.phone}</div>
                  <div className="text-vedic-muted">{selectedOrder.customer.email}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-vedic-muted block">Complete Shipping Address</span>
                  {selectedOrder.customer.shippingAddress ? (
                    <div className="text-vedic-dark font-medium leading-relaxed">
                      <div>{selectedOrder.customer.shippingAddress.street || "Street address not provided"}</div>
                      <div>
                        {selectedOrder.customer.shippingAddress.city ? `${selectedOrder.customer.shippingAddress.city}, ` : ""}
                        {selectedOrder.customer.shippingAddress.state || ""}
                      </div>
                      <div>
                        PIN Code: <strong className="text-saffron-700">{selectedOrder.customer.shippingAddress.postalCode || "N/A"}</strong>
                      </div>
                      <div className="text-vedic-muted text-[11px]">{selectedOrder.customer.shippingAddress.country || "India"}</div>
                    </div>
                  ) : (
                    <div className="text-vedic-muted italic">Address not available</div>
                  )}
                </div>
              </div>

              {selectedOrder.customer.orderNotes && (
                <div className="pt-2 border-t border-border/80">
                  <span className="text-vedic-muted block">Customer Delivery Notes / Landmarks:</span>
                  <p className="text-xs text-vedic-dark italic bg-white p-2.5 rounded-xl border border-border mt-1">
                    &ldquo;{selectedOrder.customer.orderNotes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Ordered Products */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vedic-dark">
                Items In This Parcel
              </h4>
              <div className="divide-y divide-border/60 bg-ivory rounded-2xl border border-border p-4">
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-border shrink-0">
                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-vedic-dark text-xs">{item.productName}</div>
                        <div className="text-[11px] text-vedic-muted">
                          Qty: <strong className="text-vedic-dark">{item.quantity}</strong> × ₹{item.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                    <div className="font-serif font-bold text-xs text-vedic-dark">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}

                <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-xs">
                  <span className="text-vedic-muted">Total Amount Billed:</span>
                  <span className="font-serif text-base font-bold text-saffron-700">
                    ₹{selectedOrder.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Razorpay Audit Info */}
            <div className="p-3 bg-white rounded-xl border border-border text-[11px] text-vedic-muted space-y-1">
              <div className="flex justify-between">
                <span>Razorpay Order ID:</span>
                <span className="font-mono text-vedic-dark">{selectedOrder.razorpayOrderId || "N/A"}</span>
              </div>
              {selectedOrder.paymentId && (
                <div className="flex justify-between">
                  <span>Razorpay Payment ID:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedOrder.paymentId}</span>
                </div>
              )}
            </div>

            {/* Fulfillment Status Controls & Communication */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-vedic-muted text-xs font-medium mb-1">
                    Update Parcel Fulfillment Status
                  </label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)}
                    className="w-full p-2 bg-ivory rounded-xl border border-border text-xs font-semibold text-vedic-dark focus:outline-hidden"
                  >
                    <option value="processing">Processing (Preparing & Consecration)</option>
                    <option value="shipped">Shipped (Dispatched from Rishikesh)</option>
                    <option value="delivered">Delivered (Successfully Handed Over)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <a
                    href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hari Om ${selectedOrder.customer.fullName} ji! This is Astro Raj Rishikesh regarding your order #${selectedOrder.orderNumber}. Your consecrated package has been updated to "${selectedOrder.orderStatus.toUpperCase()}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                  <a
                    href={`tel:${selectedOrder.customer.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ivory hover:bg-ivory-card border border-border text-xs font-semibold text-vedic-dark"
                  >
                    <Phone className="w-3.5 h-3.5 text-vedic-muted" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
