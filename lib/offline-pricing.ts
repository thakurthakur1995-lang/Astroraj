export type OfflineMeetingPreference = "rishikesh_office" | "onsite_visit";
export type OfflineLocationType = "rishikesh_area" | "outsider";

export interface OfflineServiceConfig {
  serviceId: string;
  slug?: string;
  title: string;
  categoryId: "astrology" | "vastu" | "puja" | "mantra-diksha" | "ayurveda" | "gemstones";
  allowedPreferences: OfflineMeetingPreference[];
  officePrice?: number;
  onsiteRishikeshPrice?: number;
  onsiteOutsiderPrice?: number;
  requiresOutsiderHospitality?: boolean;
  notice?: string;
  isDirectContactOnly?: boolean;
}

export const OFFLINE_SERVICES_CONFIG: Record<string, OfflineServiceConfig> = {
  // =========================================================================
  // 1. ASTROLOGY CONSULTATION
  // =========================================================================
  "personal-consultation": {
    serviceId: "personal-consultation",
    title: "Personal Astrology Consultation",
    categoryId: "astrology",
    allowedPreferences: ["rishikesh_office", "onsite_visit"],
    officePrice: 21000,
    onsiteRishikeshPrice: 31000,
    onsiteOutsiderPrice: 99100,
    requiresOutsiderHospitality: true,
  },
  "kundli-analysis": {
    serviceId: "kundli-analysis",
    title: "In-depth Kundli Analysis & Disha Check",
    categoryId: "astrology",
    allowedPreferences: ["rishikesh_office", "onsite_visit"],
    officePrice: 21000,
    onsiteRishikeshPrice: 31000,
    onsiteOutsiderPrice: 99100,
    requiresOutsiderHospitality: true,
  },
  "career-business-consultation": {
    serviceId: "career-business-consultation",
    title: "Career & Business Guidance",
    categoryId: "astrology",
    allowedPreferences: ["rishikesh_office", "onsite_visit"],
    officePrice: 21000,
    onsiteRishikeshPrice: 31000,
    onsiteOutsiderPrice: 99100,
    requiresOutsiderHospitality: true,
  },
  "marriage-relationship-consultation": {
    serviceId: "marriage-relationship-consultation",
    title: "Marriage & Relationship Compatibility",
    categoryId: "astrology",
    allowedPreferences: ["rishikesh_office", "onsite_visit"],
    officePrice: 21000,
    onsiteRishikeshPrice: 31000,
    onsiteOutsiderPrice: 99100,
    requiresOutsiderHospitality: true,
  },

  // =========================================================================
  // 2. VASTU CONSULTATION (ONLY ON-SITE VISIT)
  // =========================================================================
  "residential-vastu-consultation": {
    serviceId: "residential-vastu-consultation",
    title: "Residential Vastu Consultation (Homes, Flats & Villas)",
    categoryId: "vastu",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 51000,
    onsiteOutsiderPrice: 121000,
    requiresOutsiderHospitality: true,
  },
  "commercial-office-vastu": {
    serviceId: "commercial-office-vastu",
    title: "Commercial & Office Vastu Consultation",
    categoryId: "vastu",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 98000,
    onsiteOutsiderPrice: 148000,
    requiresOutsiderHospitality: true,
  },
  "industrial-factory-vastu": {
    serviceId: "industrial-factory-vastu",
    title: "Industrial & Factory Vastu Planning",
    categoryId: "vastu",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 98000,
    onsiteOutsiderPrice: 171000,
    requiresOutsiderHospitality: true,
  },
  "astro-vastu-map-analysis": {
    serviceId: "astro-vastu-map-analysis",
    title: "Astro-Vastu & Map Layout Analysis (Non-Demolition)",
    categoryId: "vastu",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 26000,
    onsiteOutsiderPrice: 111000,
    requiresOutsiderHospitality: true,
  },
  "plot-selection-griha-pravesh": {
    serviceId: "plot-selection-griha-pravesh",
    title: "Plot Selection, Shilanyas & Griha Pravesh Vastu",
    categoryId: "vastu",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 26000,
    onsiteOutsiderPrice: 111000,
    requiresOutsiderHospitality: true,
  },

  // =========================================================================
  // 3. POOJA SERVICES (ONLY ON-SITE VISIT + PANDITJI NOTICE)
  // =========================================================================
  "shri-chakra-sahasran-pooja": {
    serviceId: "shri-chakra-sahasran-pooja",
    title: "Shri Chakra Sahasran Pooja",
    categoryId: "puja",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 21000,
    onsiteOutsiderPrice: 51000,
    requiresOutsiderHospitality: true,
    notice: "गुरुजी द्वारा प्रशिक्षित योग्य वैदिक पंडितजी को पूजा कराने आपके स्थान पर भेजा जाएगा। पूज्य गुरुजी से स्वयं पूजा कराने के लिए संपर्क करें।",
  },
  "baglamukhi-brahmastra-pooja": {
    serviceId: "baglamukhi-brahmastra-pooja",
    title: "Maa Baglamukhi Brahmastra Pooja",
    categoryId: "puja",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 21000,
    onsiteOutsiderPrice: 51000,
    requiresOutsiderHospitality: true,
    notice: "गुरुजी द्वारा प्रशिक्षित योग्य वैदिक पंडितजी को पूजा कराने आपके स्थान पर भेजा जाएगा। पूज्य गुरुजी से स्वयं पूजा कराने के लिए संपर्क करें।",
  },
  "sudarshan-chakra-pooja": {
    serviceId: "sudarshan-chakra-pooja",
    title: "Sudarshan Chakra Pooja (Job Promotion & Obstacle Removal)",
    categoryId: "puja",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 15000,
    onsiteOutsiderPrice: 41000,
    requiresOutsiderHospitality: true,
    notice: "गुरुजी द्वारा प्रशिक्षित योग्य वैदिक पंडितजी को पूजा कराने आपके स्थान पर भेजा जाएगा। पूज्य गुरुजी से स्वयं पूजा कराने के लिए संपर्क करें।",
  },
  "vastu-dosh-nivaran-pooja": {
    serviceId: "vastu-dosh-nivaran-pooja",
    title: "Vastu Dosh Nivaran Pooja & Shanti Havan",
    categoryId: "puja",
    allowedPreferences: ["onsite_visit"],
    onsiteRishikeshPrice: 31000,
    onsiteOutsiderPrice: 71000,
    requiresOutsiderHospitality: true,
    notice: "गुरुजी द्वारा प्रशिक्षित योग्य वैदिक पंडितजी को पूजा कराने आपके स्थान पर भेजा जाएगा। पूज्य गुरुजी से स्वयं पूजा कराने के लिए संपर्क करें।",
  },

  // =========================================================================
  // 4. MANTRA DIKSHA & SADHANA (DIRECT CONTACT ONLY FOR ALL 7 DIKSHAS)
  // =========================================================================
  "dash-mahavidya-diksha": {
    serviceId: "dash-mahavidya-diksha",
    title: "Dash Mahavidya Diksha & Sadhana",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "asht-bhairav-diksha": {
    serviceId: "asht-bhairav-diksha",
    title: "Asht Bhairav Diksha & Raksha Vidhi",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "swarnakarshan-bhairav-diksha": {
    serviceId: "swarnakarshan-bhairav-diksha",
    title: "Swarnakarshan Bhairav Maha Diksha (Wealth & Debt Liberation)",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "shiv-diksha": {
    serviceId: "shiv-diksha",
    title: "Lord Shiv Diksha (Sadashiv, Rudra & Mahamrityunjaya)",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "ganesh-diksha": {
    serviceId: "ganesh-diksha",
    title: "Lord Ganesh Diksha (Uchchhishta, Mahaganapati & Haridra)",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "narayan-diksha": {
    serviceId: "narayan-diksha",
    title: "Lord Narayan Diksha (Maha Vishnu, Narayana Kavach & Gopal)",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },
  "sudharshan-diksha": {
    serviceId: "sudharshan-diksha",
    title: "Lord Sudarshan Chakra Maha Diksha",
    categoryId: "mantra-diksha",
    allowedPreferences: ["rishikesh_office"],
    isDirectContactOnly: true,
    notice: "मंत्र दीक्षा एवं साधना सेवाओं में सभी 7 दीक्षा व गोपनीय विधि के लिए पूज्य गुरुजी से सीधे संपर्क करें।",
  },

  // =========================================================================
  // 5. AYURVEDA & WELLNESS (ONLY RISHIKESH OFFICE VISIT)
  // =========================================================================
  "ayurveda-wellness-consultation": {
    serviceId: "ayurveda-wellness-consultation",
    title: "Vedic Lifestyle & Ayurveda Wellness Guidance",
    categoryId: "ayurveda",
    allowedPreferences: ["rishikesh_office"],
    officePrice: 11000,
  },
  "nadi-pariksha-holistic-consultation": {
    serviceId: "nadi-pariksha-holistic-consultation",
    title: "In-Person Nadi Pariksha & Classical Ayurvedic Guidance",
    categoryId: "ayurveda",
    allowedPreferences: ["rishikesh_office"],
    officePrice: 11000,
  },

  // =========================================================================
  // 6. GEMSTONE CONSULTATION (ONLY RISHIKESH OFFICE VISIT)
  // =========================================================================
  "gemstone-consultation": {
    serviceId: "gemstone-consultation",
    title: "Personalized Gemstone Recommendation",
    categoryId: "gemstones",
    allowedPreferences: ["rishikesh_office"],
    officePrice: 9000,
  },
};

/**
 * Returns configuration for a specific offline service by id or slug
 */
export function getOfflineServiceConfig(serviceIdOrSlug: string): OfflineServiceConfig | null {
  if (!serviceIdOrSlug) return null;
  const direct = OFFLINE_SERVICES_CONFIG[serviceIdOrSlug];
  if (direct) return direct;

  const foundKey = Object.keys(OFFLINE_SERVICES_CONFIG).find((k) => {
    const s = OFFLINE_SERVICES_CONFIG[k];
    return s.serviceId === serviceIdOrSlug || s.slug === serviceIdOrSlug;
  });

  return foundKey ? OFFLINE_SERVICES_CONFIG[foundKey] : null;
}

/**
 * Calculates offline pricing and the 50% online advance amount.
 */
export function getOfflinePricing(
  serviceIdOrSlug: string,
  preference: OfflineMeetingPreference,
  locationType: OfflineLocationType = "rishikesh_area"
): {
  serviceTitle: string;
  totalPrice: number;
  advanceAmount: number;
  balanceAmount: number;
  preference: OfflineMeetingPreference;
  locationType?: OfflineLocationType;
  requiresHospitality: boolean;
  hospitalityText?: string;
  notice?: string;
  isDirectContactOnly?: boolean;
} | null {
  const config = getOfflineServiceConfig(serviceIdOrSlug);
  if (!config) return null;

  if (config.isDirectContactOnly) {
    return {
      serviceTitle: config.title,
      totalPrice: 0,
      advanceAmount: 0,
      balanceAmount: 0,
      preference,
      locationType,
      requiresHospitality: false,
      notice: config.notice,
      isDirectContactOnly: true,
    };
  }

  // Determine total price
  let totalPrice = 0;
  let requiresHospitality = false;

  if (preference === "rishikesh_office") {
    if (!config.allowedPreferences.includes("rishikesh_office") || !config.officePrice) {
      // Fallback or invalid preference
      return null;
    }
    totalPrice = config.officePrice;
  } else if (preference === "onsite_visit") {
    if (!config.allowedPreferences.includes("onsite_visit")) {
      return null;
    }
    if (locationType === "outsider") {
      totalPrice = config.onsiteOutsiderPrice || 0;
      requiresHospitality = !!config.requiresOutsiderHospitality;
    } else {
      totalPrice = config.onsiteRishikeshPrice || 0;
    }
  }

  if (totalPrice <= 0) return null;

  const advanceAmount = Math.round(totalPrice / 2);
  const balanceAmount = totalPrice - advanceAmount;

  return {
    serviceTitle: config.title,
    totalPrice,
    advanceAmount,
    balanceAmount,
    preference,
    locationType: preference === "onsite_visit" ? locationType : undefined,
    requiresHospitality,
    hospitalityText: requiresHospitality ? "+ Khana and Rehna (Food & Accommodation) customer ki side se hoga" : undefined,
    notice: config.notice,
    isDirectContactOnly: false,
  };
}

/**
 * Returns minimum starting price for offline consultation of a service
 */
export function getOfflineStartingPrice(serviceIdOrSlug: string): number {
  const config = getOfflineServiceConfig(serviceIdOrSlug);
  if (!config || config.isDirectContactOnly) return 0;

  const prices: number[] = [];
  if (config.officePrice) prices.push(config.officePrice);
  if (config.onsiteRishikeshPrice) prices.push(config.onsiteRishikeshPrice);
  if (config.onsiteOutsiderPrice) prices.push(config.onsiteOutsiderPrice);

  return prices.length > 0 ? Math.min(...prices) : 0;
}

