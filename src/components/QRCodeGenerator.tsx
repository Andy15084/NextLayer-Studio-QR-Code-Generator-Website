'use client';

import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import {
    Globe,
    FileText,
    Link,
    User,
    Briefcase,
    Play,
    Image as ImageIcon,
    Facebook,
    Instagram,
    MessageSquare,
    Music,
    Menu,
    Smartphone,
    Tag,
    Wifi,
    ChevronRight,
    Download,
    Palette,
    Settings,
    Mail,
    Phone,
    MapPin,
    Calendar
} from 'lucide-react';

type QRCodeType = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    fields: FormField[];
};

type FormField = {
    id: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
};

const qrCodeTypes: QRCodeType[] = [
    {
        id: 'website',
        title: 'Webová stránka',
        description: 'Odkaz na ľubovoľnú webovú adresu URL',
        icon: Globe,
        fields: [
            {
                id: 'url',
                label: 'URL adresa',
                type: 'url',
                placeholder: 'https://example.com',
                required: true
            }
        ]
    },
    {
        id: 'vcard',
        title: 'vCard',
        description: 'Zdieľajte svoju elektronickú vizitku',
        icon: User,
        fields: [
            { id: 'firstName', label: 'Meno', type: 'text', placeholder: 'Ján', required: true },
            { id: 'lastName', label: 'Priezvisko', type: 'text', placeholder: 'Novák', required: true },
            { id: 'company', label: 'Spoločnosť', type: 'text', placeholder: 'NextLayer Studio' },
            { id: 'title', label: 'Pozícia', type: 'text', placeholder: 'Developer' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'jan.novak@example.com' },
            { id: 'phone', label: 'Telefón', type: 'tel', placeholder: '+421 123 456 789' },
            { id: 'website', label: 'Webová stránka', type: 'url', placeholder: 'https://example.com' },
            { id: 'address', label: 'Adresa', type: 'textarea', placeholder: 'Hlavná ulica 123, Bratislava' }
        ]
    },
    {
        id: 'email',
        title: 'Email',
        description: 'Odošlite email s predmetom a textom',
        icon: Mail,
        fields: [
            { id: 'email', label: 'Email adresa', type: 'email', placeholder: 'recipient@example.com', required: true },
            { id: 'subject', label: 'Predmet', type: 'text', placeholder: 'Predmet emailu', required: true },
            { id: 'body', label: 'Text emailu', type: 'textarea', placeholder: 'Text správy...', required: true }
        ]
    },
    {
        id: 'phone',
        title: 'Telefón',
        description: 'Zavolajte na telefónne číslo',
        icon: Phone,
        fields: [
            { id: 'phone', label: 'Telefónne číslo', type: 'tel', placeholder: '+421 123 456 789', required: true }
        ]
    },
    {
        id: 'sms',
        title: 'SMS',
        description: 'Pošlite SMS správu',
        icon: MessageSquare,
        fields: [
            { id: 'phone', label: 'Telefónne číslo', type: 'tel', placeholder: '+421 123 456 789', required: true },
            { id: 'message', label: 'SMS správa', type: 'textarea', placeholder: 'Text SMS správy...', required: true }
        ]
    },
    {
        id: 'wifi',
        title: 'WiFi',
        description: 'Pripojte sa k sieti Wi-Fi',
        icon: Wifi,
        fields: [
            { id: 'ssid', label: 'Názov siete (SSID)', type: 'text', placeholder: 'MojaWiFi', required: true },
            { id: 'password', label: 'Heslo', type: 'text', placeholder: 'heslo123' },
            {
                id: 'encryption', label: 'Typ šifrovania', type: 'select', options: [
                    { value: 'WPA', label: 'WPA/WPA2/WPA3' },
                    { value: 'WEP', label: 'WEP' },
                    { value: 'nopass', label: 'Bez hesla' }
                ], required: true
            }
        ]
    },
    {
        id: 'location',
        title: 'Poloha',
        description: 'Zdieľajte GPS súradnice',
        icon: MapPin,
        fields: [
            { id: 'latitude', label: 'Zemepisná šírka', type: 'text', placeholder: '48.1486', required: true },
            { id: 'longitude', label: 'Zemepisná dĺžka', type: 'text', placeholder: '17.1077', required: true },
            { id: 'name', label: 'Názov miesta', type: 'text', placeholder: 'Bratislava, Slovensko' }
        ]
    },
    {
        id: 'calendar',
        title: 'Kalendár',
        description: 'Pridajte udalosť do kalendára',
        icon: Calendar,
        fields: [
            { id: 'title', label: 'Názov udalosti', type: 'text', placeholder: 'Dôležitá schôdzka', required: true },
            { id: 'startDate', label: 'Dátum začiatku', type: 'text', placeholder: '2024-01-15', required: true },
            { id: 'startTime', label: 'Čas začiatku', type: 'text', placeholder: '14:00' },
            { id: 'endDate', label: 'Dátum konca', type: 'text', placeholder: '2024-01-15' },
            { id: 'endTime', label: 'Čas konca', type: 'text', placeholder: '15:00' },
            { id: 'description', label: 'Popis', type: 'textarea', placeholder: 'Popis udalosti...' },
            { id: 'location', label: 'Miesto', type: 'text', placeholder: 'Bratislava, Slovensko' }
        ]
    },
    {
        id: 'pdf',
        title: 'PDF',
        description: 'Ukázať súbor PDF',
        icon: FileText,
        fields: [
            { id: 'url', label: 'URL PDF súboru', type: 'url', placeholder: 'https://example.com/document.pdf', required: true }
        ]
    },
    {
        id: 'links',
        title: 'Zoznam odkazov',
        description: 'Zdieľajte viacero odkazov',
        icon: Link,
        fields: [
            { id: 'links', label: 'Odkazy (jeden na riadok)', type: 'textarea', placeholder: 'https://example1.com\nhttps://example2.com\nhttps://example3.com', required: true }
        ]
    },
    {
        id: 'business',
        title: 'Podnikanie',
        description: 'Zdieľajte informácie o svojej firme',
        icon: Briefcase,
        fields: [
            { id: 'name', label: 'Názov firmy', type: 'text', placeholder: 'NextLayer Studio', required: true },
            { id: 'description', label: 'Popis firmy', type: 'textarea', placeholder: 'Popis vašej firmy...' },
            { id: 'phone', label: 'Telefón', type: 'tel', placeholder: '+421 123 456 789' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'info@example.com' },
            { id: 'website', label: 'Webová stránka', type: 'url', placeholder: 'https://example.com' },
            { id: 'address', label: 'Adresa', type: 'textarea', placeholder: 'Hlavná ulica 123, Bratislava' }
        ]
    },
    {
        id: 'video',
        title: 'Video',
        description: 'Zobraziť video',
        icon: Play,
        fields: [
            { id: 'url', label: 'URL videa', type: 'url', placeholder: 'https://youtube.com/watch?v=...', required: true }
        ]
    },
    {
        id: 'images',
        title: 'Obrázky',
        description: 'Zdieľajte viacero obrázkov',
        icon: ImageIcon,
        fields: [
            { id: 'images', label: 'URL obrázkov (jeden na riadok)', type: 'textarea', placeholder: 'https://example.com/image1.jpg\nhttps://example.com/image2.jpg', required: true }
        ]
    },
    {
        id: 'facebook',
        title: 'Facebook',
        description: 'Zdieľajte svoju stránku na Facebooku',
        icon: Facebook,
        fields: [
            { id: 'url', label: 'URL Facebook stránky', type: 'url', placeholder: 'https://facebook.com/yourpage', required: true }
        ]
    },
    {
        id: 'instagram',
        title: 'Instagram',
        description: 'Zdieľajte svoj Instagram',
        icon: Instagram,
        fields: [
            { id: 'username', label: 'Instagram používateľské meno', type: 'text', placeholder: 'yourusername', required: true }
        ]
    },
    {
        id: 'whatsapp',
        title: 'WhatsApp',
        description: 'Získajte správy WhatsApp',
        icon: MessageSquare,
        fields: [
            { id: 'phone', label: 'Telefónne číslo', type: 'tel', placeholder: '+421 123 456 789', required: true },
            { id: 'message', label: 'Predvolená správa', type: 'textarea', placeholder: 'Ahoj! Chcel by som sa informovať...' }
        ]
    },
    {
        id: 'mp3',
        title: 'MP3',
        description: 'Zdieľanie zvukového súboru',
        icon: Music,
        fields: [
            { id: 'url', label: 'URL MP3 súboru', type: 'url', placeholder: 'https://example.com/song.mp3', required: true }
        ]
    },
    {
        id: 'menu',
        title: 'Menu',
        description: 'Vytvorte menu reštaurácie',
        icon: Menu,
        fields: [
            { id: 'restaurantName', label: 'Názov reštaurácie', type: 'text', placeholder: 'Moja Reštaurácia', required: true },
            { id: 'menuItems', label: 'Položky menu (jeden na riadok)', type: 'textarea', placeholder: 'Pizza Margherita - 12€\nŠpagety Carbonara - 10€\nSalát César - 8€', required: true }
        ]
    },
    {
        id: 'apps',
        title: 'Aplikácie',
        description: 'Presmerovanie do obchodu s aplikáciami',
        icon: Smartphone,
        fields: [
            { id: 'appName', label: 'Názov aplikácie', type: 'text', placeholder: 'Moja Aplikácia', required: true },
            {
                id: 'platform', label: 'Platforma', type: 'select', options: [
                    { value: 'ios', label: 'iOS App Store' },
                    { value: 'android', label: 'Google Play Store' },
                    { value: 'both', label: 'Obe platformy' }
                ], required: true
            },
            { id: 'appId', label: 'ID aplikácie', type: 'text', placeholder: 'com.example.app' }
        ]
    },
    {
        id: 'coupon',
        title: 'Kupón',
        description: 'Zdieľajte kupón',
        icon: Tag,
        fields: [
            { id: 'title', label: 'Názov kupónu', type: 'text', placeholder: 'Zľava 20%', required: true },
            { id: 'code', label: 'Kód kupónu', type: 'text', placeholder: 'SAVE20', required: true },
            { id: 'description', label: 'Popis', type: 'textarea', placeholder: 'Zľava 20% na všetok tovar...' },
            { id: 'validUntil', label: 'Platný do', type: 'text', placeholder: '2024-12-31' }
        ]
    }
];

const QRCodeGenerator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [previewDataUrl, setPreviewDataUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    // Customization options
    const [fillColor, setFillColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [qrSize, setQrSize] = useState(10);
    const [borderSize, setBorderSize] = useState(4);
    const [hasTransparentBackground, setHasTransparentBackground] = useState(false);
    const [hasRoundedCorners, setHasRoundedCorners] = useState(false);
    const [qrComplexity, setQrComplexity] = useState('M'); // L, M, Q, H

    // Calculate size in cm (assuming 96 DPI)
    const sizeInCm = Math.round((qrSize * 400 * 2.54) / 96) / 10;

    const generateQRContent = useCallback(() => {
        if (!selectedType) return '';

        let qrContent = '';

        // Generate QR content based on type
        switch (selectedType.id) {
            case 'website':
                qrContent = formData.url || '';
                break;
            case 'vcard':
                qrContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.firstName || ''} ${formData.lastName || ''}\nORG:${formData.company || ''}\nTITLE:${formData.title || ''}\nEMAIL:${formData.email || ''}\nTEL:${formData.phone || ''}\nURL:${formData.website || ''}\nADR:${formData.address || ''}\nEND:VCARD`;
                break;
            case 'email':
                qrContent = `mailto:${formData.email || ''}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`;
                break;
            case 'phone':
                qrContent = `tel:${formData.phone || ''}`;
                break;
            case 'sms':
                qrContent = `sms:${formData.phone || ''}?body=${encodeURIComponent(formData.message || '')}`;
                break;
            case 'wifi':
                const encryption = formData.encryption || 'WPA';
                qrContent = `WIFI:T:${encryption};S:${formData.ssid || ''};P:${formData.password || ''};;`;
                break;
            case 'location':
                qrContent = `geo:${formData.latitude || ''},${formData.longitude || ''}?q=${encodeURIComponent(formData.name || '')}`;
                break;
            case 'calendar':
                qrContent = `BEGIN:VEVENT\nSUMMARY:${formData.title || ''}\nDTSTART:${formData.startDate || ''}T${formData.startTime || '00:00'}:00\nDTEND:${formData.endDate || formData.startDate || ''}T${formData.endTime || '23:59'}:00\nDESCRIPTION:${formData.description || ''}\nLOCATION:${formData.location || ''}\nEND:VEVENT`;
                break;
            default:
                qrContent = Object.values(formData).join('\n');
        }

        return qrContent;
    }, [selectedType, formData]);

    const generatePreview = useCallback(async () => {
        const qrContent = generateQRContent();
        if (!qrContent.trim()) return;

        try {
            const options: QRCode.QRCodeToDataURLOptions = {
                width: 200,
                margin: borderSize,
                color: {
                    dark: fillColor,
                    light: hasTransparentBackground ? '#00000000' : backgroundColor,
                },
                errorCorrectionLevel: qrComplexity as 'L' | 'M' | 'Q' | 'H',
            };

            const dataUrl = await QRCode.toDataURL(qrContent, options);
            setPreviewDataUrl(dataUrl);
        } catch (err) {
            console.error('Preview generation error:', err);
        }
    }, [fillColor, backgroundColor, borderSize, hasTransparentBackground, qrComplexity, generateQRContent]);

    // Generate preview when customization options change
    useEffect(() => {
        if (currentStep === 3 && generateQRContent().trim()) {
            generatePreview();
        }
    }, [currentStep, generateQRContent, generatePreview]);

    const generateQRCode = useCallback(async () => {
        if (!selectedType) return;

        setIsGenerating(true);
        setError('');

        try {
            const qrContent = generateQRContent();

            if (!qrContent.trim()) {
                setError('Please fill in all required fields');
                return;
            }

            const options: QRCode.QRCodeToDataURLOptions = {
                width: qrSize * 400,
                margin: borderSize,
                color: {
                    dark: fillColor,
                    light: hasTransparentBackground ? '#00000000' : backgroundColor,
                },
                errorCorrectionLevel: qrComplexity as 'L' | 'M' | 'Q' | 'H',
            };

            const qrCodeDataUrl = await QRCode.toDataURL(qrContent, options);
            setQrCodeDataUrl(qrCodeDataUrl);
            setCurrentStep(4);
        } catch (err) {
            setError('Failed to generate QR code. Please check your data and try again.');
            console.error('QR Code generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    }, [selectedType, qrSize, borderSize, hasTransparentBackground, backgroundColor, fillColor, qrComplexity, generateQRContent]);

    const downloadQRCode = useCallback(() => {
        if (!qrCodeDataUrl) {
            setError('Please generate a QR code first');
            return;
        }

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `${selectedType?.id || 'qr'}-code-${timestamp}.png`;

        link.download = filename;
        link.href = qrCodeDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [qrCodeDataUrl, selectedType]);

    const resetToStep1 = useCallback(() => {
        setCurrentStep(1);
        setSelectedType(null);
        setFormData({});
        setQrCodeDataUrl('');
        setPreviewDataUrl('');
        setError('');
        setFillColor('#000000');
        setBackgroundColor('#FFFFFF');
        setQrSize(10);
        setBorderSize(4);
        setHasTransparentBackground(false);
        setHasRoundedCorners(false);
        setQrComplexity('M');
    }, []);

    const handleInputChange = useCallback((fieldId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    }, []);

    const getStepContent = useCallback(() => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
                                Choose QR Code Type
                            </h2>
                            <p className="text-gray-600 text-lg">Select what type of content you want to encode</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {qrCodeTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setFormData({});
                                        setCurrentStep(2);
                                    }}
                                    className="group relative p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 text-left hover:scale-105 shadow-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <type.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-sm">{type.title}</h3>
                                            <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                if (!selectedType) return null;
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl">
                                    <selectedType.icon className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                    {selectedType.title}
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg">Fill in the details for your QR code</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-6">
                                {selectedType.fields.map((field) => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={formData[field.id] || ''}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-6 py-4 border border-gray-300 bg-white rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 shadow-lg"
                                                rows={4}
                                            />
                                        ) : field.type === 'select' ? (
                                            <select
                                                value={formData[field.id] || ''}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                className="w-full px-6 py-4 border border-gray-300 bg-white rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-900 shadow-lg"
                                            >
                                                <option value="">Select an option</option>
                                                {field.options?.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={formData[field.id] || ''}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-6 py-4 border border-gray-300 bg-white rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    disabled={!Object.keys(formData).some(key => formData[key]?.trim())}
                                    className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-2xl hover:from-cyan-500 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl">
                                    <Palette className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                    Customize QR Code
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg">Adjust the appearance of your QR code</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                    <h3 className="font-semibold text-gray-900 mb-4">Customization Options</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                QR Code Size: {qrSize} ({sizeInCm} cm)
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={qrSize}
                                                onChange={(e) => setQrSize(Number(e.target.value))}
                                                className="w-full h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>1 ({Math.round((1 * 400 * 2.54) / 96) / 10} cm)</span>
                                                <span>20 ({Math.round((20 * 400 * 2.54) / 96) / 10} cm)</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Border Size: {borderSize}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={borderSize}
                                                onChange={(e) => setBorderSize(Number(e.target.value))}
                                                className="w-full h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                QR Code Complexity
                                            </label>
                                            <select
                                                value={qrComplexity}
                                                onChange={(e) => setQrComplexity(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-900 shadow-lg"
                                            >
                                                <option value="L">Low (7% recovery)</option>
                                                <option value="M">Medium (15% recovery)</option>
                                                <option value="Q">Quartile (25% recovery)</option>
                                                <option value="H">High (30% recovery)</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Fill Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={fillColor}
                                                    onChange={(e) => setFillColor(e.target.value)}
                                                    className="w-full h-12 border border-gray-300 rounded-2xl cursor-pointer bg-white shadow-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Background Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={backgroundColor}
                                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                                    disabled={hasTransparentBackground}
                                                    className={`w-full h-12 border border-gray-300 rounded-2xl cursor-pointer bg-white shadow-lg ${hasTransparentBackground ? 'opacity-50' : ''}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="transparentBackground"
                                                    checked={hasTransparentBackground}
                                                    onChange={(e) => setHasTransparentBackground(e.target.checked)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                />
                                                <label htmlFor="transparentBackground" className="text-sm font-medium text-gray-700">
                                                    Transparent Background (PNG)
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="roundedCorners"
                                                    checked={hasRoundedCorners}
                                                    onChange={(e) => setHasRoundedCorners(e.target.checked)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                />
                                                <label htmlFor="roundedCorners" className="text-sm font-medium text-gray-700">
                                                    Rounded Corners
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={generateQRCode}
                                        disabled={isGenerating}
                                        className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-2xl hover:from-cyan-500 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                    >
                                        {isGenerating ? 'Generating...' : 'Generate QR Code'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg flex items-center justify-center min-h-[400px]">
                                {previewDataUrl ? (
                                    <div className="text-center">
                                        <div className={`inline-block ${hasRoundedCorners ? 'rounded-3xl' : ''} overflow-hidden shadow-2xl`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={previewDataUrl}
                                                alt="QR Code Preview"
                                                className="max-w-full max-h-80 mx-auto"
                                                style={{
                                                    backgroundColor: hasTransparentBackground ? 'transparent' : backgroundColor
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-4">
                                            Preview - {sizeInCm} cm
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-xl font-medium">Preview</p>
                                        <p className="text-sm">Your QR code will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                if (!selectedType) return null;
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl">
                                    <Download className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                    Download QR Code
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg">Your QR code is ready to download</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                    <h3 className="font-semibold text-gray-900 mb-4">QR Code Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Type:</span>
                                            <span className="font-medium">{selectedType.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Size:</span>
                                            <span className="font-medium">{sizeInCm} cm</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Complexity:</span>
                                            <span className="font-medium">
                                                {qrComplexity === 'L' ? 'Low' : qrComplexity === 'M' ? 'Medium' : qrComplexity === 'Q' ? 'Quartile' : 'High'}
                                            </span>
                                        </div>
                                        {Object.entries(formData).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-gray-600">{key}:</span>
                                                <span className="font-medium truncate max-w-[200px]" title={value}>
                                                    {value && value.length > 30 ? value.substring(0, 30) + '...' : value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={resetToStep1}
                                        className="px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
                                    >
                                        Create New QR Code
                                    </button>
                                    <button
                                        onClick={downloadQRCode}
                                        className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-2xl hover:from-cyan-500 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download QR Code</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                                <div className="flex items-center justify-center">
                                    <div className={`inline-block ${hasRoundedCorners ? 'rounded-3xl' : ''} overflow-hidden shadow-2xl`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={qrCodeDataUrl}
                                            alt="Generated QR Code"
                                            className="max-w-full max-h-80 mx-auto"
                                            style={{
                                                backgroundColor: hasTransparentBackground ? 'transparent' : backgroundColor
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Scan this QR code to access your content
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }, [currentStep, selectedType, formData, qrSize, borderSize, hasTransparentBackground, backgroundColor, fillColor, qrComplexity, sizeInCm, hasRoundedCorners, previewDataUrl, qrCodeDataUrl, isGenerating, error, resetToStep1, downloadQRCode, generateQRCode, handleInputChange]);

    const steps = [
        { number: 1, title: 'Choose Type', active: currentStep >= 1 },
        { number: 2, title: 'Add Content', active: currentStep >= 2 },
        { number: 3, title: 'Customize', active: currentStep >= 3 },
        { number: 4, title: 'Download', active: currentStep >= 4 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-cyan-100">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="relative w-28 h-28">
                                <Image
                                    src="/Asset 3.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                QR Code Generator
                            </span>
                        </div>

                        {/* Steps Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.number}>
                                    <button
                                        onClick={() => {
                                            if (step.active) {
                                                setCurrentStep(step.number);
                                            }
                                        }}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${currentStep === step.number
                                            ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg'
                                            : step.active
                                                ? 'bg-white/60 backdrop-blur-lg text-gray-700 hover:bg-white/80 border border-gray-200'
                                                : 'text-gray-400 cursor-not-allowed bg-gray-100'
                                            }`}
                                        disabled={!step.active}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === step.number
                                            ? 'bg-white/20'
                                            : step.active
                                                ? 'bg-cyan-400/20'
                                                : 'bg-gray-200'
                                            }`}>
                                            {step.number}
                                        </div>
                                        <span className="font-medium">{step.title}</span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div className={`w-8 h-0.5 ${currentStep > step.number
                                            ? 'bg-gradient-to-r from-cyan-400 to-purple-600'
                                            : 'bg-gray-300'
                                            }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Steps Indicator */}
                <div className="md:hidden mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= step.number
                                        ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {step.number}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-8 h-1 mx-2 ${currentStep > step.number ? 'bg-gradient-to-r from-cyan-400 to-purple-600' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8">
                    {getStepContent()}
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-600">
                    <p className="bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-200 inline-block shadow-lg">
                        Created with ❤️ by NextLayer Studio
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator; 