# Product Requirements Document (PRD)
# hashtag3D - 3D Printing E-Commerce Platform

**Version:** 2.0  
**Last Updated:** January 2025  
**Status:** Approved

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Target Audience](#target-audience)
4. [User Personas](#user-personas)
5. [Problem Statement & Pain Points](#problem-statement--pain-points)
6. [Unique Selling Propositions (USP)](#unique-selling-propositions-usp)
7. [Core Features & Differentiators](#core-features--differentiators)
8. [User Stories](#user-stories)
9. [Technical Architecture](#technical-architecture)
10. [Use Cases](#use-cases)
11. [Success Metrics](#success-metrics)
12. [Future Enhancements](#future-enhancements)
13. [Appendix](#appendix)

---

## Executive Summary

### Problem Statement

3D printing businesses face significant operational challenges:
- **Pricing Complexity**: Calculating accurate prices based on material, size, colors, and complexity is time-consuming and error-prone
- **Inventory Management**: Tracking filament stock across multiple colors and materials manually
- **Order Management**: No efficient way to schedule prints, track progress, or communicate with customers
- **Customer Experience**: Customers can't see real-time pricing, availability, or order progress
- **Time Management**: No systematic approach to optimize print queue and delivery times

### Solution

**hashtag3D** is a comprehensive e-commerce platform specifically designed for 3D printing businesses. It automates pricing calculations, manages inventory, schedules prints, and provides real-time order tracking—all in one integrated system.

### Key Value Propositions

1. **Automated Pricing Calculator**: Real-time price calculation based on material, size, colors, and complexity
2. **Intelligent Print Scheduler**: Drag-and-drop print queue optimization for maximum efficiency
3. **Real-Time Inventory Tracking**: Track filament stock and automatically disable out-of-stock colors
4. **Customer Progress Tracking**: Customers see their order status and can watch their print being made via social media links
5. **Multi-Color Configuration**: Advanced color selection system with premium/ultra material upcharges

---

## Product Vision

### Mission
**"Empower 3D printing businesses to operate efficiently, price accurately, and deliver exceptional customer experiences—all while growing their business."**

### Vision Statement
To become the leading e-commerce platform for 3D printing businesses, making it easy for makers to turn their passion into a profitable business.

### Values
- **Simplicity**: Complex pricing made simple through automation
- **Transparency**: Customers see real-time pricing and order progress
- **Efficiency**: Optimize operations to maximize throughput
- **Quality**: Built by makers, for makers

---

## Target Audience

### Primary Users

**1. Solo 3D Printing Entrepreneurs**
- **Description**: Individuals running 3D printing businesses from home or small workshops
- **Demographics**: Ages 18-45, tech-savvy, maker community members
- **Technical Comfort**: High - comfortable with 3D printing, basic web tools
- **Pain Points**: 
  - Manual price calculations take too long
  - Can't track which colors are in stock
  - No system for organizing print queue
  - Customer communication is fragmented

**2. Small 3D Printing Businesses (2-5 employees)**
- **Description**: Small teams managing multiple printers and orders
- **Demographics**: Ages 25-50, business owners, makers
- **Technical Comfort**: Medium-High
- **Pain Points**:
  - Pricing inconsistencies across team members
  - Inventory management across multiple printers
  - Need to optimize print schedule for efficiency
  - Customer service takes too much time

**3. Makers Transitioning to Business**
- **Description**: Hobbyists who want to monetize their 3D printing skills
- **Demographics**: Ages 20-40, active in maker communities
- **Technical Comfort**: High
- **Pain Points**:
  - Don't know how to price products
  - No business management experience
  - Need guidance on operations
  - Want to focus on making, not admin

### Secondary Users

**4. Customers/End Users**
- **Description**: People ordering custom 3D printed products
- **Pain Points**: 
  - Can't see real-time pricing
  - Don't know if colors are available
  - No visibility into order progress
  - Unclear delivery timelines

---

## User Personas

### Persona 1: Alex - Solo 3D Printing Entrepreneur

**Demographics:**
- Age: 28
- Location: Suburban home workshop
- Background: Engineering graduate, started 3D printing business 2 years ago
- Team/Role: Solo operator, handles everything

**Background:**
Alex runs a successful 3D printing business from their garage, specializing in custom keychains, figurines, and home décor. They have 3 printers and handle 20-30 orders per week. Alex loves the creative side but struggles with the business operations.

**Goals:**
- Price products accurately without spending hours calculating
- Know which colors are available before taking orders
- Optimize print schedule to maximize daily output
- Provide excellent customer service without constant back-and-forth

**Frustrations:**
- Spending 30+ minutes calculating prices for complex multi-color orders
- Accidentally accepting orders for out-of-stock colors
- Print queue is disorganized, leading to missed deadlines
- Customers constantly asking "where's my order?"

**Technology Usage:**
- Uses Cura for slicing, PrusaSlicer for multi-color
- Active on Instagram and TikTok for marketing
- Comfortable with web tools and apps

**Quote:**
> "I love making things, but I hate spending hours on pricing and scheduling. I just want to print!"

**User Journey:**
1. Customer requests custom order with specific colors
2. Alex needs to calculate price (material + size + colors + complexity)
3. Check if colors are in stock
4. Add to print queue
5. Update customer on progress
6. Ship and track delivery

**Current Tools:**
- Excel spreadsheet for pricing
- Paper notes for print queue
- Instagram DMs for customer communication
- Manual inventory tracking

**Ideal Solution:**
- Automatic price calculation as customer configures product
- Real-time inventory status
- Drag-and-drop print scheduler
- Automated customer updates

**Success Metrics:**
- Reduce pricing time from 30min to 2min per order
- Zero orders for out-of-stock items
- 20% increase in daily print output
- 50% reduction in customer service inquiries

---

### Persona 2: Sarah - Small Business Owner

**Demographics:**
- Age: 35
- Location: Small commercial space
- Background: Former graphic designer, started business 3 years ago
- Team/Role: Owner, manages 2 part-time employees

**Background:**
Sarah runs a growing 3D printing business with 2 employees and 5 printers. They handle 50-70 orders per week, focusing on custom gifts and promotional items. Sarah needs systems that scale with growth.

**Goals:**
- Standardize pricing across team
- Track inventory accurately across multiple printers
- Optimize print schedule for team efficiency
- Provide professional customer experience

**Frustrations:**
- Employees quote different prices for same product
- Can't track which printer has which color loaded
- Print schedule conflicts between team members
- Customers expect professional experience but tools feel amateur

**Technology Usage:**
- Uses multiple slicing software
- Shopify for basic e-commerce (not 3D-specific)
- Google Sheets for inventory
- Slack for team communication

**Quote:**
> "We're growing fast, but our tools aren't keeping up. We need something built for 3D printing businesses."

**Ideal Solution:**
- Consistent pricing system accessible to all team members
- Centralized inventory management
- Shared print schedule visible to entire team
- Professional customer-facing experience

**Success Metrics:**
- 100% pricing consistency across team
- Real-time inventory visibility
- 30% improvement in on-time delivery
- Professional brand image

---

### Persona 3: Mike - Maker Transitioning to Business

**Demographics:**
- Age: 24
- Location: Apartment with 1 printer
- Background: Recent college grad, hobbyist for 3 years
- Team/Role: Solo, just starting to monetize

**Background:**
Mike has been 3D printing as a hobby for 3 years and wants to start selling products. He has one printer and gets occasional requests from friends and social media followers. He's unsure about pricing and business operations.

**Goals:**
- Learn how to price products profitably
- Start accepting orders professionally
- Manage inventory for limited filament stock
- Build customer base

**Frustrations:**
- Doesn't know if prices are too high or too low
- No system for managing orders
- Limited filament means need to track carefully
- Feels unprofessional using DMs for orders

**Technology Usage:**
- Active on Reddit, Discord maker communities
- Uses PrusaSlicer
- Instagram for showcasing prints
- Comfortable with technology

**Quote:**
> "I want to start selling, but I don't know where to begin. I need guidance on pricing and operations."

**Ideal Solution:**
- Built-in pricing guidance
- Simple order management
- Inventory tracking for small stock
- Professional storefront

**Success Metrics:**
- Confident pricing strategy
- Professional order management
- Zero inventory mistakes
- Growing customer base

---

## Problem Statement & Pain Points

### Core Problems Solved

#### 1. Pricing Complexity
**Problem**: Calculating prices for 3D printed products is complex:
- Base price + material cost (grams × cost/gram)
- Size-based pricing (small/medium/large)
- Multi-color upcharges (AMS fees)
- Premium/Ultra material upcharges
- Complexity fees
- Customization fees

**Current State**: Manual calculation using spreadsheets or mental math, leading to:
- Pricing inconsistencies
- Lost profit from underpricing
- Lost sales from overpricing
- Time wasted on calculations

**Solution**: Automated real-time pricing calculator that:
- Calculates prices instantly as customer configures product
- Accounts for all variables automatically
- Shows price breakdown for transparency
- Updates based on inventory availability

#### 2. Inventory Management
**Problem**: Tracking filament stock manually:
- Don't know which colors are available
- Accept orders for out-of-stock items
- Manual tracking is error-prone
- No visibility into stock levels

**Current State**: 
- Spreadsheet or paper notes
- Customers order unavailable colors
- Last-minute substitutions
- Lost sales or unhappy customers

**Solution**: Real-time inventory tracking:
- Track stock quantity per color
- Automatic out-of-stock detection
- Disable unavailable colors in UI
- Visual stock indicators

#### 3. Print Scheduling
**Problem**: No systematic way to organize print queue:
- Print orders in random order
- Miss deadlines
- Inefficient printer utilization
- Can't optimize for delivery dates

**Current State**:
- Paper notes or mental queue
- Print whatever comes to mind
- Rush orders disrupt schedule
- Missed delivery dates

**Solution**: Intelligent print scheduler:
- Drag-and-drop queue management
- Calculate print times automatically
- Optimize for delivery dates
- Visual timeline view

#### 4. Customer Communication
**Problem**: Constant customer inquiries:
- "Where's my order?"
- "Is it done yet?"
- "What's the status?"
- Fragmented communication across platforms

**Current State**:
- DMs, emails, phone calls
- Manual status updates
- Time-consuming customer service
- Poor customer experience

**Solution**: Automated order tracking:
- Real-time status updates
- Order tracking portal
- Social media integration (show prints in progress)
- Automated notifications

#### 5. Professional Image
**Problem**: Tools feel amateur:
- Spreadsheets and DMs don't look professional
- Inconsistent customer experience
- Hard to scale operations
- Doesn't build trust

**Current State**:
- Mix of tools (Excel, DMs, paper)
- Inconsistent branding
- Unprofessional appearance
- Hard to scale

**Solution**: Professional platform:
- Cohesive brand experience
- Professional storefront
- Consistent operations
- Scalable infrastructure

---

## Unique Selling Propositions (USP)

### 1. **Built Specifically for 3D Printing**
Unlike generic e-commerce platforms, hashtag3D understands 3D printing:
- Material-based pricing (grams × cost/gram)
- Multi-color AMS fee calculation
- Print time estimation
- Filament inventory tracking

**Competitive Advantage**: Generic platforms (Shopify, WooCommerce) require extensive customization. hashtag3D works out-of-the-box.

### 2. **Real-Time Price Calculator**
Customers see accurate prices instantly as they configure products:
- No surprises at checkout
- Transparent pricing breakdown
- Builds trust
- Reduces cart abandonment

**Competitive Advantage**: Most 3D printing businesses use static prices or manual quotes. Real-time calculation is unique.

### 3. **Intelligent Print Scheduler**
Drag-and-drop queue optimization:
- Maximize daily output
- Meet delivery deadlines
- Visual timeline
- Easy reordering

**Competitive Advantage**: No other platform offers integrated print scheduling.

### 4. **Inventory-Aware Ordering**
Customers can only order available colors:
- Prevents out-of-stock orders
- Reduces customer service issues
- Automatic stock updates
- Visual availability indicators

**Competitive Advantage**: Most platforms don't integrate inventory with product configuration.

### 5. **Customer Progress Tracking**
Customers see real-time order status:
- Order tracking portal
- Status updates (pending → printing → finishing → ready)
- Social media integration (watch your print!)
- Automated notifications

**Competitive Advantage**: Transparent progress tracking builds trust and reduces inquiries.

### 6. **Multi-Color Configuration System**
Advanced color selection:
- Multiple color slots per product (background, foreground, text)
- Premium/Ultra material upcharges
- Visual color swatches
- Stock-aware selection

**Competitive Advantage**: Most platforms don't support complex multi-color configurations.

---

## Core Features & Differentiators

### 1. Automated Price Calculator

**Feature Description:**
Real-time price calculation based on:
- Base product price
- Material cost (grams × cost per gram)
- Size (small/medium/large)
- Number of colors
- Color category (standard/premium/ultra)
- AMS fees for multi-color
- Accessories cost

**User Experience:**
- Customer configures product (size, colors, options)
- Price updates instantly
- Breakdown shown for transparency
- Mobile-responsive display

**Business Value:**
- Eliminates pricing errors
- Saves 20-30 minutes per order
- Consistent pricing
- Transparent customer experience

**Technical Implementation:**
- React hooks for real-time calculation
- Pricing settings stored in database
- Material costs from materials table
- Formula: `basePrice + (grams × costPerGram) + colorUpcharges + amsFee + accessories`

---

### 2. Print Schedule Manager

**Feature Description:**
Drag-and-drop interface for organizing print queue:
- Visual timeline of orders
- Calculate print times automatically
- Reorder by dragging
- Filter by status (pending, printing, finishing)
- Optimize for delivery dates

**User Experience:**
- Admin sees all active orders
- Drag orders to reorder queue
- See estimated print times
- Orders disappear when completed/cancelled

**Business Value:**
- Optimize printer utilization
- Meet delivery deadlines
- Reduce rush orders
- Visual workflow management

**Technical Implementation:**
- `print_priority` column for ordering
- Drag-and-drop HTML5 API
- Print time calculation from product data
- Real-time updates via React Query

---

### 3. Real-Time Inventory Tracking

**Feature Description:**
Track filament stock per color:
- Stock quantity in grams
- Out-of-stock threshold (default: 100g)
- Automatic UI disabling
- Visual indicators
- Admin stock management

**User Experience:**
- Customers see stock status
- Out-of-stock colors disabled
- Admin can update stock easily
- Color picker shows availability

**Business Value:**
- Prevent out-of-stock orders
- Reduce customer service issues
- Better inventory management
- Professional appearance

**Technical Implementation:**
- `stock_quantity` column in colors table
- Threshold check in UI
- Disable select options
- Admin editing interface

---

### 4. Customer Order Tracking

**Feature Description:**
Real-time order status updates:
- Order tracking portal
- Status badges (pending, confirmed, printing, finishing, ready, delivered, cancelled)
- Social media integration (watch your print!)
- Order number lookup
- Status history

**User Experience:**
- Customer enters order number
- See current status with color-coded badge
- View product details
- Click to watch print on social media
- Status updates automatically

**Business Value:**
- Reduces customer inquiries
- Builds trust through transparency
- Professional customer experience
- Social media engagement

**Technical Implementation:**
- Order status enum
- Status update mutations
- Order tracking query
- Social media URL detection (Instagram, TikTok, YouTube)

---

### 5. Multi-Color Configuration System

**Feature Description:**
Advanced color selection:
- Multiple color slots per product (e.g., "Primary Color", "Accent Color", "Text Color")
- Visual color swatches
- Category grouping (Standard, Premium, Ultra)
- Stock-aware selection
- Accordion-style UI

**User Experience:**
- Customer sees color slots for product
- Click to open color picker
- See all available colors grouped by category
- Select color per slot
- See upcharges for premium colors
- Accordion closes automatically on selection

**Business Value:**
- Support complex multi-color products
- Clear pricing for premium options
- Professional configuration experience
- Reduces configuration errors

**Technical Implementation:**
- `color_slots` JSONB column
- Color swatch components
- Category-based grouping
- Accordion UI with auto-close

---

### 6. Product Image Carousel

**Feature Description:**
Multiple product images with navigation:
- Click image to cycle through
- Dot indicators for multiple images
- Smooth transitions
- Works on product cards and detail pages

**User Experience:**
- See multiple angles/views
- Click to view next image
- Click dot to jump to specific image
- Visual indicator of image count

**Business Value:**
- Better product presentation
- Show different angles/colors
- Professional appearance
- Increased conversion

**Technical Implementation:**
- Image array in product data
- State management for current image
- Dot navigation component
- Click handlers for cycling

---

### 7. Feed-Style Home Page

**Feature Description:**
Social media-inspired product feed:
- Casual, conversational product descriptions
- Large product images
- Like functionality
- "Print This" call-to-action
- Scrollable feed layout

**User Experience:**
- Discover products in feed format
- Like products
- Quick "Print This" action
- Casual, friendly tone

**Business Value:**
- Modern, engaging experience
- Social media feel
- Easy product discovery
- Mobile-optimized

**Technical Implementation:**
- FeedHome component
- Product cards with like functionality
- Casual text generation
- Responsive layout

---

### 8. Admin Configuration Panel

**Feature Description:**
Centralized settings management:
- Pricing upcharges (premium colors, AMS fees, etc.)
- Color management (add, edit, delete)
- Stock quantity updates
- Material costs
- Business settings

**User Experience:**
- All settings in one place
- Easy editing
- Real-time updates
- Organized by category

**Business Value:**
- Centralized management
- Easy updates
- Consistent configuration
- Time savings

**Technical Implementation:**
- Settings table
- CRUD operations
- Real-time updates
- Organized UI

---

## User Stories

### Epic 1: Pricing & Configuration

#### US-1.1: Real-Time Price Calculation
**As a** customer  
**I want to** see the price update as I configure my product  
**So that** I know the total cost before adding to cart

**Acceptance Criteria:**
- Price updates instantly when size changes
- Price updates when colors are selected
- Premium/Ultra color upcharges are shown
- AMS fees calculated for multi-color
- Price breakdown is visible
- Works on mobile and desktop

**Priority:** P0 (Critical)

---

#### US-1.2: Multi-Color Product Configuration
**As a** customer  
**I want to** select different colors for different parts of a product  
**So that** I can customize my order exactly as I want

**Acceptance Criteria:**
- Product can have multiple color slots
- Each slot shows available colors
- Colors grouped by category (Standard/Premium/Ultra)
- Premium/Ultra upcharges displayed
- Selected colors shown clearly
- Accordion closes after selection

**Priority:** P0 (Critical)

---

#### US-1.3: Inventory-Aware Color Selection
**As a** customer  
**I want to** only see available colors  
**So that** I don't order something that's out of stock

**Acceptance Criteria:**
- Out-of-stock colors are disabled
- Stock quantity shown (e.g., "150g")
- Visual indicator for out-of-stock
- Cannot select unavailable colors
- Admin can update stock easily

**Priority:** P0 (Critical)

---

### Epic 2: Print Management

#### US-2.1: Print Schedule Organization
**As an** admin  
**I want to** drag and drop orders to reorder the print queue  
**So that** I can optimize my print schedule for efficiency

**Acceptance Criteria:**
- All active orders shown in list
- Drag-and-drop reordering works
- Print priority updates automatically
- Orders sorted by priority
- Visual feedback during drag
- Works on desktop

**Priority:** P0 (Critical)

---

#### US-2.2: Print Time Calculation
**As an** admin  
**I want to** see estimated print times for each order  
**So that** I can plan my schedule accurately

**Acceptance Criteria:**
- Print time calculated from product data
- Shown in print schedule
- Updates when order changes
- Accounts for size and complexity

**Priority:** P1 (High)

---

#### US-2.3: Order Status Management
**As an** admin  
**I want to** update order status as work progresses  
**So that** customers can see their order progress

**Acceptance Criteria:**
- Status dropdown for each order
- Statuses: pending, confirmed, printing, finishing, ready, delivered, cancelled
- Updates save immediately
- Customer sees updated status
- Status history tracked

**Priority:** P0 (Critical)

---

### Epic 3: Customer Experience

#### US-3.1: Order Tracking Portal
**As a** customer  
**I want to** track my order status  
**So that** I know when my product will be ready

**Acceptance Criteria:**
- Enter order number to track
- See current status with color-coded badge
- View product details
- See order date
- Status updates in real-time

**Priority:** P0 (Critical)

---

#### US-3.2: Social Media Integration
**As a** customer  
**I want to** watch my print being made on social media  
**So that** I can see the progress and share it

**Acceptance Criteria:**
- Admin can add social media link to order
- Link shown in order tracking
- Platform detected automatically (Instagram, TikTok, YouTube)
- Appropriate icon displayed
- Click opens in new tab

**Priority:** P1 (High)

---

#### US-3.3: Price Breakdown Display
**As a** customer  
**I want to** see how the price is calculated  
**So that** I understand what I'm paying for

**Acceptance Criteria:**
- Price breakdown shown on product page
- Base price visible
- Material cost shown
- Color upcharges listed
- AMS fees explained
- Visible on mobile

**Priority:** P1 (High)

---

### Epic 4: Inventory Management

#### US-4.1: Color Stock Tracking
**As an** admin  
**I want to** track filament stock per color  
**So that** I know what's available

**Acceptance Criteria:**
- Stock quantity field per color
- Update stock easily
- Out-of-stock threshold configurable
- Visual indicators
- Automatic UI disabling

**Priority:** P0 (Critical)

---

#### US-4.2: Stock Quantity Editing
**As an** admin  
**I want to** edit color stock quantities directly  
**So that** I can update inventory quickly

**Acceptance Criteria:**
- Edit stock in configuration page
- Inline editing
- Save updates immediately
- Validation (no negative numbers)

**Priority:** P1 (High)

---

## Technical Architecture

### Frontend Stack

**Core Technologies:**
- **React**: 18.2.0 - UI framework
- **TypeScript**: 5.x - Type safety
- **Vite**: 5.x - Build tool
- **React Router**: 6.x - Client-side routing

**UI Framework:**
- **Tailwind CSS**: 3.x - Styling
- **Radix UI**: Component primitives
- **shadcn/ui**: Component library
- **Lucide React**: Icons

**State Management:**
- **React Query**: Data fetching and caching
- **React Context**: Cart and auth state

**Form Handling:**
- **React Hook Form**: Form management
- **Zod**: Validation

**Other Libraries:**
- **date-fns**: Date formatting
- **AWS SDK**: R2 storage integration

---

### Backend Stack

**Database:**
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** for data isolation
- **Triggers** for automatic calculations

**Authentication:**
- **Supabase Auth** - Email/password authentication
- **Role-based access control** (admin/user)

**Storage:**
- **Cloudflare R2** - Product images
- **S3-compatible API**

**Hosting:**
- **Cloudflare Pages** - Frontend hosting
- **Supabase** - Backend (database, auth, storage)

**Environment Variables:**
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_R2_ACCOUNT_ID=
VITE_R2_ACCESS_KEY_ID=
VITE_R2_SECRET_ACCESS_KEY=
VITE_R2_BUCKET_NAME=
VITE_R2_PUBLIC_URL=
```

---

### Database Architecture

**Core Tables:**

1. **products**
   - `id` (UUID, primary key)
   - `product_number` (TEXT, unique)
   - `title` (TEXT)
   - `description` (TEXT)
   - `price` (NUMERIC)
   - `colors` (TEXT[])
   - `color_slots` (JSONB)
   - `allowed_materials` (TEXT[])
   - `allowed_sizes` (TEXT[])
   - `estimated_grams_small/medium/large` (INTEGER)
   - `print_time_small/medium/large` (INTEGER)
   - `images` (TEXT[])
   - `is_active` (BOOLEAN)
   - `is_customizable` (BOOLEAN)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)

2. **orders**
   - `id` (UUID, primary key)
   - `order_number` (TEXT, unique)
   - `product_id` (UUID, foreign key)
   - `customer_name` (TEXT)
   - `customer_email` (TEXT)
   - `status` (order_status enum)
   - `print_priority` (INTEGER)
   - `social_media_url` (TEXT)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)

3. **colors**
   - `id` (UUID, primary key)
   - `name` (TEXT, unique)
   - `hex_color` (TEXT)
   - `material_id` (UUID, foreign key)
   - `stock_quantity` (INTEGER)
   - `created_at` (TIMESTAMPTZ)

4. **materials**
   - `id` (UUID, primary key)
   - `name` (TEXT)
   - `category` (TEXT: standard/premium/ultra)
   - `cost_per_gram` (NUMERIC)
   - `created_at` (TIMESTAMPTZ)

5. **pricing_settings**
   - `id` (UUID, primary key)
   - `setting_key` (TEXT, unique)
   - `setting_value` (NUMERIC)
   - `created_at` (TIMESTAMPTZ)

6. **local_settings**
   - `id` (UUID, primary key)
   - `setting_key` (TEXT, unique)
   - `setting_value` (TEXT/JSONB)
   - `created_at` (TIMESTAMPTZ)

**Enums:**
- `order_status`: pending, confirmed, printing, finishing, ready, delivered, cancelled

**Functions:**
- `generate_product_number()` - Auto-generate product numbers
- `calculate_print_time()` - Calculate print time from product data

**Indexes:**
- `idx_orders_print_priority` - For print schedule sorting
- `idx_products_product_number` - For product lookup

---

### Security

**Row Level Security (RLS) Policies:**

**products:**
- Public can view active products
- Admins can create/update/delete

**orders:**
- Customers can view their own orders (by order number)
- Admins can view/update all orders

**colors, materials, pricing_settings:**
- Public can read
- Admins can write

**Data Isolation:**
- RLS ensures data security
- Admin role required for mutations
- Order tracking uses order number (not user ID)

---

### API Endpoints

**Supabase REST API:**
- `GET /rest/v1/products` - List products
- `POST /rest/v1/products` - Create product (admin)
- `PATCH /rest/v1/products/:id` - Update product (admin)
- `GET /rest/v1/orders` - List orders (admin)
- `PATCH /rest/v1/orders/:id` - Update order (admin)
- `GET /rest/v1/orders?order_number=eq.ORD-123` - Track order

**R2 Storage:**
- `PUT /products/:filename` - Upload image (admin)
- `GET /products/:filename` - View image (public)

---

## Use Cases

### Use Case 1: Customer Orders Multi-Color Product

**Actor:** Customer  
**Preconditions:** Product exists with multiple color slots

**Flow:**
1. Customer browses products
2. Clicks on product with multiple color slots
3. Selects size (small/medium/large)
4. Opens "Primary Color" accordion
5. Sees all available colors grouped by category
6. Selects premium color (sees upcharge)
7. Accordion closes automatically
8. Opens "Accent Color" accordion
9. Selects standard color
10. Sees price update in real-time
11. Sees price breakdown showing:
    - Base price
    - Material cost (grams × cost/gram)
    - Premium color upcharge
    - AMS fee (multi-color)
12. Adds to cart
13. Proceeds to checkout

**Postconditions:**
- Order created with color selections
- Price calculated correctly
- Inventory updated (if applicable)

---

### Use Case 2: Admin Schedules Prints

**Actor:** Admin  
**Preconditions:** Multiple orders in pending/confirmed status

**Flow:**
1. Admin navigates to Print Schedule
2. Sees list of active orders sorted by priority
3. Sees estimated print time for each order
4. Drags high-priority order to top
5. Drags another order to second position
6. Sees print times recalculate
7. Updates order status to "printing" when starting
8. Updates status to "finishing" when done printing
9. Updates status to "ready" when complete
10. Order disappears from schedule

**Postconditions:**
- Print queue optimized
- Orders processed in priority order
- Customers see status updates

---

### Use Case 3: Admin Manages Inventory

**Actor:** Admin  
**Preconditions:** Colors exist in database

**Flow:**
1. Admin navigates to Configuration
2. Clicks "Colors" tab
3. Sees all colors grouped by category
4. Clicks on color name to edit
5. Updates stock quantity from 500g to 200g
6. Saves (auto-saves on blur)
7. Navigates to product page
8. Sees color with 200g stock
9. When stock drops below 100g, color shows "Out of Stock"
10. Color is disabled in product configuration

**Postconditions:**
- Stock updated
- UI reflects availability
- Customers can't order unavailable colors

---

### Use Case 4: Customer Tracks Order

**Actor:** Customer  
**Preconditions:** Order exists with order number

**Flow:**
1. Customer receives order confirmation with order number
2. Clicks "Track Your Order" on homepage
3. Enters order number (e.g., "ORD-123456" or just "123456")
4. Sees order details:
    - Order number
    - Product name
    - Current status (color-coded badge)
    - Order date
    - Social media link (if available)
5. Clicks social media link to watch print
6. Sees status update to "printing"
7. Sees status update to "ready"
8. Receives notification when delivered

**Postconditions:**
- Customer informed of order progress
- Reduced support inquiries
- Better customer experience

---

### Use Case 5: Admin Calculates Price for New Product

**Actor:** Admin  
**Preconditions:** Pricing settings configured

**Flow:**
1. Admin navigates to Pricing Calculator
2. Enters base price: $10
3. Selects size: Medium
4. Enters estimated grams: 100g
5. Selects material: Standard
6. Sets number of colors: 2
7. Selects color category: Premium
8. Adds accessories cost: $2
9. Sees calculated price: $18.50
10. Expands price breakdown:
    - Base: $10.00
    - Material (100g × $0.03/g): $3.00
    - Premium colors (2 × $1.50): $3.00
    - AMS fee: $2.50
    - Accessories: $2.00
    - Total: $18.50
11. Uses this to set product base price

**Postconditions:**
- Accurate price calculated
- Admin understands pricing components
- Product priced correctly

---

## Success Metrics

### Business Metrics

**Revenue:**
- Average order value
- Monthly recurring revenue (if subscription model)
- Profit margin per order

**Operations:**
- Time saved on pricing (target: 90% reduction)
- Orders processed per day
- On-time delivery rate (target: 95%+)
- Inventory accuracy (target: 99%+)

**Customer Experience:**
- Customer satisfaction score
- Order tracking usage rate
- Support ticket reduction (target: 50% reduction)
- Cart abandonment rate

### Product Metrics

**Adoption:**
- Active users (admins)
- Products created
- Orders processed
- Colors managed

**Engagement:**
- Pricing calculator usage
- Print schedule usage
- Order tracking usage
- Admin configuration updates

**Quality:**
- Pricing accuracy (target: 100%)
- Zero out-of-stock orders
- System uptime (target: 99.9%)
- Error rate (target: <0.1%)

---

## Future Enhancements

### Phase 1: Enhanced Features (Q2 2025)

**1. Advanced Print Scheduling**
- Calendar view
- Multi-printer support
- Automatic optimization algorithms
- Rush order handling

**2. Inventory Alerts**
- Low stock notifications
- Reorder reminders
- Supplier integration
- Automatic reordering

**3. Customer Portal**
- Account creation
- Order history
- Favorite products
- Saved configurations

**4. Analytics Dashboard**
- Sales reports
- Popular products
- Revenue trends
- Print time analytics

### Phase 2: Integration & Automation (Q3 2025)

**1. Shipping Integration**
- Label printing
- Tracking numbers
- Carrier APIs (USPS, FedEx, UPS)
- Delivery estimates

**2. Payment Processing**
- Stripe integration
- PayPal support
- Payment plans
- Invoice generation

**3. Email Automation**
- Order confirmations
- Status update emails
- Shipping notifications
- Review requests

**4. Social Media Automation**
- Auto-post prints to Instagram
- TikTok video generation
- Social media scheduling

### Phase 3: Advanced Features (Q4 2025)

**1. Multi-Location Support**
- Multiple printer locations
- Location-based inventory
- Route optimization
- Centralized management

**2. Team Collaboration**
- Multi-user support
- Role-based permissions
- Team chat
- Task assignment

**3. Advanced Analytics**
- Profit analysis
- Customer segmentation
- Predictive analytics
- Business insights

**4. Mobile App**
- iOS app
- Android app
- Push notifications
- Mobile print management

---

## Appendix

### Glossary

- **AMS**: Automatic Material System (Bambu Lab multi-color printing)
- **Filament**: 3D printing material (PLA, PETG, etc.)
- **Grams**: Weight measurement for filament usage
- **Print Queue**: Ordered list of prints to be completed
- **RLS**: Row Level Security (PostgreSQL security feature)
- **Upcharge**: Additional fee for premium options

### Acronyms

- **USP**: Unique Selling Proposition
- **PRD**: Product Requirements Document
- **RLS**: Row Level Security
- **AMS**: Automatic Material System
- **API**: Application Programming Interface
- **UI**: User Interface
- **UX**: User Experience

### Competitive Analysis

**Competitors:**
1. **Shopify** - Generic e-commerce, requires extensive customization
2. **WooCommerce** - WordPress-based, not 3D-specific
3. **Etsy** - Marketplace, not standalone platform
4. **Custom Solutions** - Expensive, time-consuming to build

**Our Advantages:**
- Built specifically for 3D printing
- Real-time pricing calculator
- Integrated print scheduler
- Inventory-aware ordering
- Customer progress tracking
- Affordable pricing
- Easy setup

---

**Document Status:** Approved  
**Next Review:** Q2 2025  
**Owner:** Product Team  
**Stakeholders:** Engineering, Design, Business Development

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 2024 | Initial version | Product Team |
| 2.0 | Jan 2025 | Comprehensive update with USP, use cases, and differentiators | Product Team |

