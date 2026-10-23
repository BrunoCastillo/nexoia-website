import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/surveys/constants'
import { PublicShell } from '@/components/encuestas/public_shell'
import { page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Política de privacidad',
  description:
    'Qué datos recoge NexoIA en las evaluaciones de cursos, en el formulario de contacto y en las suscripciones voluntarias, para qué los usa y cómo ejercer tus derechos.',
  path: '/privacidad',
})

const mail_link = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-white underline underline-offset-4">
    {CONTACT_EMAIL}
  </a>
)

export default function PrivacidadPage() {
  return (
    <PublicShell>
      <article className="space-y-8 text-on-indigo">
        <header className="space-y-3">
          <h1 className="text-display-1 text-white">Política de privacidad</h1>
          <p>
            Última actualización: 23 de octubre de 2026. Responsable: NexoIA (Bruno Castillo), Cuenca, Ecuador. Contacto: {mail_link}.
          </p>
        </header>

        <section className="space-y-3" aria-labelledby="priv-evaluaciones">
          <h2 id="priv-evaluaciones" className="text-display-3 text-white">
            Evaluaciones de cursos
          </h2>
          <p>
            La evaluación del programa Inteligencia Artificial Aplicada a las Finanzas se responde en Google Forms y te pide tu nombre, tu
            correo y tu teléfono, además de tus respuestas sobre el curso. Usamos esos datos solo para comunicarnos contigo sobre esta y
            futuras capacitaciones de NexoIA, y para mejorar los cursos. No los vendemos ni los compartimos con terceros.
          </p>
          <p>
            Las respuestas quedan en la cuenta de Google que administra NexoIA, con acceso limitado a esa cuenta. Los comentarios abiertos
            son opcionales. La evaluación es un instrumento de NexoIA: no es una evaluación académica oficial de la Universidad de Cuenca,
            de ETAPA EP ni de otra institución, salvo que esa institución lo autorice de forma expresa.
          </p>
          <p>
            Si en el futuro publicamos otras evaluaciones que no pidan datos personales, cada una lo indicará al comienzo.
          </p>
        </section>

        <section id="contacto" className="scroll-mt-8 space-y-3" aria-labelledby="priv-contacto">
          <h2 id="priv-contacto" className="text-display-3 text-white">
            Formulario de contacto
          </h2>
          <p>
            Cuando nos escribes desde la página de contacto recibimos tu nombre, tu correo, la empresa o institución si la indicas, el tipo
            de necesidad y tu mensaje. El envío se hace a través del servicio EmailJS, que entrega el mensaje en nuestro correo. Usamos
            esos datos solo para responderte y preparar una propuesta si la pides.
          </p>
        </section>

        <section className="space-y-3" aria-labelledby="priv-suscripcion">
          <h2 id="priv-suscripcion" className="text-display-3 text-white">
            Suscripción voluntaria
          </h2>
          <p>
            Si decides recibir información, NexoIA guarda tu correo, el nombre y las áreas de interés si los escribes, el texto y la versión
            del consentimiento, la fecha y un código para darte de baja. La casilla no viene marcada. No enviamos comunicaciones
            comerciales sin ese consentimiento.
          </p>
          <p>Puedes cancelar la suscripción con el enlace que recibes al registrarte o escribiendo a {mail_link}.</p>
        </section>

        <section className="space-y-3" aria-labelledby="priv-derechos">
          <h2 id="priv-derechos" className="text-display-3 text-white">
            Conservación y derechos
          </h2>
          <p>
            Conservamos las evaluaciones mientras sirvan para mejorar los cursos, los mensajes de contacto mientras dure la conversación o
            la relación comercial, y las suscripciones hasta que canceles o pidas la eliminación. Puedes solicitar acceso, rectificación,
            eliminación, oposición o portabilidad de tus datos escribiendo a {mail_link}.
          </p>
        </section>

        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/encuestas/ia-finanzas-2026" className="font-semibold text-white underline underline-offset-4">
            Ir a la evaluación del curso
          </Link>
          <Link href="/contacto" className="font-semibold text-white underline underline-offset-4">
            Ir a contacto
          </Link>
        </p>
      </article>
    </PublicShell>
  )
}
