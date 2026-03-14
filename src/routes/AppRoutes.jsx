import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import PostProperty from '../pages/PostProperty';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* <Route path="/post-property" element={<PostProperty />} /> */}
      {/* Easy to add more later */}
      {/* <Route path="/search" element={<SearchPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;