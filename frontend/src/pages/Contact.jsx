import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* HEADER */}
      <section className="text-center py-20 px-6 mt-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Contact Us
        </motion.h1>
        <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
          Have questions, feedback, or need support? We’re here to help you anytime.
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">

        {/* CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-zinc-400">
            Reach out to us through any of the following ways. We usually respond within 24 hours.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-zinc-300">
              <Mail className="w-5 h-5 text-zinc-400" />
              <span>support@yourplatform.com</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-300">
              <Phone className="w-5 h-5 text-zinc-400" />
              <span>+977 98XXXXXXXX</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-300">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
            <h3 className="font-semibold mb-2">Support Hours</h3>
            <p className="text-zinc-400 text-sm">
              Sunday – Friday: 9:00 AM – 6:00 PM <br />
              Saturday: Limited Support
            </p>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-2">Send Message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
            required
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            <Send size={18} />
            Send Message
          </button>
        </motion.form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;