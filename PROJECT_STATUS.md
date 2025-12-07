# BidStorm - Online Auction Platform

A modern, clean online auction website built with Next.js 15, featuring a black and white minimalist design.

## 🚀 Features Implemented

### Home Page
- **Hero Section**: Eye-catching hero with call-to-action buttons and statistics
- **Top 5 Products Ending Soon**: Displays auctions closing within hours
- **Top 5 Most Popular Products**: Shows products with the highest number of bids
- **Top 5 Premium Auctions**: Features high-value items attracting top bidders

### Components
- **Header**: 
  - Categories dropdown menu (2-level hierarchy)
  - Search bar
  - Login/Register buttons
  - Language switcher (English/Vietnamese)
  - Mobile-responsive navigation

- **Footer**: 
  - Company information
  - Quick links
  - Support links
  - Legal links
  - Social media icons

- **Product Card**: 
  - Product image with hover effects
  - Real-time countdown timer
  - Current bid price
  - Buy now price (if available)
  - Wishlist functionality
  - Seller information with ratings
  - "NEW" badge for recently posted items
  - Urgent indicator for auctions ending soon

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (ready for implementation)
- **Data Fetching**: TanStack Query (ready for implementation)
- **HTTP Client**: Axios (ready for implementation)
- **Form Handling**: React Hook Form (ready for implementation)
- **Validation**: Zod (ready for implementation)
- **Icons**: React Icons (Feather Icons)
- **Internationalization**: i18next + react-i18next

### Design Philosophy
- **Color Scheme**: Black and white with minimal accent colors
- **Typography**: Inter font for clean, modern look
- **Responsive**: Mobile-first approach
- **Performance**: Optimized images, lazy loading
- **Accessibility**: Semantic HTML, proper ARIA labels

## 📁 Project Structure

```
bidstorm/
├── app/
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Main navigation
│   │   └── Footer.tsx      # Footer section
│   ├── ui/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── ProductCard.tsx # Product card component
│   │   └── ProductSection.tsx # Product list section
│   └── providers/
│       └── I18nProvider.tsx # i18n provider
├── lib/
│   ├── i18n.ts             # i18n configuration
│   ├── mockData.ts         # Mock product data
│   └── utils.ts            # Utility functions
├── locales/
│   └── en.json             # English translations
├── types/
│   └── index.ts            # TypeScript types
├── hooks/                   # Custom hooks (ready)
└── store/                   # Zustand store (ready)
```

## 🎨 Design Features

### Color Palette
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Gray Scale**: Various shades for depth
- **Accent**: Minimal use of blue, red, and green for specific actions

### Key UI Elements
- Clean, minimalist cards with subtle shadows
- Smooth hover transitions
- Real-time countdown timers
- Responsive grid layouts
- Mobile-optimized navigation

## 🔧 Mock Data

Currently using 10 sample products across different categories:
- Electronics (iPhones, MacBooks, iPads)
- Fashion (Watches, Shoes, Bags)
- Gaming (PlayStation)
- Photography (Cameras)

All products include:
- Multiple images
- Realistic pricing (in VND)
- Seller information with ratings
- Bid history
- Time remaining
- Category hierarchy

## 🌐 Internationalization

Currently supports:
- **English** (default)
- Vietnamese (structure ready, needs translation)

All text is externalized to JSON files for easy translation.

## 📱 Responsive Design

- **Mobile**: Single column, hamburger menu
- **Tablet**: 2-column grid
- **Desktop**: 5-column grid for products, full navigation

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## 📝 Next Steps

### API Integration (When Backend is Ready)
1. Replace mock data with API calls using Axios
2. Implement TanStack Query for data fetching and caching
3. Add authentication with JWT
4. Connect WebSocket for real-time bid updates

### Additional Features to Implement
- Product detail page
- Category pages
- Search functionality
- User authentication (login/register)
- User dashboard
- Bidding interface
- Product listing (seller)
- Admin dashboard

## 🎯 Key Features Ready for Implementation

- ✅ Header with categories and search
- ✅ Hero section
- ✅ Product cards with countdown timers
- ✅ Three product sections (ending soon, most bids, highest price)
- ✅ Footer with links
- ✅ Mobile responsive
- ✅ i18n setup
- ✅ TypeScript types
- 🔲 API integration
- 🔲 User authentication
- 🔲 Product detail page
- 🔲 Bidding functionality
- 🔲 Search implementation

## 📸 Features

- Real-time countdown timers update every second
- Wishlist toggle on product cards
- Category hierarchy navigation
- Mobile-friendly hamburger menu
- Smooth animations and transitions
- Image optimization with Next.js Image component

## 🤝 Contributing

This is a university project for an online auction platform. Backend is implemented separately.

---

**Built with ❤️ using Next.js 15 and Tailwind CSS**
