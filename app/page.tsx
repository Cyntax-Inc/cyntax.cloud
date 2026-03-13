import Navbar from "../components/homepage/Navbar";
import Hero from "../components/homepage/Hero";
import Services from "../components/homepage/Services";
import Tooling from "../components/homepage/Tooling";
import Carousel from "../components/homepage/Carousel";
import Packages from "../components/homepage/Packages";
import Pricing from "../components/homepage/Pricing";
import Reviews from "../components/homepage/Reviews";
import Footer from "../components/homepage/Footer";


export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Tooling />
      <Carousel />
      <Packages />
      <Pricing />
      <Reviews />
      <Footer />
    </main>
  );
}