export interface Recipient {
  email: string;
  name?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface BrandStyle {
  primaryColor: string;
  secondaryColor: string;
  actionColor: string;
  fontFamily: string;
  secondaryFont: string;
}

export const ORATORA_BRAND: BrandStyle = {
  primaryColor: '#000066', // Deep Navy Blue
  secondaryColor: '#996633', // Brown
  actionColor: '#11B018', // Action Green
  fontFamily: 'Montserrat, sans-serif',
  secondaryFont: 'Poppins, sans-serif',
};

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  preheader?: string;
  category?: string;
  thumbnail?: string;
  layoutType?: 'mosaic' | 'alternating' | 'triple-column' | 'card-deck' | 'standard';
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'sent';
  createdAt: string;
  recipientsCount: number;
}

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
  contentPadding: string;
  contentWidth: string;
  headerFontSize: string;
  bodyFontSize: string;
  lineHeight: string;
  headerAlignment: 'left' | 'center' | 'right';
  buttonPadding: string;
  sectionSpacing: string;
  senderName: string;
  senderEmail: string;
  customFont?: {
    name: string;
    data: string; // base64 data URL
    format: string;
  };
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  primaryColor: '#64FFDA',
  secondaryColor: '#0A192F',
  backgroundColor: '#F8FAFC',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '1rem',
  contentPadding: '2rem',
  contentWidth: '600px',
  headerFontSize: '2rem',
  bodyFontSize: '1rem',
  lineHeight: '1.6',
  headerAlignment: 'center',
  buttonPadding: '1rem 2rem',
  sectionSpacing: '2rem',
  senderName: 'Oratora Odyssey',
  senderEmail: 'noreply@oratora.com',
  customFont: undefined,
};
