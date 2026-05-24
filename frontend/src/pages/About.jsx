import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Shield,
  Globe,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Trusted Community",
      desc: "Connect with verified professionals and customers in your local area.",
    },
    {
      icon: Briefcase,
      title: "Wide Range of Services",
      desc: "From home repair to tutoring, find or offer any service you need.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      desc: "Built-in trust system ensures safe and transparent interactions.",
    },
    {
      icon: Globe,
      title: "Local Marketplace",
      desc: "Empowering communities by connecting people nearby.",
    },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="py-24 px-6 text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Our Platform
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl">
            A modern local service marketplace connecting people who need help
            with skilled professionals who get things done.
          </p>
        </motion.div>
      </section>

      {/* MISSION */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>

          <p className="text-zinc-400 mb-6">
            We aim to simplify how people find and offer services locally.
            Whether you're a skilled worker or someone looking for help, we
            ensure trust, transparency, and efficiency in every connection.
          </p>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle className="text-green-500" size={18} />
              Fast and reliable service matching
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle className="text-green-500" size={18} />
              Verified professionals and users
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle className="text-green-500" size={18} />
              Seamless communication system
            </li>
          </ul>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>

          <p className="text-zinc-400 leading-relaxed">
            Unlike traditional listings, we focus on real-time service
            engagement, trust-based matching, and smooth job completion flow.
            Our platform is designed to empower both clients and service
            providers equally.
          </p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold">What We Offer</h2>
          <p className="text-zinc-400 mt-2">
            Everything you need to connect, hire, and grow locally
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition"
            >
              <item.icon className="w-10 h-10 text-white mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 bg-zinc-950">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to get started?
        </h2>

        <p className="text-zinc-400 mb-8">
          Join thousands of users already using our platform.
        </p>

        <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition">
          Join Now
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default About;