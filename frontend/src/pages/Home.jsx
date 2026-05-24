import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'
import Category from '../components/Category'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const Home = () => {
 
  return (
    <div>
      <Navbar />
      <Hero />
      <Category />

      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
