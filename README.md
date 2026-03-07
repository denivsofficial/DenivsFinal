# DENIVS - Real Estate, Simplified 🏠

DENIVS is a high-performance, modular real estate platform designed for seamless property discovery and listing. Built with a "Lead Engineer" mindset to be scalable, reliable, and mobile-first.

## 🚀 Tech Stack
- **Frontend**: Vite + React
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand (Client-side state & Multi-step forms)
- **Data Fetching**: TanStack Query (React Query) + Axios
- **Icons**: Lucide-React

## 📂 Project Structure (Netflix-GPT Inspired)
This project follows a flat, modular approach to ensure speed and ease of collaboration:

- **`src/components/`**: Reusable UI blocks like `Navbar`, `Hero`, and `PropertyCard`.
- **`src/components/ui/`**: Specialized shadcn/ui components (Buttons, Inputs, Cards).
- **`src/hooks/`**: Custom TanStack Query hooks for fetching and caching property data from the Render backend.
- **`src/utils/`**: Global Zustand stores for search filters and the 3-step listing form, plus Axios configuration.
- **`src/pages/`**: Main route views including `Home`, `Search`, and `PostProperty`.
- **`src/index.css`**: Tailwind v4 entry point using the `@import "tailwindcss";` directive.

## 🛠️ Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/Anuragkite/DenivsFrontend.git](https://github.com/Anuragkite/DenivsFrontend.git)

   Important Things : 
   IN shadcn Library , There's change in Location due to internal location conflict in the shadcn as it is not able to locate the file so it is fixed manually , **Future Import From Shadcn Must Do It Manually In shadcn Components**--7 jan,26