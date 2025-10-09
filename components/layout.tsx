'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, MessageCircle, Calendar, Mail, Instagram, Linkedin, Youtube } from 'lucide-react'

const Navbar = () => {
  const [is_menu_open, setIsMenuOpen] = useState(false)
  const [is_scrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handle_scroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handle_scroll)
    return () => window.removeEventListener('scroll', handle_scroll)
  }, [])

  const nav_items = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/casos-exito', label: 'Casos de Éxito' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        is_scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {/* Efecto de pulso interno */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-teal-500/30 animate-pulse"></div>
              {/* Líneas de energía */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              {/* Letra N estilizada */}
              <span className="relative text-white font-bold text-xl z-10">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl">NEXOIA</span>
              <span className="text-xs text-gray-400 -mt-1">Impulsando la innovación</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {nav_items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://wa.me/593995048253"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://calendly.com/brunocastillo4427/consulta-nexoia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Calendar size={16} />
              <span>Agendar</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!is_menu_open)}
            className="md:hidden text-white p-2"
          >
            {is_menu_open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {is_menu_open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-md rounded-lg mt-2 p-4"
          >
            <div className="flex flex-col space-y-4">
              {nav_items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                <a
                  href="https://wa.me/593995048253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://calendly.com/brunocastillo4427/consulta-nexoia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Calendar size={16} />
                  <span>Agendar Reunión</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

const Footer = () => {
  const current_year = new Date().getFullYear()

  const social_links = [
    { href: 'https://instagram.com/tuusuario', icon: Instagram, label: 'Instagram' },
    { href: 'https://linkedin.com/in/tuusuario', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com/@tuusuario', icon: Youtube, label: 'YouTube' },
  ]

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 rounded-xl flex items-center justify-center overflow-hidden">
                {/* Efecto de pulso interno */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-teal-500/30 animate-pulse"></div>
                {/* Líneas de energía */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                {/* Letra N estilizada */}
                <span className="relative text-white font-bold text-xl z-10">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">NEXOIA</span>
                <span className="text-xs text-gray-400 -mt-1">Impulsando la innovación</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Impulsando la innovación con tecnología. Democratizamos la inteligencia artificial 
              y la ponemos al alcance de emprendedores, pequeñas empresas y creadores digitales.
            </p>
            <div className="flex space-x-4">
              {social_links.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/servicios" className="text-gray-400 hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/casos-exito" className="text-gray-400 hover:text-white transition-colors">Casos de Éxito</Link></li>
              <li><Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} />
                <span>hola@nexoia.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {current_year} NEXOIA — Impulsando la innovación con tecnología.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Navbar, Footer }
