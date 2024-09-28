import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import NotFound from './pages/NotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/CityList';
import City from './components/City';
import CountriesList from './components/CountriesList';
import Form from './components/Form';
import { useCities } from './context/CityCTX';
 

function App() {
  const {cities, isLoading} = useCities();
  
  return ( 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='pricing' element={<Pricing />} />
          <Route path='product' element={<Product />} />
          <Route path='login' element={<Login />} />
          <Route path='app' element={<AppLayout />}>
            <Route index element={<Navigate replace to='cities' />} />
            <Route
              path='cities'
              element={<CityList cities={cities} isLoading={isLoading} />}
            />
            <Route path='cities/:id' element={<City />} />
            <Route
              path='countries'
              element={<CountriesList cities={cities} isLoading={isLoading} />}
            />
            <Route path='form' element={<Form />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter> 
  );
}

export default App;
