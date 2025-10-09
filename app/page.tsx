'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Calendar, Sparkles, Bot, Zap, PenTool, Lightbulb } from 'lucide-react'
import Link from 'next/link'

const HomePage = () => {
  const services_preview = [
    {
      icon: Bot,
      title: 'Chatbots Inteligentes',
      description: 'Asistentes virtuales personalizados',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Automatización',
      description: 'Ahorra tiempo en tareas repetitivas',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: PenTool,
      title: 'Generación de Contenido',
      description: 'Creatividad potenciada por IA',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Lightbulb,
      title: 'Consultoría',
      description: 'Asesoría para integrar IA',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          {/* Líneas de energía como en el logo */}
          <div className="absolute top-1/4 right-1/4 w-32 h-1 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-500/20 rounded-full px-4 py-2"
              >
                <Sparkles className="text-purple-400" size={20} />
                <span className="text-purple-400 font-medium">Innovación Tecnológica</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Impulsando la innovación
                </span>
                <br />
                con tecnología
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Soluciones de inteligencia artificial accesibles para todos — Automatización, chatbots, generación de contenido y consultoría tecnológica.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="#contacto"
                className="group flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/25"
              >
                <span>Solicita tu asesoría gratuita</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <a
                href="https://calendly.com/brunocastillo4427/consulta-nexoia"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Calendar size={20} />
                <span>Agendar una reunión</span>
              </a>
              
              <a
                href="https://wa.me/593995048253"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle size={20} />
                <span>Escríbenos por WhatsApp</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">50+</div>
                <div className="text-gray-400">Proyectos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">95%</div>
                <div className="text-gray-400">Satisfacción del Cliente</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">24/7</div>
                <div className="text-gray-400">Soporte Disponible</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluciones de IA diseñadas para impulsar tu negocio hacia el futuro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services_preview.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-dark-700/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/servicios"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <span>Ver todos los servicios</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Comienza hoy mismo con una asesoría gratuita y descubre cómo la IA puede revolucionar tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/593995048253"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                <MessageCircle size={20} />
                <span>Contactar por WhatsApp</span>
              </a>
              <a
                href="https://calendly.com/brunocastillo4427/consulta-nexoia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-primary-800 hover:bg-primary-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                <Calendar size={20} />
                <span>Agendar Reunión</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
