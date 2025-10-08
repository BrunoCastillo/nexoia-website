'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, Calendar, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

const ContactPage = () => {
  const [form_data, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [is_submitted, setIsSubmitted] = useState(false)
  const [is_loading, setIsLoading] = useState(false)

  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsLoading(false)
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const contact_info = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hola@nexoia.com',
      description: 'Escríbenos para cualquier consulta'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+593 99 504 8253',
      description: 'Respuesta inmediata disponible'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      value: 'Ecuador',
      description: 'Servicios disponibles globalmente'
    }
  ]

  const faqs = [
    {
      question: '¿Cuánto tiempo toma implementar una solución de IA?',
      answer: 'El tiempo varía según la complejidad del proyecto. Proyectos básicos pueden completarse en 2-4 semanas, mientras que soluciones más complejas pueden tomar 2-3 meses.'
    },
    {
      question: '¿Ofrecen soporte después de la implementación?',
      answer: 'Sí, ofrecemos soporte continuo y capacitación para asegurar que tu equipo pueda aprovechar al máximo las herramientas implementadas.'
    },
    {
      question: '¿Trabajan con empresas pequeñas?',
      answer: 'Absolutamente. Nuestra misión es hacer la IA accesible para todos, independientemente del tamaño de la empresa.'
    },
    {
      question: '¿Qué tipo de datos necesitan para el proyecto?',
      answer: 'Depende del tipo de solución. Generalmente necesitamos acceso a datos históricos relevantes y una comprensión clara de tus procesos actuales.'
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
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Contacto
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Impulsando la innovación con tecnología. ¿Listo para transformar tu negocio? Contáctanos y comienza tu viaje hacia la automatización inteligente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h2>
              
              {is_submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-400">Te contactaremos pronto para discutir tu proyecto.</p>
                </motion.div>
              ) : (
                <form onSubmit={handle_submit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form_data.name}
                      onChange={handle_input_change}
                      required
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form_data.email}
                      onChange={handle_input_change}
                      required
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form_data.message}
                      onChange={handle_input_change}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Cuéntanos sobre tu proyecto y cómo podemos ayudarte..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={is_loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {is_loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Información de contacto</h2>
                <div className="space-y-6">
                  {contact_info.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                        <p className="text-primary-400 font-medium">{info.value}</p>
                        <p className="text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Acciones rápidas</h3>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/593995048253"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
                  >
                    <MessageCircle size={20} />
                    <span>WhatsApp Directo</span>
                  </a>
                  <a
                    href="https://calendly.com/tuusuario"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
                  >
                    <Calendar size={20} />
                    <span>Agendar reunión</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-700/50 border border-gray-700/50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
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
              ¿Tienes más preguntas?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              No dudes en contactarnos. Estamos aquí para ayudarte a encontrar la mejor solución para tu negocio.
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

export default ContactPage
