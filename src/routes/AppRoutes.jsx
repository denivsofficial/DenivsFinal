import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
import ExploreCategories from '../pages/ExoloreCategories';
import FeaturedList from '../pages/FeaturedList';
import MoreProperty from '../pages/MoreProperty';
import Footer from '@/pages/Footer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/explore-categories" element={<ExploreCategories />} />
      <Route path="/featured-listings" element={<FeaturedList />} />
      <Route path="/more-properties" element={<MoreProperty />} />
      <Route path="/footer" element={<Footer />} />
    </Routes>
  );
};

export default AppRoutes;