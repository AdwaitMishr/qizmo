import Header from "./components/header"
import Hero from "./components/hero"
import Features from "./components/features"
import TechStack from "./components/tech-stack"
import Reviews from "./components/reviews"
import Faq from "./components/faq"
import Contact from "./components/contact"
import Footer from "./components/footer"
import { ScrollProvider } from "./components/scroll-provider"

export default function Home() {
  return (
    <ScrollProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main>
          <Hero />
          <Features />
          <TechStack />
          <Reviews />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </ScrollProvider>
  )
}

