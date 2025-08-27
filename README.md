# SpecChem LMS - Professional Training Platform

A complete Learning Management System home page built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui, following the **Industrial Knowledge Minimalism** design language.

## 🎯 Features

- **Professional LMS Interface** - Designed specifically for industrial training and compliance
- **Industrial Design Language** - Clean, modern aesthetic suitable for B2B manufacturing environments
- **Full Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessibility Compliant** - WCAG AA standards with keyboard navigation and screen reader support
- **Performance Optimized** - Static generation with Next.js 15 and Turbopack

## 🏗️ Tech Stack

- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **shadcn/ui** components library
- **Lucide React** for icons
- **Inter & Merriweather** fonts

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css         # Design tokens and global styles
│   ├── layout.tsx          # Root layout with font loading
│   └── page.tsx            # Home page composition
├── components/
│   ├── ui/
│   │   └── Skeleton.tsx    # Loading states
│   ├── Header.tsx          # Navigation header
│   ├── HeroSection.tsx     # Main hero area
│   ├── ComplianceWidget.tsx # Compliance status dashboard
│   ├── FeaturedCourses.tsx # Course carousel
│   ├── Announcements.tsx   # System announcements
│   ├── ResourceLinks.tsx   # Quick access resources
│   └── Footer.tsx          # Site footer
└── lib/
    └── utils.ts            # Utility functions
```

## 🎨 Design System

### Colors
- **Background**: `#FAFAFA` (base), `#FFFFFF` (elevated)
- **Text**: `#0D0F12` (primary), `#49505A` (secondary), `#7A828D` (muted)
- **Brand**: `#FF6A00` (primary orange)
- **Accent**: `#1976D2` (cool blue)
- **States**: Success `#16A34A`, Warning `#F59E0B`, Error `#DC2626`

### Typography
- **Primary**: Inter (headings, UI)
- **Reading**: Merriweather (long-form content)
- **Code**: JetBrains Mono

### Components
All components follow the Industrial Knowledge Minimalism principles:
- Clean, uncluttered layouts
- Subtle shadows and rounded corners
- Purposeful animations
- Professional color palette
- Excellent readability

## 🎯 Page Sections

1. **Header** - Logo, navigation, user menu
2. **Hero Section** - Main call-to-action with animated background
3. **Compliance Widget** - Status dashboard with progress tracking
4. **Featured Courses** - Course cards with progress indicators
5. **Announcements** - System updates and notifications
6. **Resource Links** - Quick access to reference materials
7. **Footer** - Links and company information

## 🔧 Customization

The design system uses CSS custom properties for theming. Modify the tokens in `globals.css`:

```css
:root {
  --color-brand-primary: #FF6A00;
  --color-accent-cool: #1976D2;
  /* ... other tokens */
}
```

## 📱 Responsive Design

- **Mobile**: Stacked layout, touch-friendly interactions
- **Tablet**: Hybrid layout with collapsible elements  
- **Desktop**: Full layout with side rails and hover states

## ♿ Accessibility

- WCAG AA compliant color contrast ratios
- Keyboard navigation support
- Screen reader optimized with ARIA labels
- Focus indicators for all interactive elements
- Skip-to-content functionality

## 🚀 Production Ready

- Optimized bundle size (124KB total)
- Static page generation
- SEO optimized meta tags
- Performance monitoring ready
- Error boundary implementation

---

Built for SpecChem's professional training needs with scalability and maintainability in mind.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
