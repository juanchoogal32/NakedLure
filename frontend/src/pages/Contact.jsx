import React, { useState } from "react";
import { toast } from "sonner";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import { sendContact } from "../lib/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContact(form);
      toast.success("Message sent!", { description: "We'll reply within 24 hours." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send", { description: "Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-[#0a0a0a] text-white" data-testid="contact-hero">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-4">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter">
            Drop us a <span className="text-[#c8102e]">line</span>.
          </h1>
          <p className="text-white/70 mt-6 max-w-lg">
            Questions about sizing, wholesale, or custom orders? We're here for the angler.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-8">
            Customer <span className="text-[#c8102e]">Support</span>
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4" data-testid="contact-email">
              <Mail className="w-5 h-5 text-[#c8102e] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#555]">Email</p>
                <a href="mailto:hello@nakedlure.com" className="font-bold hover:text-[#c8102e]">
                  hello@nakedlure.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4" data-testid="contact-location">
              <MapPin className="w-5 h-5 text-[#c8102e] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#555]">HQ</p>
                <p className="font-bold">Eastern Sierra, California</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-gray-200">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#555] mb-4">Follow the River</p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 border-2 border-[#0a0a0a] flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] hover:text-white transition-colors"
                data-testid="contact-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 border-2 border-[#0a0a0a] flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] hover:text-white transition-colors"
                data-testid="contact-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="md:col-span-7 bg-[#f9f9f9] p-8 md:p-12"
          data-testid="contact-form"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
                Name
              </label>
              <input
                required
                value={form.name}
                onChange={change("name")}
                className="w-full bg-white border-b-2 border-gray-300 focus:border-[#c8102e] px-0 py-3 outline-none"
                data-testid="contact-name-input"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={change("email")}
                className="w-full bg-white border-b-2 border-gray-300 focus:border-[#c8102e] px-0 py-3 outline-none"
                data-testid="contact-email-input"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
              Subject
            </label>
            <input
              value={form.subject}
              onChange={change("subject")}
              className="w-full bg-white border-b-2 border-gray-300 focus:border-[#c8102e] px-0 py-3 outline-none"
              data-testid="contact-subject-input"
            />
          </div>
          <div className="mb-8">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-[#555] mb-2 block">
              Message
            </label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={change("message")}
              className="w-full bg-white border-2 border-gray-300 focus:border-[#c8102e] p-4 outline-none resize-none"
              data-testid="contact-message-input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-red" data-testid="contact-submit-btn">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
