'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, PenTool, Lightbulb, CheckCircle, ArrowRight, MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

const ServicesPage = () => {
  const services = [
    {
      icon: Bot,
      title: 'Chatbots Inteligentes',
      description: 'Crea asistentes virtuales personalizados para tu negocio',
      features: [
        'Respuestas automáticas 24/7',
        'Integración con WhatsApp y web',
        'Aprendizaje continuo',
        'Análisis de conversaciones',
        'Personalización completa'
      ],
      color: 'from-blue-500 to-purple-600',
      bg_color: 'bg-blue-500/10',
      border_color: 'border-blue-500/20'
    },
    {
      icon: Zap,
      title: 'Automatización de Procesos',
      description: 'Ahorra tiempo automatizando tareas repetitivas',
      features: [
        'Automatización de emails',
        'Gestión de inventario',
        'Procesamiento de documentos',
        'Integración con sistemas existentes',
        'Monitoreo en tiempo real'
      ],
      color: 'from-green-500 to-blue-600',
      bg_color: 'bg-green-500/10',
      border_color: 'border-green-500/20'
    },
    {
      icon: PenTool,
      title: 'Generación de Contenido',
      description: 'Redacción y creatividad potenciadas por IA',
      features: [
        'Artículos y blogs automáticos',
        'Contenido para redes sociales',
        'Descripciones de productos',
        'Traducción multilingüe',
        'Optimización SEO'
      ],
      color: 'from-purple-500 to-pink-600',
      bg_color: 'bg-purple-500/10',
      border_color: 'border-purple-500/20'
    },
    {
      icon: Lightbulb,
      title: 'Consultoría Personalizada',
      description: 'Asesoría para integrar IA en tu estrategia digital',
      features: [
        'Auditoría de procesos',
        'Estrategia de implementación',
        'Capacitación del equipo',
        'Seguimiento y optimización',
        'Soporte técnico continuo'
      ],
      color: 'from-orange-500 to-red-600',
      bg_color: 'bg-orange-500/10',
      border_color: 'border-orange-500/20'
    }
  ]

  const process_steps = [
    {
      step: '01',
      title: 'Consulta Inicial',
      description: 'Analizamos tus necesidades y objetivos específicos'
    },
    {
      step: '02',
      title: 'Propuesta Personalizada',
      description: 'Diseñamos una solución adaptada a tu negocio'
    },
    {
      step: '03',
      title: 'Implementación',
      description: 'Desarrollamos e integramos la solución de IA'
    },
    {
      step: '04',
      title: 'Capacitación',
      description: 'Entrenamos a tu equipo para usar las nuevas herramientas'
    },
    {
      step: '05',
      title: 'Seguimiento',
      description: 'Monitoreamos y optimizamos continuamente'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Nuestros{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Servicios
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Impulsando la innovación con tecnología. Soluciones de inteligencia artificial diseñadas para impulsar tu negocio hacia el futuro digital
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${service.bg_color} ${service.border_color} border rounded-2xl p-8 hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <service.icon className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-300 mb-6 text-lg">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Nuestro Proceso de Trabajo
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Un enfoque estructurado para garantizar el éxito de tu proyecto de IA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process_steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
                {index < process_steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Precios Accesibles
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluciones de IA al alcance de todos los presupuestos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Básico</h3>
              <div className="text-4xl font-bold text-primary-400 mb-6">$299<span className="text-lg text-gray-400">/mes</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Chatbot básico</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">100 mensajes/mes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Soporte por email</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                Comenzar
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600/20 to-primary-700/20 border border-primary-500/50 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Más Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Profesional</h3>
              <div className="text-4xl font-bold text-primary-400 mb-6">$599<span className="text-lg text-gray-400">/mes</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Chatbot avanzado</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">1000 mensajes/mes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Automatización básica</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Soporte prioritario</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                Comenzar
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Empresarial</h3>
              <div className="text-4xl font-bold text-primary-400 mb-6">Personalizado</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Solución completa</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Mensajes ilimitados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Consultoría incluida</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Soporte 24/7</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                Contactar
              </button>
            </motion.div>
          </div>
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
              ¿Necesitas una solución personalizada?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Cada negocio es único. Contáctanos para una propuesta personalizada que se adapte perfectamente a tus necesidades.
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
                href="https://calendly.com/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-primary-800 hover:bg-primary-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                <Calendar size={20} />
                <span>Agendar Consulta</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
