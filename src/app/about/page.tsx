import type { Metadata } from 'next'
import ExperienceView from './ExperienceView'

export const metadata: Metadata = {
  title: 'Experience — Sebastian Pellitero',
  description: 'Nine years building the web. Senior Frontend Developer specialising in React & TypeScript.',
}

export default function ExperiencePage() {
  return <ExperienceView />
}
