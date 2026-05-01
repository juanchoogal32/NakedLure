import React from "react";
import { Link } from "react-router-dom";
import { Flag, Mountain, Fish } from "lucide-react";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1591448687627-6fe916f7f26e?auto=format&fit=crop&w=1600&q=80";

const About = () => {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden" data-testid="about-hero">
        <img src={ABOUT_IMG} alt="American flag outdoors" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-4">Our Story</p>
          <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-3xl leading-[0.95]">
            Born on the water. <span className="text-[#c8102e]">Built</span> for the flag.
          </h1>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-20 md:py-28" data-testid="about-story">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold">Est. 2026</p>
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-4">
              Fishing. Freedom. <span className="text-[#c8102e]">Family.</span>
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-[#333] text-lg leading-relaxed">
            <p>
              Naked Lure started where every good story starts: on a riverbank before sunrise. We love
              this country and we love the water that runs through it — alpine lakes in the Eastern
              Sierra, tailwaters of the Rockies, brushy creeks in the South, and every quiet pond in
              between.
            </p>
            <p>
              We wanted shirts that felt like us. Loud graphics. Honest cotton. A little patriotic, a
              lot rugged. So we made them. Each tee is heavyweight, pre‑shrunk, and printed to take a
              beating and keep on representing.
            </p>
            <p className="font-display italic text-xl text-[#0a0a0a]">
              "Cast a line. Fly a flag. Wear it proud."
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f9f9f9]" data-testid="about-values">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Fish, t: "Fishing First", d: "Designed by anglers, for anglers. Built to get wet, hiked in, and slept in." },
            { icon: Flag, t: "American Heart", d: "Every graphic is a salute to the country we love — loud, proud, and a little rowdy." },
            { icon: Mountain, t: "Outdoor Soul", d: "Sierra peaks, coastal dunes, backyard creeks. If it's outside, we're there." },
          ].map((v, i) => (
            <div key={i} className="border-t-2 border-[#c8102e] pt-8" data-testid={`value-${i}`}>
              <v.icon className="w-8 h-8 text-[#c8102e] mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">{v.t}</h3>
              <p className="text-[#555] leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-24 text-center" data-testid="about-cta">
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto">
          Ready to wear your water?
        </h2>
        <p className="text-[#555] mt-4 mb-8 max-w-lg mx-auto">
          Browse the collection and pick a tee that tells your river.
        </p>
        <Link to="/shop" className="btn-red" data-testid="about-shop-cta">
          Shop the Collection
        </Link>
      </section>
    </div>
  );
};

export default About;
