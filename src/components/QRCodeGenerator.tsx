'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator: React.FC = () => {
    const [url, setUrl] = useState('');
    const [filename, setFilename] = useState('');
    const [qrSize, setQrSize] = useState(10);
    const [borderSize, setBorderSize] = useState(4);
    const [fillColor, setFillColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const generateQRCode = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            // Add https:// if no protocol specified
            let processedUrl = url.trim();
            if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
                processedUrl = 'https://' + processedUrl;
            }

            // Generate QR code
            const qrCodeDataUrl = await QRCode.toDataURL(processedUrl, {
                width: 400,
                margin: borderSize,
                color: {
                    dark: fillColor,
                    light: backgroundColor,
                },
            });

            setQrCodeDataUrl(qrCodeDataUrl);
        } catch (err) {
            setError('Failed to generate QR code. Please check your URL and try again.');
            console.error('QR Code generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeDataUrl) {
            setError('Please generate a QR code first');
            return;
        }

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const defaultFilename = filename.trim() || `qr-code-${timestamp}`;
        const finalFilename = defaultFilename.endsWith('.png') ? defaultFilename : `${defaultFilename}.png`;

        link.download = finalFilename;
        link.href = qrCodeDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearAll = () => {
        setUrl('');
        setFilename('');
        setQrSize(10);
        setBorderSize(4);
        setFillColor('#000000');
        setBackgroundColor('#FFFFFF');
        setQrCodeDataUrl('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        QR Code Generator
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Create beautiful QR codes for any website
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Panel - Controls */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Settings
                        </h2>

                        {/* URL Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website URL *
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter website URL (e.g., google.com)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filename Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filename (optional)
                            </label>
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Enter filename (e.g., my-qr-code)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* QR Code Size */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                QR Code Size: {qrSize}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={qrSize}
                                onChange={(e) => setQrSize(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Border Size */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Border Size: {borderSize}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={borderSize}
                                onChange={(e) => setBorderSize(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fill Color
                                </label>
                                <input
                                    type="color"
                                    value={fillColor}
                                    onChange={(e) => setFillColor(e.target.value)}
                                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
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
                                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={generateQRCode}
                                disabled={isGenerating}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {isGenerating ? 'Generating...' : 'Generate QR Code'}
                            </button>
                            <button
                                onClick={downloadQRCode}
                                disabled={!qrCodeDataUrl}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Download QR Code
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Preview
                        </h2>

                        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            {qrCodeDataUrl ? (
                                <div className="text-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={qrCodeDataUrl}
                                        alt="Generated QR Code"
                                        className="max-w-full max-h-80 mx-auto shadow-lg rounded-lg"
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        Scan this QR code to visit the website
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <div className="text-6xl mb-4">📱</div>
                                    <p className="text-lg font-medium">QR Code Preview</p>
                                    <p className="text-sm">Generate a QR code to see it here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-600">
                    <p>
                        Created with ❤️ by NextLayer Studio
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator; 