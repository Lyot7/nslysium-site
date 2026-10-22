import { describe, expect, it, vi } from 'vitest'
import { isValidElement, type ReactElement } from 'react'

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import LegalPage, { dynamicParams, generateMetadata, generateStaticParams } from './page'

const params = (slug: string) => ({ params: Promise.resolve({ slug }) }) as PageProps<'/legal/[slug]'>

function texte(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(texte).join(' ')
  if (isValidElement(node)) return texte((node as ReactElement<{ children?: unknown }>).props.children)
  return ''
}

describe('pages légales', () => {
  it('génère les quatre liens du pied de page et refuse les autres', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual([
      'mentions-legales',
      'confidentialite',
      'cgv',
      'rgpd',
    ])
    expect(dynamicParams).toBe(false)
  })

  it('donne un titre à chaque page', async () => {
    expect(await generateMetadata(params('cgv'))).toEqual({
      title: 'Conditions générales de vente · NSLysium',
    })
    expect(await generateMetadata(params('inconnu'))).toEqual({})
  })

  it("affiche l'éditeur et l'hébergeur dans les mentions légales", async () => {
    const contenu = texte(await LegalPage(params('mentions-legales')))
    expect(contenu).toContain('Mentions légales')
    expect(contenu).toContain('SIRET : 10576223100014')
    expect(contenu).toContain('Hostinger International Ltd')
  })

  it('renvoie une 404 pour un slug inconnu', async () => {
    await expect(LegalPage(params('inconnu'))).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
