import { z } from 'zod'

const str = (max: number) => z.string().max(max).trim()
const urlOrPath = z.string().max(2000)

/** Произвольный JSON-документ страницы (разумный предел размера) */
export const jsonPageDocument = z
  .unknown()
  .refine((v) => JSON.stringify(v ?? null).length <= 8_000_000, {
    message: 'Слишком большой документ',
  })

export const productCreateSchema = z.object({
  name: str(500),
  price: z.number().nonnegative().finite(),
  oldPrice: z.number().nonnegative().finite().nullable().optional(),
  description: str(20_000).nullable().optional(),
  features: z.array(str(500)).max(100).optional().default([]),
  material: str(200),
  color: str(200),
  image: urlOrPath,
  category: str(100).default('interior'),
  slug: str(500).min(1),
})

export const productUpdateSchema = productCreateSchema.partial().refine((o) => Object.keys(o).length > 0, {
  message: 'Пустое тело',
})

export const portfolioPutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int().optional(),
        image: urlOrPath,
        title: str(500),
        description: str(5000),
      })
    )
    .max(500),
})

export const portfolioItemCreateSchema = z.object({
  image: urlOrPath,
  title: str(500),
  description: str(5000),
})

export const portfolioItemPatchSchema = z
  .object({
    image: urlOrPath.optional(),
    title: str(500).optional(),
    description: str(5000).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'Пустое тело' })

export const aboutStatCreateSchema = z.object({
  icon: str(100),
  value: str(100),
  label: str(300),
})

export const aboutStatPatchSchema = aboutStatCreateSchema
  .partial()
  .refine((o) => Object.keys(o).length > 0, { message: 'Пустое тело' })

export const aboutAdvantageCreateSchema = z.object({
  icon: str(100),
  title: str(300),
  description: str(2000),
})

export const aboutAdvantagePatchSchema = aboutAdvantageCreateSchema
  .partial()
  .refine((o) => Object.keys(o).length > 0, { message: 'Пустое тело' })

export const contactLocationCreateSchema = z.object({
  name: str(300),
  address: str(500),
  phone: str(100),
  hours: str(300),
  coords: z.tuple([z.number().finite(), z.number().finite()]),
})

export const contactLocationPatchSchema = contactLocationCreateSchema
  .partial()
  .refine((o) => Object.keys(o).length > 0, { message: 'Пустое тело' })

export const chatMessageSchema = z.object({
  chatId: z.coerce.number().int().positive(),
  text: str(8000).min(1),
})

export const chatPublicMessageSchema = z.object({
  text: str(8000).min(1),
  chatId: z.number().int().positive().optional().nullable(),
  /** UUID из PostgreSQL; не используем .uuid() — допускаем любой непустой секрет */
  clientToken: str(64).optional().nullable(),
  eventType: z.enum(['price_clarification', 'chat_message']).optional(),
  clientName: str(200).optional(),
  clientPhone: str(60).optional(),
  productName: str(500).optional(),
  productUrl: urlOrPath.optional(),
  pageUrl: urlOrPath.optional(),
})

/** Заявка с формы «Контакты» на сайте */
export const contactLeadCreateSchema = z.object({
  name: str(100).min(1),
  phone: str(40),
  email: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    str(320).optional()
  ),
  message: str(2000).min(1),
})
