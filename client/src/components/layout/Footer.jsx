import { Flag, Github, Twitter, Linkedin, Mail, Clock, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const socialLinks = [
  { href: "#", icon: Github, label: "GitHub" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

const quickLinks = [
  { href: "/concerns", label: "Browse Concerns" },
  { href: "/trending", label: "Trending Issues" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About Us" },
];

const resources = [
  { href: "/help", label: "Help Center" },
  { href: "/guidelines", label: "Community Guidelines" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-16 grid gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Flag className="h-6 w-6 text-black" />
            <span className="text-2xl font-bold text-black">RaiseIt</span>
          </div>
          <p className="text-gray-600 max-w-sm">
            Empowering communities to raise their voices and drive meaningful change through collective action and digital advocacy.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                className="p-2.5 bg-white rounded-full border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow transition"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <FooterSection title="Quick Links" links={quickLinks} />

        {/* Resources */}
        <FooterSection title="Resources" links={resources} />

        {/* Contact */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
          <div className="space-y-4">
            <a
              href="mailto:gourishchouhan338@gmail.com"
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 p-3 rounded-lg hover:bg-white/50 transition"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Email us</div>
                <div className="text-xs text-gray-500">gourishchouhan338@gmail.com</div>
              </div>
            </a>

            <div className="flex items-center gap-3 text-gray-600 p-3 rounded-lg bg-white/30">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Local time</div>
                <div className="text-xs text-gray-500">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="flex items-center text-sm text-gray-600 gap-1">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            © {new Date().getFullYear()} RaiseIt. Crafted with
            <Heart className="h-4 w-4 text-red-500 animate-pulse" /> for community empowerment.
          </p>
          <div className="flex gap-6">
            {legalLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-gray-500 hover:text-blue-600 transition"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ul className="space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-blue-500 transition" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
