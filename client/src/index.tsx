import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css'; 
import "react-datepicker/dist/react-datepicker.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter} from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//registerLocale('ko', ko); //날짜 한국어로 표시
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
 
  <BrowserRouter>
    <Header />
    <QueryClientProvider client={queryClient}>      
    <App />
    </QueryClientProvider>    
    <Footer />
  </BrowserRouter>
  
  //<React.StrictMode>
  //  <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
