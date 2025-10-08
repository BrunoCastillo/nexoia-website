'use client'

import { motion } from 'framer-motion'
import { Target, Users, Lightbulb, Heart, Award, Globe, MessageCircle, Calendar } from 'lucide-react'
import Image from 'next/image'

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Enfoque en Resultados',
      description: 'Nos enfocamos en entregar soluciones que generen impacto real en tu negocio, no solo tecnología por tecnología.'
    },
    {
      icon: Users,
      title: 'Accesibilidad',
      description: 'Creemos que la IA debe estar al alcance de todos, independientemente del tamaño de tu empresa.'
    },
    {
      icon: Lightbulb,
      title: 'Innovación Práctica',
      description: 'Combinamos las últimas tecnologías con enfoques prácticos y probados para maximizar el éxito.'
    },
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Estamos comprometidos con el éxito a largo plazo de nuestros clientes, no solo con la implementación inicial.'
    }
  ]

  const team_members = [
    {
      name: 'Ana García',
      role: 'CEO & Fundadora',
      description: 'Experta en IA con más de 8 años de experiencia en transformación digital.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      expertise: ['Inteligencia Artificial', 'Estrategia Digital', 'Liderazgo']
    },
    {
      name: 'Carlos Mendoza',
      role: 'CTO',
      description: 'Desarrollador senior especializado en machine learning y automatización.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      expertise: ['Machine Learning', 'Desarrollo', 'Arquitectura de Sistemas']
    },
    {
      name: 'María López',
      role: 'Directora de Proyectos',
      description: 'Especialista en gestión de proyectos tecnológicos y experiencia del usuario.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      expertise: ['Gestión de Proyectos', 'UX/UI', 'Consultoría']
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Fundación',
      description: 'Nacimos con la visión de democratizar la inteligencia artificial'
    },
    {
      year: '2021',
      title: 'Primeros Clientes',
      description: 'Implementamos nuestras primeras soluciones exitosas'
    },
    {
      year: '2022',
      title: 'Expansión',
      description: 'Crecimos nuestro equipo y ampliamos nuestros servicios'
    },
    {
      year: '2023',
      title: 'Reconocimiento',
      description: 'Recibimos premios por innovación en tecnología'
    },
    {
      year: '2024',
      title: 'Escalamiento',
      description: 'Alcanzamos 50+ proyectos completados exitosamente'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Sobre{' '}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Nosotros
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Impulsando la innovación con tecnología. Somos un equipo apasionado por hacer que la inteligencia artificial sea accesible para todos los negocios, sin importar su tamaño.
              </p>
              <div className="bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Nuestra Misión</h3>
                <p className="text-gray-300">
                  Impulsando la innovación con tecnología. Democratizamos la inteligencia artificial y la ponemos al alcance de emprendedores, pequeñas empresas y creadores digitales, 
                  proporcionando soluciones prácticas y accesibles que impulsen el crecimiento y la innovación.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Equipo de IA para Todos"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold">
                <div className="flex items-center space-x-2">
                  <Award size={20} />
                  <span>Equipo Certificado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo y definen nuestra cultura
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Conoce a los expertos que hacen posible la transformación digital de tu negocio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team_members.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-700/50 border border-gray-700/50 rounded-2xl p-6 text-center hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <Globe className="text-white" size={16} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 mb-4">{member.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Nuestra Historia
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Un viaje de crecimiento y evolución en el mundo de la inteligencia artificial
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-dark-700/50 border border-gray-700/50 rounded-xl p-6">
                      <div className="text-primary-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
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
              ¿Listo para trabajar con nosotros?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Únete a las empresas que ya están transformando su futuro con inteligencia artificial accesible y práctica.
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
                <span>Agendar Reunión</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
