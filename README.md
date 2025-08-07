# QR Code Generator Web App

A modern, responsive web application for generating QR codes online. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Real-time QR Code Generation**: Generate QR codes instantly as you type
- **Customizable Design**: 
  - Adjust QR code size and border
  - Custom fill and background colors
  - Live preview of changes
- **Download Functionality**: Save QR codes as PNG files
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Error Handling**: User-friendly error messages and validation

## 🚀 Live Demo

Visit the application to start generating QR codes: [Your Deployed URL]

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **QR Code Generation**: qrcode library
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   cd qr-code-generator-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repo
- **DigitalOcean App Platform**: Select Next.js as the framework

## 🎨 Customization

### Styling
The app uses Tailwind CSS. You can customize the design by modifying:
- `src/components/QRCodeGenerator.tsx` - Main component styling
- `src/app/globals.css` - Global styles

### Features
Add new features by extending the QRCodeGenerator component:
- Additional QR code options
- Different output formats
- Analytics integration
- User preferences storage

## 📱 Usage

1. **Enter a Website URL**: Type any website URL (e.g., "google.com" or "https://example.com")
2. **Customize Settings**:
   - Adjust QR code size (1-20)
   - Set border size (0-10)
   - Choose fill and background colors
3. **Generate QR Code**: Click "Generate QR Code" to create the QR code
4. **Preview**: See the generated QR code in real-time
5. **Download**: Click "Download QR Code" to save as PNG

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   └── QRCodeGenerator.tsx  # Main QR generator component
```

### Adding New Features

1. **New QR Code Options**:
   ```typescript
   // Add to QRCodeGenerator component
   const [errorCorrection, setErrorCorrection] = useState('L');
   ```

2. **Additional Output Formats**:
   ```typescript
   // Add SVG export
   const generateSVG = async () => {
     const svg = await QRCode.toString(url, { type: 'svg' });
     // Handle SVG download
   };
   ```

## 🐛 Troubleshooting

### Common Issues

1. **QR Code Not Generating**:
   - Check that the URL is valid
   - Ensure the URL doesn't contain special characters
   - Try adding `https://` to the URL

2. **Download Not Working**:
   - Check browser permissions
   - Try a different browser
   - Ensure the QR code was generated successfully

3. **Build Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run build`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the Next.js documentation

---

**Built with ❤️ using Next.js and Tailwind CSS**
