import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/surveys/constants'
import { PublicShell } from '@/components/encuestas/public_shell'

export const metadata: Metadata = {
  title: 'Política de privacidad | NEXOIA',
  description: 'Aviso de privacidad de las evaluaciones de capacitación y de las suscripciones voluntarias de NexoIA.',
}

export default function PrivacidadPage() {
  return (
    <PublicShell>
      <article className="space-y-6 text-gray-200">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Política de privacidad</h1>
        <p>Última actualización: 20 de octubre de 2026. Responsable: NexoIA. Contacto: {CONTACT_EMAIL}.</p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Evaluaciones de capacitación</h2>
          <p>Puedes completar la evaluación en Google Forms sin entregar tu nombre ni tu correo. Las respuestas quedan en la cuenta de Google que administra NexoIA y no se relacionan con una suscripción comercial. Los comentarios abiertos son opcionales: no escribas datos que te identifiquen.</p>
          <p>La finalidad es mejorar las capacitaciones de NexoIA. Este formulario no es una evaluación académica oficial de la Universidad de Cuenca ni de otra institución, salvo que esa institución lo autorice de forma expresa.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Suscripción voluntaria</h2>
          <p>Si decides recibir información, NexoIA guarda tu correo, el nombre y las áreas de interés si los escribes, el texto y la versión del consentimiento, la fecha y un código para darte de baja. La casilla no viene marcada. No enviamos comunicaciones comerciales sin ese consentimiento.</p>
          <p>Puedes cancelar la suscripción con el enlace que recibes al registrarte o escribiendo a {CONTACT_EMAIL}. La baja no borra ni altera las evaluaciones, porque no están vinculadas a tu correo.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Conservación y derechos</h2>
          <p>Las evaluaciones se conservan mientras sirvan para analizar y mejorar el programa. Las suscripciones se conservan hasta que canceles o pidas la eliminación. Puedes solicitar acceso, rectificación, eliminación, oposición o portabilidad escribiendo a {CONTACT_EMAIL}.</p>
          <p>La evaluación se almacena en Google Forms. El acceso a esas respuestas está limitado a la cuenta de Google de NexoIA.</p>
        </section>
        <p>
          <Link href="/encuestas/ia-finanzas-2026" className="text-primary-300">Volver a la evaluación</Link>
        </p>
      </article>
    </PublicShell>
  )
}
