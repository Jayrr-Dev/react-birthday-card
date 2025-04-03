# Interactive Birthday Card

An elegant, interactive digital birthday card built with Next.js and React, featuring smooth animations and a modern design.

<!-- ![Birthday Card Preview](/Assets/preview.png) -->

## ✨ Features

- **Animated Card Interaction**: Beautiful 3D flip animation with smooth transitions
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Customizable**: Easily change colors, text, and images to personalize the card
- **Gift Voucher Integration**: Built-in form to claim a special gift voucher
- **Confetti Effects**: Celebratory animations when opening the card
- **Modern UI**: Built with Tailwind CSS, shadcn/ui, and Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/birthday-card.git
   cd birthday-card
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the card.

## 🎨 Customization

To personalize the birthday card, you can modify the following:

### Basic Settings in `app/page.tsx`

```tsx
<EnhancedBirthdayCard 
  frontColor="#000000"
  backColor="#000000"
  title="Happy 30th Birthday!"
  message="Your personal message here"
  recipientName="Recipient Name"
  senderName="Your Name"
/>
```

### Asset Customization

1. Replace the images in the `/public/Assets/` directory:
   - `Cake.png` - Birthday cake icon
   - `Gift.png` - Gift icon
   - `framed.png` - Decorative frame
   - Background image (if used)

### Advanced Customization

For more advanced customizations, you can edit the following files:

- `app/components/EnhancedBirthdayCard.tsx` - Main component logic and layout
- `app/components/Gifter.tsx` - Gift voucher form component
- `app/globals.css` - Global styles and animations

## 📧 Email Integration

The application includes an email service for sending gift voucher claims. To set up:

1. Configure environment variables for your email service:
   ```
   NEXT_PUBLIC_EMAIL_USER=your-email@gmail.com
   NEXT_PUBLIC_EMAIL_PASS=your-app-password
   ```

2. The email service uses Nodemailer with Gmail by default. You can customize the service in `app/api/send-email/route.ts`.

## 📱 Mobile Considerations

The card is fully responsive and includes specific optimizations for mobile devices:

- Automatic scaling for smaller screens
- Touch-friendly interactions
- Mobile-specific animations and layout adjustments

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Effects**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Form Handling**: Custom form implementation
- **Email Service**: [Nodemailer](https://nodemailer.com/)

## 🌐 Deployment

This application is optimized for deployment on Vercel:

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add required environment variables.
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Framer Motion](https://www.framer.com/motion/) for the fluid animations
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/birthday-card/issues).

## 📝 Contact

If you have any questions or want to reach out to the maintainer, please create an issue in the repository or contact via email at jayrrdev@gmail.com
