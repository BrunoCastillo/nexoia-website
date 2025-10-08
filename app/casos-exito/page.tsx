'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Clock, Star, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const SuccessCasesPage = () => {
  const success_cases = [
    {
      title: 'E-commerce Automatizado',
      company: 'Tienda Online Plus',
      description: 'Implementamos un chatbot inteligente que redujo el tiempo de respuesta al cliente en un 80% y aumentó las ventas en un 45%.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      metrics: [
        { label: 'Reducción de tiempo', value: '80%', icon: Clock },
        { label: 'Aumento en ventas', value: '45%', icon: TrendingUp },
        { label: 'Satisfacción cliente', value: '95%', icon: Star }
      ],
      services: ['Chatbot Inteligente', 'Automatización de Ventas'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Restaurante Digital',
      company: 'Sabores del Mar',
      description: 'Automatizamos el proceso de pedidos y gestión de inventario, resultando en una mejora del 60% en la eficiencia operativa.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop',
      metrics: [
        { label: 'Eficiencia operativa', value: '60%', icon: TrendingUp },
        { label: 'Reducción de errores', value: '75%', icon: Clock },
        { label: 'Clientes satisfechos', value: '92%', icon: Users }
      ],
      services: ['Automatización de Procesos', 'Gestión de Inventario'],
      color: 'from-green-500 to-blue-600'
    },
    {
      title: 'Agencia de Marketing',
      company: 'Creative Minds',
      description: 'Implementamos generación automática de contenido que aumentó la productividad del equipo creativo en un 70% y mejoró la calidad del contenido.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      metrics: [
        { label: 'Productividad', value: '70%', icon: TrendingUp },
        { label: 'Contenido generado', value: '300%', icon: Clock },
        { label: 'Calidad mejorada', value: '85%', icon: Star }
      ],
      services: ['Generación de Contenido', 'Automatización Creativa'],
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const testimonials = [
    {
      name: 'María González',
      role: 'CEO, Tienda Online Plus',
      content: 'La implementación del chatbot transformó completamente nuestra atención al cliente. Ahora respondemos 24/7 y nuestros clientes están más satisfechos que nunca.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Gerente, Sabores del Mar',
      content: 'La automatización de nuestros procesos nos permitió enfocarnos en lo que realmente importa: crear experiencias gastronómicas únicas para nuestros clientes.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      role: 'Directora Creativa, Creative Minds',
      content: 'La IA nos ayudó a escalar nuestra producción de contenido sin sacrificar calidad. Ahora podemos atender más clientes y generar mejores resultados.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5
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
              Casos de{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Éxito
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Impulsando la innovación con tecnología. Descubre cómo hemos transformado negocios reales con soluciones de inteligencia artificial
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Cases Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {success_cases.map((case_item, index) => (
              <motion.div
                key={case_item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex items-center gap-12`}
              >
                {/* Image */}
                <div className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden group">
                    <Image
                      src={case_item.image}
                      alt={case_item.title}
                      width={500}
                      height={300}
                      className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {case_item.company}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{case_item.title}</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">{case_item.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {case_item.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="bg-dark-700/50 rounded-lg p-4 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${case_item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <metric.icon className="text-white" size={24} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Servicios Implementados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {case_item.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Testimonios reales de empresas que han transformado su negocio con IA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              Números que hablan por sí solos
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Resultados comprobados en proyectos reales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">50+</div>
              <div className="text-gray-400">Proyectos Completados</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">95%</div>
              <div className="text-gray-400">Satisfacción del Cliente</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">60%</div>
              <div className="text-gray-400">Promedio de Mejora</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-gray-400">Soporte Disponible</div>
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
              ¿Quieres ser nuestro próximo caso de éxito?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Únete a las empresas que ya están transformando su negocio con inteligencia artificial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/593995048253"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                <span>Contactar por WhatsApp</span>
                <ArrowRight size={20} />
              </a>
              <a
                href="https://instagram.com/tuusuario"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-primary-800 hover:bg-primary-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                <ExternalLink size={20} />
                <span>Ver más casos</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SuccessCasesPage
