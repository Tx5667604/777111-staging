'use client'

import Header from '@/components/sections/Header'
import Hero from '@/components/sections/Hero'
import Advantages from '@/components/sections/Advantages'
import PriceCalculator from '@/components/sections/PriceCalculator'
import PhoneGallery from '@/components/sections/PhoneGallery'
import RepairCases from '@/components/sections/RepairCases'

import Blog from '@/components/sections/Blog'
import Appointment from '@/components/sections/Appointment'
import Contacts from '@/components/sections/Contacts'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Advantages />
        <PriceCalculator />
        <PhoneGallery />
        <RepairCases />
        <Blog />
        <Appointment />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
